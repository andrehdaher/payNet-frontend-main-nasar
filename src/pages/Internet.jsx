import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import tasded from "../assets/tasded.png";
import iptv from "../assets/iptv.png";
import baka from "../assets/baka.png";
import astfham from "../assets/astfham.webp";
import astalam from "../assets/astalam.png";
import ADSL from "../assets/tasded.png";
import elictric from "../assets/electric.png";
import water from "../assets/water.png";
import SYRIATEL from "../assets/SYRIATEL.jpeg";
import MTN from "../assets/MTN.jpeg";
import playImage from "../assets/play.jpeg";
import viewAppImage from "../assets/viewapp.jpeg";
import aiImage from "../assets/AI.jpeg";
import softwareImage from "../assets/inv.jpeg";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";
import EmptyState from "../components/Custom/EmptyState";
import PlayDetails from "../components/payInternet/PlayDetails";
import ProWaveProductsDetails from "../components/payInternet/ProWaveProductsDetails";
import ApplicationDetails from "../components/payInternet/ApplicationDetails";
import Usdtpay from "../components/payInternet/Usdtpay";
import ViewApp from "../components/payInternet/ViewApp";
import AI from "../components/payInternet/AI";
import programes from "../components/payInternet/programes";
import { ENABLE_ALESO_PRODUCTS } from "../config/features";

const ITEMS_PER_LOAD = 12;

const SECTION_CONTENT = {
  ADSL: {
    title: "خدمات الإنترنت",
    description: "اختر بين تسديد الفواتير، الاستعلام، IPTV، أو شحن الباقات.",
    tag: "إنترنت",
  },
  PHONE: {
    title: "خدمات الهاتف الأرضي",
    description: "تابع تسديد أو استعلام فواتير الهاتف الأرضي من مكان واحد.",
    tag: "هاتف",
  },
  ELEC: {
    title: "الكهرباء والمياه",
    description: "اختر نوع الفاتورة المطلوبة وتابع عملية التسديد بوضوح.",
    tag: "مرافق",
  },
  SYR: {
    title: "سيريتل و MTN",
    description: "خدمات التحويل والفواتير لشركات الاتصالات المتاحة لحسابك.",
    tag: "اتصالات",
  },
  play: {
    title: "قسم الألعاب",
    description: "اختر اللعبة أو نوع الشحن المناسب ثم تابع إلى المنتجات والأسعار.",
    tag: "ألعاب",
  },
  "prowave-products": {
    title: "البطاقات الرقمية",
    description: "تصفح بطاقات Steam وPlayStation وGoogle Play وباقي المنتجات الرقمية حسب المنصة.",
    tag: "رقمي",
  },
  application: {
    title: "تطبيقات المحادثة",
    description: "اختر التطبيق المطلوب للوصول إلى باقات الشحن والاشتراكات.",
    tag: "تطبيقات",
  },
  usdtpay: {
    title: "الدفع الإلكتروني",
    description: "خدمات شحن وتحويل المحافظ الإلكترونية والعملات الرقمية.",
    tag: "محافظ",
  },
  viewapp: {
    title: "تطبيقات المشاهدة",
    description: "اشتراكات وخدمات منصات المشاهدة المتاحة ضمن حسابك.",
    tag: "مشاهدة",
  },
  ai: {
    title: "قسم الذكاء الاصطناعي",
    description: "اشتراكات وأدوات الذكاء الاصطناعي المتاحة للشراء أو التجديد.",
    tag: "AI",
  },
  Software: {
    title: "البرامج والتطبيقات",
    description: "برامج محاسبة وتطبيقات عملية للكمبيوتر والهاتف.",
    tag: "برامج",
  },
};

