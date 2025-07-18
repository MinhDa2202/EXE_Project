import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { addToArray } from "src/Features/productsSlice";
import { compareDataByObjValue } from "src/Functions/helper";
import s from "./BuyButton.module.scss";

const BuyButton = () => {
  const { selectedProduct, productQuantity, orderProducts } =
    useSelector((state) => state.products);
  const {
    loginInfo: { isSignIn },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleBuyProduct() {
    const isAlreadyAddedToOrder = compareDataByObjValue(
      orderProducts,
      selectedProduct,
      "shortName"
    );

    if (!isSignIn) {
      showWarning("pageRequiringSignIn");
      return;
    }

    if (isAlreadyAddedToOrder) {
      showWarning("productAlreadyInOrder");
      return;
    }

    addToOrder();
  }

  function addToOrder() {
    const clonedProduct = { ...selectedProduct };
    clonedProduct.quantity = productQuantity;

    dispatch(
      addToArray({
        key: "orderProducts",
        value: clonedProduct,
      })
    );
  }

  function showWarning(translateKey) {
    dispatch(
      showAlert({
        alertText: t(`toastAlert.${translateKey}`),
        alertState: "warning",
        alertType: "alert",
      })
    );
  }

  return (
    <button type="button" className={s.buyButton} onClick={handleBuyProduct}>
      {t("buttons.buyNow")}
    </button>
  );
};
export default BuyButton;
