import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import Alert from "../components/Custom/Alert";
import { useToast } from "../context/ToastContext";

const SOCKET_URL = "https://daherserver-zgmy.onrender.com";
const CONNECTION_LOG_TYPES = new Set(["register", "disconnect"]);
const RESPONSE_MESSAGE_PREFIX = "Sent payment result:";
const REQUEST_MESSAGE_PATTERN = /^Received inquiry request for\s+(.+?)\s+in\s+(.+)$/i;
const RESPONSE_MAIN_KEYS = new Set([
  "اسم المشترك",
  "الرصيد",
]);
const RESPONSE_META_KEYS = new Set([
  "email",
  "selectedCompany",
  "company",
  "landline",
  "number",
]);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Damascus",
  });
}

function getNestedValue(source, keys) {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
}

function stringifyValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function normalizeLogData(data) {
  if (!data) return null;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return { response: data };
    }
  }

  return data;
}

function normalizeSocketData(data) {
  const rawData = data?.content?.data;

  if (typeof rawData === "string") {
    return JSON.parse(rawData);
  }

  return rawData;
}

function getLogLandline(log) {
  const data = normalizeLogData(log?.data);

  return getNestedValue(
    { ...log, data },
    [
      "landline",
      "number",
      "data.landline",
      "data.number",
      "data.content.landline",
      "data.content.number",
      "data.request.landline",
      "data.request.number",
    ],
  );
}

function getLogCompany(log) {
  const data = normalizeLogData(log?.data);

  return getNestedValue(
    { ...log, data },
    [
      "selectedCompany",
      "company",
      "data.selectedCompany",
      "data.company",
      "data.content.selectedCompany",
      "data.content.company",
      "data.request.selectedCompany",
      "data.request.company",
    ],
  );
}

function parseRequestInfo(log) {
  const match = String(log?.message || "").match(REQUEST_MESSAGE_PATTERN);

  if (!match) return null;

  return {
    landline: match[1]?.trim() || "",
    company: match[2]?.trim() || "",
    timestamp: Number(log?.timestamp) || 0,
  };
}

function parseResponseDataFromMessage(message) {
  const text = String(message || "");
  const prefixIndex = text.indexOf(RESPONSE_MESSAGE_PREFIX);

  if (prefixIndex < 0) return null;

  const payload = text.slice(prefixIndex + RESPONSE_MESSAGE_PREFIX.length).trim();

  if (!payload) return null;

  try {
    return JSON.parse(payload);
  } catch {
    return { response: payload };
  }
}

function getCandidateResponseData(log) {
  const messageData = parseResponseDataFromMessage(log?.message);
  if (messageData) return messageData;

  const data = normalizeLogData(log?.data);
  if (!data) return null;

  if (data?.content?.data) {
    return normalizeLogData(data.content.data);
  }

  if (data?.data) {
    return normalizeLogData(data.data);
  }

  return data;
}

function hasResponseFields(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;

  return Object.keys(data).some(
    (key) => !RESPONSE_META_KEYS.has(key) && !["content", "request"].includes(key),
  );
}

function getResponseData(log) {
  if (!log || CONNECTION_LOG_TYPES.has(log.type)) return null;
  if (String(log.message || "").match(REQUEST_MESSAGE_PATTERN)) return null;

  const data = getCandidateResponseData(log);

  return hasResponseFields(data) ? data : null;
}

function logBelongsToUser(log, email) {
  if (!email || !log || CONNECTION_LOG_TYPES.has(log.type)) return false;

  const data = normalizeLogData(log.data);
  const searchableValues = [
    log.from,
    log.target,
    log.email,
    data?.email,
    data?.content?.email,
    data?.request?.email,
  ];

  return searchableValues.some(
    (value) => String(value || "").toLowerCase() === email.toLowerCase(),
  );
}

function pickResponseValue(data, keys) {
  const key = keys.find(
    (item) => data?.[item] !== undefined && data?.[item] !== null && data?.[item] !== "",
  );

  return key ? data[key] : "";
}

function getExtraResponseRows(data) {
  if (!data || typeof data !== "object") return [];

  return Object.entries(data).filter(
    ([key]) => !RESPONSE_MAIN_KEYS.has(key) && !RESPONSE_META_KEYS.has(key),
  );
}

function findNearestRequestInfo(log, requestInfos) {
  const timestamp = Number(log?.timestamp) || 0;
  const olderRequests = requestInfos
    .filter((request) => request.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp);

  if (olderRequests[0]) return olderRequests[0];

  return (
    requestInfos
      .slice()
      .sort((a, b) => Math.abs(timestamp - a.timestamp) - Math.abs(timestamp - b.timestamp))[0] || null
  );
}