const DEFAULT_SECTION = {
  title: "اختيار الخدمة",
  description: "اختر نوع العملية المطلوبة للمتابعة إلى نموذج الدفع أو الشراء.",
  tag: "خدمة",
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .trim();

const getFormTypeText = (formType) => {
  if (!formType) return "";
  if (typeof formType === "string") return formType;

  return [
    formType.title,
    formType.itemGroup,
    formType.provider,
    formType.mode,
    formType.game,
  ].filter(Boolean).join(" ");
};

const getServiceGroup = (service) =>
  service.group || service.tag || service.meta || "خدمات";

const getServiceSearchText = (service) =>
  normalizeText(
    [
      service.title,
      service.description,
      service.buttonText,
      service.group,
      service.tag,
      service.meta,
      getFormTypeText(service.formType),
    ].filter(Boolean).join(" ")
  );

const getServiceKey = (service, index) => {
  const formTypeText = getFormTypeText(service.formType);
  return `${service.title || "service"}-${formTypeText || index}`;
};

const decorateServices = (services, section, metaFallback = "") =>
  services.map((service) => ({
    ...service,
    tag: service.tag || service.group || section.tag,
    meta: service.meta || service.group || metaFallback,
  }));

const createAlesoServiceCard = ({
  title,
  section,
  description,
  image,
  group,
  meta,
  navigate,
}) => ({
  title,
  formType: {
    provider: "aleso",
    alesoSection: section,
    section,
    title,
    image,
  },
  description,
  buttonText: "عرض منتجات Aleso",
  Action: (state) => navigate("/payapp", { state }),
  image,
  imageFit: "contain",
  group,
  tag: "Aleso",
  meta,
});

const optionalAlesoCard = (card) => (ENABLE_ALESO_PRODUCTS ? [card] : []);

export default function Internet() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = typeof location.state === "string" ? location.state : "";
  const section = SECTION_CONTENT[serviceType] || DEFAULT_SECTION;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const playDetails = PlayDetails();
  const proWaveProductDetails = ProWaveProductsDetails();
  const applicationDetails = ApplicationDetails();
  const usdtpayDetails = Usdtpay();
  const viewAppDetails = ViewApp();
  const aiDetails = AI();
  const softwareDetails = programes();
  const alesoPlayCard = createAlesoServiceCard({
    title: "Aleso - قسم الألعاب",
    section: "play",
    description: "منتجات وشحن ألعاب من Aleso حسب توفر المزود.",
    image: playImage,
    group: "Aleso",
    meta: "ألعاب",
    navigate,
  });
  const alesoViewAppCard = createAlesoServiceCard({
    title: "Aleso - تطبيقات المشاهدة",
    section: "viewapp",
    description: "اشتراكات مشاهدة وترفيه من Aleso.",
    image: viewAppImage,
    group: "Aleso",
    meta: "مشاهدة",
    navigate,
  });
  const alesoAiCard = createAlesoServiceCard({
    title: "Aleso - الذكاء الاصطناعي",
    section: "ai",
    description: "اشتراكات وأدوات ذكاء اصطناعي من Aleso.",
    image: aiImage,
    group: "Aleso",
    meta: "AI",
    navigate,
  });
  const alesoSoftwareCard = createAlesoServiceCard({
    title: "Aleso - البرامج والتطبيقات",
    section: "software",
    description: "VPN وبرامج تصميم ولغات وأدوات كمبيوتر من Aleso.",
    image: softwareImage,
    group: "Aleso",
    meta: "برامج",
    navigate,
  });
  const alesoDigitalCardsCard = createAlesoServiceCard({
    title: "Aleso - بطاقات رقمية",
    section: "digital_cards",
    description: "بطاقات Steam وPlayStation وiTunes من Aleso.",
    image: softwareImage,
    group: "Aleso",
    meta: "بطاقات رقمية",
    navigate,
  });

  const serviceCollections = {
    ADSL: decorateServices([
      {
        title: "استعلام عن فاتورة",
        formType: "astalam",
        description: "استعلام عن قيمة فاتورة الإنترنت قبل التسديد.",
        buttonText: "استعلام عن فاتورة",
        Action: (formType) => navigate("/astalam", { state: formType }),
        image: astfham,
        group: "استعلام",
      },
      {
        title: "تسديد فاتورة",
        formType: "ADSL",
        description: "تسديد فاتورة إنترنت وإضافة رصيد.",
        buttonText: "تسديد فاتورة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: tasded,
        group: "فواتير",
      },
      {
        title: "تسديد IPTV",
        formType: "IPTV",
        description: "تسديد خدمة IPTV بسرعة وأمان.",
        buttonText: "إضافة رصيد",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: iptv,
        group: "IPTV",
      },
      {
        title: "شحن باقة",
        formType: "RECHARGE",
        description: "شحن باقة إنترنت بسرعة وأمان.",
        buttonText: "شحن باقة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: baka,
        group: "باقات",
      },
    ], SECTION_CONTENT.ADSL),
    PHONE: decorateServices([
      {
        title: "تسديد فاتورة الأرضي",
        formType: "PHONE",
        description: "تسديد فاتورة الهاتف الأرضي بسرعة وأمان.",
        buttonText: "تسديد فاتورة الأرضي",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: ADSL,
        group: "فواتير",
      },
      {
        title: "استعلام عن الفاتورة",
        description: "استعلام عن الفاتورة قبل التسديد.",
        buttonText: "استعلام عن الفاتورة",
        Action: () => window.open("http://tarassul.sy/#BPKCMCOF", "_blank"),
        image: astalam,
        group: "استعلام",
      },
    ], SECTION_CONTENT.PHONE),
    ELEC: decorateServices([
      {
        title: "تسديد فاتورة كهرباء",
        formType: "ELEC",
        description: "تسديد فاتورة الكهرباء في جميع المحافظات.",
        buttonText: "تسديد فاتورة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: elictric,
        group: "كهرباء",
      },
      {
        title: "تسديد فاتورة المياه",
        formType: "WATER",
        description: "تسديد فاتورة المياه في جميع المحافظات.",
        buttonText: "تسديد فاتورة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: water,
        group: "مياه",
      },
    ], SECTION_CONTENT.ELEC),
    SYR: decorateServices([
      {
        title: "تحويل وحدات سيريتل",
        formType: "SYR",
        description: "تحويل وحدات وفواتير سيريتل وسيريتل كاش.",
        buttonText: "متابعة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: SYRIATEL,
        group: "سيريتل",
      },
      {
        title: "تحويل وحدات MTN",
        formType: "MTN",
        description: "تحويل وحدات وفواتير MTN و MTN كاش.",
        buttonText: "متابعة",
        Action: (formType) => navigate("/payinternet", { state: formType }),
        image: MTN,
        group: "MTN",
      },
    ], SECTION_CONTENT.SYR),
    play: decorateServices([...optionalAlesoCard(alesoPlayCard), ...playDetails], SECTION_CONTENT.play, "شحن ألعاب"),
    "prowave-products": decorateServices([...optionalAlesoCard(alesoDigitalCardsCard), ...proWaveProductDetails], SECTION_CONTENT["prowave-products"], "بطاقات رقمية"),
    application: decorateServices(applicationDetails, SECTION_CONTENT.application, "تطبيق محادثة"),
    usdtpay: decorateServices(usdtpayDetails, SECTION_CONTENT.usdtpay, "دفع إلكتروني"),
    viewapp: decorateServices([...optionalAlesoCard(alesoViewAppCard), ...viewAppDetails], SECTION_CONTENT.viewapp, "اشتراك مشاهدة"),
    ai: decorateServices([...optionalAlesoCard(alesoAiCard), ...aiDetails], SECTION_CONTENT.ai, "ذكاء اصطناعي"),
    Software: decorateServices([...optionalAlesoCard(alesoSoftwareCard), ...softwareDetails], SECTION_CONTENT.Software, "برامج"),
  };

  const services = serviceCollections[serviceType] || [];
  const normalizedSearchTerm = normalizeText(searchTerm);
  const groups = Array.from(new Set(services.map(getServiceGroup))).filter(Boolean);
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !normalizedSearchTerm || getServiceSearchText(service).includes(normalizedSearchTerm);
    const matchesGroup = selectedGroup === "all" || getServiceGroup(service) === selectedGroup;

    return matchesSearch && matchesGroup;
  });
  const visibleServices = filteredServices.slice(0, visibleCount);
  const remainingCount = Math.max(filteredServices.length - visibleServices.length, 0);
  const hasActiveFilters = Boolean(searchTerm.trim()) || selectedGroup !== "all";

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [normalizedSearchTerm, selectedGroup, serviceType]);

  useEffect(() => {
    setSearchTerm("");
    setSelectedGroup("all");
    setVisibleCount(ITEMS_PER_LOAD);
  }, [serviceType]);

  return (
    <ScreenWrapper>
      <PageHeader
        title={section.title}
        description={section.description}
        onBack={() => navigate("/")}
        stats={[
          { label: "كل الخيارات", value: services.length },
          { label: "نتائج العرض", value: filteredServices.length },
          { label: "المعروضة الآن", value: visibleServices.length },
        ]}
      />

      {services.length > 0 && (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" dir="rtl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-violet-700" aria-hidden="true" />
            أدوات العرض
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative">
              <Input
                id="internet-service-search"
                type="text"
                label="البحث"
                placeholder="ابحث باسم الخدمة أو المنصة أو نوع العملية..."
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
              <label htmlFor="internet-service-group" className="block text-sm font-semibold text-slate-700">
                التصنيف
              </label>
              <select
                id="internet-service-group"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={selectedGroup}
                onChange={(event) => setSelectedGroup(event.target.value)}
              >
                <option value="all">كل التصنيفات</option>
                {groups.map((group) => (
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
                عرض {filteredServices.length} من أصل {services.length} خيار
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

      {services.length === 0 ? (
        <EmptyState
          title="لا توجد خدمات في هذا القسم"
          description="ارجع إلى الصفحة الرئيسية واختر قسمًا آخر."
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
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" dir="rtl">
            {visibleServices.map((service, index) => (
              <ServiceCard
                key={getServiceKey(service, index)}
                onClick={() => service.Action?.(service.formType)}
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

          {remainingCount > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="w-full max-w-xs"
                onClick={() => setVisibleCount((current) => current + ITEMS_PER_LOAD)}
              >
                تحميل المزيد ({remainingCount})
              </Button>
            </div>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}
