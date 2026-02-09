import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState("");

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();

        // Convert ingredients string to array if needed
        if (typeof data.ingredients === "string") {
          data.ingredients = data.ingredients
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i);
        }

        setProduct(data);

        if (data.images?.length > 0) setMainImage(data.images[0]);
        else setMainImage("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  /* ---------- ADD TO CART ---------- */
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  /* ---------- BUY NOW ---------- */
  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  };

  /* ---------- IMAGE URL ---------- */
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    return img.startsWith("http") ? img : `http://localhost:8000${img}`;
  };

  /* ---------- LOADING / ERROR STATES ---------- */
  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Loading product...</p>
    );
  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!product)
    return (
      <p className="text-center py-10 text-gray-500">Product not found</p>
    );

  const images = product.images || [];

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10">
      {/* PRODUCT IMAGES */}
      <div className="flex-1 flex flex-col gap-4">
        {/* MAIN IMAGE */}
        <img
          src={getImageUrl(mainImage)}
          alt={product.name}
          className="w-full max-w-md object-contain rounded-lg mx-auto"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />

        {/* HORIZONTAL THUMBNAILS BELOW MAIN IMAGE */}
        {images.length > 1 && (
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border transition-all flex-shrink-0 ${
                  mainImage === img
                    ? "border-pink-600 scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img)}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-pink-500 uppercase">
          {product.mainCategory || "Uncategorized"}
        </p>

        <h1 className="text-3xl font-semibold">{product.name}</h1>

        {/* RATING */}
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" />
          <span>4.5 (120 reviews)</span>
        </div>

        {/* PRICE */}
        <p className="text-2xl font-bold">₹{product.price}</p>

        {/* QUANTITY */}
        <div className="flex items-center gap-4 mt-4">
          <span>Quantity:</span>
          <div className="flex items-center border rounded">
            <button
              className="px-3 py-1 hover:bg-gray-100"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1 hover:bg-gray-100"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={handleAddToCart}
            className="bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            Buy Now
          </button>
        </div>

        {/* FEATURES */}
        <div className="mt-6 space-y-2">
          <p className="flex items-center gap-2 text-gray-600">
            <span className="text-pink-500">●</span> Free Shipping above ₹999
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <span className="text-pink-500">●</span> 100% Authentic Products
          </p>
        </div>

        {/* TABS */}
        <div className="mt-8 w-full">
          <div className="flex gap-6 border-b">
            {["Description", "Ingredients", "How to Use"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-pink-600 font-semibold text-black"
                    : "text-gray-500 hover:text-pink-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 text-gray-700 min-h-[80px]">
            {activeTab === "Description" && (
              <p className="text-justify">
                {product.description || "No description available."}
              </p>
            )}

            {activeTab === "Ingredients" &&
              (product.ingredients?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              ) : (
                <p>No ingredients listed</p>
              ))}

            {activeTab === "How to Use" && (
              <p>{product.howToUse || "Use as directed."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
