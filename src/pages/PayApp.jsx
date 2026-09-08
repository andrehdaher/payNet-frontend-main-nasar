import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { appDetails } from "../components/payInternet/appDetails";
import AppCard from "../components/payInternet/CardApp";
import ScreenWrapper from "../components/ScreenWrapper";
import PurchaseModal from "../components/payInternet/PurchaseModal";
import ProWavePurchaseResultModal from "../components/payInternet/ProWavePurchaseResultModal";
import ProWaveDirectTopUpResultModal from "../components/payInternet/ProWaveDirectTopUpResultModal";
import PageHeader from "../components/Custom/PageHeader";
import EmptyState from "../components/Custom/EmptyState";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import { useToast } from "../context/ToastContext";
import {
  authConfig,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";
import {
  checkProWaveAvailability,
  createProWaveQuote,
  createProWaveDirectTopUpRequest,
  purchaseProWaveDigitalCard,
} from "../api/prowaveApi";
import { purchaseAlesoProduct } from "../api/alesoApi";
import {
  useProWaveDirectTopUpCatalog,
  useProWaveItems,
} from "../hooks/useProWave";
import { useAlesoProducts } from "../hooks/useAleso";
import {
  getProWaveItemsList,
  mapProWaveItemToCard,
  parseProWaveAvailability,
} from "../utils/prowaveProductMapper";
import {
  getAlesoItemsList,
  mapAlesoProductToCard,
} from "../utils/alesoProductMapper";
import {
  PROWAVE_GROUPS,
  buildProWaveDirectTopUpRouteState,
  getProWaveDirectTopUpGameByAlias,
} from "../config/prowaveGames";
import { getProWaveGroupImage } from "../config/prowaveImages";
import { apiUrl } from "../config/api";
import { ENABLE_ALESO_PRODUCTS } from "../config/features";

const INITIAL_VISIBLE_CARDS = 12;

const SORT_OPTIONS = [
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "name-asc", label: "الاسم: أ - ي" },
  { value: "name-desc", label: "الاسم: ي - أ" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "كل الحالات" },
  { value: "available", label: "المتوفرة" },
  { value: "unknown", label: "تحتاج تحقق" },
  { value: "unavailable", label: "غير المتوفرة" },
];

const MANUAL_DUPLICATE_FORM_TYPES = new Set(["NETFLIX", "CHATGPT", "GEMINI"]);

const shouldMarkManualSection = (formType) =>
  typeof formType === "string" &&
  MANUAL_DUPLICATE_FORM_TYPES.has(formType.trim().toUpperCase());

const withManualSuffix = (card, shouldMarkManual) => {
  if (!shouldMarkManual || !card?.title || card.title.includes("يدوي")) return card;

  return {
    ...card,
    title: `${card.title} (يدوي)`,
  };
};

const compactPayload = (payload) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
};

const normalizeSearchText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .trim();

const getCardSearchText = (card) =>
  normalizeSearchText(
    [
      card.title,
      card.name,
      card.itemCode,
      card.proWaveName,
      card.alesoProductId,
      card.categoryName,
      card.description,
      card.des,
      card.raw?.item_group,
      card.raw?.custom_item_group_name_ar,
      card.raw?.category_name,
      card.raw?.section_label,
    ].filter(Boolean).join(" ")
  );

const getCardName = (card) => String(card.title || card.name || "").trim();

