import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { saveAlraghebConfig, getAlraghebConfigHistory } from "../../api/alraghebApi";
import { commandClass, inputClass, syp } from "./PurchaseForm";
import { iconButtonClass } from "./CatalogUi";
import { estimateAlraghebMarkup } from "../../utils/alraghebPricing";

export default function ProductConfigEditor({ product, onClose }) {
  const dialog = useRef(null);
  const client = useQueryClient();
  const config = product.config;
  const [unit, setUnit] = useState(String(config?.billingUnitQty || product.pricing_preview?.billing_unit_qty || ""));
  const [enabled, setEnabled] = useState(Boolean(config?.purchaseEnabled));
  const [note, setNote] = useState(config?.note || "");
  const [previewQty, setPreviewQty] = useState(String(product.quantity_rules.defaultQty || ""));
  const categoryRule = product.category_pricing_rule;
  const categoryRuleRevision = categoryRule?.revision;
  const categoryRulePercent = categoryRule?.markup_percent;
  const categoryRuleFixed = categoryRule?.markup_fixed_syp;
  const [useCategoryRule, setUseCategoryRule] = useState(!config && Boolean(categoryRule));
  const [percent, setPercent] = useState(config?.markupPercent || categoryRulePercent || '0');
  const [fixed, setFixed] = useState(config?.markupFixedSyp || categoryRuleFixed || '0');
  const preview = estimateAlraghebMarkup(product.provider_price, previewQty, unit, percent, fixed);
  const previewTotal = preview?.total;
  const [fields, setFields] = useState(product.params.map((label, index) => ({ label, key: config?.fieldSchema?.[index]?.key || "", required: config?.fieldSchema?.[index]?.required ?? true })));
  const history = useQuery({ queryKey: ["alragheb", "config-history", product.id], queryFn: () => getAlraghebConfigHistory(product.id) });
  const save = useMutation({ mutationFn: saveAlraghebConfig, onSuccess: async () => { await client.invalidateQueries({ queryKey: ["alragheb"] }); onClose(); } });
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => {
    if (!useCategoryRule || !categoryRule) return;
    setPercent(categoryRulePercent);
    setFixed(categoryRuleFixed);
  }, [useCategoryRule, categoryRule, categoryRuleRevision, categoryRulePercent, categoryRuleFixed]);
  return <dialog ref={dialog} onCancel={onClose} className="m-auto max-h-[90vh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-5 text-right shadow-xl backdrop:bg-black/40" dir="rtl">
    <div className="mb-5 flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="break-words text-lg font-bold">{product.name}</h2><p className="mt-1 text-sm text-zinc-500">#{product.id} · سعر المصدر: <bdi>{syp(product.provider_price)}</bdi></p></div><button className={iconButtonClass} onClick={onClose} title="إغلاق" aria-label="إغلاق إعداد المنتج"><X className="h-4 w-4" /></button></div>
    <form className="space-y-4" onSubmit={(e) => {
      e.preventDefault();
      const payload = { id: product.id, revision: config?.revision || 0, billingUnitQty: Number(unit), purchaseEnabled: enabled, fieldSchema: fields, note };
      save.mutate(useCategoryRule ? { ...payload, markupSource: 'category' } : { ...payload, markupPercent: percent, markupFixedSyp: fixed });
    }}>
      <label className="block text-sm font-medium">عدد الوحدات التي يغطيها سعر المصدر<input aria-label="وحدة الفوترة" className={inputClass} type="number" min="1" step="1" required value={unit} onChange={(e) => setUnit(e.target.value)} /></label>
      {categoryRule && <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={useCategoryRule} onChange={(e) => setUseCategoryRule(e.target.checked)} />استخدام قاعدة التصنيف: <bdi>{categoryRule.markup_percent}% + {syp(categoryRule.markup_fixed_syp)}</bdi></label>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">نسبة الربح من التكلفة (%)<input aria-label="نسبة ربح المنتج" className={inputClass} type="number" min="0" max="1000" step="0.01" required disabled={useCategoryRule} value={percent} onChange={e => setPercent(e.target.value)} /></label>
        <label className="block text-sm font-medium">إضافة ثابتة للطلب (ل.س)<input aria-label="ربح ثابت للمنتج" className={inputClass} type="number" min="0" max="1000000000" step="0.01" required disabled={useCategoryRule} value={fixed} onChange={e => setFixed(e.target.value)} /></label>
      </div>
      <div className="grid grid-cols-2 items-end gap-4 border-y border-zinc-200 py-4">
        <label className="min-w-0 text-sm font-medium">كمية المعاينة<input aria-label="كمية المعاينة" className={inputClass} type="number" min="1" step="1" value={previewQty} onChange={(e) => setPreviewQty(e.target.value)} /></label>
        <div className="min-w-0"><p className="text-xs text-zinc-500">إجمالي المعاينة</p><output aria-label="إجمالي المعاينة" className="mt-1 block min-h-10 break-all py-2 font-semibold tabular-nums"><bdi>{previewTotal ? syp(previewTotal) : "-"}</bdi></output></div>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm"><div className="min-w-0"><dt className="text-zinc-500">تكلفة المزوّد التقديرية</dt><dd className="mt-1 break-all"><bdi>{preview ? syp(preview.cost) : '-'}</bdi></dd></div><div className="min-w-0"><dt className="text-zinc-500">الربح الإجمالي التقديري</dt><dd className="mt-1 break-all text-teal-700"><bdi>{preview ? syp(preview.profit) : '-'}</bdi></dd></div></dl>
      {fields.map((field, index) => <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <label className="min-w-0 text-sm">{field.label}<input aria-label={`مفتاح الحقل ${index + 1}`} className={inputClass} required pattern="[a-zA-Z][a-zA-Z0-9_]{0,49}" value={field.key} dir="ltr" onChange={(e) => setFields((all) => all.map((f, i) => i === index ? { ...f, key: e.target.value } : f))} /></label>
        <label className="mb-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} onChange={(e) => setFields((all) => all.map((f, i) => i === index ? { ...f, required: e.target.checked } : f))} />مطلوب</label>
      </div>)}
      <label className="block text-sm font-medium">مرجع اعتماد السعر والحقول<textarea className={inputClass} required minLength={3} maxLength={500} rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />تمكين شراء المنتج</label>
      {save.isError && <p role="alert" className="text-sm text-red-700">{save.error.message}</p>}
      <button className={commandClass} disabled={save.isPending} type="submit"><Save className="h-4 w-4" />{save.isPending ? "جارٍ الحفظ" : "حفظ الاعتماد"}</button>
    </form>
    <section className="mt-6 border-t border-zinc-200 pt-4"><h3 className="mb-3 text-sm font-bold">سجل الاعتماد</h3>
      {history.isError ? <p className="text-sm text-red-700">تعذر جلب سجل الاعتماد</p> : history.data?.data.length ? <ul className="space-y-3 text-xs text-zinc-600">{history.data.data.map((item) => <li key={item._id}><p>{new Date(item.createdAt).toLocaleString("ar-SY")} · الإصدار {item.after?.revision}</p><p className="mt-1 break-words">{item.after?.note}</p><p className="mt-1">الربح السابق: {item.before?.markupPercent || '0'}% + {syp(item.before?.markupFixedSyp || '0')}</p><p>الربح الجديد: {item.after?.markupPercent || '0'}% + {syp(item.after?.markupFixedSyp || '0')}</p></li>)}</ul> : <p className="text-sm text-zinc-500">لا توجد تعديلات مسجلة</p>}
    </section>
  </dialog>;
}
