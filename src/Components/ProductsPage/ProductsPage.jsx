// src/Components/ProductsPage/ProductsPage.jsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import { WEBSITE_NAME } from "src/Data/constants";
import { productCardCustomizations } from "src/Data/staticData";
import useProducts from "src/Hooks/App/useProducts";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import ExploreProducts from "../Home/ProductPoster/ExploreProducts";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards";
import AddProductModal from "./AddProductModal";
import s from "./ProductsPage.module.scss";

const ProductsPage = () => {
  const { t } = useTranslation();
  const { products, error, refetch } = useProducts("loadingProductsPage");
  const { loadingProductsPage } = useSelector((state) => state.loading);
  const [showAddModal, setShowAddModal] = useState(false);

  useScrollOnMount(200);

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleProductAdded = () => {
    setShowAddModal(false);
    refetch(); // Refresh the products list
  };

  return (
    <>
      <Helmet>
        <title>Products</title>
        <link rel="preconnect" href="https://localhost:7235/" />
        <meta
          name="description"
          content={`Explore the entire collection of products available on ${WEBSITE_NAME}. From fashion to electronics, browse our comprehensive catalog to find the perfect items for your needs.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.productsPage}>
          <PagesHistory history={["/", t("history.products")]} />

          <div className={s.pageHeader}>
            <h1>{t("products.title", "Products")}</h1>
            <button 
              className={s.addButton}
              onClick={handleAddProduct}
              type="button"
            >
              <span className={s.addIcon}>+</span>
              {t("products.addProduct", "Add Product")}
            </button>
          </div>

          <section className={s.products} id="products-section">
            {error && (
              <div className={s.errorMessage}>
                <p>{error}</p>
                <button onClick={refetch}>
                  Thử lại
                </button>
              </div>
            )}
            
            {!loadingProductsPage && products.length > 0 && (
              <ExploreProducts
                customization={productCardCustomizations.allProducts}
                products={products}
              />
            )}
            
            {!loadingProductsPage && products.length === 0 && !error && (
              <div className={s.noProducts}>
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
            
            {loadingProductsPage && (
              <div className={s.SkeletonCards}>
                <SkeletonCards numberOfCards={8} />
              </div>
            )}
          </section>
        </main>
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={handleCloseModal}
          onProductAdded={handleProductAdded}
        />
      )}
    </>
  );
};

export default ProductsPage;