import Navbar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../data/products";

function Lip() {
  // Filter only Makeup → Lip products
  const lipProducts = products.filter(
    (product) =>
      product.mainCategory === "makeup" &&
      product.subCategory === "lip"
  );

  return (
    <>


      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          Lip Makeup
        </h1>

        <ProductGrid products={lipProducts} />
      </div>
    </>
  );
}

export default Lip;
