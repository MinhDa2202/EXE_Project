import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle";
import s from "./ThisMonthSection.module.scss";

const ThisMonthSection = () => {
  const { t } = useTranslation();
  const thisMonthSection = "sectionTitles.thisMonthSection";
  const { allProducts } = useSelector((state) => state.products);

  function filterThisMonthProducts() {
    // Placeholder: Show the 8 highest-rated products as "Best Selling"
    return [...allProducts]
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8);
  }

  return (
    <section className={s.thisMonthSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${thisMonthSection}.title`)}
          sectionName={t(`${thisMonthSection}.bestSelling`)}
        />

        <Link to="/products" className={s.viewAllBtn}>
          {t("buttons.viewAll")}
        </Link>
      </div>

      <ProductsSlider filterFun={filterThisMonthProducts} loading="lazy" />
    </section>
  );
};
export default ThisMonthSection;
