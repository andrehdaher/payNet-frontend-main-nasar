import { Search, ShieldCheck, X } from "lucide-react";
import { Button } from "../Custom/Button";

export default function InquiryForm({
  companies,
  selectedCompany,
  landline,
  loading,
  onCompanyChange,
  onLandlineChange,
  onSubmit,
}) {
  const clearLandline = () => onLandlineChange("");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="mb-1 flex items-center gap-2">
          <Search className="h-5 w-5 text-violet-700" aria-hidden="true" />
          <h1 className="text-lg font-bold text-slate-950">استعلام عن فاتورة</h1>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          اختر مزود الخدمة وأدخل رقم المشترك للاستعلام الفوري.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        aria-busy={loading}
      >
        <div>
          <label htmlFor="company" className="mb-1.5 block text-xs font-semibold text-slate-700">
            مزود الخدمة <span className="text-red-600">*</span>
          </label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(event) => onCompanyChange(event.target.value)}
            disabled={loading}
            className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none transition-colors hover:bg-white focus:border-violet-700 focus:bg-white focus:ring-2 focus:ring-violet-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            required
          >
            {companies.map((company) => (
              <option key={company || "empty-company"} value={company}>
                {company || "اختر الشركة"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="landline" className="text-xs font-semibold text-slate-700">
              رقم المشترك <span className="text-red-600">*</span>
            </label>
          </div>
          <div className="relative">
            <input
              id="landline"
              name="landline"
              value={landline}
              onChange={(event) => onLandlineChange(event.target.value)}
              disabled={loading}
              required
              type="text"
              inputMode="numeric"
              dir="ltr"
              placeholder="رقم الهاتف أو المشترك"
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-3 pl-10 text-left font-mono text-base font-bold text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-violet-700 focus:ring-2 focus:ring-violet-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {landline && !loading && (
              <button
                type="button"
                onClick={clearLandline}
                className="absolute left-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                aria-label="مسح الرقم"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
            يدعم أرقام الهواتف الأرضية ورموز المشتركين المعتمدة.
          </p>
        </div>

        <Button type="submit" className="h-12 w-full bg-violet-700 hover:bg-violet-800" loading={loading}>
          <Search className="h-4 w-4" aria-hidden="true" />
          {loading ? "جاري الاستعلام..." : "استعلام عن الفاتورة"}
        </Button>
      </form>

      <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-start gap-2.5 text-xs leading-6 text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" aria-hidden="true" />
          <span>الاستعلام فوري ومجاني، ولا يترتب عليه أي اقتطاع مالي إلا عند إتمام التسديد.</span>
        </div>
      </div>
    </section>
  );
}
