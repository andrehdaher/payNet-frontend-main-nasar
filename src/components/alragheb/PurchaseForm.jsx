import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, RefreshCw, ShoppingCart } from "lucide-react";
import { getAlraghebOrder, orderAlragheb, quoteAlragheb } from "../../api/alraghebApi";
import { getAlraghebFieldLabel } from "../../utils/alraghebProductMapper";
import { estimateAlraghebTotal } from "../../utils/alraghebPricing";

export const inputClass = "mt-1 block w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
export const commandClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50";
export const orderStatus = { pending: "قيد التنفيذ والتحقق", completed: "تم الشحن بنجاح", refunded: "رُفض الطلب وأعيد المبلغ" };
export const syp = (value) => value == null ? "غير متاح" : `${value} ل.س`;
const digits = (value) => value.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776));
const storageKey = (id) => {
  try { return `alragheb-attempt:${JSON.parse(atob(localStorage.getItem("token").split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).id}:${id}`; }
  catch { return `alragheb-attempt:session:${id}`; }
};
const readAttempt = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };

export default function PurchaseForm({ product }) {
  const queryClient = useQueryClient();
  const key = storageKey(product.id);
  const [qty, setQty] = useState(String(product.quantity_rules.defaultQty || ""));
  const [params, setParams] = useState({});
  const [quote, setQuote] = useState(null);
  const [attempt, setAttempt] = useState(() => readAttempt(key));
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const version = useRef(0);
  const lock = useRef(false);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const statusQuery = useQuery({ queryKey: ["alragheb", "order", order?.transaction_id],
    queryFn: () => getAlraghebOrder(order.transaction_id), enabled: Boolean(order?.transaction_id),
    refetchInterval: (query) => query.state.data?.data?.status === "pending" ? 5000 : false });
  const currentOrder = statusQuery.data?.data || order;
  useEffect(() => {
    if (currentOrder?.transaction_id) window.dispatchEvent(new Event('paynet:wallet-changed'));
  }, [currentOrder?.transaction_id, currentOrder?.status]);
  const invalidate = () => { version.current += 1; setQuote(null); setError(""); };
  const rules = product.quantity_rules;
  const parsedQty = Number(qty);
  const validQty = /^\d+$/.test(qty) && Number.isSafeInteger(parsedQty) && parsedQty > 0 &&
    (rules.mode === "choices" ? rules.values.includes(parsedQty) : rules.mode === "fixed" ? parsedQty === rules.defaultQty : rules.mode === "range" && parsedQty >= rules.min && parsedQty <= rules.max);
  const expired = quote && Date.parse(quote.expires_at) <= now;
  let estimate = null;
  if (validQty && product.pricing_preview) {
    estimate = estimateAlraghebTotal(product.pricing_preview.price_per_billing_unit_syp, qty, product.pricing_preview.billing_unit_qty, product.pricing_preview.fixed_fee_syp || '0');
  }
  const resetAttempt = () => { localStorage.removeItem(key); setAttempt(null); };
  async function review(event) {
    event.preventDefault();
    if (lock.current || !validQty || !product.purchasable) return;
    lock.current = true; setBusy(true); setError(""); setQuote(null);
    const requested = version.current;
    try {
      const response = await quoteAlragheb({ product_id: product.id, qty: parsedQty, params });
      if (version.current === requested) { setNow(Date.now()); setQuote(response.data); }
    } catch (e) { setError(e.message); }
    finally { lock.current = false; setBusy(false); }
  }
  async function confirm() {
    if (lock.current) return;
    const request = attempt || { quote_id: quote.quote_id, client_request_id: crypto.randomUUID() };
    try { localStorage.setItem(key, JSON.stringify(request)); }
    catch { setError("تعذر حفظ محاولة الشراء على هذا المتصفح"); return; }
    setAttempt(request); lock.current = true; setBusy(true); setError("");
    try {
      const response = await orderAlragheb(request);
      setOrder(response.data); resetAttempt(); setQuote(null);
      await queryClient.invalidateQueries();
    } catch (e) {
      setError(e.message);
      if (["QUOTE_CHANGED", "QUOTE_EXPIRED", "INSUFFICIENT_BALANCE", "PRODUCT_UNAVAILABLE", "PRODUCT_NOT_CONFIGURED", "PURCHASE_DISABLED", "FORBIDDEN"].includes(e.code)) { resetAttempt(); setQuote(null); }
    } finally { lock.current = false; setBusy(false); }
  }
  return <section className="border-t border-zinc-200 py-6" aria-label="شراء المنتج">
    <h2 className="mb-4 text-base font-bold text-zinc-900">شحن الحساب</h2>
    {product.pricing_preview && <p className="mb-4 break-words text-sm text-zinc-600"><bdi>{syp(product.pricing_preview.price_per_billing_unit_syp)}</bdi> لكل <bdi>{product.pricing_preview.billing_unit_qty}</bdi> وحدة</p>}
    {Number(product.pricing_preview?.fixed_fee_syp) > 0 && <p className="mb-4 text-sm text-zinc-600">إضافة ثابتة للطلب: <bdi>{syp(product.pricing_preview.fixed_fee_syp)}</bdi></p>}
    {currentOrder ? <div className="space-y-3 border-r-4 border-teal-600 bg-teal-50 p-4" role="status">
      <p className="font-bold">{orderStatus[currentOrder.status]}</p>
      <p className="break-all text-xs">{currentOrder.transaction_id}</p>
      <p>{currentOrder.qty} وحدة · {syp(currentOrder.total_amount_syp)}</p>
      {currentOrder.result && <pre className="whitespace-pre-wrap break-all text-sm">{currentOrder.result}</pre>}
      {statusQuery.isError && <p className="text-sm text-red-700">تعذر تحديث الحالة، الطلب محفوظ في السجل</p>}
      {currentOrder.status !== "pending" && <button className={commandClass} onClick={() => { setOrder(null); setQuote(null); }}>طلب جديد</button>}
    </div> : attempt ? <div className="space-y-3 border-r-4 border-amber-500 bg-amber-50 p-4">
      <p className="text-sm">توجد محاولة شراء لم تستلم نتيجتها بعد</p>
      <button className={commandClass} disabled={busy} onClick={confirm}><RefreshCw className="h-4 w-4" />استعادة نتيجة المحاولة</button>
    </div> : <form onSubmit={review} className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 items-end gap-4">
      <label className="block min-w-0 text-sm font-medium">كمية الشحن
        {rules.mode === "choices" ? <select aria-label="كمية الشحن" className={inputClass} value={qty} disabled={busy} onChange={(e) => { setQty(e.target.value); invalidate(); }}>{rules.values.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          : <input aria-label="كمية الشحن" className={inputClass} inputMode="numeric" value={qty} readOnly={rules.mode === "fixed"} disabled={busy} onChange={(e) => { setQty(digits(e.target.value)); invalidate(); }} />}
      </label>
      <div className="min-w-0"><p className="text-sm text-zinc-500">الإجمالي التقديري</p><output aria-label="الإجمالي التقديري" aria-live="polite" className="mt-1 flex min-h-10 items-center break-all text-base font-bold tabular-nums text-zinc-900"><bdi>{estimate ? syp(estimate) : "-"}</bdi></output></div>
      </div>
      {rules.mode === "range" && <p className="text-xs text-zinc-500">الحد الأدنى: {rules.min} · الحد الأعلى: {rules.max}</p>}
      {!validQty && <p className="text-sm text-red-700">أدخل كمية ضمن الحدود المسموحة</p>}
      {product.input_fields.map((field) => <label key={field.key} className="block text-sm font-medium">{getAlraghebFieldLabel(field.label)}
        <input className={inputClass} required={field.required} maxLength={200} value={params[field.key] || ""} disabled={busy} autoComplete="off" onChange={(e) => { setParams({ ...params, [field.key]: e.target.value }); invalidate(); }} />
      </label>)}
      {!product.purchasable && <p role="status" className="border-r-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">الشراء غير مفعّل لهذا المنتج حاليًا</p>}
      <button className={commandClass} type="submit" disabled={busy || !validQty || !estimate || !product.purchasable}><ShoppingCart className="h-4 w-4" />{busy ? "جارٍ التحقق" : "مراجعة السعر"}</button>
      {quote && <div className="space-y-3 border-y border-zinc-200 py-4">
        <p className="text-sm">{product.name} · {quote.qty} وحدة</p>
        <p className="break-all text-sm" dir="auto">{Object.values(params).join(" / ")}</p>
        <p className="text-lg font-bold">الإجمالي: <bdi>{syp(quote.total_amount_syp)}</bdi></p>
        <p className="text-xs text-zinc-500">{expired ? "انتهى عرض السعر" : `صلاحية العرض: ${Math.max(0, Math.ceil((Date.parse(quote.expires_at) - now) / 1000))} ثانية`}</p>
        <button type="button" className={commandClass} disabled={busy || expired} onClick={confirm}><Check className="h-4 w-4" />تأكيد الدفع</button>
      </div>}
    </form>}
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
  </section>;
}
