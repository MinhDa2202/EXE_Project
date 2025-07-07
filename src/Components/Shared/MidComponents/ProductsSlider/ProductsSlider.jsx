import { useRef } from "react";
import { useSelector } from "react-redux";
import { shouldDisplaySliderButtons } from "src/Functions/conditions";
import useSlider from "src/Hooks/App/useSlider";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard";
import s from "./ProductsSlider.module.scss";
import SliderButtons from "./SliderButtons/SliderButtons";
import SpinnerLoading from "../../Loaders/SpinnerLoading";

const ProductsSlider = ({
  filterFun = (products) => products,
  customization,
}) => {
  const {
    allProducts,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.products);

  const filteredProducts = filterFun(allProducts);
  const sliderRef = useRef();
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);
  const { windowWidth } = useGetResizeWindow();

  const shouldDisplayButtons = shouldDisplaySliderButtons(
    windowWidth,
    filteredProducts
  );

  if (productsLoading === 'loading') return <SpinnerLoading />;
  if (error) return <p>Error: {error}</p>;
  if (filteredProducts.length === 0) return null; // Don't render anything if there are no products

  return (
    <>
      {shouldDisplayButtons && (
        <SliderButtons
          handleNextBtn={handleNextBtn}
          handlePrevBtn={handlePrevBtn}
        />
      )}

      <div className={s.productsSlider} ref={sliderRef} dir="ltr">
        {filteredProducts.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            customization={customization}
            loading={productsLoading === 'loading'}
          />
        ))}
      </div>
    </>
  );
};

export default ProductsSlider;
