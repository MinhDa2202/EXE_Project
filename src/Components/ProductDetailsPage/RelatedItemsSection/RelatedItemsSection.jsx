import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import s from "./RelatedItemsSection.module.scss";

const RelatedItemsSection = ({ productType, currentProduct }) => {
  const { allProducts } = useSelector((state) => state.products);
  const { t } = useTranslation();

  function getProductsByRelatedType() {
    return allProducts.filter((product) => {
      // The API response does not contain 'category', so this will need adjustment.
      // For now, I'll simulate the logic. This needs to be fixed once the API provides category data.
      const isSameType = true; // Placeholder
      const isCurrentProduct = product.id === currentProduct.id;
      return isSameType && !isCurrentProduct;
    });
  }

  const relatedProducts = getProductsByRelatedType();
  const hasRelatedProducts = relatedProducts.length > 0;

  return (
    <section className={s.section}>
      <SectionTitle type={2} eventName={t("detailsPage.relatedItems")} />

      {!hasRelatedProducts && <p>No related items were found.</p>}

      {hasRelatedProducts && <ProductsSlider filterFun={() => relatedProducts} />}
    </section>
  );
};
export default RelatedItemsSection;
