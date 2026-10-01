export const formatAlraghebNumber = (number) => Number(number).toLocaleString("en-US", { maximumFractionDigits: 8 });

export const getAlraghebQuantityLabel = (rules) => {
  if (rules?.mode === "fixed") return `كمية ثابتة: ${formatAlraghebNumber(rules.defaultQty)}`;
  if (rules?.mode === "choices") return rules.values.map(formatAlraghebNumber).join(" / ");
  if (rules?.mode === "range") return `${formatAlraghebNumber(rules.min)} - ${formatAlraghebNumber(rules.max)}`;
  return "الكمية قيد المراجعة";
};

export const getAlraghebFieldLabel = (label) => {
  const normalized = String(label).trim().toLowerCase();
  if (["please enter your user id", "please enter the user id", "player id"].includes(normalized)) return "معرّف الحساب";
  if (["please enter your zone id", "please enter your zone"].includes(normalized)) return "معرّف المنطقة";
  return label;
};

export const getAlraghebCategoryLabel = (product) => product.category_id === 1 ? "تطبيقات مباشرة" : product.category_name;
export const getAlraghebTypeLabel = (product) => product.product_type === "amount" ? "شحن حسب الكمية" :
  product.product_type === "package" ? "باقة" : product.product_type === "specificPackage" ? "كميات محددة" : "منتج";

export const alraghebCatalogPath = (categoryId = 1) => categoryId === 1 ? "/chat-apps" : `/chat-apps?category=${categoryId}`;
