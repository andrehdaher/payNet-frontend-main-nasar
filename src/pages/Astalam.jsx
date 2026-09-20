import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import InquiryForm from "../components/inquiry/InquiryForm";
import InquiryHistory from "../components/inquiry/InquiryHistory";
import InquiryResult from "../components/inquiry/InquiryResult";
import {
  buildHistoryRows,
  getResponseData,
  getTodayDate,
  logBelongsToUser,
  normalizeSocketData,
  parseJwt,
} from "../components/inquiry/inquiryUtils";
import { useToast } from "../context/ToastContext";
import { writeClipboardText } from "../utils/clipboard";

const SOCKET_URL = "https://daherserver-zgmy.onrender.com";

const COMPANIES = [
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

export default function Astalam() {
  const toast = useToast();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const astalamRef = useRef(false);

  const [astalam, setastalam] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [landline, setLandline] = useState("");
  const [fatoraData, setFatoraData] = useState(null);
  const [historyDate, setHistoryDate] = useState(getTodayDate);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const token = localStorage.getItem("token");
  const decoded = useMemo(() => parseJwt(token), [token]);
  const email = decoded?.email;

  useEffect(() => {
    astalamRef.current = astalam;
  }, [astalam]);

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
        setastalam(false);
        fetchInquiryHistory();
      } catch (error) {
        console.error("خطأ في تحليل JSON:", error);
        setastalam(false);
        toast.error("تعذر قراءة رد المزود. يرجى إعادة المحاولة.");
      }
    });

    socket.on("connect_error", () => {
      if (!astalamRef.current) return;

      setastalam(false);
      toast.error("تعذر الاتصال بخادم الاستعلام. تحقق من الاتصال وحاول مرة أخرى.");
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
  }, [email, fetchInquiryHistory, toast]);

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

  const resetInquiry = () => {
    setastalam(false);
    setFatoraData(null);
    setLandline("");
  };

  const copyInquiryDetails = async (text) => {
    const copied = await writeClipboardText(text);
    if (copied) {
      toast.success("تم نسخ تفاصيل الفاتورة بنجاح.");
    } else {
      toast.warning("تعذر نسخ التفاصيل تلقائياً.");
    }
  };

  const handelAstalam = () => {
    if (astalam) {
      toast.warning("يوجد استعلام قيد التنفيذ حالياً.");
      return;
    }

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
  };

  return (
    <ScreenWrapper>
      <div className="space-y-6" dir="rtl">
        <div dir="ltr" className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          <div dir="rtl" className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">
            <InquiryResult
              data={fatoraData}
              isWaiting={astalam && !fatoraData}
              selectedCompany={selectedCompany}
              landline={landline}
              onCopy={copyInquiryDetails}
              onNewInquiry={resetInquiry}
              onPay={() => goToInternetPayment()}
            />
          </div>
          <div dir="rtl" className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4">
            <InquiryForm
              companies={COMPANIES}
              selectedCompany={selectedCompany}
              landline={landline}
              loading={astalam}
              onCompanyChange={setSelectedCompany}
              onLandlineChange={setLandline}
              onSubmit={handelAstalam}
            />
          </div>
        </div>

        <InquiryHistory
          rows={historyLogs}
          date={historyDate}
          loading={historyLoading}
          error={historyError}
          onDateChange={setHistoryDate}
          onRefresh={fetchInquiryHistory}
          onPay={goToInternetPayment}
        />
      </div>
    </ScreenWrapper>
  );
}
