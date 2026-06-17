import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import AddPointForm from "../components/AddPointForm";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable"; // ✅ تأكد إن المسار صحيح
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Custom/PageHeader";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import PromptDialog from "../components/Custom/PromptDialog";
import Alert from "../components/Custom/Alert";

export default function AddPoint() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState([]);
  const [AddPointFormId, setAddPointFormId] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ فك JWT
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  // ✅ جلب الإيميل من التوكن
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.email) setEmail(decoded.email);
  }, []);

  // ✅ جلب النقاط
  const getPoint = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded?.email) return;

    try {
      const res = await axios.get(
        `https://paynet-1.onrender.com/api/payment/save-number/api/point/add-point?email=${decoded.email}`
      );
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPoint();
  }, []);

  // ✅ إضافة رصيد
  const handelAddBalance = async (id, username, owner, amount) => {
    if (!amount) return;

    try {
      await axios.put(
        `https://paynet-1.onrender.com/api/payment/save-number/api/point/add-balance/${id}`,
        { amount, email, username, owner }
      );
      setMessage({ type: "success", text: "تمت إضافة الرصيد بنجاح." });
      getPoint();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "حدث خطأ أثناء إضافة الرصيد." });
    }
  };

  // ✅ حذف نقطة
  const handelDelete = async (id) => {
    try {
      await axios.delete(
        `https://paynet-1.onrender.com/api/payment/save-number/api/point/delete/${id}`
      );
      setMessage({ type: "success", text: "تم حذف النقطة." });
      getPoint();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "حدث خطأ أثناء الحذف." });
    }
  };

  const columns = [
    {
      label: "تاريخ الإنشاء",
      key: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleString("ar-SY"),
    },
    { label: "الرصيد", key: "balance" },
    { label: "الوكيل", key: "email" },
    { label: "اسم المستخدم", key: "username" },
    { label: "صاحب النقطة", key: "owner" },
    {
      label: "العمليات",
      key: "action",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setDialog({ type: "balance", row })
            }
            }
          >
            إضافة رصيد
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDialog({ type: "delete", row })
            }}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ScreenWrapper>
      <PageHeader
        title="نقاط البيع الفرعية"
        description="إدارة نقاط البيع التابعة لك، إضافة رصيد، ومراجعة البيان المالي لكل نقطة."
        actions={<Button onClick={() => setAddPointFormId(true)}>إضافة نقطة بيع</Button>}
      />
      {message && <Alert type={message.type} className="mb-4">{message.text}</Alert>}
      {/* ✅ نافذة إضافة نقطة */}
      {AddPointFormId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AddPointForm onClose={() => setAddPointFormId(false)} />
        </div>
      )}

      {/* ✅ DataTable */}
      <Card className={'m-6'}>
        <CardHeader>
          <CardTitle>
            نقاط البيع الفرعية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formData}
            pageSize={10}
            onRowClick={row => {
              navigate('/financial-point', { state: row })
            }}
          />
        </CardContent>
      </Card>
      <PromptDialog
        open={dialog?.type === "balance"}
        title="إضافة رصيد"
        description="سيتم شحن النقطة من رصيد حسابك."
        label="قيمة الرصيد"
        inputType="number"
        placeholder="أدخل المبلغ"
        confirmText="إضافة"
        tone="success"
        onClose={() => setDialog(null)}
        onConfirm={(amount) => {
          const row = dialog?.row;
          if (!row) return;
          handelAddBalance(row._id, row.username, row.owner, amount);
          setDialog(null);
        }}
      />
      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="حذف نقطة البيع"
        description="هل أنت متأكد من حذف هذه النقطة؟"
        confirmText="حذف"
        tone="danger"
        onClose={() => setDialog(null)}
        onConfirm={() => {
          handelDelete(dialog?.row?._id);
          setDialog(null);
        }}
      />
    </ScreenWrapper>
  );
}
