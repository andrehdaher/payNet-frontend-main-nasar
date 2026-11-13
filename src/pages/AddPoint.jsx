import { PAYNET_BASE_URL } from "../api";
import { useToast } from "../context/ToastContext";
import DataFeedback from "../components/DataFeedback";
import React, { useEffect, useState } from "react";
import AddPointForm from "../components/AddPointForm";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable"; // ✅ تأكد إن المسار صحيح
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import { useNavigate } from "react-router-dom";

export default function AddPoint() {
  const toast = useToast();
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [AddPointFormId, setAddPointFormId] = useState(false);

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
    if (!decoded?.email) {
      setLoading(false);
      setLoadError(true);
      return;
    }

    setLoadError(false);

    try {
      const res = await axios.get(
        `${PAYNET_BASE_URL}/api/point/add-point?email=${decoded.email}`
      );
      setFormData(res.data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPoint();
  }, []);

  // ✅ إضافة رصيد
  const handelAddBalance = async (id, username, owner) => {
    const amount = prompt("ادخل قيمة الرصيد المطلوب إضافتها   (سيتم شحن رصيده من رصيدك):");
    if (!amount) return;

    try {
      await axios.put(
        `${PAYNET_BASE_URL}/api/point/add-balance/${id}`,
        { amount, email, username, owner }
      );
      toast.success("تمت إضافة الرصيد بنجاح ✅");
      getPoint();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إضافة الرصيد ❌");
    }
  };

  // ✅ حذف نقطة
  const handelDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(
        `${PAYNET_BASE_URL}/api/point/delete/${id}`
      );
      toast.success("تم حذف النقطة ✅");
      getPoint();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف ❌");
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
              handelAddBalance(
                row._id,
                row.username,
                row.owner
              )
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
              handelDelete(row._id)
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
      {/* ✅ نافذة إضافة نقطة */}
      {AddPointFormId && (
        <AddPointForm onClose={() => setAddPointFormId(false)} />
      )}

      {/* ✅ DataTable */}
      <Card className="min-w-0">
        <CardHeader>
          <h1 className="page-title mb-0">
            نقاط البيع الفرعية
          </h1>
        </CardHeader>
        <CardContent>
          <DataFeedback loading={loading} error={loadError}>
            <DataTable
              columns={columns}
              data={formData}
              pageSize={10}
              onRowClick={row => {
                navigate('/financial-point', { state: row })
              }}
            />
          </DataFeedback>
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
