import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { internetDetails } from "../components/payInternet/internetDetails";
import PageHeader from "../components/Custom/PageHeader";
import FormSection from "../components/Custom/FormSection";
import { authConfig, getApiErrorMessage, getCurrentEmail } from "../api/paymentQueries";

const SUCCESS_ALERT_DURATION = 4000;

function PaymentMessagePopup({ message, onClose }) {
  const isSuccess = message?.type === "success";
  const Icon = isSuccess ? CheckCircle : XCircle;
  const title = isSuccess ? "تم إرسال الطلب" : "تعذر إرسال الطلب";
  const iconClassName = isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={`${message.type}-${message.text}`}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          dir="rtl"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-message-title"
            aria-describedby="payment-message-description"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="إغلاق الرسالة"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex gap-3 pl-7">
              <div className={`mt-1 rounded-full p-2 ${iconClassName}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="payment-message-title" className="text-lg font-bold text-slate-900">
                  {title}
                </h2>
                <p id="payment-message-description" className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const speedlessTypes = [
  "PHONE",
  "PAYCELL",
  "USDTTRC20",
  "USDTBEB20",
  "SYR",
  "MTN",
  "pubg",
  "pubgtr",
  "freefire",
  "ballpool8",
  "clashclans",
  "clashroyal",
  "jawakerman",
  "jawaker",
  "knivesout",
  "ludoking",
  "mobilelegend",
  "projectentropy",
  "whithoutsurvivial",
];

export default function PayInternet() {
  const [message, setMessage] = useState(null);
  const successAlertTimerRef = useRef(null);
  const [landline, setLandline] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentType, setPaymentType] = useState("cash");

  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state;
  const formType =
    locationState && typeof locationState === "object"
      ? locationState.formType
      : locationState;
  const prefilledLandline =
    locationState && typeof locationState === "object" ? locationState.landline || "" : "";
  const prefilledCompany =
    locationState && typeof locationState === "object" ? locationState.selectedCompany || "" : "";
  const config = internetDetails[formType] || {};
  const multiplier = config.multiplier || 1;
  const calculatedAmount = amountToPay ? (amountToPay * multiplier).toFixed(2) : "";
  const companies = config.companies || [];
  const speeds = Array.isArray(config.speeds) ? config.speeds : [];
  const title = config.title || "تنفيذ عملية دفع";

  useEffect(() => {
    if (speedlessTypes.includes(formType)) setSelectedSpeed("0");
  }, [formType]);

  useEffect(() => {
    if (prefilledLandline) setLandline(prefilledLandline);
    if (prefilledCompany) setSelectedCompany(prefilledCompany);
  }, [prefilledCompany, prefilledLandline]);

  useEffect(() => {
    if (successAlertTimerRef.current) {
      clearTimeout(successAlertTimerRef.current);
      successAlertTimerRef.current = null;
    }

    if (message?.type === "success") {
      successAlertTimerRef.current = window.setTimeout(() => {
        setMessage(null);
        successAlertTimerRef.current = null;
      }, SUCCESS_ALERT_DURATION);
    }

    return () => {
      if (successAlertTimerRef.current) {
        clearTimeout(successAlertTimerRef.current);
        successAlertTimerRef.current = null;
      }
    };
  }, [message]);

  const needsSpeed =
    Array.isArray(config.speeds) && config.speeds.length > 0 && !["PHONE", "SYR", "MTN"].includes(formType);

  const needsExtraNumber =
    config.speeds === "counter" || config.speeds === "mobilelegend" || config.speeds === "BANKTR";

  const isFormValid =
    landline &&
    selectedCompany &&
    (selectedSpeed || !needsSpeed || ["PHONE", "SYR", "MTN"].includes(formType)) &&
    amountToPay;

  const paymentMutation = useMutation({
    mutationFn: () =>
      axios.post(
        "https://paynet-1.onrender.com/api/payment/save-number/api/payment/internet-full",
        {
          landline,
          company: selectedCompany,
          speed: selectedSpeed,
          amount: parseFloat(amountToPay),
          email: getCurrentEmail(),
          paymentType,
          calculatedAmount,
        },
        authConfig(),
      ),
    onSuccess: (res) => {
      setMessage({ type: "success", text: `تم إرسال العملية بنجاح. الرصيد الجديد: ${res.data.newBalance}` });
      setLandline("");
      setSelectedCompany("");
      setSelectedSpeed(speedlessTypes.includes(formType) ? "0" : "");
      setAmountToPay("");
    },
    onError: (err) => {
      setMessage({ type: "error", text: getApiErrorMessage(err, "حدث خطأ أثناء إرسال العملية.") });
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (paymentMutation.isPending) return;
    setMessage(null);
    paymentMutation.mutate();
  };

  const speedLabel =
    config.speeds === "mobilelegend"
      ? "يرجى إدخال Zone ID"
      : config.speeds === "BANKTR"
        ? "يرجى إدخال رقم الحساب"
        : "رقم الاشتراك / العداد";

  return (
    <ScreenWrapper>
      <PaymentMessagePopup message={message} onClose={() => setMessage(null)} />

      <PageHeader
        title={title}
        description="راجع بيانات العملية قبل الإرسال. سيتم احتساب المبلغ المطلوب تلقائيا حسب نوع الخدمة."
        onBack={() => navigate(-1)}
      />

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            {/* <h1 className="text-xl font-bold text-slate-900">{title}</h1> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-busy={paymentMutation.isPending}
            >
              <FormSection
                // title="بيانات العملية"
                // description="أدخل معلومات الحساب أو الرقم المطلوب تسديده."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    id="landline"
                    label={config.label || "الرقم / المعرف"}
                    type="number"
                    value={landline}
                    onChange={(event) => setLandline(event.target.value)}
                    required
                  />

                  <div className="space-y-1 text-right">
                    <label
                      htmlFor="selectedCompany"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      {config.description || "الشركة"}
                    </label>
                    <select
                      id="selectedCompany"
                      value={selectedCompany}
                      onChange={(event) =>
                        setSelectedCompany(event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                      required
                    >
                      <option value="" disabled>
                        اختر
                      </option>
                      {companies.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>

                  {needsExtraNumber && (
                    <Input
                      id="selectedSpeed"
                      label={speedLabel}
                      type="number"
                      value={selectedSpeed}
                      onChange={(event) => setSelectedSpeed(event.target.value)}
                      required
                    />
                  )}

                  {needsSpeed && !needsExtraNumber && (
                    <div className="space-y-1 text-right md:col-span-2">
                      <label
                        htmlFor="selectedSpeedOption"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        {formType === "ADSL" ? "اختر السرعة" : "اختر الباقة"}
                      </label>
                      <select
                        id="selectedSpeedOption"
                        value={selectedSpeed}
                        onChange={(event) =>
                          setSelectedSpeed(event.target.value)
                        }
                        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="" disabled>
                          اختر
                        </option>
                        {speeds.map((speed) => (
                          <option key={speed} value={speed}>
                            {speed}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Input
                    id="amountToPay"
                    label="المبلغ المراد تسديده"
                    type="number"
                    value={amountToPay}
                    onChange={(event) => setAmountToPay(event.target.value)}
                    min={config.min}
                    required
                  />
                  <Input
                    id="calculatedAmount"
                    label="المبلغ المطلوب"
                    type="number"
                    value={calculatedAmount}
                    readOnly
                  />
                </div>
              </FormSection>

              <FormSection title="طريقة الدفع">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => setPaymentType("cash")}
                    variant={paymentType === "cash" ? "default" : "outline"}
                    disabled={paymentMutation.isPending}
                  >
                    نقدا
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setPaymentType("credit")}
                    variant={paymentType === "credit" ? "default" : "outline"}
                    disabled={paymentMutation.isPending}
                  >
                    دين
                  </Button>
                </div>
              </FormSection>

              <div className="rounded-lg border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">
                <p className="mb-3 font-bold text-slate-900">مراجعة العملية</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <span>
                    الرقم/المعرف: <b>{landline || "-"}</b>
                  </span>
                  <span>
                    الشركة: <b>{selectedCompany || "-"}</b>
                  </span>
                  <span>
                    القيمة: <b>{amountToPay || "-"}</b>
                  </span>
                  <span>
                    المبلغ المطلوب: <b>{calculatedAmount || "-"}</b>
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                loading={paymentMutation.isPending}
                className="w-full"
              >
                {paymentMutation.isPending
                  ? "جاري الإرسال..."
                  : "إرسال العملية"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
