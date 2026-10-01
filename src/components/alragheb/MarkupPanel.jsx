import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Save } from 'lucide-react';
import { previewAlraghebMarkup, applyAlraghebMarkup } from '../../api/alraghebApi';
import { commandClass, inputClass, syp } from './PurchaseForm';

const reasons = { not_configured: 'غير معتمد', custom_markup: 'ربح مخصص محفوظ', unchanged: 'بلا تغيير', invalid_price: 'سعر غير صالح' };

export default function MarkupPanel({ filters, selected, total, preset }) {
  const client = useQueryClient();
  const [scope, setScope] = useState('filtered');
  const [percent, setPercent] = useState('0');
  const [fixed, setFixed] = useState('0');
  const [onlyWithoutMarkup, setOnlyWithoutMarkup] = useState(true);
  const [note, setNote] = useState('');
  const [review, setReview] = useState(null);
  const [saved, setSaved] = useState(null);
  const presetNonce = preset?.nonce;
  const presetPercent = preset?.percent;
  const presetFixed = preset?.fixed;
  useEffect(() => {
    if (!presetNonce) return;
    setScope('filtered');
    setPercent(presetPercent);
    setFixed(presetFixed);
    setOnlyWithoutMarkup(true);
    setReview(null);
    setSaved(null);
  }, [presetNonce, presetPercent, presetFixed]);
  const payload = { scope, ...(scope === 'selected' ? { productIds: selected } : { filters }), markupPercent: percent, markupFixedSyp: fixed, onlyWithoutMarkup };
  const signature = JSON.stringify(payload);
  const preview = useMutation({ mutationFn: previewAlraghebMarkup,
    onSuccess: (response, variables) => { setReview({ ...response.data, signature: JSON.stringify(variables) }); setSaved(null); } });
  const apply = useMutation({ mutationFn: applyAlraghebMarkup,
    onSuccess: async (response) => { setSaved(response.data.updated); setReview(null); await client.invalidateQueries({ queryKey: ['alragheb'] }); } });
  const current = review?.signature === signature ? review : null;
  const busy = preview.isPending || apply.isPending;
  const skipped = current?.skipped.reduce((all, item) => ({ ...all, [item.reason]: (all[item.reason] || 0) + 1 }), {}) || {};
  return <section className="mb-6 border-y border-zinc-200 py-5" aria-label="إدارة الأرباح">
    <h2 className="mb-4 text-base font-bold text-zinc-900">تعديل الأرباح</h2>
    <form onSubmit={e => { e.preventDefault(); apply.reset(); preview.mutate(payload); }}>
      <fieldset disabled={busy} className="grid min-w-0 gap-4 md:grid-cols-3">
        <label className="text-sm font-medium">نطاق التعديل<select aria-label="نطاق الأرباح" className={inputClass} value={scope} onChange={e => setScope(e.target.value)}><option value="filtered">كل نتائج البحث ({total ?? '-'})</option><option value="selected">المنتجات المحددة ({selected.length})</option></select></label>
        <label className="text-sm font-medium">نسبة الربح من التكلفة (%)<input aria-label="نسبة الربح الجماعي" className={inputClass} type="number" required min="0" max="1000" step="0.01" value={percent} onChange={e => setPercent(e.target.value)} /></label>
        <label className="text-sm font-medium">إضافة ثابتة للطلب (ل.س)<input aria-label="الربح الثابت الجماعي" className={inputClass} type="number" required min="0" max="1000000000" step="0.01" value={fixed} onChange={e => setFixed(e.target.value)} /></label>
      </fieldset>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={busy} checked={onlyWithoutMarkup} onChange={e => setOnlyWithoutMarkup(e.target.checked)} />فقط المنتجات بلا ربح مخصص</label>
        <button className={commandClass} disabled={busy || (scope === 'selected' && !selected.length)} type="submit"><Eye className="h-4 w-4" />{preview.isPending ? 'جارٍ حساب الأسعار' : 'معاينة الأرباح'}</button>
      </div>
    </form>
    {preview.isError && <p className="mt-3 text-sm text-red-700" role="alert">{preview.error.message}</p>}
    {apply.isError && <p className="mt-3 text-sm text-red-700" role="alert">{apply.error.message}</p>}
    {saved !== null && <p role="status" className="mt-4 border-r-4 border-teal-600 bg-teal-50 p-3 text-sm text-teal-900">تم حفظ الربح لـ {saved} منتج</p>}
    {current && <div className="mt-5 border-t border-zinc-200 pt-4">
      <div className="mb-3 flex flex-wrap gap-3 text-sm"><strong>{current.rows.length} منتج سيتغير من {current.total}</strong>{Object.entries(skipped).map(([key, value]) => <span key={key} className="text-zinc-500">{reasons[key]}: {value}</span>)}</div>
      {current.rows.length > 0 && <>
        <div className="max-h-96 overflow-auto border-y border-zinc-200">
          <table className="w-full min-w-[740px] text-right text-sm" aria-label="معاينة أسعار البيع">
            <thead className="sticky top-0 bg-zinc-100 text-xs text-zinc-600"><tr>{['المنتج', 'الكمية', 'تكلفة المزوّد', 'البيع الحالي', 'البيع الجديد', 'الربح التقديري'].map(label => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-zinc-100">{current.rows.map(row => <tr key={row.product_id}><td className="max-w-60 break-words px-3 py-3"><span dir="auto">{row.name}</span><span className="block text-xs text-zinc-500">#{row.product_id}{!row.purchase_enabled && ' · البيع متوقف'}</span></td><td className="px-3 py-3">{row.qty}</td>{['cost_syp', 'old_total_syp', 'new_total_syp', 'profit_syp'].map(key => <td key={key} className={`max-w-48 break-all px-3 py-3 tabular-nums ${key === 'new_total_syp' ? 'font-bold text-teal-800' : ''}`}><bdi>{syp(row[key])}</bdi></td>)}</tr>)}</tbody>
          </table>
        </div>
        <form className="mt-4 space-y-3" onSubmit={e => { e.preventDefault(); apply.mutate({ batch_id: current.batch_id, note }); }}>
          <p className="text-xs text-zinc-500">صلاحية المعاينة: {new Date(current.expires_at).toLocaleTimeString('ar-SY')}</p>
          <label className="block max-w-xl text-sm font-medium">سبب تعديل الأرباح<input aria-label="سبب تعديل الأرباح" className={inputClass} required minLength={3} maxLength={500} value={note} disabled={busy} onChange={e => setNote(e.target.value)} /></label>
          <button className={commandClass} disabled={busy} type="submit"><Save className="h-4 w-4" />{apply.isPending ? 'جارٍ حفظ الأرباح' : `تأكيد تعديل ${current.rows.length} منتج`}</button>
        </form>
      </>}
    </div>}
  </section>;
}
