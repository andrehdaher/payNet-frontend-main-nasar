import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Wand2 } from 'lucide-react';
import { saveAlraghebPricingRule } from '../../api/alraghebApi';
import { useAlraghebPricingRules } from '../../hooks/useAlragheb';
import { commandClass, inputClass, syp } from './PurchaseForm';

const valueOf = (rule, key) => rule?.[key] ?? '0';

export default function CategoryRulesPanel({ currentCategoryId, onUseRule }) {
  const client = useQueryClient();
  const rules = useAlraghebPricingRules();
  const categories = useMemo(() => (rules.data?.data?.categories || []).filter((category) => category.product_count > 0), [rules.data]);
  const [categoryId, setCategoryId] = useState(String(currentCategoryId || 1));
  const selected = categories.find((category) => String(category.id) === categoryId) || categories[0];
  const activeRule = selected?.rule || selected?.inherited_rule || null;
  const [percent, setPercent] = useState('0');
  const [fixed, setFixed] = useState('0');
  const [note, setNote] = useState('');
  const selectedId = selected?.id;
  const activeRevision = activeRule?.revision;
  const activePercent = valueOf(activeRule, 'markup_percent');
  const activeFixed = valueOf(activeRule, 'markup_fixed_syp');
  const exactNote = selected?.rule?.note || '';

  useEffect(() => {
    if (!currentCategoryId) return;
    setCategoryId(String(currentCategoryId));
  }, [currentCategoryId]);

  useEffect(() => {
    if (!selected) return;
    setPercent(activePercent);
    setFixed(activeFixed);
    setNote(exactNote);
  }, [selected, selectedId, activeRevision, activePercent, activeFixed, exactNote]);

  const save = useMutation({
    mutationFn: saveAlraghebPricingRule,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['alragheb'] });
    },
  });

  const busy = rules.isFetching || save.isPending;
  return <section className="mb-6 border-y border-zinc-200 py-5" aria-label="قواعد ربح التصنيفات">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-zinc-900">قواعد ربح التصنيفات</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">احفظ نسبة افتراضية للدردشات الآن، ثم استخدم نفس الأسلوب للألعاب و AI عند إضافة تصنيفاتها.</p>
      </div>
      {selected?.rule && <span className="text-xs text-zinc-500">آخر حفظ: {new Date(selected.rule.updated_at).toLocaleString('ar-SY')}</span>}
    </div>
    {rules.isError && <p className="mb-3 text-sm text-red-700" role="alert">{rules.error.message}</p>}
    {save.isError && <p className="mb-3 text-sm text-red-700" role="alert">{save.error.message}</p>}
    {save.isSuccess && <p className="mb-3 border-r-4 border-teal-600 bg-teal-50 p-3 text-sm text-teal-900" role="status">تم حفظ قاعدة الربح للتصنيف</p>}
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!selected) return;
      save.mutate({ categoryId: selected.id, markupPercent: percent, markupFixedSyp: fixed, note });
    }}>
      <fieldset disabled={busy || !selected} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="text-sm font-medium">التصنيف
          <select className={inputClass} value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="تصنيف قاعدة الربح">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name} ({category.product_count})</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">نسبة الربح (%)
          <input className={inputClass} type="number" min="0" max="1000" step="0.01" required value={percent} onChange={(event) => setPercent(event.target.value)} />
        </label>
        <label className="text-sm font-medium">إضافة ثابتة (ل.س)
          <input className={inputClass} type="number" min="0" max="1000000000" step="0.01" required value={fixed} onChange={(event) => setFixed(event.target.value)} />
        </label>
      </fieldset>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="text-sm font-medium">سبب تعديل القاعدة
          <input className={inputClass} required minLength={3} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button className={commandClass} type="submit" disabled={busy || !selected}><Save className="h-4 w-4" />{save.isPending ? 'جارٍ الحفظ' : 'حفظ القاعدة'}</button>
        <button className={commandClass} type="button" disabled={!selected} onClick={() => onUseRule?.({ categoryId: selected.id, percent, fixed, label: selected.name })}>
          <Wand2 className="h-4 w-4" />تحميلها للمعاينة
        </button>
      </div>
    </form>
    {selected && <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
      <p>المنتجات ضمن التصنيف: <bdi className="font-semibold text-zinc-900">{selected.product_count}</bdi></p>
      <p>القاعدة المحفوظة: <bdi className="font-semibold text-zinc-900">{selected.rule ? `${selected.rule.markup_percent}% + ${syp(selected.rule.markup_fixed_syp)}` : 'غير محددة'}</bdi></p>
      <p>الموروثة حاليا: <bdi className="font-semibold text-zinc-900">{selected.inherited_rule ? `${selected.inherited_rule.markup_percent}% + ${syp(selected.inherited_rule.markup_fixed_syp)}` : '-'}</bdi></p>
    </div>}
  </section>;
}
