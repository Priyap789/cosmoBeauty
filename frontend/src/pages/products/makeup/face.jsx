import ProductGrid from "../../../components/ProductGrid";
import products from "../../../data/products";

function Face() {
  // Filter only Makeup → face products
  const faceProducts = products.filter(
    (product) =>
      product.mainCategory === "makeup" &&
      product.subCategory === "face"
  );

  return (
    <>
     

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          face Makeup
        </h1>

        <ProductGrid products={faceProducts} />
      </div>
    </>
  );
}

export default Face;
