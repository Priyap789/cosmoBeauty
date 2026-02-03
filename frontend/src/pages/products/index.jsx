import { useEffect, useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";

const MAIN_CATEGORIES = ["Skincare", "Body", "Haircare"];

function ProductsPage() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Extract ONLY subcategories
  const selectedSubCategories = selectedFilters.filter(
    (f) => !MAIN_CATEGORIES.includes(f)
  );

  // ✅ Filter products
  const filteredProducts =
    selectedSubCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedSubCategories.includes(product.subCategory)
        );

  return (
    <div className="min-h-screen px-6 py-6 bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Our Products
      </h1>

      <div className="flex gap-0">
        <CategoryFilter
          selected={selectedFilters}
          onChange={setSelectedFilters}
        />

        <div className="flex-1">
          {loading ? (
            <p className="text-center mt-10">Loading products...</p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
