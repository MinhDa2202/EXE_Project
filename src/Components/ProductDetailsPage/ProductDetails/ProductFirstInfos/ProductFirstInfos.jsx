import { useTranslation } from "react-i18next";
import RateStars from "../../../Shared/MidComponents/RateStars/RateStars";
import s from "./ProductFirstInfos.module.scss";

const ProductFirstInfos = ({ productData }) => {
  const { name, description, price, votes, rate } = productData;
  const { t } = useTranslation();

  // Format description by replacing newlines with <br> tags
  const formattedDescription = description.replaceAll('\n', '<br />');

  return (
    <section className={s.firstInfos}>
      <h2 className={s.productName}>{name}</h2>

      <div className={s.rateAndReviews}>
        <RateStars rate={rate} />
        <span className={s.reviews}>{t("detailsPage.reviews", { votes })}</span>

        <div className={s.verticalLine} />

        <span className={s.greenText}>{t("detailsPage.inStock")}</span>
      </div>

      <span className={s.price} aria-label={`Price: $${price}`}>
        ${price}
      </span>

      <p
        className={s.description}
        dangerouslySetInnerHTML={{ __html: formattedDescription }}
      />
    </section>
  );
};
export default ProductFirstInfos;
