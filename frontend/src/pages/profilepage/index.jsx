import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8000/api/profile";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [focusedField, setFocusedField] = useState("");

const handleFocus = (field) => setFocusedField(field);

const handleBlur = (field) => {
  if (formData[field]) {
    return;
  }

  if (formData.addresses?.[0]?.[field]) {
    return;
  }

  setFocusedField("");
};
const [formData, setFormData] = useState({
  name: "",
  email: "",
  mobile: "",
  addresses: [
    {
      fullName: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  ],
});

  // Fetch profile
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFormData(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  // Fetch orders
  useEffect(() => {
    if (activeTab === "orders" && token) {
      axios
        .get("http://localhost:8000/api/checkout/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data.data))
        .catch((err) => console.log(err));
    }
  }, [activeTab, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const updatedAddress = {
      ...formData.addresses[0],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, addresses: [updatedAddress] });
  };

  // SweetAlert Success
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: message,
      confirmButtonText: "ok",
      background: "#fff",
      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "text-pink-800 font-bold text-xl",
        confirmButton:
          "bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-xl font-bold uppercase text-sm",
      },
      buttonsStyling: false,
    });
  };

  // SweetAlert Error
  const showErrorAlert = () => {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Something went wrong. Please try again.",
      confirmButtonText: "Okay",
      customClass: {
        popup: "rounded-3xl shadow-xl",
        confirmButton:
          "bg-pink-500 text-white px-6 py-2 rounded-xl font-bold",
      },
      buttonsStyling: false,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccessAlert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Update failed", error);
      showErrorAlert();
    } finally {
      setLoading(false);
    }
  };
