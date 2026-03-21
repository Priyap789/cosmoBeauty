import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../redux/cartSlice";
import { ChevronLeft, ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react"; 
import toast from "react-hot-toast";
import StarDisplay from "../../components/StarDisplay";
import axios from "axios";
import Swal from "sweetalert2";
import { Dialog } from "@mui/material";
import { useSelector } from "react-redux";

const API_URL = "http://localhost:8000/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
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
  const [reviewImage, setReviewImage] = useState(null);
  const [openReviewImage, setOpenReviewImage] = useState(false);
const [selectedReviewImage, setSelectedReviewImage] = useState("");

useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    dispatch(fetchCart(userId));
  }
}, [dispatch]);
  /* ---------- Logic (Unchanged) ---------- */
useEffect(() => {
  const fetchProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Product not found");

      const data = await res.json();

      if (typeof data.ingredients === "string") {
        data.ingredients = data.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }

      setProduct(data);

      // 🔥 fetch reviews
      const reviewRes = await fetch(
        `http://localhost:8000/api/reviews/${id}`
      );
      const reviewData = await reviewRes.json();

      setReviews(reviewData || []);

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

  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login first to add items to cart",
      confirmButtonColor: "#ec4899",
    });
    return;
  }

  try {
    await axios.post("http://localhost:8000/api/cart/add", {
      userId,
      productId: product._id,
      quantity,
      price: discountedPrice,
    });

    dispatch(fetchCart(userId));

    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.name} added successfully.`,
      confirmButtonColor: "#ec4899",
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to add to cart",
      confirmButtonColor: "#ec4899",
    });
  }
};

 
const handleSubmitReview = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to submit a review",
      confirmButtonColor: "#ec4899",
    });
    return;
  }

  if (!rating) {
    Swal.fire({
      icon: "info",
      title: "Select Rating",
      text: "Please choose a rating before submitting",
      confirmButtonColor: "#ec4899",
    });
    return;
  }

  try {

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);

    if (reviewImage) {
      formData.append("image", reviewImage);
    }

    await axios.post(
      `http://localhost:8000/api/reviews/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    Swal.fire({
      icon: "success",
      title: "Thank You!",
      text: "Your review has been submitted successfully.",
      confirmButtonColor: "#ec4899",
    });

    setRating(0);
    setComment("");
    setReviewImage(null);

    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    setProduct(data);
    setReviews(data.reviews || []);

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Review Failed",
      text: err.response?.data?.message || "Something went wrong",
      confirmButtonColor: "#ec4899",
    });
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
 const isInCart = cartItems.some(
  (item) => item.productId === product._id || item.product?._id === product._id
);
  const handleBuyNow = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login first to continue",
      confirmButtonColor: "#ec4899",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Proceed to Checkout?",
    text: "You will be redirected to checkout page.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ec4899",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Continue",
  });

  if (!result.isConfirmed) return;

 const buyNowItem = {
  productId: product._id,
  name: product.name,
  price: discountedPrice,
  quantity: quantity,
  mainImage: mainImage, // ✅ use same key as checkout
};

  navigate("/checkout", {
  state: {
    isBuyNow: true,
    product: buyNowItem
  }
});
};

return (
  <div className="bg-gray-50 min-h-screen pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* BREADCRUMB / BACK */}
      <nav className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-all group"
        >
          <ChevronLeft size={18} />
          <span className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">Back to Shop</span>
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: IMAGES + REVIEWS */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* IMAGE GALLERY */}
          <div className="flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
              <img
                src={getImageUrl(mainImage)}
                alt={product.name}
                className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
            
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

          <hr className="border-gray-200" />

          {/* REVIEWS LISTING */}
          {/* REVIEWS LISTING - Desktop */}
