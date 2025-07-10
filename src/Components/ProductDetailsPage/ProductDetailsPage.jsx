// src/Components/ProductDetailsPage/ProductDetailsPage.jsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants";
import useSingleProduct from "src/Hooks/App/useSingleProduct";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import ProductDetails from "./ProductDetails/ProductDetails";
import RelatedItemsSection from "./RelatedItemsSection/RelatedItemsSection";
import s from "./ProductDetailsPage.module.scss";

const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const PRODUCT_ID = useGetSearchParam("id");
  const { product: PRODUCT_DATA, error } = useSingleProduct(PRODUCT_ID, "id");
  const { loadingProductDetails } = useSelector((state) => state.loading);

  // Fallback data while loading or if error
  const productCategory = PRODUCT_DATA?.category?.toLowerCase() || "unknown";
  const productCategoryTrans = t(`categoriesData.${productCategory}`, productCategory);
  const productName = PRODUCT_DATA?.shortName?.replaceAll(" ", "") || PRODUCT_DATA?.name?.replaceAll(" ", "") || "unknown";
  const productNameTrans = t(`products.${productName}.name`, PRODUCT_DATA?.shortName || PRODUCT_DATA?.name || "Product");
  
  const history = [
    t("history.account"),
    productCategoryTrans,
    productNameTrans,
  ];
  
  const historyPaths = [
    {
      index: 0,
      path: "/profile",
    },
    {
      index: 1,
      path: `/category?type=${PRODUCT_DATA?.category || "all"}`,
    },
  ];

  useScrollOnMount(200);

  // Loading state
  if (loadingProductDetails) {
    return (
      <>
        <Helmet>
          <title>Loading Product...</title>
          <meta
            name="description"
            content={`Loading product details on ${WEBSITE_NAME}...`}
          />
        </Helmet>

        <div className="container">
          <main className={s.detailsPage}>
            <div className={s.loadingContainer}>
              <div className={s.loadingSpinner}>
                <div className={s.spinner}></div>
                <p>Đang tải thông tin sản phẩm...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Error state
  if (error || !PRODUCT_DATA) {
    return (
      <>
        <Helmet>
          <title>Product Not Found</title>
          <meta
            name="description"
            content={`Product not found on ${WEBSITE_NAME}. Please check the product name or try again.`}
          />
        </Helmet>

        <div className="container">
          <main className={s.detailsPage}>
            <PagesHistory history={["/"]} />
            <div className={s.errorContainer}>
              <div className={s.errorMessage}>
                <h2>Không tìm thấy sản phẩm</h2>
                <p>{error || "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}</p>
                <div className={s.errorActions}>
                  <button 
                    onClick={() => window.history.back()}
                    className={s.backButton}
                  >
                    Quay lại
                  </button>
                  <button 
                    onClick={() => window.location.href = "/products"}
                    className={s.browseButton}
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Success state
  return (
    <>
      <Helmet>
        <title>{PRODUCT_DATA.shortName || PRODUCT_DATA.name}</title>
        <meta
          name="description"
          content={`${PRODUCT_DATA.description || `Explore the details and specifications of ${PRODUCT_DATA.shortName || PRODUCT_DATA.name} on ${WEBSITE_NAME}. Find everything you need to know, from features to customer reviews, before making your purchase.`}`}
        />
        <meta property="og:title" content={PRODUCT_DATA.shortName || PRODUCT_DATA.name} />
        <meta property="og:description" content={PRODUCT_DATA.description || `Check out ${PRODUCT_DATA.shortName || PRODUCT_DATA.name} on ${WEBSITE_NAME}`} />
        {PRODUCT_DATA.ImageUrls && PRODUCT_DATA.ImageUrls.length > 0 && (
          <meta property="og:image" content={PRODUCT_DATA.ImageUrls[0]} />
        )}
      </Helmet>

      <div className="container">
        <main className={s.detailsPage}>
          <PagesHistory history={history} historyPaths={historyPaths} />
          <ProductDetails productData={PRODUCT_DATA} />
          <RelatedItemsSection
            productType={PRODUCT_DATA?.category}
            currentProduct={PRODUCT_DATA}
          />
        </main>
      </div>
    </>
  );
};

export default ProductDetailsPage;