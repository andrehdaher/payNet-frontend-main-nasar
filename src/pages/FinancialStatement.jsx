import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import {
  authConfig,
  fetchPaginated,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";
import { apiUrl } from "../config/api";
import { normalizePaymentStatusLabel } from "../utils/paymentStatus";

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Damascus",
  });
}

function getRefusedSeenKey(userEmail, date = getTodayDate()) {
  return `paynet:refused-seen:${userEmail || "anonymous"}:${date}`;
}

const getPayloadData = (value) => {
  const candidates = [
    value?.message?.data,
    value?.data?.message?.data,
    value?.data?.data,
    value?.data,
    value?.message && typeof value.message === "object" ? value.message : undefined,
    value,
  ];

  return candidates.find((item) => item !== undefined && item !== null && item !== "") || {};
};

const CODE_KEYS = [
  "code",
  "pin",
  "card_number",
  "cardNumber",
  "serial",
  "digital_code",
  "digitalCode",
  "voucher",
  "username",
  "email",
  "password",
  "replay",
  "reply",
  "message",
];

const readPath = (source, path) =>
  path.reduce(
    (value, key) => (value && value[key] !== undefined ? value[key] : undefined),
    source,
  );

const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const hasCodeFields = (value) =>
  isObject(value) && CODE_KEYS.some((key) => value[key] !== undefined && value[key] !== null && value[key] !== "");

const normalizeCodeArray = (value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== "");
  if (!isObject(value)) return [value];
  if (hasCodeFields(value)) return [value];

  return Object.values(value).filter((item) => item !== undefined && item !== null && item !== "");
};

const getCodeArray = (source) => {
  if (Array.isArray(source)) return source;

  const payload = getPayloadData(source);
  const paths = [
    ["digital_codes"],
    ["digitalCodes"],
    ["digital_code"],
    ["digitalCode"],
    ["codes"],
    ["cards"],
    ["items"],
    ["replay_api"],
    ["replayApi"],
    ["order", "replay_api"],
    ["order", "replayApi"],
    ["aleso_order_data", "replay_api"],
    ["aleso_order_data", "replayApi"],
    ["aleso_response", "data", "replay_api"],
    ["prowave_codes_response", "message", "data", "digital_codes"],
    ["prowave_codes_response", "data", "digital_codes"],
    ["prowave_codes_response", "digital_codes"],
    ["prowave_codes_response", "codes"],
    ["prowave_response", "message", "data", "digital_codes"],
    ["prowave_response", "data", "digital_codes"],
    ["prowave_response", "digital_codes"],
    ["prowave_response", "codes"],
  ];

  for (const path of paths) {
    const codes = normalizeCodeArray(readPath(payload, path));
    if (codes.length) return codes;
  }

  for (const path of paths) {
    const codes = normalizeCodeArray(readPath(source, path));
    if (codes.length) return codes;
  }

  return hasCodeFields(payload) ? [payload] : [];
};

const getProWaveCodes = (payment) => {
  const extra = payment?.extra || {};
  if (extra.provider !== "prowave") return [];

  const candidates = [
    getCodeArray(extra.digital_codes),
    getCodeArray(extra.prowave_purchase_data),
    getCodeArray(extra.prowave_response),
    getCodeArray(extra.prowave_codes_response),
  ];

  return candidates.find((codes) => codes.length > 0) || [];
};

const isProWaveDirectTopUpPayment = (payment) => {
  const extra = payment?.extra || {};
  return (
    extra.provider === "prowave" &&
    (extra.operation_type === "direct_topup" ||
      extra.prowave_operation_type === "direct_topup")
  );
};

const formatProWaveCode = (code) => {
  if (!code || typeof code !== "object") return String(code || "-");

  const codeParts = CODE_KEYS
    .map((key) => code[key])
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map(String);

  return codeParts.length ? codeParts.join(" / ") : JSON.stringify(code);
};

