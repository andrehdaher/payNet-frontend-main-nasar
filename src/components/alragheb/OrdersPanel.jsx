import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { getAlraghebOrders, checkAlraghebOrder, getAlraghebSummary } from "../../api/alraghebApi";
import { CatalogError, CatalogPagination, iconButtonClass, selectClass } from "./CatalogUi";
import { orderStatus, syp } from "./PurchaseForm";

export default function OrdersPanel({ admin = false }) {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["alragheb", "orders", admin, status, page, product, from, to],
    queryFn: () => getAlraghebOrders({ status, page, limit: 20, product_id: product, from, to }, admin), refetchInterval: 15000 });
  const summary = useQuery({ queryKey: ['alragheb', 'summary'], queryFn: getAlraghebSummary, enabled: admin, refetchInterval: 15000 });
  const check = useMutation({ mutationFn: checkAlraghebOrder, onSuccess: () => client.invalidateQueries({ queryKey: ["alragheb"] }) });
  return <section className="py-5" aria-label={admin ? "إدارة طلبات Alragheb" : "طلباتي"}>
    {admin && summary.data && <dl className="mb-5 grid gap-4 border-b border-zinc-200 pb-5 sm:grid-cols-3">{Object.entries(orderStatus).map(([key, label]) => <div key={key}><dt className="text-xs text-zinc-500">{label}</dt><dd className="mt-2 text-lg font-bold">{summary.data.data.statuses[key]?.count || 0}</dd><dd className="mt-1 text-sm text-zinc-600">{syp(summary.data.data.statuses[key]?.amount_syp || '0')}</dd></div>)}</dl>}
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h2 className="ml-auto text-lg font-bold">{admin ? "طلبات Alragheb" : "طلباتي"}</h2>
      {admin && <input className="h-10 w-36 rounded-md border border-zinc-300 px-3 text-sm" aria-label="معرف منتج الطلبات" placeholder="معرّف المنتج" inputMode="numeric" value={product} onChange={(e) => { if (/^\d*$/.test(e.target.value)) { setProduct(e.target.value); setPage(1); } }} />}
      <select className={`${selectClass} max-w-48`} aria-label="حالة الطلبات" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
        <option value="">جميع الحالات</option>{Object.entries(orderStatus).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
      </select>
      <button className={iconButtonClass} title="تحديث الطلبات" aria-label="تحديث الطلبات" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className="h-4 w-4" /></button>
    </div>
    {admin && <div className="mb-4 flex flex-wrap gap-3 text-sm"><label>من تاريخ<input type="date" className="mr-2 rounded-md border border-zinc-300 p-2" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} /></label><label>إلى تاريخ<input type="date" className="mr-2 rounded-md border border-zinc-300 p-2" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} /></label></div>}
    {query.isError && <CatalogError error={query.error} onRetry={() => query.refetch()} />}
    {check.isError && <p role="alert" className="py-3 text-sm text-red-700">{check.error.message}</p>}
    {query.isPending ? <p role="status">جارٍ تحميل الطلبات</p> : <div className="overflow-x-auto border-y border-zinc-200">
      <table className="w-full min-w-[680px] text-right text-sm"><thead className="bg-zinc-100 text-zinc-600"><tr>{["التاريخ", "المنتج / الحساب", "الكمية", "المبلغ", "الحالة", "التفاصيل"].map((label) => <th key={label} className="px-3 py-3">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-zinc-100">{query.data?.data.map((order) => <tr key={order.transaction_id}>
          <td className="whitespace-nowrap px-3 py-3 text-xs">{new Date(order.created_at).toLocaleString("ar-SY")}</td>
          <td className="max-w-56 break-words px-3 py-3"><p>{order.product_name}</p><p className="mt-1 break-all text-xs text-zinc-500">{Object.values(order.params || {}).join(" / ")}</p></td>
          <td className="px-3 py-3">{order.qty}</td><td className="whitespace-nowrap px-3 py-3">{syp(order.total_amount_syp)}</td>
          <td className={`px-3 py-3 ${order.status === "completed" ? "text-emerald-700" : order.status === "refunded" ? "text-red-700" : "text-amber-700"}`}>{orderStatus[order.status]}</td>
          <td className="max-w-64 px-3 py-3"><details><summary className="cursor-pointer text-teal-700">عرض</summary><div className="mt-2 space-y-2 break-all text-xs">
            <p>{order.transaction_id}</p>{order.result && <pre className="whitespace-pre-wrap break-all">{order.result}</pre>}
            {admin && <><p>الحساب: {String(order.user)}</p><p>UUID: {order.order_uuid}</p><p>تكلفة المزوّد: {syp(order.provider_cost_syp)}</p><p>الربح الإجمالي المحقق: {syp(order.gross_profit_syp)}</p><p>الربح المضاف عند الشراء: {order.markup_percent ?? '-'}% + {syp(order.markup_fixed_syp)}</p><p>محاولات التحقق: {order.attempts}</p>{order.last_error && <p>{order.last_error}</p>}</>}
            {order.status === "refunded" && <p>المبلغ المعاد: {syp(order.refunded_amount_syp)}</p>}
          </div></details>{admin && order.status === "pending" && <button className={`${iconButtonClass} mt-2`} aria-label={`فحص ${order.transaction_id}`} title="فحص لدى المزوّد" disabled={check.isPending || Date.parse(order.next_check_at) > Date.now()} onClick={() => check.mutate(order.transaction_id)}><RefreshCw className="h-4 w-4" /></button>}</td>
        </tr>)}{!query.data?.data.length && <tr><td colSpan={6} className="py-8 text-center text-zinc-500">لا توجد طلبات</td></tr>}</tbody>
      </table>
    </div>}
    {query.data && <CatalogPagination meta={query.data.meta} busy={query.isFetching} onPage={setPage} />}
  </section>;
}
