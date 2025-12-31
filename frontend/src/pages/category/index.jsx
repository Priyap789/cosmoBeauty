import { useParams } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid";
import products from "../../data/products";

function CategoryPage() {
  const { categoryName } = useParams();

  const filteredProducts = products.filter(
    (item) => item.category === categoryName
  );

  return (
    <>
     
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 capitalize">
          {categoryName} Products
        </h1>

        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}

export default CategoryPage;
