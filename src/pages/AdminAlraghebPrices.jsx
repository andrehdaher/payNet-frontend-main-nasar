import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ExternalLink, RefreshCw, Settings2 } from "lucide-react";
import ProductConfigEditor from "../components/alragheb/ProductConfigEditor";
import OrdersPanel from "../components/alragheb/OrdersPanel";
import MarkupPanel from "../components/alragheb/MarkupPanel";
import CategoryRulesPanel from "../components/alragheb/CategoryRulesPanel";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAdminAlraghebProducts, useAlraghebProfile, useAlraghebSearch } from "../hooks/useAlragheb";
import { refreshAlraghebCatalog } from "../api/alraghebApi";
import { formatAlraghebNumber, getAlraghebCategoryLabel, getAlraghebQuantityLabel, getAlraghebTypeLabel } from "../utils/alraghebProductMapper";
import {
  AlraghebImage, Availability, CatalogError, CatalogFreshness, CatalogPagination,
  CatalogSearch, CatalogSkeleton, iconButtonClass, selectClass,
} from "../components/alragheb/CatalogUi";

const showPrice = (value) => value === null || value === undefined ? "غير متاح" : String(value);

export default function AdminAlraghebPrices() {
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [profitPreset, setProfitPreset] = useState(null);
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const searchText = params.get("search") || "";
  const search = useAlraghebSearch(searchText);
  const profitsView = params.get('view') === 'profits';
  const filters = { search: searchText, category_id: params.get('category') || '', available: params.get('available') || '' };
  const products = useAdminAlraghebProducts({
    search, category_id: params.get("category") || "", available: params.get("available") || "",
    page: params.get("page") || "1", limit: "30",
  });
  const profile = useAlraghebProfile();
  const meta = products.data?.meta;
  const refresh = useMutation({
    mutationFn: refreshAlraghebCatalog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["alragheb"] });
    },
  });

  const updateQuery = (key, value, replace = false) => {
    if (['search', 'category', 'available'].includes(key)) setSelected([]);
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value); else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    }, { replace });
  };
  const useProfitRule = (rule) => {
    setProfitPreset({ ...rule, nonce: Date.now() });
    updateQuery("category", rule.categoryId === 1 ? "" : String(rule.categoryId));
  };

  return <ScreenWrapper staticFooter>
    <header className="border-b border-zinc-200 pb-5 pt-3">
      <Link to="/adminpending" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-teal-700"><ArrowRight className="h-4 w-4" />الإدارة</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0"><h1 className="text-2xl font-bold leading-9 text-zinc-900">كتالوج Alragheb</h1><p className="mt-1 text-sm text-zinc-500">تطبيقات الدردشة وباقاتها</p></div>
        <div className="flex items-center gap-2">
          <Link to="/chat-apps" className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700"><ExternalLink className="h-4 w-4" />عرض الموقع</Link>
          <button className={iconButtonClass} onClick={() => refresh.mutate()} disabled={refresh.isPending || products.isFetching} aria-label="مزامنة الكتالوج" title="مزامنة الكتالوج">
            <RefreshCw className={`h-4 w-4 ${refresh.isPending || products.isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      <dl className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div><dt className="text-xs text-zinc-500">كل المنتجات والباقات</dt><dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{meta?.catalog_total ?? "-"}</dd></div>
        <div><dt className="text-xs text-zinc-500">متوفر لدى المزوّد</dt><dd className="mt-1 text-xl font-bold tabular-nums text-emerald-700">{meta?.available_total ?? "-"}</dd></div>
        <div><dt className="text-xs text-zinc-500">رصيد حساب المزوّد</dt><dd className="mt-1 break-words text-xl font-bold tabular-nums text-zinc-900">{profile.isPending ? "..." : profile.data?.data?.balance ?? "-"} <span className="text-xs font-normal text-zinc-500">{profile.data?.data?.currency || "عملة الحساب"}</span></dd></div>
        <div className="min-w-0"><dt className="text-xs text-zinc-500">الحساب</dt><dd className="mt-2 break-all text-sm font-medium text-zinc-800" dir="auto">{profile.data?.data?.email || "-"}</dd></div>
      </dl>
    </header>

    {profile.isError && <CatalogError error={profile.error} onRetry={() => profile.refetch()} />}
    {refresh.isError && <CatalogError error={refresh.error} onRetry={() => refresh.mutate()} />}
    <div className="my-4 border-r-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
      العملة: الليرة السورية (SYP). {!meta ? "جارٍ التحقق من حالة الشراء." : meta.purchase_enabled ? "استقبال الشراء مفعّل للمنتجات المعتمدة." : "استقبال الشراء متوقف من إعدادات الخادم."}
    </div>
    <div role="tablist" aria-label="أقسام إدارة Alragheb" className="mb-4 flex border-b border-zinc-200">
      {[['catalog', 'المنتجات والتسعير'], ['profits', 'الأرباح'], ['orders', 'الطلبات والمتابعة']].map(([value, label]) => <button key={value} role="tab" aria-selected={(params.get('view') || 'catalog') === value} className={`min-w-0 border-b-2 px-3 py-3 text-sm font-semibold ${(params.get('view') || 'catalog') === value ? 'border-teal-700 text-teal-800' : 'border-transparent text-zinc-500'}`} onClick={() => updateQuery('view', value)}>{label}</button>)}
    </div>
    {params.get('view') === 'orders' ? <OrdersPanel admin /> : <>
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_200px_180px]">
      <CatalogSearch value={searchText} onChange={(value) => updateQuery("search", value, true)} id="admin-chat-search" />
      <select className={selectClass} aria-label="تصنيف التطبيقات" value={params.get("category") || ""} onChange={(event) => updateQuery("category", event.target.value)}>
        <option value="">جميع التطبيقات والباقات</option>
        {meta?.categories?.filter((category) => category.id !== 1).map((category) => <option key={category.id} value={category.id}>{category.name} ({category.product_count})</option>)}
      </select>
      <select className={selectClass} aria-label="حالة التوفر" value={params.get("available") || ""} onChange={(event) => updateQuery("available", event.target.value)}>
        <option value="">كل حالات التوفر</option><option value="true">متوفر لدى المزوّد</option><option value="false">غير متوفر</option>
      </select>
    </div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600"><span>{meta?.total ?? "-"} نتيجة</span><CatalogFreshness meta={meta} /></div>
    {profitsView && <>
      <CategoryRulesPanel currentCategoryId={params.get("category") || 1} onUseRule={useProfitRule} />
      <MarkupPanel filters={filters} selected={selected} total={meta?.total} preset={profitPreset} />
    </>}
    {products.isError && <CatalogError error={products.error} onRetry={() => products.refetch()} />}
    {products.isLoading ? <CatalogSkeleton /> : products.data && <>
      <div className="overflow-x-auto border-y border-zinc-200" aria-busy={products.isFetching}>
        <table className="w-full min-w-[920px] text-right text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-100 text-xs text-zinc-600"><tr>
            {profitsView && <th className="px-3 py-3"><input type="checkbox" aria-label="تحديد منتجات الصفحة" checked={products.data.data.length > 0 && products.data.data.every(p => selected.includes(p.id))} onChange={e => setSelected(e.target.checked ? [...new Set([...selected, ...products.data.data.map(p => p.id)])] : selected.filter(id => !products.data.data.some(p => p.id === id)))} /></th>}
            {["المنتج", "التصنيف", "النوع", "الكمية", "حقول الشحن", "سعر المصدر (ل.س)", "الربح المضاف", "التوفر", "البيع", "الإعداد"].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {products.data.data.map((product) => <tr key={product.id} className="align-top hover:bg-zinc-50">
              {profitsView && <td className="px-3 py-3"><input type="checkbox" aria-label={`تحديد المنتج ${product.id}`} checked={selected.includes(product.id)} onChange={e => setSelected(ids => e.target.checked ? [...ids, product.id] : ids.filter(id => id !== product.id))} /></td>}
              <td className="px-3 py-3"><Link to={`/chat-apps/products/${product.id}`} className="flex items-center gap-3 text-zinc-800 hover:text-teal-700">
                <AlraghebImage item={product} className="h-10 w-10 shrink-0 rounded object-contain" />
                <div className="max-w-56"><p className="break-words font-semibold" dir="auto">{product.name}</p><p className="mt-1 text-xs tabular-nums text-zinc-400">#{product.id}</p></div>
              </Link></td>
              <td className="px-3 py-3 text-zinc-600">{getAlraghebCategoryLabel(product)}</td>
              <td className="px-3 py-3 text-zinc-600">{getAlraghebTypeLabel(product)}</td>
              <td className="max-w-44 px-3 py-3 tabular-nums text-zinc-600"><bdi>{getAlraghebQuantityLabel(product.quantity_rules)}</bdi></td>
              <td className="max-w-44 px-3 py-3 text-xs leading-5 text-zinc-600">{product.params.length ? product.params.join(" / ") : "-"}</td>
              <td className="px-3 py-3 tabular-nums text-zinc-800" dir="ltr">{showPrice(product.provider_price)}</td>
              <td className="px-3 py-3 tabular-nums text-zinc-600"><p><bdi>{product.config?.markupPercent || '0'}%</bdi></p><p className="mt-1 whitespace-nowrap text-xs"><bdi>{product.config?.markupFixedSyp || '0'} ل.س</bdi> / طلب</p>{!product.config && product.category_pricing_rule && <p className="mt-2 text-xs text-teal-700">قاعدة التصنيف: <bdi>{product.category_pricing_rule.markup_percent}%</bdi></p>}</td>
              <td className="px-3 py-3"><Availability available={product.available} /></td>
              <td className="px-3 py-3 text-xs"><p>{product.purchasable ? "مفعّل" : product.purchase_status === "not_configured" ? "بانتظار الاعتماد" : "متوقف"}</p>{product.pricing_preview && <p className="mt-2">{formatAlraghebNumber(product.pricing_preview.total_amount_syp)} ل.س / {product.pricing_preview.qty} وحدة</p>}</td>
              <td className="px-3 py-3"><button className={iconButtonClass} title="إعداد المنتج" aria-label={`إعداد المنتج ${product.id}`} onClick={() => setEditing(product)}><Settings2 className="h-4 w-4" /></button></td>
            </tr>)}
            {!products.data.data.length && <tr><td colSpan={profitsView ? 11 : 10} className="py-12 text-center text-zinc-500">لا توجد منتجات مطابقة</td></tr>}
          </tbody>
        </table>
      </div>
      <CatalogPagination meta={meta} busy={products.isFetching} onPage={(page) => updateQuery("page", String(page))} />
    </>}
    </>}
    {editing && <ProductConfigEditor key={editing.id} product={editing} onClose={() => setEditing(null)} />}
  </ScreenWrapper>;
}
