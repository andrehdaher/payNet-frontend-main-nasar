import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";
import EmptyState from "../components/Custom/EmptyState";
import Alert from "../components/Custom/Alert";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import { useNotification } from "../context/NotificationContext";
import { HOME_SERVICE_GROUPS, HOME_SERVICES } from "../config/homeServices";
import { apiUrl } from "../config/api";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .trim();

const getServiceSearchText = (service) =>
  normalizeText(
    [
      service.title,
      service.description,
      service.buttonText,
      service.group,
      service.tag,
      service.meta,
      service.service,
    ].filter(Boolean).join(" ")
  );

const isServiceEnabled = (service, cardKey = {}) =>
  cardKey[service.cardKey] === true ||
  (service.fallbackCardKey && cardKey[service.fallbackCardKey] === true);

function ServiceGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="جاري تحميل الخدمات">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-10 animate-pulse rounded-md bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { setHasNewUnpaid } = useNotification();
  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : null;
  const email = decoded?.email || "";
  const [userCards, setUserCards] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [reloadSignal, setReloadSignal] = useState(0);

  useEffect(() => {
    const newSocket = io(apiUrl(""));

    newSocket.on("connect", () => {
      newSocket.emit("financial", "done");
    });

    newSocket.on("json_message", (data) => {
      setHasNewUnpaid(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [setHasNewUnpaid]);

  useEffect(() => {
    let ignoreResponse = false;

    async function fetchUserCards() {
      if (!email || !token) {
        setUserCards(null);
        setIsLoadingUser(false);
        return;
      }

      try {
        setIsLoadingUser(true);
        setLoadError("");
        const response = await axios.get(
          apiUrl(`/api/user/get-user-by-email?email=${encodeURIComponent(email)}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!ignoreResponse) {
          setUserCards(response.data);
        }
      } catch (error) {
        if (!ignoreResponse) {
          setLoadError("تعذر تحميل الخدمات المفعلة لهذا الحساب. حاول مرة أخرى.");
          setUserCards(null);
        }
      } finally {
        if (!ignoreResponse) {
          setIsLoadingUser(false);
        }
      }
    }

    fetchUserCards();

    return () => {
      ignoreResponse = true;
    };
  }, [email, reloadSignal, token]);

  const enabledServices = useMemo(() => {
    const cardKey = userCards?.cardKey || {};

    return HOME_SERVICES
      .filter((service) => isServiceEnabled(service, cardKey))
      .sort((firstService, secondService) => (firstService.priority || 99) - (secondService.priority || 99));
  }, [userCards]);
  const availableGroups = useMemo(
    () => HOME_SERVICE_GROUPS.filter((group) =>
      enabledServices.some((service) => service.group === group),
    ),
    [enabledServices],
  );
  const normalizedSearchTerm = normalizeText(searchTerm);
  const filteredServices = useMemo(() => {
    return enabledServices.filter((service) => {
      const matchesSearch =
        !normalizedSearchTerm || getServiceSearchText(service).includes(normalizedSearchTerm);
      const matchesGroup = selectedGroup === "all" || service.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [enabledServices, normalizedSearchTerm, selectedGroup]);
  const hasActiveFilters = Boolean(searchTerm.trim()) || selectedGroup !== "all";

  useEffect(() => {
    if (selectedGroup !== "all" && !availableGroups.includes(selectedGroup)) {
      setSelectedGroup("all");
    }
  }, [availableGroups, selectedGroup]);

  return (
    <ScreenWrapper>
      <PageHeader
        title="الخدمات المتاحة"
        description={
          email
            ? `اختر الخدمة التي تريد تنفيذها. تظهر هنا الخدمات المفعلة لحساب ${email}.`
            : "اختر الخدمة التي تريد تنفيذها. تظهر هنا الخدمات المفعلة لحسابك فقط."
        }
        stats={[
          { label: "الخدمات المفعلة", value: isLoadingUser ? "..." : enabledServices.length },
          { label: "نتائج العرض", value: isLoadingUser ? "..." : filteredServices.length },
          { label: "التصنيفات", value: isLoadingUser ? "..." : availableGroups.length },
        ]}
      />

      {loadError && (
        <Alert type="error" className="mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{loadError}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setReloadSignal((current) => current + 1)}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              تحديث
            </Button>
          </div>
        </Alert>
      )}

      {!isLoadingUser && enabledServices.length > 0 && (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" dir="rtl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-violet-700" aria-hidden="true" />
            أدوات العرض
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative">
              <Input
                id="home-service-search"
                type="text"
                label="البحث"
                placeholder="ابحث عن خدمة أو تصنيف..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-12 pr-10"
              />
              <Search className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 text-slate-400" aria-hidden="true" />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 left-1 h-9 w-9"
                  onClick={() => setSearchTerm("")}
                  aria-label="مسح البحث"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>

            <div className="space-y-1 text-right">
              <label htmlFor="home-service-group" className="block text-sm font-semibold text-slate-700">
                التصنيف
              </label>
              <select
                id="home-service-group"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={selectedGroup}
                onChange={(event) => setSelectedGroup(event.target.value)}
              >
                <option value="all">كل التصنيفات</option>
                {availableGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
              <p className="text-sm font-semibold text-slate-700">
                عرض {filteredServices.length} من أصل {enabledServices.length} خدمة
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGroup("all");
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                مسح التصفية
              </Button>
            </div>
          )}
        </section>
      )}

      {isLoadingUser ? (
        <ServiceGridSkeleton />
      ) : enabledServices.length === 0 ? (
        <EmptyState
          title="لا توجد خدمات مفعلة"
          description="لم يتم تفعيل أي بطاقات خدمة لهذا الحساب بعد. تواصل مع الإدارة لتفعيل الخدمات المطلوبة."
        />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج مطابقة"
          description="جرّب تغيير كلمة البحث أو التصنيف للوصول إلى الخدمة المطلوبة."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedGroup("all");
              }}
            >
              مسح البحث والفلاتر
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" dir="rtl">
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.service}
              onClick={() => navigate(service.route, { state: service.service })}
              title={service.title}
              description={service.description}
              image={service.image}
              imageFit={service.imageFit}
              actionLabel={service.buttonText}
              tag={service.tag}
              meta={service.meta}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
