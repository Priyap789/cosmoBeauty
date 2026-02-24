import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/profile";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    addresses: [{ fullName: "", mobile: "", address: "", city: "", state: "", pincode: "" }],
    
  });

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setFormData(res.data))
    .catch((err) => console.log(err));
  }, [token]);

useEffect(() => {
  if (activeTab === "orders" && token) {
    axios.get("http://localhost:8000/api/checkout/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setOrders(res.data.data);
    })
    .catch((err) => console.log(err));
  }
}, [activeTab, token]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const updatedAddress = { ...formData.addresses[0], [e.target.name]: e.target.value };
    setFormData({ ...formData, addresses: [updatedAddress] });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* 🔥 Gradient Hero Section - Matching Contact Us */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold  tracking-tight">My Account</h1>
        <p className="mt-3 text-sm opacity-90">
          Manage your personal details, addresses, and track your orders.
        </p>
      </div>

      {/* --- CUSTOM POPUP MESSAGE --- */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white text-gray-800 px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-pink-200 animate-bounce">
            <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
            <span className="text-sm font-semibold">Profile Updated Successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid md:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR - Modern Card Style */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
              {formData.name?.charAt(0) || "U"}
            </div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Welcome back,</p>
            <p className="font-bold text-gray-800 text-lg truncate w-full">{formData.name || "User"}</p>
          </div>

          <nav className="bg-white shadow-md rounded-2xl overflow-hidden p-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              👤 Profile Information
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'addresses' ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              📍 Manage Addresses
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              📦 My Orders
            </button>
          </nav>
        </div>

        {/* RIGHT CONTENT - Matching Contact Us Form Style */}
        <div className="md:col-span-3">
          <div className="bg-white shadow-xl rounded-2xl p-8 min-h-[500px]">
            
            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-500 text-sm mb-8">Update your name and contact details.</p>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input 
                        name="mobile" 
                        value={formData.mobile} 
                        onChange={handleChange} 
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Read Only)</label>
                    <input 
                      value={formData.email} 
                      disabled 
                      className="w-full border rounded-xl px-4 py-3 bg-gray-100 text-gray-400 cursor-not-allowed italic"
                    />
                  </div>

                  <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-12 py-3 rounded-xl font-bold uppercase text-sm shadow-lg hover:opacity-90 transition transform active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Shipping Addresses</h3>
                <p className="text-gray-500 text-sm mb-8">Manage where your products get delivered.</p>
                
                <div className="bg-purple-50/50 border-2 border-dashed border-purple-200 p-8 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Address</label>
                      <input name="address" value={formData.addresses[0]?.address} onChange={handleAddressChange} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="House No, Street, Locality" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input name="city" value={formData.addresses[0]?.city} onChange={handleAddressChange} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input name="pincode" value={formData.addresses[0]?.pincode} onChange={handleAddressChange} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                  </div>
                  <button onClick={handleSave} className="mt-8 bg-pink-600 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-purple-700 transition">
                    Update Address
                  </button>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
  <div className="animate-fadeIn">
    <h3 className="text-xl font-bold text-gray-800 mb-6">
      My Orders
    </h3>

    {orders.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="p-6 bg-pink-50 rounded-full mb-6">
          <span className="text-5xl">🛍️</span>
        </div>
        <p className="text-xl font-bold text-gray-700">
          No Orders Yet
        </p>
        <button className="mt-8 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-10 py-3 rounded-xl font-bold uppercase text-sm shadow-lg">
          Start Shopping
        </button>
      </div>
    ) : (
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-6 shadow-sm bg-gray-50"
          >
            <div className="flex justify-between mb-3">
              <p className="font-semibold">
                Order ID: {order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t font-bold">
              <span>Total</span>
              <span>₹{order.amount}</span>
            </div>

           <div className="mt-2 text-sm">
  Delivery Status:{" "}
  <span
    className={
      order.deliveryStatus === "Delivered"
        ? "text-green-600 font-semibold"
        : order.deliveryStatus === "Cancelled"
        ? "text-red-600 font-semibold"
        : "text-orange-500 font-semibold"
    }
  >
    {order.deliveryStatus}
  </span>
</div>
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