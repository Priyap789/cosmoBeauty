import Navbar from "../../components/Navbar";
import ProductGrid from "../../components/ProductGrid";
import products from "../../data/products";

function Skincare() {
  const skincareProducts = products.filter(
    (p) => p.mainCategory === "skincare"
  );

  return (
    <>
    
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          Skincare Products
        </h1>

        <ProductGrid products={skincareProducts} />
      </div>
    </>
  );
}

export default Skincare;
