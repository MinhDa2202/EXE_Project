import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../Shared/ProductsCards/ProductCard/ProductCard";
import s from "./ProductsCategory.module.scss";

const ProductsCategory = ({ categoryName, customization }) => {
  const { t } = useTranslation();
  const { allProducts } = useSelector((state) => state.products);

  // The API response does not contain 'category', so this will need adjustment.
  // For now, I'll simulate the logic. This needs to be fixed once the API provides category data.
  const categoryProducts = allProducts.filter(
    (product) => true // Placeholder for category check
  );
  const hasProducts = categoryProducts.length > 0;

  if (!hasProducts)
    return (
      <div className={s.notFoundMessage}>
        <p>{t("common.weDontHaveProducts")}</p>
        <p>
          {t("common.backTo")} <Link to="/">{t("common.home")}</Link>
        </p>
      </div>
    );

  return (
    <div className={s.products}>
      {categoryProducts?.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          customization={customization}
        />
      ))}
    </div>
  );
};
export default ProductsCategory;
