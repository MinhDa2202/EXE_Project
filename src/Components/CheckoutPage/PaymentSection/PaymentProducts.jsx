import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./PaymentProducts.module.scss";

const PaymentProducts = ({ products }) => {
  const hasProducts = products.length > 0;
  const { t } = useTranslation();

  return (
    <div className={s.products}>
      {products.map(({ img, name, price, discount, id }) => {
        const priceAfterDiscount = price * (1 - discount / 100);

        return (
          <Link to={`/details?product=${name}`} key={id} className={s.product}>
            <div className={s.wrapper}>
              <img src={img} alt={name} />
              <span>{name}</span>
            </div>

            <span className={s.price}>${priceAfterDiscount.toFixed(2)}</span>
          </Link>
        );
      })}

      {!hasProducts && (
        <p className={s.hasNoProducts}>{t("checkoutPage.hasNoProducts")}</p>
      )}
    </div>
  );
};
export default PaymentProducts;
