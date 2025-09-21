import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import AddPointForm from "../components/AddPointForm";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable"; // ✅ تأكد إن المسار صحيح
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import { useNavigate } from "react-router-dom";

export default function AddPoint() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState([]);
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
    if (!decoded?.email) return;

    try {
      const res = await axios.get(
        `https://paynet-1.onrender.com/api/point/add-point?email=${decoded.email}`
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
  const handelAddBalance = async (id, username, owner) => {
    const amount = prompt("ادخل قيمة الرصيد المطلوب إضافتها   (سيتم شحن رصيده من رصيدك):");
    if (!amount) return;

    try {
      await axios.put(
        `https://paynet-1.onrender.com/api/point/add-balance/${id}`,
        { amount, email, username, owner }
      );
      alert("تمت إضافة الرصيد بنجاح ✅");
      getPoint();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة الرصيد ❌");
    }
  };

  // ✅ حذف نقطة
  const handelDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(
        `https://paynet-1.onrender.com/api/point/delete/${id}`
      );
      alert("تم حذف النقطة ✅");
      getPoint();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف ❌");
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
              navigate('/financial-point', {state: row})
            }}
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
