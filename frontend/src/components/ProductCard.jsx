import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import StarDisplay from "./StarDisplay";

const IMAGE_BASE = "http://localhost:8000";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  /* ================= IMAGE ================= */
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image || "";

  const imageUrl = mainImage
    ? mainImage.startsWith("http")
      ? mainImage
      : `${IMAGE_BASE}${mainImage}`
    : "/placeholder.png";

  /* ================= OFFER LOGIC ================= */
  /* ================= OFFER LOGIC ================= */
const today = new Date();

const isOfferActive =
  product.offer?.isActive &&
  product.offer?.discountPercentage > 0 &&
  (!product.offer?.startDate ||
    new Date(product.offer.startDate) <= today) &&
  (!product.offer?.endDate ||
    new Date(product.offer.endDate) >= today);

const discountedPrice = isOfferActive
  ? product.offer.offerPrice
  : product.price;


  /* ================= ADD TO CART ================= */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        ...product,
        price: discountedPrice, // 🔥 add discounted price to cart
        quantity: 1,
      })
    );
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

          {/* 🔥 OFFER BADGE */}
          {isOfferActive && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {product.offer?.discountPercentage}% OFF

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
          <StarDisplay
            rating={product.rating}
            count={product.numReviews}
          />

          {/* PRICE + CART */}
          <div className="flex items-center justify-between mt-4">
            <div>
              {isOfferActive ? (
                <>
                  <span className="text-sm text-gray-400 line-through mr-2">
                    ₹{product.price}
                  </span>
                  <span className="font-bold text-red-600">
                    ₹{discountedPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold text-gray-800">
                  ₹{product.price}
                </span>
              )}
            </div>

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
