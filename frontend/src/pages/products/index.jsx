import { useEffect, useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";

const MAIN_CATEGORIES = ["Skincare", "Makeup", "Haircare", "Bodycare"];

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

  // ✅ Extract ONLY subcategories selected
  const selectedSubCategories = selectedFilters.filter(
    (f) => !MAIN_CATEGORIES.includes(f)
  );

  // ✅ Filter products by selected subcategories
  const filteredProducts =
    selectedSubCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedSubCategories.includes(product.subCategory)
        );

  // ✅ Group products by main category
  const groupByCategory = (productsArray) => {
    const grouped = {};
    productsArray.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  };

  const groupedProducts = groupByCategory(filteredProducts);

  return (
    <div className="min-h-screen px-6 py-6 bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Our Products
      </h1>

      <div className="flex gap-6">
        {/* 🟣 Sidebar: Category Filter */}
        <div className="w-64">
          <CategoryFilter selected={selectedFilters} onChange={setSelectedFilters} />
        </div>

        {/* 🟣 Products Display */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <p className="text-center mt-10 text-gray-500">Loading products...</p>
          ) : Object.keys(groupedProducts).length === 0 ? (
            <p className="text-center mt-10 text-gray-500">No products found.</p>
          ) : (
            Object.entries(groupedProducts).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-pink-600 mb-4">{category}</h2>
                <ProductGrid products={items} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
