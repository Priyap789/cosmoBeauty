import { useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";
import products from "../../data/products";

function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState([]);

  const filteredProducts = products.filter((product) => {
    // ✅ ALL selected
    if (activeFilter.length === 0) return true;

    const selected = activeFilter[0];

    // ✅ If MAIN CATEGORY selected (Skincare)
    if (selected === product.mainCategory) {
      return true; // shows ALL subcategories
    }

    // ✅ If SUB CATEGORY selected (Face Wash)
    if (selected === product.subCategory) {
      return true;
    }

    return false;
  });

  return (
    <div className="min-h-screen px-6 py-6 bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        All Products
      </h1>

      <div className="flex gap-6">
        {/* FILTER */}
        <CategoryFilter onFilterChange={setActiveFilter} />

        {/* PRODUCTS */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
