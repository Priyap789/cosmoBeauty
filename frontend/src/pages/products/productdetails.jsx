import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/products";
const IMAGE_BASE = "http://localhost:8000/uploads/";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState(""); // For big image display

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.image || ""); // Set first image as default
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

  /* ---------- IMAGE HANDLING ---------- */
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png"; // fallback image
    if (img.startsWith("http")) return img;
    return img.startsWith("/uploads") ? `http://localhost:8000${img}` : `${IMAGE_BASE}${img}`;
  };

  /* ---------- STATES ---------- */
  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  // Ensure images array exists
  const images = product.images?.length ? product.images : [product.image];

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10">
      {/* Product Images */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <img
          src={getImageUrl(mainImage)}
          alt={product.name}
          className="w-full max-w-md object-contain"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        {/* Thumbnails */}
        <div className="flex gap-2 mt-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={getImageUrl(img)}
              alt={`Thumbnail ${idx + 1}`}
              className={`w-16 h-16 object-cover border rounded cursor-pointer ${
                mainImage === img ? "border-pink-600" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-pink-500 uppercase">{product.category || "Uncategorized"}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" />
          <span>4.5 (120 reviews)</span>
        </div>

        {/* Price */}
        <p className="text-2xl font-bold">₹{product.price || "N/A"}</p>

        {/* Description */}
        <p className="text-gray-600">{product.description || "No description available."}</p>

        {/* Quantity */}
        <div className="flex items-center gap-4 mt-4">
          <span>Quantity:</span>
          <div className="flex items-center border rounded">
            <button className="px-3 py-1" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
            <span className="px-4">{quantity}</span>
            <button className="px-3 py-1" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700"
          >
            Add to Cart
          </button>
          <button className="bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700">
            Buy Now
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 space-y-2">
          <p className="flex items-center gap-2 text-gray-600"><span className="text-pink-500">●</span> Free Shipping above ₹999</p>
          <p className="flex items-center gap-2 text-gray-600"><span className="text-pink-500">●</span> 100% Authentic Products</p>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-6 border-b">
            {["Description", "Ingredients", "How to Use"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${activeTab === tab ? "border-b-2 border-pink-600 font-semibold" : "text-gray-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 text-gray-700">
            {activeTab === "Description" && <p>{product.description || "No description available."}</p>}

            {activeTab === "Ingredients" && (
              product.ingredients?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              ) : (
                <p>No ingredients listed</p>
              )
            )}

            {activeTab === "How to Use" && (
              <p>{product.howToUse || "Use as directed."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
