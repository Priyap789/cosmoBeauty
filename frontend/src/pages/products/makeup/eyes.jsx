import Navbar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../data/products";

function Eyes() {
  // Filter only Makeup → eyes products
  const eyesProducts = products.filter(
    (product) =>
      product.mainCategory === "makeup" &&
      product.subCategory === "eyes"
  );

  return (
    <>
     
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          EYES Makeup
        </h1>

        <ProductGrid products={eyesProducts} />
      </div>
    </>
  );
}

export default Eyes;
