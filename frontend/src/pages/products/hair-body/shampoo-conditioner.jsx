import ProductGrid from "../../../components/ProductGrid";
import products from "../../../data/products";

function Shampoo() {
  // Filter only Makeup → face products
  const shampooProducts = products.filter(
    (product) =>
      product.mainCategory === "hair-body" &&
      product.subCategory === "shampoo-conditioner"
  );

  return (
    <>
   

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          Shampoo&Conditioner
        </h1>

        <ProductGrid products={shampooProducts} />
      </div>
    </>
  );
}

export default Shampoo;
