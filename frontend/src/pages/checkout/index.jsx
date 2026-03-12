import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const reduxCartItems = useSelector((state) => state.cart.items);
  const cartItems = buyNowItem
    ? [buyNowItem]   // If Buy Now → use only that product
    : reduxCartItems; // Else → normal cart
  const token = localStorage.getItem("token");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
 
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
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

        setShipping({
          name: user.name || "",
          address: user.addresses?.[0]?.address || "",
          city: user.addresses?.[0]?.city || "",
          state: user.addresses?.[0]?.state || "",
          pincode: user.addresses?.[0]?.pincode || "",
          phone: user.mobile || "",
        });
      })
      .catch((err) => console.log(err));
  }, [token]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + tax + shippingFee;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !shipping.name ||
      !shipping.address ||
      !shipping.city ||
      !shipping.state ||
      !shipping.pincode ||
      !shipping.phone
    ) {
      Swal.fire({
        title: "Missing Details",
        text: "Please fill all shipping details.",
        icon: "warning",
        confirmButtonColor: "#ec4899",
      });
      return false;
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

    if (paymentMethod === "cod") {
      try {
        const formattedItems = cartItems.map(item => ({
  productId: item.productId || item._id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  mainImage: item.mainImage || item.images?.[0] || ""
}));
        await axios.post(
          "http://localhost:8000/api/checkout/cod-order",
          {
            items: formattedItems,
            shipping,
            totalAmount,
            paymentMethod: "COD",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire({
          title: "Order Confirmed 🎉",
          html: `
            <p style="margin-bottom:8px;">
              Your order has been placed successfully.
            </p>
            <p style="font-size:14px;">
              📧 A confirmation email has been sent to you.<br/>
              🚚 Please pay cash when your order is delivered.
            </p>
          `,
          icon: "success",
          confirmButtonColor: "#ec4899",
        });

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#ec4899",
        });
      } finally {
        setLoading(false);
      }

    } else {
      // Razorpay Payment
      // Razorpay Payment
try {

  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    Swal.fire("Error", "Razorpay SDK failed to load.", "error");
    setLoading(false);
    return;
  }

  const res = await axios.post(
    "http://localhost:8000/api/checkout/create-order",
    {
      items: cartItems.map(item => ({
  productId: item.productId || item._id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  mainImage: item.mainImage || item.images?.[0] || ""
})),
      shipping,
      totalAmount,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const { order } = res.data;
  
  const options = {
    key: "rzp_test_SHWEffooS82UUC",
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: "Your Store",
    description: "Order Payment",

    handler: async function (response) {

      await axios.post(
        "http://localhost:8000/api/checkout/verify-payment",
        {
          razorpayResponse: response,
          items: cartItems.map(item => ({
  productId: item.productId || item._id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  mainImage: item.mainImage || item.images?.[0] || item.image || ""
})),
          shipping,
          totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Payment Successful 💗",
        text: "Your order has been confirmed!",
        icon: "success",
        confirmButtonColor: "#ec4899",
      });
    },

    prefill: {
      name: shipping.name,
      contact: shipping.phone,
    },

    theme: {
      color: "#ec4899",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();

} catch (error) {
  Swal.fire({
    title: "Payment Failed",
    text: "Something went wrong.",
    icon: "error",
  });
} finally {
  setLoading(false);
}
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
          Checkout
        </h1>

        {/* Shipping */}
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" name="name" value={shipping.name} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="text" name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone Number" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="text" name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="text" name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="text" name="state" value={shipping.state} onChange={handleChange} placeholder="State" className="border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="text" name="pincode" value={shipping.pincode} onChange={handleChange} placeholder="Pincode" className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-pink-400 outline-none" />
        </div>

        {/* Payment Method */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Select Payment Method</h2>

          <div className="flex gap-4">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 py-3 rounded-lg border transition ${
                paymentMethod === "card"
                  ? "bg-pink-600 text-white"
                  : "bg-white"
              }`}
            >
              💳 Card / UPI
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex-1 py-3 rounded-lg border transition ${
                paymentMethod === "cod"
                  ? "bg-pink-600 text-white"
                  : "bg-white"
              }`}
            >
              🚚 Cash on Delivery
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gray-100 p-6 rounded-xl">
          <p>Subtotal: ₹{subtotal}</p>
          <p>Tax (18%): ₹{tax}</p>
          <p>Shipping: ₹{shippingFee === 0 ? "Free" : shippingFee}</p>
          <p className="text-xl font-bold mt-2">Total: ₹{totalAmount}</p>
        </div>

        {/* Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-6 w-full bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-pink-700 transition disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "cod"
            ? "Place Order"
            : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;