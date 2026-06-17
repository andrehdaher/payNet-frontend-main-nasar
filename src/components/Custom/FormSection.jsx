export default function FormSection({ title, description, children, className = "" }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}
          {description && <p className="mt-1 text-sm leading-6 text-slate-700">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
