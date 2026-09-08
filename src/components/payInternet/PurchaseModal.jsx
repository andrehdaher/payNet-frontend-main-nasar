import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../Custom/Button";
import { Input } from "../Custom/Input";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatPrice = (value) =>
  `${toNumber(value).toLocaleString("en-US", { maximumFractionDigits: 2 })} ل.س`;

export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  title,
  price,
  formattedPrice,
  name,
  placeholder = "أدخل القيمة",
  description = "أدخل البيانات المطلوبة لإتمام الطلب.",
  confirmText = "شراء",
  cancelText = "إلغاء",
  showMainInput = true,
  mainInputRequired = true,
  fields = [],
  showQuantity = false,
  quantityLabel = "الكمية",
  quantityRequired = true,
  quantityDefault = 1,
  quantityMin = 1,
  quantityMax,
  quantityStep = 1,
  quantityOptions = [],
  priceIsUnit = false,
  loading: externalLoading = false,
}) {
  const normalizedFields = useMemo(
    () =>
      fields
        .map((field, index) => ({
          name: field.name || `field_${index + 1}`,
          label: field.label || field.placeholder || `Field ${index + 1}`,
          placeholder: field.placeholder || field.label || "",
          type: field.type || "text",
          required: field.required !== false,
          helperText: field.helperText || "",
        }))
        .filter((field) => field.name),
    [fields],
  );
  const [mainValue, setMainValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [dynamicValues, setDynamicValues] = useState({});
  const [quantityValue, setQuantityValue] = useState(String(quantityDefault || 1));
  const [internalLoading, setInternalLoading] = useState(false);
  const needsPassword = showMainInput && name && name.includes("oldAccount");
  const loading = externalLoading || internalLoading;
  const numericQuantity = Math.max(toNumber(quantityValue, quantityDefault || 1), 1);
  const computedPrice =
    showQuantity && priceIsUnit && price !== undefined && price !== null
      ? toNumber(price) * numericQuantity
      : price;
  const priceLabel =
    showQuantity && priceIsUnit
      ? formatPrice(computedPrice)
      : formattedPrice ||
        (price !== undefined && price !== null ? formatPrice(price) : "");
  const quantityHasOptions = Array.isArray(quantityOptions) && quantityOptions.length > 0;
  const numericMin = toNumber(quantityMin, 1);
  const numericMax = quantityMax === undefined || quantityMax === null ? null : toNumber(quantityMax, 0);
  const quantityInvalid =
    showQuantity &&
    (numericQuantity <= 0 ||
      numericQuantity < numericMin ||
      (numericMax !== null && numericMax > 0 && numericQuantity > numericMax) ||
      (quantityHasOptions && !quantityOptions.map(Number).includes(Number(numericQuantity))));

  useEffect(() => {
    if (!open) return;

    setMainValue("");
    setPasswordValue("");
    setQuantityValue(String(quantityDefault || 1));
    setDynamicValues(
      normalizedFields.reduce((values, field) => {
        values[field.name] = "";
        return values;
      }, {}),
    );
  }, [name, normalizedFields, open, quantityDefault, title]);

  const setFieldValue = (fieldName, value) => {
    setDynamicValues((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const hasMissingDynamicField = normalizedFields.some(
    (field) => field.required && !String(dynamicValues[field.name] || "").trim(),
  );

  const handleConfirm = async () => {
    const requiresMainValue = showMainInput && mainInputRequired;

    if (
      loading ||
      quantityInvalid ||
      hasMissingDynamicField ||
      (requiresMainValue && !mainValue) ||
      (needsPassword && (!mainValue || !passwordValue))
    ) {
      return;
    }

    try {
      setInternalLoading(true);
      const dataToSend = {
        ...(showMainInput
          ? needsPassword
            ? { value: mainValue, password: passwordValue }
            : { value: mainValue }
          : {}),
        ...(showQuantity ? { quantity: numericQuantity } : {}),
        ...(normalizedFields.length ? { params: dynamicValues } : {}),
      };

      await onConfirm(dataToSend);
      setMainValue("");
      setPasswordValue("");
      setDynamicValues({});
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          dir="rtl"
          role="presentation"
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.18 }}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
            aria-busy={loading}
          >
            <button
              type="button"
              onClick={loading ? undefined : onClose}
              disabled={loading}
              className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-60"
              aria-label="إغلاق نافذة الشراء"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-5">
              {priceLabel && (
                <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-900">
                  {priceLabel}
                </span>
              )}
              <h2 id="purchase-modal-title" className="mt-3 text-xl font-bold leading-7 text-slate-900">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {showQuantity && (
                quantityHasOptions ? (
                  <div className="space-y-1 text-right">
                    <label htmlFor="purchase-quantity" className="block text-sm font-semibold text-slate-700">
                      {quantityLabel}
                      {quantityRequired && <span className="mr-1 text-red-600">*</span>}
                    </label>
                    <select
                      id="purchase-quantity"
                      value={quantityValue}
                      onChange={(event) => setQuantityValue(event.target.value)}
                      disabled={loading}
                      required={quantityRequired}
                      className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-right text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
                    >
                      {quantityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    id="purchase-quantity"
                    label={quantityLabel}
                    type="number"
                    min={numericMin}
                    max={numericMax || undefined}
                    step={quantityStep}
                    value={quantityValue}
                    onChange={(event) => setQuantityValue(event.target.value)}
                    required={quantityRequired}
                    disabled={loading}
                    error={quantityInvalid ? "الكمية خارج الحدود المسموحة" : ""}
                  />
                )
              )}

              {showMainInput && (
                <>
                  <Input
                    id="purchase-value"
                    label={placeholder}
                    value={mainValue}
                    onChange={(event) => setMainValue(event.target.value)}
                    required={mainInputRequired}
                    disabled={loading}
                  />
                  {needsPassword && (
                    <Input
                      id="purchase-password"
                      label="باسورد حساب الشات"
                      value={passwordValue}
                      onChange={(event) => setPasswordValue(event.target.value)}
                      required
                      disabled={loading}
                    />
                  )}
                </>
              )}

              {normalizedFields.map((field) => (
                <Input
                  key={field.name}
                  id={`purchase-${field.name}`}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  helperText={field.helperText}
                  value={dynamicValues[field.name] || ""}
                  onChange={(event) => setFieldValue(field.name, event.target.value)}
                  required={field.required}
                  disabled={loading}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                {cancelText}
              </Button>
              <Button type="button" variant="success" onClick={handleConfirm} loading={loading}>
                {loading ? "جاري التنفيذ..." : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
