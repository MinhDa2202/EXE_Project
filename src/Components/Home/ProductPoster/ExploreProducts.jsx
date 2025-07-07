import { useEffect, useState } from "react";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard";
import SpinnerLoading from "../../Shared/Loaders/SpinnerLoading";
import s from "./ExploreProducts.module.scss";

const ExploreProducts = ({ numOfProducts = -1, customization }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7235/api/Product");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        // Map API data to the format expected by ProductCard
        const mappedProducts = data.map(p => ({
          id: p.id,
          name: p.title,
          shortName: p.title, // Assuming shortName can be the same as title
          description: p.descriptions,
          price: p.price,
          img: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : '', // Use first image
          addedDate: p.createdAt,
          discount: 0, // API doesn't provide discount, default to 0
          rate: 4, // Default value
          votes: 0, // Default value
          colors: [], // Default value
          quantity: 1, // Default value
        }));

        setProducts(mappedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <p className={s.error}>Không thể tải được danh sách sản phẩm. Vui lòng thử lại sau.</p>;
  }

  const displayedProducts =
    numOfProducts === -1
      ? products
      : products.slice(0, numOfProducts);

  return (
    <div className={s.products}>
      {displayedProducts.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          customization={customization}
        />
      ))}
    </div>
  );
};
export default ExploreProducts;
