import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProductGrid from "../../components/ProductGrid";
import products from "../../data/products";


function ProductsPage() {
  const { category, subCategory } = useParams();

  // 🔹 Filtering logic
  const filteredProducts = products.filter((product) => {
    // All Products
    if (!category) return true;

    // Main Category only (Skincare, Makeup, Hair & Body)
    if (category && !subCategory) {
      return product.mainCategory === category;
    }

    // Main + Sub Category
    return (
      product.mainCategory === category &&
      product.subCategory === subCategory
    );
  });

  // 🔹 Dynamic Page Title
  const getTitle = () => {
    if (!category) return "All Products";
    if (category && !subCategory) return category.replace("-", " ");
    return subCategory.replace("-", " ");
  };

  return (
    <>
      {/* Navbar */}
     

      {/* Page Content */}
      <div className="min-h-screen  ">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 capitalize">
          {getTitle()}
        </h1>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}

export default ProductsPage;
