import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants";
import { SIMPLE_DELAYS } from "src/Data/globalVariables";
import { updateLoadingState } from "src/Features/loadingSlice";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useUpdateLoadingOnSamePage from "src/Hooks/App/useUpdateLoadingOnSamePage";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import ProductDetails from "./ProductDetails/ProductDetails";
import s from "./ProductDetailsPage.module.scss";
import RelatedItemsSection from "./RelatedItemsSection/RelatedItemsSection";
import SpinnerLoading from "../Shared/Loaders/SpinnerLoading";

const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const { allProducts, loading } = useSelector((state) => state.products);
  const PRODUCT_NAME = useGetSearchParam("product");

  const PRODUCT_DATA = allProducts.find(
    (product) => product?.name?.toLowerCase() === PRODUCT_NAME?.toLowerCase()
  );

  useUpdateLoadingOnSamePage({
    loadingKey: "loadingProductDetails",
    actionMethod: updateLoadingState,
    delays: SIMPLE_DELAYS,
    dependencies: [PRODUCT_NAME],
  });
  useScrollOnMount(200);

  if (loading === 'loading' || !PRODUCT_DATA) {
    return <SpinnerLoading />;
  }

  const history = [
    t("history.account"),
    PRODUCT_DATA.category,
    PRODUCT_DATA.name,
  ];
  const historyPaths = [
    {
      index: 0,
      path: "/profile",
    },
    {
      index: 1,
      path: `/category?type=${PRODUCT_DATA.category}`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{PRODUCT_DATA?.name}</title>
        <meta
          name="description"
          content={`Explore the details and specifications of your favorite products on ${WEBSITE_NAME}. Find everything you need to know, from features to customer reviews, before making your purchase.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.detailsPage}>
          <PagesHistory history={history} historyPaths={historyPaths} />
          <ProductDetails productData={PRODUCT_DATA} />
          <RelatedItemsSection
            productType={PRODUCT_DATA.category}
            currentProduct={PRODUCT_DATA}
          />
        </main>
      </div>
    </>
  );
};
export default ProductDetailsPage;
