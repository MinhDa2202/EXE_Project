import RateStars from "../../../MidComponents/RateStars/RateStars";
import ProductColors from "../../../MiniComponents/ProductColors/ProductColors";
import s from "./ProductCardInfo.module.scss";

const ProductCardInfo = ({ product, showColors, navigateToProductDetails }) => {
  const { name, price, discount, rate, votes, colors } = product;

  // In the future, if the API provides a discount, calculate the discounted price here.
  const afterDiscount = price * (1 - discount / 100);

  return (
    <section className={s.productInfo}>
      <strong className={s.productName}>
        <a href="#" onClick={() => navigateToProductDetails()}>
          {name}
        </a>
      </strong>

      <div className={s.price}>
        ${afterDiscount.toFixed(2)}
        {discount > 0 && <del className={s.afterDiscount}>${price}</del>}
      </div>

      <div className={s.rateContainer}>
        <RateStars rate={rate} />
        <span className={s.numOfVotes}>({votes})</span>
      </div>

      {showColors && (
        <div className={s.colors}>
          <ProductColors colors={colors} />
        </div>
      )}
    </section>
  );
};
export default ProductCardInfo;