const handleCancelOrder = async (orderId) => {
  const result = await Swal.fire({
    title: "Cancel Order?",
    input: "text",
    inputLabel: "Reason for cancellation",
    inputPlaceholder: "Enter reason...",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Cancel it",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const reason = result.value || "Customer cancelled";

  try {
    await axios.put(
      `http://localhost:8000/api/checkout/cancel/${orderId}`,
      { reason }, // ✅ send reason
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

    // Update UI
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, deliveryStatus: "Cancelled", cancelReason: reason }
          : order
      )
    );
  } catch (error) {
    Swal.fire("Error", "Failed to cancel order", "error");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
        <p className="mt-3 text-sm opacity-90">
          Manage your personal details, addresses, and track your orders.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 shadow-lg rounded-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 mx-auto">
              {formData.name?.charAt(0) || "U"}
            </div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
              Welcome back,
            </p>
            <p className="font-bold text-gray-800 text-lg truncate">
              {formData.name || "User"}
            </p>
          </div>

          <nav className="bg-white shadow-md rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full px-4 py-3 rounded-xl transition ${
                activeTab === "profile"
                  ? "bg-pink-50 text-pink-600 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              👤 Profile Information
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full px-4 py-3 rounded-xl transition ${
                activeTab === "addresses"
                  ? "bg-pink-50 text-pink-600 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📍 Manage Addresses
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full px-4 py-3 rounded-xl transition ${
                activeTab === "orders"
                  ? "bg-pink-50 text-pink-600 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📦 My Orders
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white shadow-xl rounded-2xl p-8 min-h-[500px]">
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  Update your name and contact details.
                </p>

                <div className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    onFocus={() => handleFocus("name")}
    onBlur={() => handleBlur("name")}
    className="w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
  />

  <label
    className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
      ${
        focusedField === "name" || formData.name
          ? "-top-2 text-xs text-pink-500 bg-white px-1"
          : "top-4"
      }`}
  >
    Full Name
  </label>
</div>
                    <div className="relative">
  <input
    type="tel"
    name="mobile"
    value={formData.mobile}
    onChange={handleChange}
    onFocus={() => handleFocus("mobile")}
    onBlur={() => handleBlur("mobile")}
    className="w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
  />

  <label
    className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
      ${
        focusedField === "mobile" || formData.mobile
          ? "-top-2 text-xs text-pink-500 bg-white px-1"
          : "top-4"
      }`}
  >
    Mobile Number
  </label>
</div>
                  </div>

                  <div className="relative">
  <input
    type="email"
    value={formData.email}
    disabled
    className="w-full border rounded-lg px-4 pt-5 pb-2 bg-gray-100 text-gray-500 peer"
  />

  <label className="-top-2 text-xs text-gray-400 bg-white px-1 absolute left-4">
    Email Address
  </label>
</div>

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-12 py-3 rounded-xl font-bold uppercase text-sm shadow-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB (unchanged layout) */}
            {activeTab === "addresses" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Shipping Addresses
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  Manage where your products get delivered.
                </p>

                <div className="bg-purple-50/50 border-2 border-dashed border-purple-200 p-8 rounded-2xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative col-span-2">
  <input
    type="text"
    name="address"
    value={formData.addresses[0]?.address || ""}
    onChange={handleAddressChange}
    onFocus={() => handleFocus("address")}
    onBlur={() => handleBlur("address")}
    className="w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
  />

  <label
    className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
    ${
      focusedField === "address" || formData.addresses[0]?.address
        ? "-top-2 text-xs text-pink-500 bg-white px-1"
        : "top-4"
    }`}
  >
    Detailed Address
  </label>
</div>
                  <div className="relative">
  <input
    type="text"
    name="city"
    value={formData.addresses[0]?.city || ""}
    onChange={handleAddressChange}
    onFocus={() => handleFocus("city")}
    onBlur={() => handleBlur("city")}
    className="w-full border rounded-lg px-4 pt-5 pb-2 focus:ring-2 focus:ring-pink-500 peer"
  />

  <label
    className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
    ${
      focusedField === "city" || formData.addresses[0]?.city
        ? "-top-2 text-xs text-pink-500 bg-white px-1"
        : "top-4"
    }`}
  >
    City
  </label>
</div>
                   <div className="relative">
  <input
    type="text"
    name="pincode"
    value={formData.addresses[0]?.pincode || ""}
    onChange={handleAddressChange}
    onFocus={() => handleFocus("pincode")}
    onBlur={() => handleBlur("pincode")}
    className="w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
  />

  <label
    className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
    ${
      focusedField === "pincode" || formData.addresses[0]?.pincode
        ? "-top-2 text-xs text-pink-500 bg-white px-1"
        : "top-4"
    }`}
  >
    Pincode
  </label>
</div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="mt-8 bg-pink-600 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-pink-700 transition"
                  >
                    Update Address
                  </button>
                </div>
              </div>
            )}

            {/* ORDERS TAB — your original logic untouched */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  My Orders
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xl font-bold text-gray-700">
                      No Orders Yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
  <div
    key={order._id}
    className="border rounded-xl p-6 shadow-sm bg-gray-50"
  >
    {/* Order Header */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
      <div>
        <p className="font-semibold text-gray-800">
          Order ID: {order._id?.toString().slice(-6)}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-4 mt-2 md:mt-0 items-center">

  <span
    className={`text-sm font-semibold px-3 py-1 rounded-full ${
      order.paymentStatus === "paid"
        ? "bg-green-100 text-green-600"
        : "bg-yellow-100 text-yellow-600"
    }`}
  >
    Payment: {order.paymentStatus || "Pending"}
  </span>

  {/* Cancel Button */}
  {order.deliveryStatus !== "Cancelled" && order.deliveryStatus !== "Delivered" && (
    <button
      onClick={() => handleCancelOrder(order._id)}
      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
    >
      Cancel Order
    </button>
  )}
</div>
    </div>

    {/* Product Items */}
    {order.items.map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-between border-b py-3"
      >
        <div className="flex items-center gap-4">
          {item.mainImage && (
            <img
  src={`http://localhost:8000${item.mainImage}`}
  alt={item.name}
  className="w-16 h-16 object-cover"
/>
          )}

          <div>
            <p className="font-medium text-gray-800">{item.name}</p>

            <p className="text-xs text-gray-500">
              Quantity: {item.quantity}
            </p>

            <p className="text-xs text-gray-500">
              Price: ₹{item.price}
            </p>
          </div>
        </div>

        <div className="font-semibold text-gray-700">
          ₹{item.price * item.quantity}
        </div>
      </div>
    ))}

    {/* Total */}
    <div className="flex justify-between mt-4 pt-3 font-bold text-lg">
      <span>Total</span>
      <span>₹{order.amount}</span>
    </div>
    
{/* Cancel Message */}

{/* If USER cancelled → show reason */}
{order.cancelledBy === "user" && order.cancelReason && (
  <div className="mt-2 text-sm text-red-600">
    <strong>Your Reason:</strong> {order.cancelReason}
  </div>
)}

{/* If ADMIN cancelled → show simple message */}
{order.cancelledBy === "admin" && (
  <div className="mt-2 text-sm text-red-600">
    <strong>Order Cancelled by Admin</strong>
  </div>
)}

{/* Admin Message */}
{order.adminMessage && (
  <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-sm text-yellow-800">
    <strong>Message from Admin:</strong> {order.adminMessage}
  </div>
)}
{/* Refund Status */}
{order.refundStatus === "processing" && (
  <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded-md text-sm text-blue-800">
    💳 Refund is processing. Amount will be returned within 2 days.
  </div>
)}

{order.refundStatus === "completed" && (
  <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 rounded-md text-sm text-green-800">
    ✅ Refund completed. Amount returned to your account.
  </div>
)}

  </div>
))}

                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}