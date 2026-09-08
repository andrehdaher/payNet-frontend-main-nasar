import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Sparkles, Ticket, X, Zap } from "lucide-react";
import { Button } from "./Custom/Button";

const ANNOUNCEMENT_STARTED_AT_KEY = "paynet:new-services-announcement:2026-09-games-digital:started-at";
const ANNOUNCEMENT_SESSION_DISMISSED_KEY = "paynet:new-services-announcement:2026-09-games-digital:dismissed-session";
const ANNOUNCEMENT_DURATION_MS = 24 * 60 * 60 * 1000;

const getAnnouncementStartedAt = () => {
  try {
    const storedValue = Number(window.localStorage.getItem(ANNOUNCEMENT_STARTED_AT_KEY));
    if (Number.isFinite(storedValue) && storedValue > 0) {
      return storedValue;
    }

    const startedAt = Date.now();
    window.localStorage.setItem(ANNOUNCEMENT_STARTED_AT_KEY, String(startedAt));
    return startedAt;
  } catch {
    return 0;
  }
};

const shouldShowAnnouncement = () => {
  try {
    if (window.sessionStorage.getItem(ANNOUNCEMENT_SESSION_DISMISSED_KEY) === "true") {
      return false;
    }
  } catch {
    return false;
  }

  const startedAt = getAnnouncementStartedAt();
  return startedAt > 0 && Date.now() - startedAt < ANNOUNCEMENT_DURATION_MS;
};

const markAnnouncementDismissedForSession = () => {
  try {
    window.sessionStorage.setItem(ANNOUNCEMENT_SESSION_DISMISSED_KEY, "true");
  } catch {
    // Ignore storage errors so the announcement never blocks the app.
  }
};

export default function NewServicesAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/login") {
      setIsOpen(false);
      return;
    }

    const hasToken = Boolean(window.localStorage.getItem("token"));
    setIsOpen(hasToken && shouldShowAnnouncement());
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const startedAt = getAnnouncementStartedAt();
    const remainingMs = ANNOUNCEMENT_DURATION_MS - (Date.now() - startedAt);

    if (remainingMs <= 0) {
      setIsOpen(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  const closeAnnouncement = () => {
    markAnnouncementDismissedForSession();
    setIsOpen(false);
  };

  const goToSection = (section) => {
    closeAnnouncement();
    navigate("/internet", { state: section });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      dir="rtl"
      role="presentation"
      onClick={closeAnnouncement}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-services-announcement-title"
        aria-describedby="new-services-announcement-description"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAnnouncement}
          className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="إغلاق النافذة"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3 pl-8">
            <span className="rounded-full bg-violet-100 p-2 text-violet-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-violet-700">خدمات جديدة</p>
              <h2 id="new-services-announcement-title" className="text-xl font-bold text-slate-950">
                تحديث مهم في PayNet
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p id="new-services-announcement-description" className="text-base font-semibold leading-8 text-slate-800">
            أصبح شحن لعبتي PUBG Mobile و Free Fire فوريًا مع الشركة مباشرة، ويمكنك الآن شراء أكواد لألعاب مختلفة بشكل فوري من قسم المنتجات الرقمية، بالإضافة إلى الكثير من التطبيقات والخدمات الجديدة.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <Gamepad2 className="mb-2 h-5 w-5 text-violet-700" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-900">شحن فوري للألعاب</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">PUBG Mobile و Free Fire مباشرة.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <Ticket className="mb-2 h-5 w-5 text-emerald-700" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-900">أكواد رقمية</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">ألعاب ومنصات متنوعة بشكل فوري.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <Zap className="mb-2 h-5 w-5 text-amber-600" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-900">خدمات أكثر</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">تطبيقات وخيارات جديدة داخل حسابك.</p>
            </div>
          </div>

          <div className="grid gap-2 pt-2 sm:grid-cols-3">
            <Button type="button" className="sm:col-span-1" onClick={() => goToSection("play")}>
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              قسم الألعاب
            </Button>
            <Button type="button" variant="outline" className="sm:col-span-1" onClick={() => goToSection("prowave-products")}>
              <Ticket className="h-4 w-4" aria-hidden="true" />
              المنتجات الرقمية
            </Button>
            <Button type="button" variant="ghost" className="sm:col-span-1" onClick={closeAnnouncement}>
              لاحقًا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
