import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAdmin from '../components/NavbarAdmin'
import { useNavigate } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";



export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  const navigate = useNavigate()

const fetchUsers = () => {
  axios.get("https://paynet-1.onrender.com/api/admin/all-user")
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
};
useEffect(() => {
  fetchUsers();
}, []);


  const deleteUser = async (id) => {
          const confirmed = window.confirm("هل انت متاكد من حذف المستخدم");
    if (!confirmed) return;
    try {
      await axios.delete(`https://paynet-1.onrender.com/api/admin/deleteuser/${id}`);
      setUsers(users.filter(user => user._id !== id));
      alert("تم حذف المستخدم")
      
    } catch (err) {
      console.error("خطأ في الحذف", err);
    }
  };

 

  const addBatch = async (id) => {
  const input = prompt("ادخل الدفعة التي تريد إضافتها");

  if (!input) return; // المستخدم ضغط إلغاء

  const amount = parseFloat(input);

  if (isNaN(amount)) {
    alert("الرجاء إدخال رقم صحيح");
    return;
  }

  try {
    
    await axios.put(`https://paynet-1.onrender.com/api/admin/addbatch/${id}`, {
      amount, // إرسال القيمة بعد التحويل لرقم
    });
    alert("تمت إضافة الدفعة بنجاح ✅");
    fetchUsers(); // ⬅️ هذا السطر يُعيد تحميل القائمة


  } catch (err) {
    console.error(err);
    alert(err);
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


      <NavbarAdmin/>
      <h2 className="text-xl font-bold mb-4">قائمة المستخدمين</h2>
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

      <div className="text-right font-bold mt-4">
        مجموع الرصيد: {totalBalance}$
      </div>
    </div>
  );
}
