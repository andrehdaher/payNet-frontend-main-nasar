import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PurchaseForm from "../components/alragheb/PurchaseForm";
import OrdersPanel from "../components/alragheb/OrdersPanel";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAlraghebProduct } from "../hooks/useAlragheb";
import { ENABLE_ALRAGHEB_PRODUCTS } from "../config/features";
import { AlraghebImage, Availability, CatalogError, CatalogFreshness } from "../components/alragheb/CatalogUi";
import { alraghebCatalogPath, getAlraghebCategoryLabel, getAlraghebFieldLabel, getAlraghebQuantityLabel, getAlraghebTypeLabel } from "../utils/alraghebProductMapper";

export default function AlraghebProductDetails() {
  const { productId } = useParams();
  const [params] = useSearchParams();
  const query = useAlraghebProduct(productId, ENABLE_ALRAGHEB_PRODUCTS);
  const product = query.data?.data;
  return <ScreenWrapper staticFooter>
    <div className="py-3">
      <Link to={`/chat-apps?${params.toString()}`} className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-teal-700"><ArrowRight className="h-4 w-4" />تطبيقات الدردشة</Link>
    </div>
    {!ENABLE_ALRAGHEB_PRODUCTS ? <p className="py-12">قسم تطبيقات الدردشة متوقف مؤقتًا</p> : <>
      {query.isError && <CatalogError error={query.error} onRetry={() => query.refetch()} />}
      {query.isLoading && <div role="status" className="my-8 h-72 animate-pulse rounded-lg bg-zinc-100" aria-label="جاري تحميل المنتج" />}
      {product && <article className="max-w-4xl py-6">
        <div className="flex flex-col gap-6 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
          <AlraghebImage item={product} priority className="h-32 w-32 shrink-0 rounded-lg bg-white object-contain p-2" />
          <div className="min-w-0">
            <p className="mb-2 text-xs text-zinc-500">Alragheb <span className="mr-2">#{product.id}</span></p>
            <h1 className="break-words text-right text-2xl font-bold leading-9 text-zinc-900" dir="auto">{product.name}</h1>
            <Link to={alraghebCatalogPath(product.category_id)} className="mt-2 inline-block text-sm text-teal-700 hover:underline">{getAlraghebCategoryLabel(product)}</Link>
            <div className="mt-3"><Availability available={product.available} /></div>
          </div>
        </div>
        <dl className="grid gap-x-10 gap-y-5 border-b border-zinc-200 py-6 sm:grid-cols-2">
          <div><dt className="text-sm text-zinc-500">نوع المنتج</dt><dd className="mt-1 font-semibold text-zinc-800">{getAlraghebTypeLabel(product)}</dd></div>
          <div><dt className="text-sm text-zinc-500">الكمية المسموحة</dt><dd className="mt-1 break-words font-semibold tabular-nums text-zinc-800"><bdi>{getAlraghebQuantityLabel(product.quantity_rules)}</bdi></dd></div>
        </dl>
        <section className="py-6" aria-labelledby="chat-product-fields">
          <h2 id="chat-product-fields" className="mb-3 text-base font-bold text-zinc-800">بيانات الشحن المطلوبة</h2>
          {product.params.length ? <ul className="space-y-2 text-sm text-zinc-600">{product.params.map((field, index) => <li key={`${field}-${index}`} dir="auto">{getAlraghebFieldLabel(field)}</li>)}</ul> : <p className="text-sm text-zinc-500">لم يحدد المزوّد حقولًا إضافية</p>}
        </section>
        <PurchaseForm key={product.id} product={product} />
        <div className="mt-4"><CatalogFreshness meta={query.data.meta} /></div>
      </article>}
      <OrdersPanel />
    </>}
  </ScreenWrapper>;
}
