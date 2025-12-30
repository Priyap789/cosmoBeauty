//import Navbar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../data/products";

function Bodywash() {
  // Filter only hair-body → bodywash products
  const bodywashProducts = products.filter(
    (product) =>
      product.mainCategory === "hair-body" &&
      product.subCategory === "body-wash-cream"
  );
  
  return (
    <>
    

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          Bodywash&Cream
        </h1>

        <ProductGrid products={bodywashProducts} />
      </div>
    </>
  );
}

export default Bodywash;
