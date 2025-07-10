// src/Components/Home/TodaySection/TodaySection.jsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useProducts from "src/Hooks/App/useProducts";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import SkeletonCards from "../../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import EventCounter from "./EventCounter";
import s from "./TodaySection.module.scss";

const TodaySection = () => {
  const todaysSection = "sectionTitles.todaysSection";
  const { t } = useTranslation();
  const { products, error } = useProducts("loadingTodayProducts");
  const { loadingTodayProducts } = useSelector((state) => state.loading);

  // Filter function cho flash sales - products có sold > 100
  const filterFlashSalesProducts = () => {
    return products.filter((product) => product.sold > 100);
  };

  return (
    <section className={s.todaysSection} id="todays-section">
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${todaysSection}.title`)}
          sectionName={t(`${todaysSection}.flashSales`)}
        />
        <EventCounter eventName="flash-sales" timeEvent="3 23 19 56" />
      </div>

      {/* Show error message if API call fails */}
      {error && (
        <div className={s.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {/* Show skeleton loader while loading */}
      {loadingTodayProducts && (
        <div className={s.skeletonWrapper}>
          <SkeletonCards numberOfCards={6} />
        </div>
      )}

      {/* Show products slider when data is loaded */}
      {!loadingTodayProducts && !error && products.length > 0 && (
        <ProductsSlider 
          filterFun={filterFlashSalesProducts} 
          loading="lazy" 
          customization={{
            stopHover: false,
            showDiscount: true,
            showFavIcon: true,
            showDetailsIcon: true,
            showRemoveIcon: false,
            showNewText: true,
            showWishList: true,
            showColors: false,
          }}
        />
      )}

      {/* Show message when no products found */}
      {!loadingTodayProducts && !error && products.length === 0 && (
        <div className={s.noProducts}>
          <p>Không có sản phẩm flash sale nào.</p>
        </div>
      )}

      <Link to="/products" className={s.viewProductsBtn}>
        {t("buttons.viewAllProducts")}
      </Link>
    </section>
  );
};

export default TodaySection;