function buildHistoryRows(logs) {
  const requestInfos = logs.map(parseRequestInfo).filter(Boolean);

  return logs
    .map((log, index) => {
      const responseData = getResponseData(log);
      if (!responseData) return null;

      const pairedRequest = findNearestRequestInfo(log, requestInfos);
      const company =
        getLogCompany(log) ||
        responseData.company ||
        responseData.selectedCompany ||
        pairedRequest?.company ||
        "";
      const rowLandline =
        getLogLandline(log) ||
        responseData.landline ||
        responseData.number ||
        pairedRequest?.landline ||
        "";

      return {
        id: log.id || `${log.timestamp}-${index}`,
        timestamp: Number(log.timestamp) || 0,
        company,
        landline: rowLandline,
        subscriberName: pickResponseValue(responseData, ["اسم المشترك", "صاحب الخط"]),
        balance: pickResponseValue(responseData, ["الرصيد", "رصيد المشترك"]),
        nextInvoiceDate: pickResponseValue(responseData, ["تاريخ الفاتورة القادمة"]),
        packagePrice: pickResponseValue(responseData, ["سعر الحزمة"]),
        date: log.date || "",
        time: log.time || "",
        extraRows: getExtraResponseRows(responseData),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export default function Astalam() {
  const toast = useToast();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [astalam, setastalam] = useState(false);
  const [fatora, setfatora] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [landline, setLandline] = useState("");
  const [fatoraData, setFatoraData] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(true);
  const [historyDate, setHistoryDate] = useState(getTodayDate);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const token = localStorage.getItem("token");
  const decoded = useMemo(() => parseJwt(token), [token]);
  const email = decoded?.email;

  const fetchInquiryHistory = useCallback(async () => {
    if (!email) return;

    setHistoryLoading(true);
    setHistoryError("");

    try {
      const response = await axios.get(`${SOCKET_URL}/api/reports/InquiryLogs`, {
        params: {
          date: historyDate,
          email,
        },
      });

      const logs = Array.isArray(response.data?.logs) ? response.data.logs : [];
      setHistoryLogs(
        buildHistoryRows(logs.filter((log) => logBelongsToUser(log, email))),
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "تعذر جلب سجل الاستعلامات. تحقق من الاتصال وحاول مرة أخرى.";

      setHistoryError(message);
      setHistoryLogs([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [email, historyDate]);

  useEffect(() => {
    fetchInquiryHistory();
  }, [fetchInquiryHistory]);

  useEffect(() => {
    if (fatora && fatoraData) {
      setLoading(true);
      setCountdown(5);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoading(false);
            setastalam(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [fatora, fatoraData]);

  useEffect(() => {
    if (!email) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", email);
    });

    socket.on("json_message", (data) => {
      try {
        const parsedData = normalizeSocketData(data);

        setFatoraData(parsedData);
        setfatora(true);
        fetchInquiryHistory();
      } catch (error) {
        console.error("خطأ في تحليل JSON:", error);
      }
    });

    socket.on("createLog", (newLog) => {
      if (!logBelongsToUser(newLog, email) || !getResponseData(newLog)) return;

      setHistoryLogs((currentLogs) => {
        const [newRow] = buildHistoryRows([newLog]);
        if (!newRow) return currentLogs;

        const withoutDuplicate = currentLogs.filter((row) => row.id !== newRow.id);

        return [newRow, ...withoutDuplicate].sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0),
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [email, fetchInquiryHistory]);

  const goToInternetPayment = (
    paymentLandline = landline,
    paymentCompany = selectedCompany,
  ) => {
    if (!paymentLandline || !paymentCompany) {
      toast.warning("لا يمكن تحويل الطلب للدفع بدون الرقم والشركة.");
      return;
    }

    navigate("/payinternet", {
      state: {
        formType: "ADSL",
        landline: paymentLandline,
        selectedCompany: paymentCompany,
      },
    });
  };

  const handelAstalam = () => {
    if (!selectedCompany || !landline) {
      toast.warning("يرجى اختيار الشركة وإدخال الرقم الأرضي");
      return;
    }
    if (socketRef.current) {
      socketRef.current.emit("json_message", {
        target: "worker",
        content: { email, selectedCompany, landline },
      });
    }

    setastalam(true);
    setFatoraData(null);
    setfatora(false);
    setLoading(true);
  };

  const companies = [
    "",
    "برونت",
    "اينت",
    "رنت",
    "الكم",
    "ليما",
    "سوا",
    "اية",
    "يارا",
    "بطاقات",
    "هايبر",
    "ويف",
    "امنية",
    "فيو",
    "ليزر",
    "متس",
    "سما",
    "زاد",
    "دنيا",
    "هاي فاي",
    "تكامل",
    "لاين",
    "الجمعية",
  ];

  return (
    <ScreenWrapper>
      <div className="space-y-4" dir="rtl">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">استعلام عن فاتورة</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelAstalam();
              }}
              className="space-y-5"
              aria-busy={astalam}
            >
              <div className="space-y-1 text-right">
                <label htmlFor="company" className="block text-sm font-semibold text-slate-700">
                  اختر الشركة
                </label>
                <select
                  id="company"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                  required
                >
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="landline"
                name="landline"
                label="رقم الأرضي"
                value={landline}
                onChange={(e) => setLandline(e.target.value)}
                required
                type="text"
                inputMode="numeric"
              />

              <Button type="submit" className="w-full" loading={astalam}>
                {astalam ? "جاري الاستعلام..." : "استعلام عن فاتورة"}
              </Button>
            </form>

            {astalam && (
              <Alert type="warning">
                الرجاء عدم مغادرة الصفحة. المدة المتوقعة 60 ثانية.
              </Alert>
            )}
          </CardContent>
        </Card>

        {fatora && (
          <div className="mx-auto max-h-80 w-full max-w-md overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
            {loading ? (
              <p className="text-sm font-semibold text-slate-700" aria-live="polite">
                الرجاء الانتظار... {countdown} ثانية
              </p>
            ) : fatoraData ? (
              <div className="space-y-4">
                <table className="w-full border-collapse text-center text-sm">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="border border-slate-300 px-4 py-2">العنوان</th>
                      <th className="border border-slate-300 px-4 py-2">القيمة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(fatoraData).map(([key, value], index) => (
                      <tr key={index} className="transition-colors hover:bg-slate-50">
                        <td className="border border-slate-300 px-4 py-2">{key}</td>
                        <td className="border border-slate-300 px-4 py-2">
                          {stringifyValue(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Button
                  type="button"
                  className="w-full"
                  variant="success"
                  onClick={() => goToInternetPayment()}
                >
                  إرسال الرقم إلى تسديد الإنترنت
                </Button>
              </div>
            ) : null}
          </div>
        )}

        <Card className="mx-auto max-w-4xl">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-2xl">سجل الاستعلامات</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-5 sm:pt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                id="history-date"
                name="historyDate"
                label="التاريخ"
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
              />

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full sm:w-auto"
                  loading={historyLoading}
                  onClick={fetchInquiryHistory}
                >
                  تحديث السجل
                </Button>
              </div>
            </div>

            {historyError && <Alert type="error">{historyError}</Alert>}

            {historyLoading ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                جاري تحميل سجل الاستعلامات...
              </p>
            ) : historyLogs.length === 0 ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {"\u0644\u0627 \u062a\u0648\u062c\u062f \u0631\u062f\u0648\u062f \u0627\u0633\u062a\u0639\u0644\u0627\u0645 \u0645\u062d\u0641\u0648\u0638\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u062a\u0627\u0631\u064a\u062e."}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full min-w-[980px] border-collapse text-center text-sm">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0644\u0634\u0631\u0643\u0629"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0644\u0631\u0642\u0645"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u062a\u0631\u0643"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0644\u0631\u0635\u064a\u062f"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 \u0627\u0644\u0642\u0627\u062f\u0645\u0629"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0633\u0639\u0631 \u0627\u0644\u062d\u0632\u0645\u0629"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0644\u062a\u0627\u0631\u064a\u062e"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0627\u0644\u0648\u0642\u062a"}</th>
                      <th className="border border-slate-200 px-3 py-3">{"\u0625\u062c\u0631\u0627\u0621"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLogs.map((row) => (
                      <tr key={row.id} className="align-top transition-colors hover:bg-slate-50">
                        <td className="border border-slate-200 px-3 py-3 font-semibold">
                          {row.company || "-"}
                        </td>
                        <td className="border border-slate-200 px-3 py-3 font-semibold">
                          {row.landline || "-"}
                        </td>
                        <td className="border border-slate-200 px-3 py-3">
                          {stringifyValue(row.subscriberName) || "-"}
                        </td>
                        <td className="border border-slate-200 px-3 py-3">
                          {stringifyValue(row.balance) || "-"}
                        </td>
                        <td className="border border-slate-200 px-3 py-3">
                          {stringifyValue(row.nextInvoiceDate) || "-"}
                        </td>
                        <td className="border border-slate-200 px-3 py-3">
                          {stringifyValue(row.packagePrice) || "-"}
                          {row.extraRows.length > 0 && (
                            <div className="mt-2 space-y-1 rounded bg-slate-50 p-2 text-xs leading-5 text-slate-600">
                              {row.extraRows.map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-semibold">{key}: </span>
                                  <span>{stringifyValue(value) || "-"}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="border border-slate-200 px-3 py-3">{row.date || "-"}</td>
                        <td className="border border-slate-200 px-3 py-3">{row.time || "-"}</td>
                        <td className="border border-slate-200 px-3 py-3">
                          {row.landline && row.company ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="success"
                              onClick={() => goToInternetPayment(row.landline, row.company)}
                            >
                              {"\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u062f\u0641\u0639"}
                            </Button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
