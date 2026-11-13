export default function DataFeedback({ loading, error, empty, children }) {
  if (loading) return <p role="status" className="page-message">جاري تحميل البيانات…</p>;
  if (error) return <p role="alert" className="page-message text-red-700">تعذر تحميل البيانات. أعد المحاولة بتحديث الصفحة.</p>;
  if (empty) return <p className="page-message">لا توجد بيانات.</p>;
  return children;
}
