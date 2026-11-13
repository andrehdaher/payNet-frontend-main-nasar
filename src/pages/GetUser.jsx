import { PAYNET_BASE_URL } from "../api";
import { useToast } from "../context/ToastContext";
import DataFeedback from "../components/DataFeedback";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";



export default function UsersTable() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const navigate = useNavigate()

  const fetchUsers = () => {
    setLoadError(false);
    axios.get(`${PAYNET_BASE_URL}/api/admin/all-user`)
      .then(res => setUsers(res.data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchUsers();
  }, []);


  const deleteUser = async (id) => {
    const confirmed = window.confirm("هل انت متاكد من حذف المستخدم");
    if (!confirmed) return;
    try {
      await axios.delete(`${PAYNET_BASE_URL}/api/admin/deleteuser/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success("تم حذف المستخدم")

    } catch (err) {
      console.error("خطأ في الحذف", err);
    }
  };



  const addBatch = async (id) => {
    const input = prompt("ادخل الدفعة التي تريد إضافتها");

    if (!input) return; // المستخدم ضغط إلغاء

    const amount = parseFloat(input);

    if (isNaN(amount)) {
      toast.warning("الرجاء إدخال رقم صحيح");
      return;
    }

    try {

      await axios.put(`${PAYNET_BASE_URL}/api/admin/addbatch/${id}`, {
        amount, // إرسال القيمة بعد التحويل لرقم
      });
      toast.success("تمت إضافة الدفعة بنجاح ✅");
      fetchUsers(); // ⬅️ هذا السطر يُعيد تحميل القائمة


    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "تعذر إضافة الدفعة.");
    }
  };

  const updateHandle = (id) => {
    setEditUserId(id);
  };



  const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);

  return (

    <div className="container mx-auto p-4">
      {editUserId && (
        <EditUserForm
          userId={editUserId}
          onClose={() => setEditUserId(null)}
          onUpdate={fetchUsers}
        />
      )}
      <h1 className="page-title">قائمة المستخدمين</h1>
      <DataFeedback loading={loading} error={loadError} empty={!users.length}>
        <div className="table-scroll" role="region" aria-label="جدول البيانات" tabIndex={0}>
          <table className="min-w-full bg-white border text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">الاسم</th>
              <th className="border px-4 py-2">البريد</th>
              <th className="border px-4 py-2">رقم الهاتف</th>
              <th className="border px-4 py-2">النوع</th>
              <th className="border px-4 py-2">الرصيد</th>
              <th className="border px-4 py-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.number}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.balance}</td>
                <td className="border px-4 py-2 space-x-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => (updateHandle(user._id))}
                  >
                    تعديل
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteUser(user._id)}
                  >
                    حذف
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => addBatch(user._id)}
                  >
                    إضافة دفعة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="text-right font-bold mt-4">
          مجموع الرصيد: <bdi>{totalBalance}$</bdi>
        </div>
      </DataFeedback>
    </div>
  );
}
