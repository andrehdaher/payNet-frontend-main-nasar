const CONNECTION_LOG_TYPES = new Set(["register", "disconnect"]);
const RESPONSE_MESSAGE_PREFIX = "Sent payment result:";
const REQUEST_MESSAGE_PATTERN = /^Received inquiry request for\s+(.+?)\s+in\s+(.+)$/i;

const RESPONSE_META_KEYS = new Set([
  "email",
  "selectedCompany",
  "company",
  "landline",
  "number",
  "content",
  "request",
]);

const FIELD_ALIASES = {
  subscriberName: [
    "اسم المشترك",
    "صاحب الخط",
    "اسم صاحب الاشتراك",
    "المشترك",
    "subscriberName",
    "subscriber_name",
    "customerName",
    "customer_name",
    "name",
  ],
  subscriberNumber: [
    "رقم المشترك",
    "رقم الاشتراك",
    "subscriptionNumber",
    "subscription_number",
    "subscriberNumber",
    "subscriber_number",
    "number",
    "landline",
  ],
  telephoneNumber: [
    "رقم الهاتف المرتبط",
    "رقم الهاتف",
    "رقم الأرضي",
    "telephone",
    "telephoneNumber",
    "phone",
    "phoneNumber",
  ],
  monthlyCost: [
    "الكلفة الشهرية",
    "التكلفة الشهرية",
    "التكلفة الشهرية المستحقة",
    "سعر الحزمة",
    "monthlyCost",
    "monthly_cost",
    "packagePrice",
    "package_price",
  ],
  outstandingBalance: [
    "الرصيد",
    "رصيد المشترك",
    "الرصيد الحالي",
    "outstandingBalance",
    "outstanding_balance",
    "balance",
  ],
  financialStatus: [
    "الحالة المالية",
    "حالة الدفع",
    "financialStatus",
    "financial_status",
    "paymentStatus",
  ],
  status: [
    "الحالة",
    "حالة المرحلة",
    "status",
    "state",
    "result",
    "message",
  ],
  serviceType: [
    "نوع الخدمة",
    "نوع الاشتراك",
    "serviceType",
    "service_type",
    "type",
  ],
  packageName: [
    "اسم الباقة",
    "اسم الحزمة",
    "الحزمة",
    "packageName",
    "package_name",
    "plan",
  ],
  expirationDate: [
    "تاريخ الانتهاء",
    "تاريخ انتهاء الاشتراك",
    "expirationDate",
    "expiration_date",
    "expiresAt",
  ],
  nextInvoiceDate: [
    "تاريخ الفاتورة القادمة",
    "الفاتورة القادمة",
    "nextInvoiceDate",
    "next_invoice_date",
  ],
  internetSpeed: [
    "السرعة",
    "سرعة الانترنت",
    "سرعة الإنترنت",
    "internetSpeed",
    "internet_speed",
    "speed",
  ],
  dataUsage: [
    "الاستهلاك",
    "استهلاك البيانات",
    "dataUsage",
    "data_usage",
    "usage",
  ],
  remainingQuota: [
    "الرصيد المتبقي",
    "الحصة المتبقية",
    "remainingQuota",
    "remaining_quota",
    "quota",
  ],
};

const ALL_KNOWN_RESPONSE_KEYS = new Set(
  Object.values(FIELD_ALIASES)
    .flat()
    .concat(Array.from(RESPONSE_META_KEYS)),
);

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getTodayDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Damascus",
  });
}

export function isPresent(value) {
  return value !== undefined && value !== null && value !== "";
}

export function stringifyValue(value) {
  if (!isPresent(value)) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function displayValue(value, fallback = "-") {
  const text = stringifyValue(value);
  return text || fallback;
}

export function getNestedValue(source, keys) {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], source);

    if (isPresent(value)) return value;
  }

  return "";
}

