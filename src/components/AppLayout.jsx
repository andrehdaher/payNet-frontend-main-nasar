import { PAYNET_BASE_URL } from "../api";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import axios from "axios";
import Footer from "./Footer";
import { useNotification } from "../context/NotificationContext";

const navigation = [
  {
    title: "الخدمات",
    links: [
      { path: "/", label: "الصفحة الرئيسية" },
      { path: "/add-point", label: "نقاط البيع الفرعية", role: "user" },
      { href: "https://wa.me/963959762701", label: "واتساب", role: "user" },
    ],
  },
  {
    title: "الحساب",
    links: [
      { path: "/financial", label: "البيان المالي", notification: true },
      { path: "/balance", label: "تعبئة رصيد", role: "user" },
      {
        path: "/financial-point",
        label: "البيان المالي للنقاط الفرعية",
        role: "user",
      },
      {
        path: "/PointPayment",
        label: "البيان المالي للدفعات",
        role: "user-point",
      },
    ],
  },
  {
    title: "الإدارة",
    links: [
      { path: "/adminpending", label: "العمليات المعلقة", role: "admin" },
      {
        path: "/adminfinancial",
        label: "البيان المالي للتسديد",
        role: "admin",
      },
      {
        path: "/adminPaymentStatement",
        label: "البيان المالي للدفعات",
        role: "admin",
      },
      { path: "/admindaen", label: "الديون", role: "admin" },
      { path: "/adminAddUser", label: "إضافة مستخدم", role: "admin" },
      { path: "/allUser", label: "عرض المستخدمين", role: "admin" },
    ],
  },
];

export function PageLoading() {
  return (
    <p role="status" className="page-message">
      جاري تحميل الصفحة…
    </p>
  );
}

function Navigation({ role, onSelect, onLogout }) {
  const { hasNewUnpaid } = useNotification();

  return (
    <nav aria-label="التنقل الرئيسي">
      {navigation.map(({ title, links }) => {
        const available = links.filter(
          (link) => !link.role || link.role === role,
        );
        if (!available.length) return null;
        return (
          <section key={title} className="mb-5">
            <h2 className="px-3 mb-1 text-sm font-bold text-slate-600">
              {title}
            </h2>
            {available.map(({ path, href, label, notification }) =>
              href ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paynet-nav-link"
                  onClick={onSelect}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={path}
                  end
                  to={
                    path === "/" && role === "user-point" ? "/HomePoint" : path
                  }
                  className="paynet-nav-link"
                  onClick={onSelect}
                >
                  {label}
                  {notification && hasNewUnpaid && (
                    <span
                      className="size-2 rounded-full bg-red-600"
                      role="img"
                      aria-label="عملية جديدة"
                    />
                  )}
                </NavLink>
              ),
            )}
          </section>
        );
      })}
      <button
        type="button"
        className="paynet-nav-link w-full text-red-700"
        onClick={onLogout}
      >
        <LogOut size={18} aria-hidden="true" /> تسجيل الخروج
      </button>
    </nav>
  );
}

export default function AppLayout() {
  const { session, token } = useOutletContext();
  const { key, pathname } = useLocation();
  const navigate = useNavigate();
  const drawer = useRef(null);
  const trigger = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [balanceError, setBalanceError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setBalanceError(false);
    axios
      .get(`${PAYNET_BASE_URL}/api/user/balance`, {
        headers: { Authorization: "Bearer " + token },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!controller.signal.aborted) setBalance(data.balance);
      })
      .catch(() => {
        if (!controller.signal.aborted) setBalanceError(true);
      });
    return () => controller.abort();
  }, [token, key]);

  useEffect(() => {
    drawer.current?.close();
  }, [key]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function closeOnDesktop(event) {
      if (event.matches) drawer.current?.close();
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function openMenu() {
    drawer.current.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    drawer.current.close();
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="paynet-shell">
      <header className="paynet-header">
        <button
          ref={trigger}
          type="button"
          className="paynet-menu-button lg:hidden"
          aria-label="فتح القائمة"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="paynet-drawer"
          onClick={openMenu}
        >
          <Menu aria-hidden="true" />
        </button>
        <Link
          to={session.role === "user-point" ? "/HomePoint" : "/"}
          className="font-bold text-violet-700"
        >
          PayNet
        </Link>
        <div className="min-w-0 ms-auto text-sm text-end">
          {session.email && (
            <bdi className="block truncate font-semibold" title={session.email}>
              {session.email}
            </bdi>
          )}
          <span className="text-slate-600">
            الرصيد :{" "}
            {balanceError ? (
              "غير متاح"
            ) : balance == null ? (
              "…"
            ) : (
              <>
                <bdi>{Number(balance).toFixed(2)}</bdi> ل.س
              </>
            )}
          </span>
        </div>
      </header>
      <div className="paynet-body">
        <aside className="paynet-sidebar hidden lg:block">
          <Navigation role={session.role} onLogout={logout} />
        </aside>
        <div className="paynet-content">
          <main id="main-content" className="paynet-main">
            <Suspense key={pathname} fallback={<PageLoading />}>
              <div className="paynet-page-enter">
                <Outlet />
              </div>
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
      <dialog
        ref={drawer}
        id="paynet-drawer"
        className="paynet-drawer"
        aria-labelledby="paynet-drawer-title"
        onClose={() => {
          setMenuOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 id="paynet-drawer-title" className="font-bold">
            القائمة
          </h2>
          <button
            type="button"
            className="paynet-menu-button"
            aria-label="إغلاق القائمة"
            onClick={closeMenu}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <Navigation
          role={session.role}
          onSelect={closeMenu}
          onLogout={logout}
        />
      </dialog>
    </div>
  );
}
