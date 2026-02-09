import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const IMAGE_BASE = "http://localhost:8000";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  /* ✅ PICK ONLY ONE MAIN IMAGE */
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image || "";

  const imageUrl = mainImage
    ? mainImage.startsWith("http")
      ? mainImage
      : `${IMAGE_BASE}${mainImage}`
    : "/placeholder.png";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer">

        {/* IMAGE */}
        <div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          {/* CATEGORY BADGE */}
          {product.mainCategory && (
            <span className="absolute top-3 left-3 bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
              {product.mainCategory}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {product.subCategory && (
            <p className="text-sm text-gray-500">
              {product.subCategory}
            </p>
          )}

          {/* RATING */}
          <div className="flex items-center gap-1 text-sm mt-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span>4.5</span>
            <span className="text-gray-400">(120)</span>
          </div>

          {/* PRICE + CART */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-bold text-gray-800">
              ₹{product.price}
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-pink-500 p-2 rounded-lg text-white hover:bg-pink-600"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
