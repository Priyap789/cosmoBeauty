import { useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";
import products from "../../data/products";

const MAIN_CATEGORIES = ["Skincare", "Body", "Haircare"];

function ProductsPage() {
  const [selectedFilters, setSelectedFilters] = useState([]);

  // ✅ Extract ONLY subcategories
  const selectedSubCategories = selectedFilters.filter(
    (f) => !MAIN_CATEGORIES.includes(f)
  );

  const filteredProducts =
    selectedSubCategories.length === 0
      ? products // 👈 DEFAULT: show all products
      : products.filter((product) =>
          selectedSubCategories.includes(product.subCategory)
        );

  return (
    <div className="min-h-screen px-6 py-6 bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        
      </h1>

      <div className="flex gap-0">
        <CategoryFilter
          selected={selectedFilters}
          onChange={setSelectedFilters}
        />

        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
