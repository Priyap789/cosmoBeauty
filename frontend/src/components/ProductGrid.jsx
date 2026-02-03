import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <section className="max-w-7xl mx-auto px-5 py-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500">No products found</p>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
