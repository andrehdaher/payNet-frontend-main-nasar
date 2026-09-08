import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import NavbarAdmin from "../components/NavbarAdmin";
import EditUserForm from "../components/EditUserForm";
import PageHeader from "../components/Custom/PageHeader";
import DataTable from "../components/Custom/DataTable";
import { Button } from "../components/Custom/Button";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import PromptDialog from "../components/Custom/PromptDialog";
import Alert from "../components/Custom/Alert";
import Footer from "../components/Footer";
import { apiUrl } from "../config/api";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(apiUrl("/api/admin/all-user"))
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        setMessage({ type: "error", text: "تعذر تحميل المستخدمين." });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const runAction = async (callback, successText) => {
    try {
      setActionLoading(true);
      setMessage(null);
      await callback();
      setMessage({ type: "success", text: successText });
      fetchUsers();
      setDialog(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "تعذر تنفيذ العملية." });
    } finally {
      setActionLoading(false);
    }
  };

  const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
  const selected = dialog?.user;

  const columns = useMemo(
    () => [
      { key: "name", label: "الاسم" },
      { key: "email", label: "البريد" },
      { key: "number", label: "رقم الهاتف" },
      { key: "role", label: "النوع" },
      { key: "balance", label: "الرصيد", render: (user) => `${user.balance || 0}` },
      {
        key: "actions",
        label: "إجراءات",
        render: (user) => (
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditUserId(user._id); }}>
              تعديل
            </Button>
            <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); setDialog({ type: "batch", user }); }}>
              إضافة دفعة
            </Button>
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDialog({ type: "delete", user }); }}>
              حذف
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <NavbarAdmin />
      {editUserId && (
        <EditUserForm userId={editUserId} onClose={() => setEditUserId(null)} onUpdate={fetchUsers} />
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="قائمة المستخدمين"
          description="إدارة المستخدمين والأرصدة والدفعات من مكان واحد."
          stats={[
            { label: "عدد المستخدمين", value: users.length },
            { label: "مجموع الرصيد", value: `${totalBalance}$` },
          ]}
        />

        {message && <Alert type={message.type} className="mb-4">{message.text}</Alert>}

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyTitle="لا يوجد مستخدمون"
          emptyDescription="ستظهر الحسابات هنا بعد إضافتها."
        />
      </main>

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="حذف المستخدم"
        description={selected ? `هل تريد حذف المستخدم ${selected.email}؟ لا يمكن التراجع عن هذه العملية.` : ""}
        confirmText="حذف"
        tone="danger"
        loading={actionLoading}
        onClose={() => setDialog(null)}
        onConfirm={() => runAction(() => axios.delete(apiUrl(`/api/admin/deleteuser/${selected._id}`)), "تم حذف المستخدم.")}
      />

      <PromptDialog
        open={dialog?.type === "batch"}
        title="إضافة دفعة"
        description={selected ? `إضافة دفعة إلى حساب ${selected.email}.` : ""}
        label="قيمة الدفعة"
        inputType="number"
        placeholder="أدخل المبلغ"
        confirmText="إضافة"
        tone="success"
        loading={actionLoading}
        onClose={() => setDialog(null)}
        onConfirm={(value) => {
          const amount = parseFloat(value);
          if (Number.isNaN(amount)) return;
          runAction(() => axios.put(apiUrl(`/api/admin/addbatch/${selected._id}`), { amount }), "تمت إضافة الدفعة بنجاح.");
        }}
      />
      <Footer />
    </div>
  );
}
