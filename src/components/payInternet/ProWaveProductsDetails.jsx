import { useNavigate } from "react-router-dom";
import { PROWAVE_PRODUCT_CATEGORIES } from "../../config/prowaveProducts";
import { getProWaveGroupImage } from "../../config/prowaveImages";

export default function ProWaveProductsDetails() {
  const navigate = useNavigate();

  return PROWAVE_PRODUCT_CATEGORIES.map((category) => ({
    title: category.title,
    formType: {
      provider: "prowave",
      itemGroup: category.itemGroup,
      title: category.title,
      inputLabel: "أدخل رقم الواتساب لاستلام الكود",
    },
    description: category.description,
    buttonText: "عرض المنتجات",
    Action: (state) => navigate("/payapp", { state }),
    image: getProWaveGroupImage(category.itemGroup),
    imageFit: "contain",
    group: category.group || "بطاقات رقمية",
    tag: category.group || "رقمي",
    meta: category.itemGroup,
  }));
}
