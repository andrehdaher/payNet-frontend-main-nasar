import {
  buildHistoryRows,
  displayValue,
  getExtraResponseRows,
  normalizeInquiryResult,
  pickResponseValue,
  stringifyValue,
} from "./inquiryUtils";

describe("inquiryUtils", () => {
  test("preserves zero as a valid display value", () => {
    expect(stringifyValue(0)).toBe("0");
    expect(displayValue(0)).toBe("0");
    expect(pickResponseValue({ الرصيد: 0 }, ["الرصيد"])).toBe(0);
  });

  test("treats null, undefined, and empty strings as missing", () => {
    expect(stringifyValue(null)).toBe("");
    expect(stringifyValue(undefined)).toBe("");
    expect(stringifyValue("")).toBe("");
    expect(displayValue("")).toBe("-");
  });

  test("normalizes known subscriber and financial fields", () => {
    const result = normalizeInquiryResult(
      {
        "اسم المشترك": "غسان داوود زحلق",
        "رقم الهاتف المرتبط": "134737667",
        "سعر الحزمة": 240,
        الرصيد: 0,
        "نوع الخدمة": "ADSL",
      },
      { selectedCompany: "ليما", landline: "4737667" },
    );

    expect(result.summary.subscriberName).toBe("غسان داوود زحلق");
    expect(result.summary.subscriberNumber).toBe("4737667");
    expect(result.summary.telephoneNumber).toBe("134737667");
    expect(result.summary.monthlyCost).toBe(240);
    expect(result.summary.outstandingBalance).toBe(0);
    expect(result.summary.provider).toBe("ليما");
  });

  test("keeps provider-specific fields available as extra rows", () => {
    const rows = getExtraResponseRows({
      "اسم المشترك": "غسان داوود زحلق",
      الرصيد: 0,
      "منفذ DSLAM": "DAM-CTR-P08",
    });

    expect(rows).toEqual([["منفذ DSLAM", "DAM-CTR-P08"]]);
  });

  test("builds history rows from paired request and response logs", () => {
    const logs = [
      {
        id: "request-1",
        type: "message",
        message: "Received inquiry request for 4737667 in ليما",
        timestamp: 1000,
        data: { email: "user@example.com" },
      },
      {
        id: "response-1",
        type: "message",
        message: 'Sent payment result: {"اسم المشترك":"غسان","الرصيد":0,"سعر الحزمة":240}',
        timestamp: 1001,
        date: "2026-09-19",
        time: "1:40 PM",
        data: { email: "user@example.com" },
      },
    ];

    expect(buildHistoryRows(logs)).toEqual([
      expect.objectContaining({
        id: "response-1",
        company: "ليما",
        landline: "4737667",
        subscriberName: "غسان",
        balance: 0,
        monthlyCost: 240,
      }),
    ]);
  });
});
