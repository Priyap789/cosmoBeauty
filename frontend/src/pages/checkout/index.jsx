import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const token = localStorage.getItem("token");

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

    axios.get("http://localhost:8000/api/profile/me", {
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

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/checkout/create-order",
        {
          items: cartItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
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
        description: "Test Transaction",
        handler: async function (response) {
  await axios.post(
    "http://localhost:8000/api/checkout/verify-payment",
    {
      razorpayResponse: response,
      items: cartItems.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shipping,
      totalAmount,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  alert("Payment Successful!");
},
        prefill: {
          name: shipping.name,
          contact: shipping.phone,
        },
        theme: { color: "#F472B6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="space-y-4">
        <input type="text" name="name" value={shipping.name} onChange={handleChange} placeholder="Name" className="input" />
        <input type="text" name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="input" />
        <input type="text" name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="input" />
        <input type="text" name="state" value={shipping.state} onChange={handleChange} placeholder="State" className="input" />
        <input type="text" name="pincode" value={shipping.pincode} onChange={handleChange} placeholder="Pincode" className="input" />
        <input type="text" name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone" className="input" />
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax (18%): ₹{tax}</p>
        <p>Shipping: ₹{shippingFee === 0 ? "Free" : shippingFee}</p>
        <p className="font-semibold">Total: ₹{totalAmount}</p>
      </div>

      <button
        onClick={handlePayment}
        className="mt-4 w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
      >
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;