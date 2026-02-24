import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../redux/cartSlice";
import { ChevronLeft, ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react"; 
import toast from "react-hot-toast";
import StarDisplay from "../../components/StarDisplay";
import axios from "axios";

const API_URL = "http://localhost:8000/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);

  /* ---------- Logic (Unchanged) ---------- */
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
        data.ingredients = data.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
      }

      setProduct(data);
      setReviews(data.reviews || []); // 🔥 set reviews separately
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
  const today = new Date();
  const isOfferActive =
    product?.offer?.isActive &&
    product?.offer?.discountPercentage > 0 &&
    (!product?.offer?.startDate || new Date(product.offer.startDate) <= today) &&
    (!product?.offer?.endDate || new Date(product.offer.endDate) >= today);

  const discountedPrice = isOfferActive ? product?.offer?.offerPrice : product?.price;

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { toast.error("Please login first"); return; }
    try {
      await axios.post("http://localhost:8000/api/cart/add", {
        userId, productId: product._id, quantity, price: discountedPrice,
      });
      dispatch(fetchCart(userId));
      toast.success("Added to cart!");
    } catch (error) { toast.error("Failed to add to cart"); }
  };

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { toast.error("Please login first"); return; }
    try {
      const res = await axios.post("http://localhost:8000/api/payment/create", {
        userId, productId: product._id, quantity, price: discountedPrice,
      });
      const { key, amount, razorpayOrderId } = res.data;
      const options = {
        key, amount, currency: "INR", name: product.name, description: "Buy Now Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          await axios.post("http://localhost:8000/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success("Payment successful!");
        },
        prefill: { email: localStorage.getItem("email") || "", contact: localStorage.getItem("phone") || "" },
        theme: { color: "#db2777" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) { toast.error("Payment failed"); }
  };
  const handleSubmitReview = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to review");
    return;
  }

  if (!rating) {
    toast.error("Please select rating");
    return;
  }

  try {
    const reviewRes = await axios.post(
      `http://localhost:8000/api/reviews/${id}`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Review submitted!");
    setRating(0);
    setComment("");

    // 🔥 refresh product to update rating
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    setProduct(data);
    setReviews(data.reviews || []); // 🔥 update reviews state
  } catch (err) {
    toast.error(err.response?.data?.message || "Review failed");
  }
};

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    return img.startsWith("http") ? img : `http://localhost:8000${img}`;
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div></div>;
  if (error) return <div className="max-w-xl mx-auto mt-20 text-center p-10 bg-red-50 rounded-xl border border-red-200 text-red-600 font-medium">{error}</div>;
  if (!product) return <p className="text-center py-10 text-gray-500">Product not found</p>;

  const images = product.images || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* BREADCRUMB / BACK */}
        <nav className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-all group"
          >
            <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase">Back to Collection</span>
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
              <img
                src={getImageUrl(mainImage)}
                alt={product.name}
                className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
            
            {/* THUMBNAILS LIST */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === img ? "border-pink-500 ring-2 ring-pink-100" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold tracking-widest uppercase rounded-full">
                {product.mainCategory || "New Arrival"}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 py-2">
                <StarDisplay rating={product.rating} count={product.numReviews} />
                <span className="h-4 w-px bg-gray-300"></span>
                <span className="text-sm text-green-600 font-medium italic">In Stock</span>
              </div>
            </div>

            {/* PRICING CARD */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-baseline gap-3">
                {isOfferActive ? (
                  <>
                    <span className="text-4xl font-black text-gray-900">₹{discountedPrice}</span>
                    <span className="text-xl text-gray-400 line-through font-medium">₹{product.price}</span>
                    <span className="ml-auto text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-lg animate-pulse">
                      {product.offer?.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                )}
              </div>

              {/* OFFER EXPIRY INFO */}
              {product.offer?.isActive && product.offer?.startDate && (
                <div className="py-2 px-3 rounded-lg bg-orange-50 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                   <p className="text-xs text-orange-700 font-semibold">
                     {new Date(product.offer.startDate) > today 
                        ? `Starts ${new Date(product.offer.startDate).toLocaleDateString()}` 
                        : `Ending soon: ${new Date(product.offer.endDate).toLocaleDateString()}`}
                   </p>
                </div>
              )}

              {/* QUANTITY SELECTOR */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 transition-colors" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-pink-600 text-pink-600 px-6 py-4 rounded-xl font-bold hover:bg-pink-50 transition-all active:scale-95"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-pink-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all active:scale-95"
                >
                  <Zap size={20} fill="currentColor" /> Buy Now
                </button>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck size={20} className="text-pink-500" />
                <span className="text-xs font-medium leading-tight">Free Shipping<br/>Above ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ShieldCheck size={20} className="text-pink-500" />
                <span className="text-xs font-medium leading-tight">100% Secure<br/>Authenticity</span>
              </div>
            </div>

            {/* TABS SECTION */}
            <div className="pt-6">
              <div className="flex gap-8 border-b border-gray-200">
                {["Description", "Ingredients", "How to Use"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                      activeTab === tab ? "text-pink-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-600 rounded-t-full"></div>}
                  </button>
                ))}
              </div>
              <div className="py-6 text-gray-600 leading-relaxed text-sm">
                {activeTab === "Description" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{product.description || "No description available."}</div>}
                {activeTab === "Ingredients" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {product.ingredients?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">{ing}</span>
                        ))}
                      </div>
                    ) : <p>No ingredients listed</p>}
                  </div>
                )}
                {activeTab === "How to Use" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{product.howToUse || "Use as directed."}</div>}
              </div>
            </div>
            {/* REVIEWS SECTION */}
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

  {/* Existing Reviews */}
 {reviews.length > 0 ? (
  reviews.map((rev, index) => (
    <div key={index} className="mb-4 p-4 bg-white rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{rev.user?.name || "User"}</span>
        <span>⭐ {rev.rating}</span>
      </div>
      <p className="text-gray-600 mt-2 text-sm">{rev.comment}</p>
    </div>
  ))
) : (
  <p className="text-gray-500">No reviews yet.</p>
)}

  {/* Add Review Form */}
  <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="border p-2 rounded w-full mb-4"
    >
      <option value="">Select Rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your review..."
      className="border p-3 rounded w-full mb-4"
    />

    <button
      onClick={handleSubmitReview}
      className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
    >
      Submit Review
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}