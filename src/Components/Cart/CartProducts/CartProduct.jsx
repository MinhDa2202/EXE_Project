import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CustomNumberInput from "../../Shared/MiniComponents/CustomNumberInput/CustomNumberInput";
import s from "./CartProduct.module.scss";
import RemoveCartProductBtn from "./RemoveCartProductBtn";

const CartProduct = ({ data }) => {
  const { img, name, price, discount, quantity, id } = data;

  // Calculate prices directly from raw data
  const priceAfterDiscount = price * (1 - discount / 100);
  const subTotal = (quantity * priceAfterDiscount).toFixed(2);

  return (
    <tr className={s.productContainer}>
      <td className={s.product}>
        <div className={s.imgHolder}>
          <img src={img} alt={`${name} product`} />
          <RemoveCartProductBtn productId={id} />
        </div>

        <Link to={`/details?product=${name}`}>{name}</Link>
      </td>

      <td className={s.price}>${priceAfterDiscount.toFixed(2)}</td>

      <td>
        <CustomNumberInput product={data} quantity={quantity} />
      </td>

      <td>${subTotal}</td>
    </tr>
  );
};
export default CartProduct;
