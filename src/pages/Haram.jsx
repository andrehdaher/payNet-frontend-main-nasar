import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import qrImage from "../assets/QRcode.png";
import { useToast } from "../context/ToastContext";
import { apiUrl } from "../config/api";

const SERVICE_CONFIG = {
  HARAM: {
    label: "شركة الهرم",
    destination: "ماهر حبيب ضاهر - محردة - هرم",
    number: "0969735667",
    requiresNumber: true,
  },
  SHAMKASH: {
    label: "شام كاش",
    destination: "andreh daher",
    number: "0969735667",
    requiresNumber: false,
  },
  FOAD: {
    label: "شركة الفؤاد",
    destination: "ماهر حبيب ضاهر - محردة - فؤاد",
    number: "0969735667",
    requiresNumber: true,
  },
};

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getCurrentUserEmail() {
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  return decoded?.email || "";
}

function createInitialFormData(serviceConfig, name = "") {
  return {
    name,
    destination: serviceConfig.destination,
    number: serviceConfig.number,
    operator: "",
    noticeNumber: "",
    amount: "",
    date: "",
  };
}

function trimValue(value) {
  return String(value ?? "").trim();
}

export default function TransferForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const toast = useToast();
  const location = useLocation();

  const rawServiceType =
    typeof location.state === "string" ? location.state : location.state?.service;
  const serviceKey = SERVICE_CONFIG[rawServiceType] ? rawServiceType : "FOAD";
  const serviceConfig = useMemo(() => SERVICE_CONFIG[serviceKey], [serviceKey]);

  const [formData, setFormData] = useState(() =>
    createInitialFormData(serviceConfig),
  );

  useEffect(() => {
    const email = getCurrentUserEmail();

    setFormData((prev) => ({
      ...prev,
      name: prev.name || email,
      destination: serviceConfig.destination,
      number: serviceConfig.number,
    }));
  }, [serviceConfig]);

  const validateForm = () => {
    const nextErrors = {};
    const noticeNumber = trimValue(formData.noticeNumber);
    const amount = trimValue(formData.amount);
    const numericAmount = Number(amount);

    if (!trimValue(formData.name)) {
      nextErrors.name = "يرجى إدخال اسم المستخدم.";
    }

    if (serviceConfig.requiresNumber && !trimValue(formData.number)) {
      nextErrors.number = "يرجى إدخال الرقم.";
    }

    if (!trimValue(formData.destination)) {
      nextErrors.destination = "يرجى إدخال جهة التحويل.";
    }

    if (!trimValue(formData.operator)) {
      nextErrors.operator = "يرجى إدخال اسم صاحب الإشعار.";
    }

    if (!noticeNumber) {
      nextErrors.noticeNumber = "يرجى إدخال رقم الإشعار.";
    } else if (!/^\d+$/.test(noticeNumber)) {
      nextErrors.noticeNumber = "يجب أن يحتوي رقم الإشعار على أرقام فقط.";
    }

    if (!amount) {
      nextErrors.amount = "يرجى إدخال المبلغ.";
    } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = "يجب أن يكون المبلغ أكبر من صفر.";
    }

    if (!formData.date) {
      nextErrors.date = "يرجى اختيار تاريخ الحوالة.";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }

    if (formError) {
      setFormError("");
    }
  };

  const resetForm = () => {
    setFormData(createInitialFormData(serviceConfig, getCurrentUserEmail()));
    setErrors({});
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormError("يرجى تصحيح الحقول المحددة قبل إرسال الإشعار.");
      toast.error("يرجى تصحيح الحقول المحددة قبل إرسال الإشعار.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      const message = "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.";
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const payload = {
        ...formData,
        name: trimValue(formData.name),
        destination: trimValue(formData.destination),
        number: trimValue(formData.number),
        operator: trimValue(formData.operator),
        noticeNumber: trimValue(formData.noticeNumber),
        amount: Number(formData.amount),
      };

      const res = await axios.post(
        apiUrl("/api/saveBalance/haram"),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data?.message || "تم إرسال الإشعار بنجاح.");
      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "تعذر إرسال الإشعار. تحقق من الاتصال وحاول مرة أخرى.";

      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8"
        dir="rtl"
        noValidate
        aria-busy={isSubmitting}
      >
        <Card className="border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-2xl text-slate-900">
              تحويل إشعار {serviceConfig.label}
            </CardTitle>
            <CardDescription className="text-sm text-slate-700">
              أدخل بيانات الإشعار كما ظهرت في عملية التحويل ليتم تأكيد الرصيد من الإدارة.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5 sm:pt-6">
            {formError && (
              <div
                role="alert"
                className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800"
              >
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Input
                id="transfer-name"
                name="name"
                type="text"
                label="اسم المستخدم"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                helperText="سيتم استخدام هذا الاسم لمطابقة الطلب مع حسابك."
                autoComplete="email"
                required
              />

              {serviceKey === "SHAMKASH" ? (
                <div
                  className="rounded-md border border-slate-300 bg-slate-50 p-4 text-center shadow-sm transition-shadow duration-200"
                  aria-labelledby="shamkash-qr-title"
                >
                  <p
                    id="shamkash-qr-title"
                    className="text-sm font-semibold leading-6 text-slate-800"
                  >
                    امسح رمز QR التالي للتحويل إلى حساب شام كاش
                  </p>
                  <img
                    src={qrImage}
                    alt="رمز QR للتحويل إلى حساب شام كاش"
                    className="mx-auto mt-3 h-36 w-36 object-contain"
                  />
                </div>
              ) : (
                <Input
                  id="transfer-number"
                  name="number"
                  type="text"
                  label="الرقم"
                  value={formData.number}
                  onChange={handleChange}
                  error={errors.number}
                  helperText="تأكد من مطابقة الرقم قبل إرسال الإشعار."
                  inputMode="tel"
                  required
                />
              )}

              <Input
                id="transfer-destination"
                name="destination"
                type="text"
                label="إلى"
                value={formData.destination}
                onChange={handleChange}
                error={errors.destination}
                helperText="جهة استلام التحويل."
                containerClassName="sm:col-span-2"
                required
              />

              <Input
                id="transfer-operator"
                name="operator"
                type="text"
                label="صاحب الإشعار"
                value={formData.operator}
                onChange={handleChange}
                error={errors.operator}
                autoComplete="name"
                required
              />

              <Input
                id="transfer-notice-number"
                name="noticeNumber"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                label="رقم الإشعار"
                value={formData.noticeNumber}
                onChange={handleChange}
                error={errors.noticeNumber}
                required
              />

              <Input
                id="transfer-amount"
                name="amount"
                type="number"
                label="المبلغ"
                value={formData.amount}
                onChange={handleChange}
                error={errors.amount}
                helperText="أدخل المبلغ بالأرقام فقط."
                min="1"
                step="any"
                required
              />

              <Input
                id="transfer-date"
                name="date"
                type="date"
                label="تاريخ الحوالة"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
              />

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  aria-describedby="transfer-submit-status"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الإشعار"}
                </Button>
                <p
                  id="transfer-submit-status"
                  className="sr-only"
                  aria-live="polite"
                >
                  {isSubmitting ? "جاري إرسال الإشعار." : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </ScreenWrapper>
  );
}
