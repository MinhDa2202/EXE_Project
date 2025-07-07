import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { updateLoadingState } from "src/Features/loadingSlice";
import { updateProductsState } from "src/Features/productsSlice";
import { searchByObjectKey } from "src/Functions/helper";
import SvgIcon from "../../MiniComponents/SvgIcon";
import SearchInput from "./SearchInput";
import s from "./SearchProductsInput.module.scss";

const SearchProductsInput = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const searchRef = useRef("");
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts } = useSelector((state) => state.products);

  function getProducts(query) {
    let productsFound = searchByObjectKey({
      data: allProducts,
      key: "shortName",
      query,
    });
  
    if (productsFound.length === 0) {
      // Category search is not possible with the current API data structure.
      // This part is commented out but can be re-enabled if category data becomes available.
      /*
      productsFound = searchByObjectKey({
        data: allProducts,
        key: "category",
        query,
      });
      */
    }
  
    return productsFound;
  }

  function handleSearchProducts(e) {
    setSearchParams({ query: searchRef.current });
    e.preventDefault();

    const isEmptyQuery = searchRef.current?.trim()?.length === 0;
    if (isEmptyQuery) return;

    updateSearchProducts();
  }

  function updateSearchProducts() {
    dispatch(updateLoadingState({ key: "loadingSearchProducts", value: true }));

    const queryValue = searchRef.current || searchParams.get("query");
    const isEmptyQuery = queryValue?.trim()?.length === 0;

    if (isEmptyQuery) {
      dispatch(updateProductsState({ key: "searchProducts", value: [] }));
      return;
    }

    const productsFound = getProducts(queryValue);

    dispatch(
      updateProductsState({ key: "searchProducts", value: productsFound })
    );
    navigateTo("/search?query=" + queryValue);
  }

  useEffect(() => {
    const isSearchPage = pathName === "/search";
    if (isSearchPage) updateSearchProducts();

    return () => {
      dispatch(
        updateLoadingState({ key: "loadingSearchProducts", value: true })
      );
    };
  }, [pathName]); // Added pathName to dependency array

  function focusInput(e) {
    const searchInput = e.currentTarget.querySelector("#search-input");
    searchInput.focus();
  }

  return (
    <form
      className={s.searchContainer}
      onSubmit={handleSearchProducts}
      onClick={focusInput}
      role="search"
    >
      <SearchInput searchRef={searchRef} />

      <button type="submit" aria-label={t("tooltips.searchButton")}>
        <SvgIcon name="search" />
      </button>
    </form>
  );
};

export default SearchProductsInput;