export function normalizeLogData(data) {
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

export function normalizeSocketData(data) {
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

  return Object.keys(data).some((key) => !RESPONSE_META_KEYS.has(key));
}

export function getResponseData(log) {
  if (!log || CONNECTION_LOG_TYPES.has(log.type)) return null;
  if (String(log.message || "").match(REQUEST_MESSAGE_PATTERN)) return null;

  const data = getCandidateResponseData(log);

  return hasResponseFields(data) ? data : null;
}

export function logBelongsToUser(log, email) {
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

export function pickResponseValue(data, keys) {
  const key = keys.find((item) => isPresent(data?.[item]));
  return key ? data[key] : "";
}

export function getExtraResponseRows(data) {
  if (!data || typeof data !== "object") return [];

  return Object.entries(data).filter(([key]) => !ALL_KNOWN_RESPONSE_KEYS.has(key));
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

export function normalizeInquiryResult(data, context = {}) {
  const source = data && typeof data === "object" ? data : {};
  const summary = {
    subscriberName: pickResponseValue(source, FIELD_ALIASES.subscriberName),
    subscriberNumber:
      pickResponseValue(source, FIELD_ALIASES.subscriberNumber) || context.landline || "",
    telephoneNumber: pickResponseValue(source, FIELD_ALIASES.telephoneNumber),
    provider:
      source.selectedCompany ||
      source.company ||
      context.company ||
      context.selectedCompany ||
      "",
    monthlyCost: pickResponseValue(source, FIELD_ALIASES.monthlyCost),
    outstandingBalance: pickResponseValue(source, FIELD_ALIASES.outstandingBalance),
    financialStatus: pickResponseValue(source, FIELD_ALIASES.financialStatus),
    status: pickResponseValue(source, FIELD_ALIASES.status),
    serviceType: pickResponseValue(source, FIELD_ALIASES.serviceType),
    packageName: pickResponseValue(source, FIELD_ALIASES.packageName),
    expirationDate: pickResponseValue(source, FIELD_ALIASES.expirationDate),
    nextInvoiceDate: pickResponseValue(source, FIELD_ALIASES.nextInvoiceDate),
    internetSpeed: pickResponseValue(source, FIELD_ALIASES.internetSpeed),
    dataUsage: pickResponseValue(source, FIELD_ALIASES.dataUsage),
    remainingQuota: pickResponseValue(source, FIELD_ALIASES.remainingQuota),
  };

  return {
    raw: source,
    summary,
    extraRows: getExtraResponseRows(source),
  };
}

export function getInquiryStatus(summary = {}, raw = null) {
  const text = [
    summary.status,
    summary.financialStatus,
    raw?.response,
    raw?.error,
    raw?.message,
  ]
    .map((value) => stringifyValue(value).toLowerCase())
    .filter(Boolean)
    .join(" ");

  if (
    text.includes("not found") ||
    text.includes("غير موجود") ||
    text.includes("لم يتم العثور") ||
    text.includes("unknown")
  ) {
    return {
      key: "not-found",
      label: "لم يتم العثور",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("timeout") ||
    text.includes("تعذر") ||
    text.includes("خطأ") ||
    text.includes("فشل")
  ) {
    return {
      key: "error",
      label: "عطل بالمزود",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (
    text.includes("inactive") ||
    text.includes("غير فعال") ||
    text.includes("unpaid") ||
    text.includes("غير مسدد")
  ) {
    return {
      key: "pending",
      label: stringifyValue(summary.status || summary.financialStatus) || "بحاجة لمراجعة",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  return {
    key: "success",
    label: stringifyValue(summary.status || summary.financialStatus) || "فعال",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
}

export function buildHistoryRows(logs) {
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
      const normalized = normalizeInquiryResult(responseData, {
        company,
        landline: rowLandline,
      });
      const status = getInquiryStatus(normalized.summary, responseData);

      return {
        id: log.id || `${log.timestamp}-${index}`,
        timestamp: Number(log.timestamp) || 0,
        company,
        landline: rowLandline,
        subscriberName: normalized.summary.subscriberName,
        balance: normalized.summary.outstandingBalance,
        monthlyCost: normalized.summary.monthlyCost,
        status,
        nextInvoiceDate: normalized.summary.nextInvoiceDate,
        packagePrice: normalized.summary.monthlyCost,
        date: log.date || "",
        time: log.time || "",
        extraRows: normalized.extraRows,
        responseData,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function formatInquiryDetails(data) {
  if (!data || typeof data !== "object") return "";

  return Object.entries(data)
    .map(([key, value]) => `${key}: ${stringifyValue(value) || "-"}`)
    .join("\n");
}
