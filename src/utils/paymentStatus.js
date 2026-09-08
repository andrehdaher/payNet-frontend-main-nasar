const PROVIDER_NEUTRAL_PENDING_STATUS = "قيد التنفيذ";

export function normalizePaymentStatusLabel(status) {
  if (status === undefined || status === null || status === "") return status;

  const text = String(status).trim();
  if (!/prowave/i.test(text)) return status;

  const sanitized = text
    .replace(/\s*(?:لدى|عبر)\s*Prowave\s*/gi, " ")
    .replace(/\bProwave\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized || PROVIDER_NEUTRAL_PENDING_STATUS;
}
