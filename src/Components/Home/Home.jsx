import { Helmet } from "react-helmet-async";
import { productImg1 } from "src/Assets/Images/Images";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import CategoriesSection from "./CategoriesSection/CategoriesSection";
import s from "./Home.module.scss";
import MainSlider from "./Introduction/MainSlider/MainSlider";
import ProductPoster from "./ProductPoster/ProductPoster";
import ThisMonthSection from "./ThisMonthSection/ThisMonthSection";
import TodaySection from "./TodaySection/TodaySection";
import CompareSection from "./CompareSection/CompareSection";
import ProductAnalyzerSection from "./ProductAnalyzerSection/ProductAnalyzerSection";

const Home = () => {
  useScrollOnMount();

  return (
    <>
      <Helmet>
        <title>Recloop Mart</title>
        <meta
          name="description"
          content="Your ultimate destination for effortless online shopping. Discover curated collections, easily add items to your cart and wishlist,and enjoy detailed product descriptions with captivating previews. Experience convenience like never before with our intuitive interface. Shop smarter with us today."
        />
        <link ref="preload" as="image" type="image/webp" href={productImg1} />
      </Helmet>

      <main className={s.home}>
        <div className={s.container}>
          <div className={s.introductionContainer}>
            <div className={s.line} />

            <MainSlider />
          </div>

          <TodaySection />
          <CategoriesSection />
          <ThisMonthSection />
          <ProductPoster />
          
          <div className={s.featuresContainer}>
            <CompareSection />
            <ProductAnalyzerSection />
          </div>

          {/* <OurProductsSection /> */}
        </div>
      </main>
    </>
  );
};

export default Home;
