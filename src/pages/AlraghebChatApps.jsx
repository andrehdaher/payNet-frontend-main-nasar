import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers, RefreshCw } from "lucide-react";
import ScreenWrapper from "../components/ScreenWrapper";
import OrdersPanel from "../components/alragheb/OrdersPanel";
import { syp } from "../components/alragheb/PurchaseForm";
import { useAlraghebContent, useAlraghebSearch } from "../hooks/useAlragheb";
import { ENABLE_ALRAGHEB_PRODUCTS } from "../config/features";
import { getAlraghebCategoryLabel, getAlraghebQuantityLabel, getAlraghebTypeLabel } from "../utils/alraghebProductMapper";
import {
  AlraghebImage, Availability, CatalogError, CatalogFreshness, CatalogPagination,
  CatalogSearch, CatalogSkeleton, iconButtonClass, selectClass,
} from "../components/alragheb/CatalogUi";

export default function AlraghebChatApps() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category") || "1";
  const searchText = params.get("search") || "";
  const search = useAlraghebSearch(searchText);
  const scope = params.get("scope") || "direct";
  const query = useAlraghebContent(categoryId, {
    search, page: params.get("page") || "1", available: params.get("available") || "", scope, limit: "24",
  }, ENABLE_ALRAGHEB_PRODUCTS);
  const content = query.data?.data;
  const meta = query.data?.meta;
  const busy = query.isFetching || search !== searchText;

  const updateQuery = (key, value, replace = false) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value); else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    }, { replace });
  };

  return <ScreenWrapper staticFooter>
    <header className="mb-6 border-b border-zinc-200 pb-5 pt-3">
      <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-teal-700"><ArrowRight className="h-4 w-4" />الرئيسية</Link>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-9 text-zinc-900">تطبيقات الدردشة</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
            <span>Alragheb</span>
            {meta && <span className="tabular-nums">{meta.catalog_total} منتج وباقة</span>}
          </div>
        </div>
        <button className={iconButtonClass} onClick={() => query.refetch()} disabled={busy || !ENABLE_ALRAGHEB_PRODUCTS} aria-label="تحديث التطبيقات" title="تحديث التطبيقات">
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>

    {!ENABLE_ALRAGHEB_PRODUCTS ? <p className="py-12 text-center text-zinc-600">قسم تطبيقات الدردشة متوقف مؤقتًا</p> : <>
      <nav aria-label="مسار التصنيفات" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
        {(content?.breadcrumbs || [{ id: 1, name: "جميع التطبيقات" }]).map((category, index) => <span key={category.id} className="inline-flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          <Link to={category.id === 1 ? "/chat-apps" : `/chat-apps?category=${category.id}`} className="break-words hover:text-teal-700" aria-current={String(category.id) === categoryId ? "page" : undefined}>
            {category.name}
          </Link>
        </span>)}
      </nav>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
        <div className="col-span-2 lg:col-span-1"><CatalogSearch value={searchText} onChange={(value) => updateQuery("search", value, true)} /></div>
        <select aria-label="حالة التوفر" className={selectClass} value={params.get("available") || ""} onChange={(event) => updateQuery("available", event.target.value)}>
          <option value="">كل حالات التوفر</option><option value="true">متوفر لدى المزوّد</option><option value="false">غير متوفر</option>
        </select>
        <select aria-label="نطاق المنتجات" className={selectClass} value={scope} onChange={(event) => updateQuery("scope", event.target.value)}>
          <option value="direct">منتجات القسم</option><option value="all">مع التصنيفات الفرعية</option>
        </select>
      </div>

      {query.isError && <CatalogError error={query.error} onRetry={() => query.refetch()} />}
      {query.isLoading ? <CatalogSkeleton /> : content && <>
        {content.categories.length > 0 && !searchText && <section className="mb-7" aria-labelledby="chat-categories-heading">
          <h2 id="chat-categories-heading" className="mb-3 text-sm font-bold text-zinc-700">باقات التطبيقات</h2>
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {content.categories.map((category) => <Link key={category.id} to={`/chat-apps?category=${category.id}`}
              className="flex min-w-0 items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
              <AlraghebImage item={category} className="h-12 w-12 shrink-0 rounded-md object-contain" />
              <div className="min-w-0"><h3 className="break-words text-sm font-bold text-zinc-900" dir="auto">{category.name}</h3><p className="mt-1 text-xs text-zinc-500">{category.product_count} منتج</p></div>
              <ArrowLeft className="mr-auto h-4 w-4 shrink-0 text-zinc-400" />
            </Link>)}
          </div>
        </section>}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-zinc-800">{searchText ? "نتائج البحث" : content.category.id === 1 ? "التطبيقات والمنتجات" : content.category.name} <span className="mr-1 text-sm font-normal tabular-nums text-zinc-500">({meta.total})</span></h2>
          <CatalogFreshness meta={meta} />
        </div>
        <div aria-busy={busy} className={busy ? "opacity-60" : ""}>
          {content.products.length ? <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {content.products.map((product, index) => <Link key={product.id} to={`/chat-apps/products/${product.id}?${params.toString()}`}
              className="group flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-teal-600 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              aria-label={`تفاصيل ${product.name}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <AlraghebImage item={product} priority={index < 4} className="h-16 w-16 shrink-0 rounded-md object-contain" />
                <span className="text-xs tabular-nums text-zinc-400">#{product.id}</span>
              </div>
              <h3 className="min-h-12 break-words text-right text-base font-bold leading-6 text-zinc-900" dir="auto">{product.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500"><Layers className="h-3 w-3 shrink-0" />{getAlraghebCategoryLabel(product)}</p>
              <div className="mt-4 border-t border-zinc-100 pt-3">
                <p className="mb-1 text-xs text-zinc-500">{getAlraghebTypeLabel(product)}</p>
                <p className="min-h-5 break-words text-sm tabular-nums text-zinc-700"><bdi>{product.quantity_rules.mode === "choices" ? `${product.quantity_rules.values.length} كميات محددة` : getAlraghebQuantityLabel(product.quantity_rules)}</bdi></p>
              </div>
              {product.pricing_preview && <p className="mt-3 text-sm font-semibold text-teal-800"><bdi>{syp(product.pricing_preview.total_amount_syp)}</bdi><span className="mr-1 text-xs font-normal text-zinc-500">/ {product.pricing_preview.qty} وحدة</span></p>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><Availability available={product.available} /><ArrowLeft className="h-4 w-4 text-teal-700" /></div>
            </Link>)}
          </div> : <div className="border-y border-zinc-200 py-14 text-center"><p className="font-semibold text-zinc-700">لا توجد منتجات مطابقة</p>
            <button className="mt-3 text-sm text-teal-700 underline underline-offset-4" onClick={() => setParams(categoryId === "1" ? {} : { category: categoryId })}>مسح التصفية</button>
          </div>}
          <CatalogPagination meta={meta} busy={busy} onPage={(page) => updateQuery("page", String(page))} />
        </div>
      </>}
    </>}
    <OrdersPanel />
  </ScreenWrapper>;
}
