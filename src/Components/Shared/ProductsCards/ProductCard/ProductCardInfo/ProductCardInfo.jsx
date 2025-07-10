import { useTranslation } from "react-i18next";
import RateStars from "../../../MidComponents/RateStars/RateStars";
import ProductColors from "../../../MiniComponents/ProductColors/ProductColors";
import s from "./ProductCardInfo.module.scss";

const ProductCardInfo = ({ product, showColors, navigateToProductDetails }) => {
  // Debug: Log received product
  // console.log("ProductCardInfo received product:", product);
  
  // Safe destructuring với fallback values
  const {
    Title: shortName = "Sản phẩm không có tên",
    Price: price = 0,
    Discount: discount = 0,
    AfterDiscount: afterDiscount = 0,
    Rate: rate = 0,
    Votes: votes = 0,
    Colors: colors = [],
  } = product || {};

  const { t } = useTranslation();

  // Debug: Log destructured values
  // console.log("ProductCardInfo destructured values:", {
  //   shortName,
  //   price,
  //   discount,
  //   afterDiscount,
  //   rate,
  //   votes,
  //   colors
  // });

  // Handle translation với fallback
  const translatedProductName = shortName ? t(shortName) : "Sản phẩm";

  // Format price display
  const formatPrice = (priceValue) => {
    if (!priceValue || priceValue === 0) return "0";
    return parseFloat(priceValue).toFixed(2);
  };

  return (
    <section className={s.productInfo}>
      <strong className={s.productName}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigateToProductDetails();
          }}
        >
          {translatedProductName}
        </a>
      </strong>

      <div className={s.price}>
        <span className={s.currentPrice}>
          ${formatPrice(afterDiscount || price)}
        </span>
        {discount > 0 && price > afterDiscount && (
          <del className={s.originalPrice}>
            ${formatPrice(price)}
          </del>
        )}
      </div>

      <div className={s.rateContainer}>
        <RateStars rate={rate || 0} />
        <span className={s.numOfVotes}>
          ({votes || 0})
        </span>
      </div>

      {showColors && colors && colors.length > 0 && (
        <div className={s.colors}>
          <ProductColors colors={colors} />
        </div>
      )}
    </section>
  );
};

export default ProductCardInfo;