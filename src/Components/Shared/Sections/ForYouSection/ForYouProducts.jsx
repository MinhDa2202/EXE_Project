import { useEffect, useState } from "react";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard";
import SpinnerLoading from "../../Loaders/SpinnerLoading";
import s from "./ForYouProducts.module.scss";

const ForYouProducts = ({ loading = "eager" }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7235/api/Product");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        const mappedProducts = data.map(p => ({
          id: p.id,
          name: p.title,
          shortName: p.title,
          description: p.descriptions,
          price: p.price,
          img: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : '',
          addedDate: p.createdAt,
          discount: 0,
          rate: 4,
          votes: 0,
          colors: [],
          quantity: 1,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <p>Không thể tải được danh sách sản phẩm. Vui lòng thử lại sau.</p>;
  }

  const forYouProducts = products.slice(0, 4);

  return (
    <div className={s.forYouProducts}>
      {forYouProducts.map((product) => (
        <ProductCard key={product.id} product={product} loading={loading} />
      ))}
    </div>
  );
};
export default ForYouProducts;