const getCardPrice = (card) => {
  if (typeof card.price === "number") return Number.isFinite(card.price) ? card.price : 0;

  const numericPrice = Number(String(card.price || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const compareCardsByName = (firstCard, secondCard) =>
  getCardName(firstCard).localeCompare(getCardName(secondCard), "ar", {
    numeric: true,
    sensitivity: "base",
  });

const sortCards = (cards, sortOption) => {
  const sortedCards = [...cards];

  switch (sortOption) {
    case "price-desc":
      return sortedCards.sort((firstCard, secondCard) => getCardPrice(secondCard) - getCardPrice(firstCard));
    case "name-asc":
      return sortedCards.sort(compareCardsByName);
    case "name-desc":
      return sortedCards.sort((firstCard, secondCard) => compareCardsByName(secondCard, firstCard));
    case "price-asc":
    default:
      return sortedCards.sort((firstCard, secondCard) => getCardPrice(firstCard) - getCardPrice(secondCard));
  }
};

const matchesAvailabilityFilter = (card, availabilityFilter) => {
  if (availabilityFilter === "all") return true;

  const status = card.availabilityStatus || (card.isProWaveDirectTopUp ? "available" : "unknown");

  if (availabilityFilter === "available") {
    return status === "available" || card.isProWaveDirectTopUp;
  }

  if (availabilityFilter === "unavailable") {
    return status === "unavailable";
  }

  return status === "unknown" || (!status && card.isProWave);
};

function ProductsGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="جاري تحميل المنتجات">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-14 animate-pulse rounded-md bg-slate-100" />
            <div className="h-10 animate-pulse rounded-md bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

const getProWaveQuotePayload = (response) => {
  const payload = response?.source === "prowave" ? response.data : response?.data || response;
  return payload?.quote || payload;
};

const applyProWaveQuoteToProduct = (product, quote) => {
  if (!quote?.id) return product;

  const quotedPrice = Number(quote.total_amount_syp || 0);
  const quotedUnitUsd = Number(
    quote.paynet_sale_price_usd ||
      quote.sale_unit_price_usd ||
      quote.unit_price_usd ||
      0
  );

  return {
    ...product,
    price: quotedPrice || product.price,
    formattedPrice:
      quote.formatted_total_amount_syp ||
      (quotedPrice ? `${quotedPrice.toLocaleString("en-US")} ل.س` : product.formattedPrice),
    priceUsd: quotedUnitUsd || product.priceUsd,
    exchangeRate: Number(quote.exchange_rate || product.exchangeRate),
    marginPercent: Number(quote.margin_percent || product.marginPercent || 0),
    roundingStep: Number(quote.rounding_step || product.roundingStep || 1),
    quoteId: quote.id,
    quoteExpiresAt: quote.expires_at,
  };
};

const buildProWavePurchasePayload = ({ product, extra = {}, email, paymentType }) => {
  return compactPayload({
    item_code: product.itemCode,
    item_name: product.proWaveName || product.title,
    item_title: product.title,
    qty: 1,
    currency: "USD",
    prowave_currency: "USD",
    immediate_code_view: true,
    customer_identifier: extra.playerId,
    customer_contact: extra.playerId,
    playerId: extra.playerId,
    password: extra.password,
    email,
    paymentType,
    quote_id: product.quoteId,
    item_group: product.raw?.item_group,
  });
};

const buildProWaveDirectTopUpPayload = ({ product, extra = {}, email, paymentType }) => {
  const itemCode = product.itemCode || product.providerItemCode || product.rechargeCategory;

  return compactPayload({
    game: product.game,
    player_id: extra.playerId || extra.value,
    item_code: itemCode,
    currency: "USD",
    email,
    paymentType,
  });
};

const buildAlesoPurchasePayload = ({ product, extra = {}, email, paymentType }) => {
  return compactPayload({
    product_id: product.alesoProductId,
    qty: extra.quantity || product.quantityRules?.defaultQty || 1,
    params: compactPayload(extra.params || {}),
    email,
    paymentType,
    quote_id: product.quoteId,
  });
};

const getDirectTopUpImageGroup = (game) => {
  if (String(game || "").toLowerCase() === "free_fire") return "Free Fire Cards";
  return "PUBG Cards";
};

const getLegacyDirectTopUpAliasSource = (routeState) => {
  if (typeof routeState === "string") return routeState;
  if (!routeState || typeof routeState !== "object" || routeState.provider === "prowave") return "";

  return routeState.formType || routeState.game || routeState.title || "";
};

const mapDirectTopUpItemToCard = ({ item, routeState, formType }) => {
  const itemCode = item.item_code || item.provider_item_code || item.recharge_category;
  const rechargeCategory = item.recharge_category || itemCode;
  const title = item.title_ar || item.title || item.item_name || item.web_item_name || itemCode;
  const card = mapProWaveItemToCard({
    ...item,
    item_code: itemCode,
    item_name: title,
    web_item_name: title,
    custom_item_name_ar: title,
    item_group: formType,
  });

  return {
    ...card,
    title,
    name: itemCode,
    description: item.description || routeState?.title || "",
    image: getProWaveGroupImage(getDirectTopUpImageGroup(item.game || routeState?.game)),
    isProWaveDirectTopUp: true,
    itemCode,
    providerItemCode: item.provider_item_code || itemCode,
    rechargeCategory,
    game: item.game || routeState?.game,
    availabilityStatus: "available",
    availabilityMessage: "",
    btntext: "شحن مباشر",
    raw: item,
  };
};

export default function PayApp() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const rawRouteState = location.state;
  const legacyDirectTopUpGame = getProWaveDirectTopUpGameByAlias(
    getLegacyDirectTopUpAliasSource(rawRouteState)
  );
  const routeState = legacyDirectTopUpGame
    ? buildProWaveDirectTopUpRouteState(legacyDirectTopUpGame)
    : rawRouteState;
  const isProWaveRoute = routeState?.provider === "prowave";
  const isAlesoRequest = routeState?.provider === "aleso";
  const isAlesoRoute = ENABLE_ALESO_PRODUCTS && isAlesoRequest;
  const isAlesoDisabledRoute = isAlesoRequest && !ENABLE_ALESO_PRODUCTS;
  const isProWaveDirectTopUpRoute =
    isProWaveRoute && routeState?.mode === "direct-topup";
  const formType = isProWaveRoute || isAlesoRequest
    ? routeState.title || routeState.itemGroup
    : routeState;
  const proWaveRouteGroup = isProWaveRoute ? routeState.itemGroup : "";
  const proWaveInputLabel = isProWaveRoute ? routeState.inputLabel : "";
  const alesoSection = isAlesoRoute ? routeState.alesoSection || routeState.section : "";

  const config = appDetails[formType] || {};
  const multiplier = config.multiplier || 1;

  const normalizedFormType = String(formType || "").trim().toUpperCase();
  const proWaveGroup = proWaveRouteGroup || PROWAVE_GROUPS[normalizedFormType];
  const useProWaveProducts = !isAlesoRoute && Boolean(proWaveGroup) && !isProWaveDirectTopUpRoute;

  const [paymentType] = useState("cash");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [proWavePurchaseResult, setProWavePurchaseResult] = useState(null);
  const [proWaveDirectTopUpResult, setProWaveDirectTopUpResult] = useState(null);
  const [alesoPurchaseResult, setAlesoPurchaseResult] = useState(null);
  const [proWaveAvailability, setProWaveAvailability] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARDS);

  const productQuery = useQuery({
    queryKey: paymentQueryKeys.productOnline(formType),
    queryFn: async () => {
      const response = await axios.get(
        apiUrl(`/api/productonline/get-product-online?name=${formType}`)
      );

      return {
        card: response.data?.card?.[0] || [],
        placeholder: response.data?.products?.[0]?.type || "أدخل ID",
      };
    },
    enabled: Boolean(formType) && !useProWaveProducts && !isProWaveDirectTopUpRoute && !isAlesoRoute && !isAlesoDisabledRoute,
  });

  const {
    data: itemsData,
    isLoading: proWaveItemsLoading,
    isError: proWaveItemsIsError,
    error: proWaveItemsError,
  } = useProWaveItems(
    {
      item_group: proWaveGroup,
      page_index: 1,
      currency: "USD",
      ordered_by: "price",
      sort: "ASC",
    },
    {
      enabled: useProWaveProducts,
    }
  );

  const {
    data: directTopUpData,
    isLoading: directTopUpLoading,
    isError: directTopUpIsError,
    error: directTopUpError,
  } = useProWaveDirectTopUpCatalog(
    {
      game: routeState?.game,
      currency: "USD",
    },
    {
      enabled: isProWaveDirectTopUpRoute,
    }
  );

  const {
    data: alesoData,
    isLoading: alesoProductsLoading,
    isError: alesoProductsIsError,
    error: alesoProductsError,
  } = useAlesoProducts(
    {
      section: alesoSection,
    },
    {
      enabled: isAlesoRoute,
    }
  );

  const paymentMutation = useMutation({
    mutationFn: async ({ product, extra }) => {
      const email = getCurrentEmail();

      if (!email) {
        throw new Error("الرجاء تسجيل الدخول");
      }

      if (
        product?.isProWave &&
        !product?.isProWaveDirectTopUp &&
        product.availabilityStatus !== "available"
      ) {
        throw new Error("يرجى التحقق من توفر المنتج أولاً");
      }

      if (product?.isAleso && product.availabilityStatus === "unavailable") {
        throw new Error("هذا المنتج غير متوفر حاليا لدى Aleso");
      }

      if (product.isAleso) {
        const response = await purchaseAlesoProduct(
          buildAlesoPurchasePayload({ product, extra, email, paymentType })
        );

        return {
          provider: "aleso",
          product,
          response,
        };
      }

      if (product.isProWaveDirectTopUp) {
        const response = await createProWaveDirectTopUpRequest(
          buildProWaveDirectTopUpPayload({ product, extra, email, paymentType })
        );

        return {
          provider: "prowave-direct-topup",
          product,
          response,
        };
      }

      if (product.isProWave) {
        const response = await purchaseProWaveDigitalCard(
          buildProWavePurchasePayload({ product, extra, email, paymentType })
        );

        return {
          provider: "prowave",
          product,
          response,
        };
      }

      const calculatedAmount = Number((product.price * multiplier).toFixed(2));

      const response = await axios.post(
        apiUrl("/api/payment/internet-full"),
        {
          landline: product.isProWave ? extra?.playerId : product.name,
          company: product.title,
          speed: product.isProWave ? product.itemCode : product.url,
          amount: product.price,
          email,
          paymentType,
          calculatedAmount,

          provider: product.isProWave ? "prowave" : "local",
          item_code: product.isProWave ? product.itemCode : undefined,
          prowave_item_name: product.isProWave ? product.proWaveName : undefined,
          prowave_price_usd: product.isProWave ? product.priceUsd : undefined,
          prowave_price_without_discount_usd: product.isProWave
            ? product.oldPriceUsd
            : undefined,
          prowave_exchange_rate: product.isProWave
            ? product.exchangeRate
            : undefined,
          prowave_discount_percent: product.isProWave
            ? product.discountPercent
            : undefined,

          ...extra,
        },
        authConfig()
      );

      return {
        provider: "local",
        product,
        response: response.data,
      };
    },
    onSuccess: (result) => {
      if (result?.provider === "aleso") {
        toast.success(result?.response?.message || "تم إرسال طلب Aleso بنجاح");
        setShowModal(false);
        setSelectedProduct(null);
        setAlesoPurchaseResult(result);
        return;
      }

      if (result?.provider === "prowave-direct-topup") {
        toast.success("تم إرسال طلب الشحن المباشر بنجاح");
        setShowModal(false);
        setSelectedProduct(null);
        setProWaveDirectTopUpResult(result);
        return;
      }

      if (result?.provider === "prowave") {
        toast.success("تم شراء المنتج بنجاح");
        setShowModal(false);
        setSelectedProduct(null);
        setProWavePurchaseResult(result);
        return;
      }

      toast.success("تمت العملية بنجاح. ستصلك معلومات الطلب عبر الرسائل");
      setShowModal(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "حدث خطأ"));
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: async (product) => {
      const response = await checkProWaveAvailability(product.itemCode);
      const availability = parseProWaveAvailability(response);
      let quote = null;

      if (availability.isAvailable) {
        try {
          const quoteResponse = await createProWaveQuote({
            item_code: product.itemCode,
            item_name: product.proWaveName,
            item_title: product.title,
            qty: 1,
            currency: "USD",
          });
          quote = getProWaveQuotePayload(quoteResponse);
        } catch (error) {
          error.stage = "quote";
          error.availability = availability;
          throw error;
        }
      }

      return {
        product,
        availability,
        quote,
      };
    },
    onSuccess: ({ product, availability, quote }) => {
      setProWaveAvailability((current) => ({
        ...current,
        [product.itemCode]: availability,
      }));

      if (!availability.isAvailable) {
        toast.error(
          availability.message || "هذا المنتج غير متوفر حاليا"
        );
        return;
      }

      toast.success("المنتج متوفر");
      setSelectedProduct({
        ...applyProWaveQuoteToProduct(product, quote),
        inStock: true,
        availabilityStatus: "available",
        availabilityMessage: availability.message,
      });
      setShowModal(true);
    },
    onError: (error, product) => {
      const message = getApiErrorMessage(error, "فشل التحقق من التوفر");

      if (product?.itemCode) {
        setProWaveAvailability((current) => ({
          ...current,
          [product.itemCode]: {
            isAvailable: error?.stage === "quote" ? true : false,
            status: error?.stage === "quote" ? "available" : "unavailable",
            message: error?.availability?.message || message,
          },
        }));
      }

      toast.error(message);
    },
  });

  const placeholder = productQuery.data?.placeholder || "أدخل ID";

  const localCards = useMemo(
    () => (productQuery.data?.card || []).map((card) =>
      withManualSuffix(card, shouldMarkManualSection(formType))
    ),
    [formType, productQuery.data?.card]
  );

  const checkingItemCode = availabilityMutation.variables?.itemCode;
  const proWaveCards = useMemo(() => {
    if (!useProWaveProducts) return [];

    return getProWaveItemsList(itemsData).map((item) => {
      const card = mapProWaveItemToCard(item);
      const availability = proWaveAvailability[card.itemCode];
      const isCheckingAvailability =
        availabilityMutation.isPending &&
        checkingItemCode === card.itemCode;

      return {
        ...card,
        inStock: availability ? availability.isAvailable : true,
        availabilityStatus: availability?.status || card.availabilityStatus,
        availabilityMessage: availability?.message || "",
        isCheckingAvailability,
      };
    });
  }, [
    availabilityMutation.isPending,
    checkingItemCode,
    itemsData,
    proWaveAvailability,
    useProWaveProducts,
  ]);

  const directTopUpCards = useMemo(() => {
    if (!isProWaveDirectTopUpRoute) return [];

    return getProWaveItemsList(directTopUpData).map((item) =>
      mapDirectTopUpItemToCard({ item, routeState, formType })
    );
  }, [directTopUpData, formType, isProWaveDirectTopUpRoute, routeState]);

  const alesoCards = useMemo(() => {
    if (!isAlesoRoute) return [];

    return getAlesoItemsList(alesoData).map((item) =>
      mapAlesoProductToCard(item, routeState?.image || "")
    );
  }, [alesoData, isAlesoRoute, routeState?.image]);

  const cards = useMemo(() => {
    if (isAlesoDisabledRoute) return [];
    if (isAlesoRoute) return alesoCards;
    if (isProWaveDirectTopUpRoute) return directTopUpCards;
    if (useProWaveProducts) return proWaveCards;

    return localCards;
  }, [
    alesoCards,
    directTopUpCards,
    isAlesoDisabledRoute,
    isAlesoRoute,
    isProWaveDirectTopUpRoute,
    localCards,
    proWaveCards,
    useProWaveProducts,
  ]);

  const isProductsLoading = isAlesoDisabledRoute
    ? false
    : isAlesoRoute
    ? alesoProductsLoading
    : isProWaveDirectTopUpRoute
    ? directTopUpLoading
    : useProWaveProducts
    ? proWaveItemsLoading
    : productQuery.isLoading;

  const productsIsError = isAlesoDisabledRoute
    ? false
    : isAlesoRoute
    ? alesoProductsIsError
    : isProWaveDirectTopUpRoute
    ? directTopUpIsError
    : useProWaveProducts
    ? proWaveItemsIsError
    : productQuery.isError;

  const productsError = isAlesoDisabledRoute
    ? null
    : isAlesoRoute
    ? alesoProductsError
    : isProWaveDirectTopUpRoute
    ? directTopUpError
    : useProWaveProducts
    ? proWaveItemsError
    : productQuery.error;

  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const filteredCards = useMemo(() => {
    const matchingCards = cards.filter((card) => {
      const matchesSearch =
        !normalizedSearchTerm || getCardSearchText(card).includes(normalizedSearchTerm);

      return matchesSearch && matchesAvailabilityFilter(card, availabilityFilter);
    });

    return sortCards(matchingCards, sortOption);
  }, [availabilityFilter, cards, normalizedSearchTerm, sortOption]);
  const visibleCards = filteredCards.slice(0, visibleCount);
  const remainingCardsCount = Math.max(filteredCards.length - visibleCards.length, 0);
  const hasActiveFilters = Boolean(searchTerm.trim()) || availabilityFilter !== "all";
  const pageTitle =
    routeState?.title ||
    config.title ||
    (isProWaveDirectTopUpRoute
      ? "الشحن المباشر"
      : useProWaveProducts
        ? "المنتجات الرقمية"
        : "المنتجات");
  const pageDescription = isAlesoRoute
    ? "اختر المنتج المناسب من Aleso ثم أدخل البيانات المطلوبة لإرسال الطلب مباشرة."
    : isProWaveDirectTopUpRoute
      ? "اختر فئة الشحن المناسبة، ثم أدخل بيانات اللاعب لإرسال طلب الشحن."
      : useProWaveProducts
        ? "تصفح البطاقات الرقمية حسب السعر والتوفر، وتحقق من المنتج قبل إتمام الشراء."
        : "اختر المنتج المناسب وتابع بيانات الطلب قبل الإرسال.";

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARDS);
  }, [availabilityFilter, formType, normalizedSearchTerm, sortOption]);

  const getPlaceholder = () => {
    if (selectedProduct?.isProWaveDirectTopUp) {
      return proWaveInputLabel || "أدخل ID اللاعب";
    }

    if (selectedProduct?.isProWave) {
      return proWaveInputLabel || "أدخل ID اللاعب";
    }

    if (
      placeholder.includes("view") ||
      selectedProduct?.title?.includes("حساب جديد جاهز لمده شهر")
    ) {
      return "أدخل رقم الواتساب لإرسال معلومات الاستفسار";
    }

    if (selectedProduct?.title?.includes(" تجديد ")) {
      return "أدخل الإيميل";
    }

    return "أدخل ID الخاص بك";
  };

  return (
    <>
      <ProWavePurchaseResultModal
        open={Boolean(proWavePurchaseResult)}
        title="بيانات الكود"
        result={proWavePurchaseResult}
        onClose={() => setProWavePurchaseResult(null)}
      />
      <ProWavePurchaseResultModal
        open={Boolean(alesoPurchaseResult)}
        title="بيانات طلب Aleso"
        result={alesoPurchaseResult}
        onClose={() => setAlesoPurchaseResult(null)}
      />
      <ProWaveDirectTopUpResultModal
        open={Boolean(proWaveDirectTopUpResult)}
        result={proWaveDirectTopUpResult}
        onClose={() => setProWaveDirectTopUpResult(null)}
      />

      <PurchaseModal
        open={showModal}
        title={selectedProduct?.title}
        price={selectedProduct?.price}
        formattedPrice={selectedProduct?.formattedPrice}
        name={selectedProduct?.name}
        placeholder={getPlaceholder()}
        fields={selectedProduct?.isAleso ? selectedProduct.inputFields : []}
        showQuantity={Boolean(
          selectedProduct?.isAleso &&
          selectedProduct?.quantityRules?.mode &&
          selectedProduct.quantityRules.mode !== "fixed"
        )}
        quantityDefault={selectedProduct?.quantityRules?.defaultQty || 1}
        quantityMin={selectedProduct?.quantityRules?.min || 1}
        quantityMax={selectedProduct?.quantityRules?.max}
        quantityOptions={selectedProduct?.quantityRules?.values || []}
        priceIsUnit={Boolean(selectedProduct?.isAleso)}
        description={
          selectedProduct?.isAleso
            ? "أدخل بيانات المنتج كما يطلبها Aleso وسيتم إرسال الطلب مباشرة."
            : selectedProduct?.isProWaveDirectTopUp
            ? "أدخل ID اللاعب ليتم إنشاء طلب شحن مباشر لدى المزوّد."
            : selectedProduct?.isProWave
            ? "سيتم تنفيذ الشراء مباشرة وعرض الكود بعد نجاح العملية."
            : undefined
        }
        confirmText={
          selectedProduct?.isAleso
            ? "تأكيد الطلب"
            : selectedProduct?.isProWaveDirectTopUp
            ? "تأكيد الشحن"
            : selectedProduct?.isProWave
              ? "تأكيد الشراء"
              : undefined
        }
        showMainInput={
          selectedProduct?.isAleso
            ? false
            : selectedProduct?.isProWaveDirectTopUp
              ? true
              : !selectedProduct?.isProWave
        }
        loading={paymentMutation.isPending}
        onClose={() => {
          if (!paymentMutation.isPending) setShowModal(false);
        }}
        onConfirm={(value) =>
          paymentMutation.mutateAsync({
            product: selectedProduct,
            extra: selectedProduct?.isAleso
              ? {
                quantity: value.quantity,
                params: value.params || {},
              }
              : selectedProduct?.isProWaveDirectTopUp
              ? {
                playerId: value.value,
              }
              : selectedProduct?.isProWave
                ? {}
                : {
                playerId: value.value,
                password: value.password,
              },
          })
        }
      />

      <ScreenWrapper>
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          onBack={() => navigate(-1)}
          stats={[
            { label: "المنتجات المحملة", value: cards.length },
            { label: "نتائج العرض", value: filteredCards.length },
            { label: "المعروضة الآن", value: visibleCards.length },
          ]}
        />

        {productsIsError && (
          <div
            className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800"
            dir="rtl"
          >
            {getApiErrorMessage(productsError, "حدث خطأ أثناء جلب المنتجات")}
          </div>
        )}

        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" dir="rtl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-violet-700" aria-hidden="true" />
            أدوات العرض
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_220px]">
            <div className="relative">
              <Input
                id="payapp-product-search"
                type="text"
                label="البحث"
                placeholder="ابحث باسم المنتج أو الكود أو الفئة..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-12 pr-10"
                disabled={isProductsLoading}
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
              <label htmlFor="payapp-availability-filter" className="block text-sm font-semibold text-slate-700">
                الحالة
              </label>
              <select
                id="payapp-availability-filter"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
                value={availabilityFilter}
                disabled={isProductsLoading}
                onChange={(event) => setAvailabilityFilter(event.target.value)}
              >
                {AVAILABILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-right">
              <label htmlFor="payapp-sort" className="block text-sm font-semibold text-slate-700">
                الترتيب
              </label>
              <select
                id="payapp-sort"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
                value={sortOption}
                disabled={isProductsLoading}
                onChange={(event) => setSortOption(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
              <p className="text-sm font-semibold text-slate-700">
                عرض {filteredCards.length} من أصل {cards.length} منتج
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setAvailabilityFilter("all");
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                مسح التصفية
              </Button>
            </div>
          )}
        </section>

        {isProductsLoading ? (
          <ProductsGridSkeleton />
        ) : cards.length === 0 ? (
          <EmptyState
            title="لا توجد منتجات متاحة حاليًا"
            description="لم يتم العثور على منتجات ضمن هذا القسم في الوقت الحالي."
          />
        ) : filteredCards.length === 0 ? (
          <EmptyState
            title="لا توجد نتائج مطابقة"
            description="جرّب تغيير كلمة البحث أو حالة التوفر للوصول إلى المنتج المطلوب."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setAvailabilityFilter("all");
                }}
              >
                مسح البحث والفلاتر
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" dir="rtl">
              {visibleCards.map((item, index) => (
                <AppCard
                  key={item._id || item.id || index}
                  data={item}
                name={formType}
                onClick={(data) => {
                  if (data.isAleso) {
                    if (data.availabilityStatus === "unavailable") {
                      toast.error(data.availabilityMessage || "هذا المنتج غير متوفر حاليا لدى Aleso");
                      return;
                    }

                    setAlesoPurchaseResult(null);
                    setSelectedProduct(data);
                    setShowModal(true);
                    return;
                  }

                  if (data.isProWaveDirectTopUp) {
                    setProWaveDirectTopUpResult(null);
                    setSelectedProduct(data);
                    setShowModal(true);
                    return;
                  }

                  if (data.isProWave) {
                    setProWavePurchaseResult(null);
                    availabilityMutation.mutate(data);
                    return;
                  }

                  setSelectedProduct(data);
                  setShowModal(true);
                  }}
                />
              ))}
            </div>

            {remainingCardsCount > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full max-w-xs"
                  onClick={() => setVisibleCount((current) => current + INITIAL_VISIBLE_CARDS)}
                >
                  تحميل المزيد ({remainingCardsCount})
                </Button>
              </div>
            )}
          </>
        )}
      </ScreenWrapper>
    </>
  );
}
