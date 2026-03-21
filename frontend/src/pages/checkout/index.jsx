import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isBuyNow = location.state?.isBuyNow;
  const buyNowProduct = location.state?.product;
  const reduxCartItems = useSelector((state) => state.cart.items);

  const cartItems = isBuyNow
    ? [buyNowProduct]
    : location.state?.cartItems || reduxCartItems;

  const token = localStorage.getItem("token");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const IMAGE_BASE = "http://localhost:8000";
const [shipping, setShipping] = useState({
  name: "",
  address: "",
  city: "",
  state: "",
  district: "",   // ✅ NEW
  country: "",    // ✅ NEW
  pincode: "",
  phone: "",
});

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        const addr = user.addresses?.[0] || {};

const cleanCity = (addr.city || "")
  .replace(/Taluka|District|Tehsil/gi, "")
  .trim();

setShipping({
  name: user.name || "",
  address: addr.address || "",
  city: cleanCity,           // ✅ FIXED (Nadiad only)
  state: addr.state || "",
  district: addr.district || "",   // ✅ NEW
  country: addr.country || "",     // ✅ NEW
  pincode: addr.pincode || "",
  phone: user.mobile || "",
});
      })
      .catch((err) => console.log(err));
  }, [token]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + tax + shippingFee;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const required = [
  "name",
  "address",
  "city",
  "state",
  "district",   // ✅ NEW
  "country",    // ✅ NEW
  "pincode",
  "phone",
];
    for (let field of required) {
      if (!shipping[field]) {
        Swal.fire({
          title: "Missing Details",
          text: `Please fill in your ${field}.`,
          icon: "warning",
          confirmButtonColor: "#db2777",
        });
        return false;
      }
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const formattedItems = cartItems.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      mainImage: item.mainImage || item.images?.[0] || "",
    }));

    if (paymentMethod === "cod") {
      try {
        await axios.post(
          "http://localhost:8000/api/checkout/cod-order",
          { items: formattedItems, shipping, totalAmount, paymentMethod: "COD" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          title: "Order Confirmed 🎉",
          text: "Your order has been placed successfully via COD.",
          icon: "success",
          confirmButtonColor: "#db2777",
        }).then(() => navigate("/profile"));
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          Swal.fire("Error", "Razorpay SDK failed to load.", "error");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          "http://localhost:8000/api/checkout/create-order",
          { items: formattedItems, shipping, totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { order } = res.data;
        const options = {
          key: "rzp_test_SHWEffooS82UUC",
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "Glam Store",
          handler: async function (response) {
            await axios.post(
              "http://localhost:8000/api/checkout/verify-payment",
              { razorpayResponse: response, items: formattedItems, shipping, totalAmount },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Success!", "Payment Confirmed", "success").then(() => navigate("/orders"));
          },
          prefill: { name: shipping.name, contact: shipping.phone },
          theme: { color: "#db2777" },
        };
        new window.Razorpay(options).open();
      } catch (error) {
        Swal.fire("Payment Failed", "Check your connection or try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-10 tracking-tight">
          Secure <span className="text-pink-600">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Shipping Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
  { label: "Full Name", name: "name", type: "text" },
  { label: "Phone Number", name: "phone", type: "text" },
  { label: "Address", name: "address", type: "text", span: true },
  { label: "City", name: "city", type: "text" },
  { label: "State", name: "state", type: "text" },
  { label: "District", name: "district", type: "text" }, // ✅ NEW
  { label: "Country", name: "country", type: "text" },   // ✅ NEW
  { label: "Pincode", name: "pincode", type: "text", span: true },
].map((input) => (
                  <div key={input.name} className={`${input.span ? "md:col-span-2" : ""}`}>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1">{input.label}</label>
                    <input
                      type={input.type}
                      name={input.name}
                      value={shipping[input.name]}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all font-semibold ${
                    paymentMethod === "card" 
                    ? "border-pink-600 bg-pink-50 text-pink-700" 
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl">💳</span> Online Payment
                </button>
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all font-semibold ${
                    paymentMethod === "cod" 
                    ? "border-pink-600 bg-pink-50 text-pink-700" 
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl">🚚</span> Cash on Delivery
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 ">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="max-h-64 overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.mainImage ? `${IMAGE_BASE}${item.mainImage}` : "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity || 1}</p>
                      <p className="text-sm font-bold text-pink-600">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>+ ₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-pink-600">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-8 w-full bg-pink-600 text-white py-4 rounded-xl text-lg font-bold shadow-pink-200 shadow-lg hover:bg-pink-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  paymentMethod === "cod" ? "Confirm Order" : "Proceed to Pay"
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 px-4">
                By completing your purchase, you agree to our Terms of Service.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;