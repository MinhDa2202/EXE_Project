import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants";
import useNavToolsProps from "src/Hooks/App/useNavToolsProps";
import NavTools from "../../Shared/MidComponents/NavTools/NavTools";
import s from "./Header.module.scss";
import MobileNavIcon from "./MobileNavIcon";
import Nav from "./Nav";
import { openAddProductModal } from "src/Features/uiSlice";

const Header = () => {
  const navToolsProps = useNavToolsProps();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddProduct = () => {
    dispatch(openAddProductModal());
  };

  return (
    <header className={s.header} dir="ltr">
      <div className={s.container}>
        <h1>
          <Link to="/">{WEBSITE_NAME}</Link>
        </h1>

        <div className={s.headerContent}>
          <Nav />
          <button
            className={s.addButton}
            onClick={handleAddProduct}
            type="button"
          >
            <span className={s.addIcon}>+</span>
            {t("products.addProduct", "Add Product")}
          </button>
          <NavTools {...navToolsProps} />
        </div>

        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