const renderProWaveDirectTopUp = (payment) => {
  const extra = payment?.extra || {};
  const requestName = extra.prowave_request_name || extra.name;
  const status = normalizePaymentStatusLabel(extra.recharge_status || payment.status);
  const rejectionReason = extra.rejection_reason || payment.note;

  return (
    <div className="mx-auto max-w-[240px] space-y-1 whitespace-normal text-right">
      <div className="rounded-md bg-sky-50 px-2 py-1">
        <p className="break-words text-xs font-bold text-sky-900">
          {requestName || "بانتظار اسم الطلب"}
        </p>
        {status && (
          <p className="mt-0.5 text-[11px] font-semibold text-sky-700">
            {status}
          </p>
        )}
        {rejectionReason && payment.status?.includes("غير") && (
          <p className="mt-0.5 text-[11px] font-semibold text-red-700">
            {rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
};

const renderProWaveCodes = (payment) => {
  if (payment?.extra?.provider !== "prowave") return "-";

  if (isProWaveDirectTopUpPayment(payment)) {
    return renderProWaveDirectTopUp(payment);
  }

  const codes = getProWaveCodes(payment);
  if (!codes.length) {
    return <span className="text-xs font-semibold text-amber-700">بانتظار الكود</span>;
  }

  return (
    <div className="mx-auto max-w-[240px] space-y-1 whitespace-normal text-right">
      {codes.map((code, index) => (
        <div key={`${formatProWaveCode(code)}-${index}`} className="rounded-md bg-emerald-50 px-2 py-1">
          <p className="break-words font-mono text-xs font-bold text-emerald-900">
            {formatProWaveCode(code)}
          </p>
          {code?.status && (
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">{code.status}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const formatAlesoReply = (reply) => {
  if (!reply || typeof reply !== "object") return String(reply || "-");

  const values = CODE_KEYS
    .map((key) => reply[key])
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => (Array.isArray(value) ? value.join(" / ") : String(value)));

  return values.length ? values.join(" / ") : JSON.stringify(reply);
};

const renderAlesoOrder = (payment) => {
  const extra = payment?.extra || {};
  if (extra.provider !== "aleso") return "-";

  const orderId = extra.aleso_order_id || extra.order_id || extra.order_uuid;
  const status = normalizePaymentStatusLabel(extra.aleso_status || payment.status);
  const replies = [
    ...normalizeCodeArray(extra.replay_api),
    ...getCodeArray(extra.aleso_order_data),
    ...getCodeArray(extra.aleso_response),
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-[260px] space-y-1 whitespace-normal text-right">
      <div className="rounded-md bg-violet-50 px-2 py-1">
        <p className="break-words text-xs font-bold text-violet-900">
          {orderId || "بانتظار رقم الطلب"}
        </p>
        {status && (
          <p className="mt-0.5 text-[11px] font-semibold text-violet-700">
            {status}
          </p>
        )}
      </div>
      {replies.map((reply, index) => (
        <div key={`${formatAlesoReply(reply)}-${index}`} className="rounded-md bg-emerald-50 px-2 py-1">
          <p className="break-words font-mono text-xs font-bold text-emerald-900">
            {formatAlesoReply(reply)}
          </p>
        </div>
      ))}
    </div>
  );
};

const renderProviderResult = (payment) => {
  if (payment?.extra?.provider === "aleso") return renderAlesoOrder(payment);

  return renderProWaveCodes(payment);
};

export default function FinancialStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [pendingPaymentType, setPendingPaymentType] = useState(null);
  const {
    setHasNewUnpaid,
    setHasUnseenRefusedToday,
    setRefusedTodaySeenAt,
  } = useNotification();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchLandline || undefined,
      date: searchDate || undefined,
      status: searchStatus || undefined,
      paymentType: paymentFilter || undefined,
    }),
    [currentPage, itemsPerPage, searchLandline, searchDate, searchStatus, paymentFilter],
  );

  const queryKey = paymentQueryKeys.userConfirmed(queryParams);

  const confirmedQuery = useQuery({
    queryKey,
    queryFn: () => fetchPaginated("/api/admin/user/confirmed", queryParams),
    placeholderData: keepPreviousData,
  });

  const confirmedPayments = confirmedQuery.data?.data || [];
  const pagination = confirmedQuery.data?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    if (confirmedQuery.isSuccess) {
      setHasNewUnpaid(false);
      const now = Date.now();
      const email = getCurrentEmail();
      localStorage.setItem(getRefusedSeenKey(email), String(now));
      setRefusedTodaySeenAt(now);
      setHasUnseenRefusedToday(false);
    }
  }, [confirmedQuery.isSuccess, setHasNewUnpaid, setHasUnseenRefusedToday, setRefusedTodaySeenAt]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchLandline, searchDate, searchStatus, paymentFilter]);

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.userConfirmed(nextParams),
        queryFn: () => fetchPaginated("/api/admin/user/confirmed", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient, queryParams]);

  const paymentTypeMutation = useMutation({
    mutationFn: ({ id, newType }) =>
      axios.put(
        apiUrl(`/api/admin/payment/${id}`),
        { paymentType: newType },
        authConfig(),
      ),
    onMutate: async ({ id, newType }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.map((payment) =>
            payment._id === id ? { ...payment, paymentType: newType } : payment,
          ),
        };
      });

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "حدث خطأ أثناء تعديل نوع الدفع."),
      });
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "تم تعديل نوع الدفع." });
      setPendingPaymentType(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "user-confirmed"] });
    },
  });

  const columns = useMemo(
    () => [
      {
        key: "operationType",
        label: "نوع العملية",
        render: (p) => p.operationType || (p.source === "batch" ? "تعبئة رصيد" : "تسديد خدمة"),
      },
      {
        key: "operationTarget",
        label: "الوجهة",
        render: (p) => p.operationTarget || p.pointUsername || p.email || "-",
      },
      { key: "landline", label: "رقم أرضي" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      { key: "providerResult", label: "الكود / الطلب", render: renderProviderResult },
      {
        key: "paymentType",
        label: "نوع الدفع",
        render: (p) =>
          p.source === "internet" ? (
            <select
              value={p.paymentType || ""}
              onChange={(e) => setPendingPaymentType({ id: p._id, newType: e.target.value })}
              disabled={paymentTypeMutation.isPending}
              className="rounded border border-slate-300 bg-white p-1 text-sm text-slate-900 disabled:opacity-60"
            >
              <option value="cash">نقدا</option>
              <option value="credit">دين</option>
            </select>
          ) : (
            "-"
          ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (p) => {
          const displayStatus = normalizePaymentStatusLabel(p.status);

          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${displayStatus === "تم التسديد" || displayStatus === "تم التحويل"
                ? "bg-green-200 text-green-800"
                : displayStatus === "غير مسددة"
                  ? "bg-red-200 text-red-800"
                  : displayStatus === "غير مؤكد"
                    ? "bg-amber-100 text-amber-800"
                    : displayStatus === "جاري التسديد" || displayStatus === "قيد التنفيذ"
                      ? "bg-yellow-200 text-yellow-800"
                      : displayStatus === "بدء التسديد"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                }`}
            >
              {(displayStatus === "تم التسديد" || displayStatus === "تم التحويل") && <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}
              {displayStatus}
            </span>
          );
        },
      },
      {
        key: "date",
        label: "تاريخ التسديد",
        render: (p) =>
          new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
      {
        key: "note",
        label: "ملاحظات",
        render: (p) => (p.status === "غير مسددة" ? p.note || "-" : "-"),
      },
    ],
    [paymentTypeMutation.isPending],
  );

  return (
    <ScreenWrapper>
      <PageHeader
        title="البيان المالي"
        description="راجع عملياتك المالية وابحث حسب الرقم، التاريخ، حالة التسديد أو طريقة الدفع."
      />
      {(message || confirmedQuery.isError) && (
        <Alert type={message?.type || "error"} className="mb-4">
          {message?.text || getApiErrorMessage(confirmedQuery.error, "تعذر تحميل البيان المالي.")}
        </Alert>
      )}
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-700">البيان المالي</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Input
              id="financial-search-landline"
              label="بحث"
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              value={searchLandline}
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              id="financial-search-date"
              label="تاريخ"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <div>
              <label htmlFor="financial-search-status" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة التسديد
              </label>
              <select
                id="financial-search-status"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="تم التسديد">تم التسديد</option>
                <option value="غير مسددة">غير مسددة</option>
              </select>
            </div>
            <div>
              <label htmlFor="financial-payment-filter" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة الدفع
              </label>
              <select
                id="financial-payment-filter"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="cash">نقدا</option>
                <option value="credit">دين</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={confirmedPayments}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            loading={confirmedQuery.isLoading}
            updating={confirmedQuery.isFetching && !confirmedQuery.isLoading}
          />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={Boolean(pendingPaymentType)}
        title="تعديل نوع الدفع"
        description="هل أنت متأكد من تعديل نوع الدفع لهذه العملية؟"
        confirmText="تعديل"
        loading={paymentTypeMutation.isPending}
        onClose={() => {
          if (!paymentTypeMutation.isPending) setPendingPaymentType(null);
        }}
        onConfirm={() => {
          if (pendingPaymentType) paymentTypeMutation.mutate(pendingPaymentType);
        }}
      />
    </ScreenWrapper>
  );
}
