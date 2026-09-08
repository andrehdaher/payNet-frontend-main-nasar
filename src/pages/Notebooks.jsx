import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "../components/Custom/Button";
import DataTable from "../components/Custom/DataTable";
import AddSaveNum from "../components/AddSaveNum";
import PageHeader from "../components/Custom/PageHeader";
import EmptyState from "../components/Custom/EmptyState";
import Alert from "../components/Custom/Alert";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import {
  authConfig,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";
import { apiUrl } from "../config/api";

export default function Notebooks() {
  const queryClient = useQueryClient();
  const email = getCurrentEmail();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [message, setMessage] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const savedNumbersQuery = useQuery({
    queryKey: paymentQueryKeys.savedNumbers(email),
    queryFn: async () => {
      const response = await axios.get(apiUrl(`/api/payment/save-number?email=${email}`), authConfig());
      return response.data || [];
    },
    enabled: Boolean(email),
  });

  const formData = useMemo(() => savedNumbersQuery.data || [], [savedNumbersQuery.data]);

  const invalidateSavedNumbers = () => {
    queryClient.invalidateQueries({ queryKey: paymentQueryKeys.savedNumbers(email) });
  };

  const paySelectedMutation = useMutation({
    mutationFn: ({ selectedNumbers, selectedData }) =>
      axios.post(
        apiUrl("/api/payment/pay-selected"),
        {
          email,
          numbers: selectedNumbers,
          selectedData,
        },
        authConfig(),
      ),
    onSuccess: (_response, variables) => {
      setMessage({
        type: "success",
        text: `تم تسديد ${variables.selectedNumbers.length} رقم بنجاح: ${variables.selectedNumbers.join(", ")}`,
      });
      setSelectedRows([]);
      invalidateSavedNumbers();
    },
    onError: (error) => {
      setMessage({ type: "error", text: getApiErrorMessage(error, "حدث خطأ في تسديد الأرقام. حاول مرة أخرى.") });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ rowId, values }) =>
      axios.put(
        apiUrl(`/api/payment/save-number/${rowId}`),
        values,
        authConfig(),
      ),
    onSuccess: () => {
      setEditingId(null);
      setEditedRow({});
      setMessage({ type: "success", text: "تم حفظ التعديلات." });
      invalidateSavedNumbers();
    },
    onError: (error) => {
      setMessage({ type: "error", text: getApiErrorMessage(error, "تعذر حفظ التعديلات. حاول لاحقا.") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (row) =>
      axios.delete(apiUrl(`/api/payment/save-number/${row._id || row.id}`), {
        ...authConfig(),
        data: { email },
      }),
    onSuccess: () => {
      setMessage({ type: "success", text: "تم حذف الرقم من القائمة." });
      setDeleteCandidate(null);
      invalidateSavedNumbers();
    },
    onError: (error) => {
      setMessage({ type: "error", text: getApiErrorMessage(error, "تعذر حذف الرقم.") });
    },
  });

  const selectedData = useMemo(
    () =>
      formData.filter((row, index) => {
        const uniqueId = row.id || row._id || index;
        return selectedRows.includes(uniqueId);
      }),
    [formData, selectedRows],
  );

  const startEdit = (row) => {
    const rowId = row._id || row.id || row.landline;
    setEditingId(rowId);
    setEditedRow({
      landline: row.landline,
      company: row.company,
      date: row.date,
      amount: row.amount,
      speed: row.speed,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedRow({});
  };

  const saveEdit = useCallback((rowId) => {
    editMutation.mutate({
      rowId,
      values: {
        landline: editedRow.landline,
        company: editedRow.company,
        date: editedRow.date,
        amount: editedRow.amount,
      },
    });
  }, [editMutation, editedRow.amount, editedRow.company, editedRow.date, editedRow.landline]);

  const selectNum = () => {
    const numbers = selectedData.map((row) => row.landline);

    if (selectedData.length === 0) {
      setMessage({ type: "warning", text: "لم يتم تحديد أي رقم." });
      return;
    }

    paySelectedMutation.mutate({ selectedNumbers: numbers, selectedData });
  };

  const actionLoading = paySelectedMutation.isPending || editMutation.isPending || deleteMutation.isPending;

  const notebookColumns = useMemo(
    () => [
      {
        key: "select",
        label: "✔",
        render: (row, index) => {
          const uniqueId = row.id || row._id || index;
          return (
            <input
              type="checkbox"
              checked={selectedRows.includes(uniqueId)}
              aria-label={`تحديد الرقم ${row.landline || uniqueId}`}
              className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-2 focus:ring-violet-500"
              onChange={() => {
                setSelectedRows((current) =>
                  current.includes(uniqueId)
                    ? current.filter((id) => id !== uniqueId)
                    : [...current, uniqueId],
                );
              }}
            />
          );
        },
      },
      {
        key: "landline",
        label: "الرقم",
        render: (row) => {
          const rowId = row._id || row.id || row.landline;
          if (editingId === rowId) {
            return (
              <input
                aria-label="تعديل الرقم"
                className="w-28 rounded-md border border-slate-300 bg-white p-1 text-center text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={editedRow.landline ?? ""}
                onChange={(e) => setEditedRow({ ...editedRow, landline: e.target.value })}
              />
            );
          }
          return row.landline;
        },
      },
      {
        key: "company",
        label: "الشركة",
        render: (row) => {
          const rowId = row._id || row.id || row.landline;
          if (editingId === rowId) {
            return (
              <input
                aria-label="تعديل الشركة"
                className="w-28 rounded-md border border-slate-300 bg-white p-1 text-center text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={editedRow.company ?? ""}
                onChange={(e) => setEditedRow({ ...editedRow, company: e.target.value })}
              />
            );
          }
          return row.company;
        },
      },
      {
        key: "createdAt",
        label: "تاريخ الإنشاء",
        render: (row) => new Date(row.createdAt).toLocaleDateString("ar-SY", { dateStyle: "medium" }),
      },
      {
        key: "date",
        label: "تاريخ التسديد",
        render: (row) => {
          const rowId = row._id || row.id || row.landline;
          if (editingId === rowId) {
            const value = editedRow.date ? new Date(editedRow.date).toISOString().slice(0, 10) : "";
            return (
              <input
                type="date"
                aria-label="تعديل تاريخ التسديد"
                className="w-36 rounded-md border border-slate-300 bg-white p-1 text-center text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={value}
                onChange={(e) => setEditedRow({ ...editedRow, date: e.target.value })}
              />
            );
          }
          return new Date(row.date).toLocaleDateString("ar-SY", { dateStyle: "medium" });
        },
      },
      {
        key: "amount",
        label: "المبلغ",
        render: (row) => {
          const rowId = row._id || row.id || row.landline;
          if (editingId === rowId) {
            return (
              <input
                type="number"
                aria-label="تعديل المبلغ"
                className="w-28 rounded-md border border-slate-300 bg-white p-1 text-center text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={editedRow.amount ?? 0}
                onChange={(e) => setEditedRow({ ...editedRow, amount: Number(e.target.value) })}
              />
            );
          }
          return `${row.amount?.toLocaleString?.() || row.amount} ل.س`;
        },
      },
      { key: "speed", label: "السرعة" },
      {
        key: "actions",
        label: "اجراءات",
        render: (row) => {
          const rowId = row._id || row.id || row.landline;
          const isEditing = editingId === rowId;
          return (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="success" size="sm" loading={editMutation.isPending} onClick={() => saveEdit(rowId)}>
                    حفظ
                  </Button>
                  <Button variant="outline" size="sm" disabled={actionLoading} onClick={cancelEdit}>
                    إلغاء
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" disabled={actionLoading} onClick={() => startEdit(row)}>
                    تعديل
                  </Button>
                  <Button variant="danger" size="sm" disabled={actionLoading} onClick={() => setDeleteCandidate(row)}>
                    حذف
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [actionLoading, editMutation.isPending, editedRow, editingId, saveEdit, selectedRows],
  );

  return (
    <ScreenWrapper>
      <PageHeader
        title="الأرقام المحفوظة"
        description="احفظ الأرقام المتكررة، عدلها، وحدد أكثر من رقم للتسديد دفعة واحدة."
        actions={<Button className="bg-violet-600 text-white" onClick={() => setShowForm(true)}>إضافة رقم</Button>}
      />
      {(message || savedNumbersQuery.isError) && (
        <Alert type={message?.type || "error"} className="mb-4">
          {message?.text || getApiErrorMessage(savedNumbersQuery.error, "تعذر تحميل الأرقام المحفوظة.")}
        </Alert>
      )}

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-blue-400 text-white text-sm"
                variant="outline"
                onClick={() => {
                  const allIds = formData.map((row, index) => row.id || row._id || index);
                  setSelectedRows(allIds);
                }}
                disabled={formData.length === 0 || actionLoading}
              >
                تحديد الكل
              </Button>
              <Button
                className="bg-gray-400 text-white text-sm"
                variant="outline"
                onClick={() => setSelectedRows([])}
                disabled={selectedRows.length === 0 || actionLoading}
              >
                إلغاء تحديد الكل
              </Button>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-2 text-sm font-bold text-violet-800">
              المحدد: {selectedRows.length}
            </span>
          </div>
        </div>

        {showForm && (
          <AddSaveNum
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              invalidateSavedNumbers();
            }}
          />
        )}

        <div className="w-full px-4">
          {formData.length > 0 || savedNumbersQuery.isLoading ? (
            <DataTable
              columns={notebookColumns}
              data={formData}
              currentPage={1}
              totalPages={1}
              onPageChange={() => { }}
              loading={savedNumbersQuery.isLoading}
              updating={savedNumbersQuery.isFetching && !savedNumbersQuery.isLoading}
            />
          ) : (
            <EmptyState
              title="لا توجد أرقام محفوظة"
              description="اضغط على إضافة رقم لإنشاء أول رقم محفوظ."
              action={<Button onClick={() => setShowForm(true)}>إضافة رقم</Button>}
            />
          )}
        </div>

        <div className="mt-4 w-full px-4">
          <Button
            onClick={selectNum}
            className="w-full bg-green-500 text-white"
            disabled={selectedRows.length === 0}
            loading={paySelectedMutation.isPending}
          >
            تسديد الأرقام المحددة ({selectedRows.length})
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteCandidate)}
        title="حذف الرقم"
        description="هل أنت متأكد من حذف هذا الرقم من القائمة؟"
        confirmText="حذف"
        tone="danger"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) setDeleteCandidate(null);
        }}
        onConfirm={() => deleteCandidate && deleteMutation.mutate(deleteCandidate)}
      />
    </ScreenWrapper>
  );
}