<section className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-bold text-xl">{product.rating}</span>
                <StarDisplay rating={product.rating} count={product.numReviews} />
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-500 italic py-4">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-50 last:border-0 pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-900 block">{rev.user?.name || "Verified Buyer"}</span>
                        <div className="flex text-yellow-400 text-xs mt-1">
                           {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Verified Purchase</span>
                    </div>

                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.image && (
                      <img
                        src={`http://localhost:8000${rev.image}`}
                        className="w-24 h-24 mt-4 rounded-lg object-cover cursor-zoom-in border hover:opacity-90 transition-opacity"
                        alt="review"
                        onClick={() => {
                          setSelectedReviewImage(`http://localhost:8000${rev.image}`);
                          setOpenReviewImage(true);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        {/* WRITE A REVIEW FORM - Desktop */}
<section className="hidden lg:block bg-gray-50/50 p-6 rounded-2xl border border-white-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share your experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                >
                  <option value="">Select Rating</option>
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Star' : 'Stars'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReviewImage(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer"
                />
              </div>
            </div>

            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-pink-500 outline-none min-h-[100px]"
            />

            {reviewImage && (
              <div className="relative w-20 h-20 mb-4 group">
                <img
                  src={URL.createObjectURL(reviewImage)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg border-2 border-white shadow-sm"
                />
                <button 
                  onClick={() => setReviewImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-lg"
                >✕</button>
              </div>
            )}

            <button
              onClick={handleSubmitReview}
              className="w-full md:w-auto bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 transition-all active:scale-95 shadow-lg shadow-pink-200"
            >
              Submit Review
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: PRODUCT INFO & PURCHASE */}
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

            {/* ... Other Pricing/Qty UI ... */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select Quantity</span>
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 transition-colors" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
  onClick={handleAddToCart}
  disabled={isInCart}
  className={`flex items-center justify-center gap-3 px-2 py-2 rounded-2xl text-lg font-extrabold transition-all active:scale-95
    ${
      isInCart
        ? "bg-green-500 text-white cursor-not-allowed"
        : "bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50"
    }`}
>
  <ShoppingBag size={24} />
  {isInCart ? "Added to Cart" : "Add to Cart"}
</button>
              <button onClick={handleBuyNow} className="flex items-center justify-center gap-3 bg-pink-600 text-white px-2 py-2 rounded-2xl text-lg font-extrabold hover:bg-pink-700 transition-all active:scale-95">
                <Zap size={24} /> Buy Now
              </button>
            </div>
          </div>

          {/* TRUST BADGES & TABS (Kept in right column for balance) */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
             {/* ... Shipping/Security Badges ... */}
             <div className="flex items-center gap-3 text-gray-600">
               <Truck size={20} className="text-pink-500" />
               <span className="text-xs font-medium leading-tight">Free Shipping<br/>Above ₹999</span>
             </div>
             <div className="flex items-center gap-3 text-gray-600">
               <ShieldCheck size={20} className="text-pink-500" />
               <span className="text-xs font-medium leading-tight">100% Secure<br/>Authenticity</span>
             </div>
          </div>

          <div className="pt-6">
            {/* ... Description / Ingredients Tabs ... */}
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
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {product.ingredients?.map((ing, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">{ing}</span>
                  )) || <p>No ingredients listed</p>}
                </div>
              )}
              {activeTab === "How to Use" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{product.howToUse || "Use as directed."}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
{/* MOBILE REVIEWS + REVIEW FORM */}
<div className="lg:hidden max-w-7xl mx-auto px-4 mt-10 space-y-8">

  {/* REVIEWS LIST */}
  <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

    {reviews.length === 0 ? (
      <p className="text-gray-500 italic">
        No reviews yet. Be the first to review!
      </p>
    ) : (
      <div className="space-y-6">
        {reviews.map((rev) => (
          <div key={rev._id}>
            <span className="font-semibold">
              {rev.user?.name || "Verified Buyer"}
            </span>

            <div className="text-yellow-400 text-sm">
              {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
            </div>

            <p className="text-gray-600 text-sm mt-2">{rev.comment}</p>

            {rev.image && (
              <img
                src={`http://localhost:8000${rev.image}`}
                className="w-24 h-24 mt-2 rounded-lg object-cover"
                alt="review"
              />
            )}
          </div>
        ))}
      </div>
    )}
  </section>

  {/* WRITE REVIEW FORM */}
  <section className="bg-gray-50 p-6 rounded-2xl border">
    <h3 className="text-lg font-bold mb-4">Write a Review</h3>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="w-full border rounded-lg p-3 mb-3"
    >
      <option value="">Select Rating</option>
      {[5,4,3,2,1].map(num => (
        <option key={num} value={num}>
          {num} {num === 1 ? "Star" : "Stars"}
        </option>
      ))}
    </select>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your review..."
      className="w-full border rounded-lg p-3 mb-3"
    />

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setReviewImage(e.target.files[0])}
      className="mb-3"
    />

    <button
      onClick={handleSubmitReview}
      className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold"
    >
      Submit Review
    </button>
  </section>

</div>
    {/* Full Image Dialog */}
    <Dialog open={openReviewImage} onClose={() => setOpenReviewImage(false)} maxWidth="md">
      <img src={selectedReviewImage} alt="Review" className="w-full h-auto max-h-[90vh] object-contain" />
    </Dialog>
  </div>
);


      
}