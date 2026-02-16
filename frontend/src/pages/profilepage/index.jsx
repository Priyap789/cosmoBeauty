import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/profile";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPopup, setShowPopup] = useState(false); // State for custom popup
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const updatedAddress = { ...formData.addresses[0], [e.target.name]: e.target.value };
    setFormData({ ...formData, addresses: [updatedAddress] });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // TRIGGER CUSTOM POPUP
      setShowPopup(true);
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-8 px-4 md:px-16 relative">
      
      {/* --- CUSTOM POPUP MESSAGE --- */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gray-800 text-white px-8 py-3 rounded-sm shadow-2xl flex items-center gap-3 border-b-4 border-green-500">
            <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
            <span className="text-sm font-medium">Profile Saved Successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/4 space-y-4">
          <div className="bg-white p-3 shadow-sm flex items-center gap-4 rounded-sm">
            <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-bold uppercase shadow-inner">
              {formData.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-tighter">Hello,</p>
              <p className="font-bold text-gray-800 truncate w-32">{formData.name || "User"}</p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <div 
              onClick={() => setActiveTab("orders")}
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition ${activeTab === 'orders' ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center gap-3 text-gray-400 font-bold uppercase text-[12px]">
                <span className="text-blue-600 text-lg">📦</span> MY ORDERS
              </div>
              <span className="text-gray-300 text-xs">❯</span>
            </div>

            <div className="bg-white pb-2">
              <div className="p-4 flex items-center gap-3 text-blue-600 font-bold uppercase text-[12px]">
                <span>👤</span> ACCOUNT SETTINGS
              </div>
              <ul className="text-sm">
                <li 
                  onClick={() => setActiveTab("profile")}
                  className={`px-12 py-3 cursor-pointer transition ${activeTab === 'profile' ? 'text-blue-600 font-bold bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
                >
                  Profile Information
                </li>
                <li 
                  onClick={() => setActiveTab("addresses")}
                  className={`px-12 py-3 cursor-pointer transition ${activeTab === 'addresses' ? 'text-blue-600 font-bold bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
                >
                  Manage Addresses
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-white shadow-sm rounded-sm min-h-[500px]">
          
          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-8">Personal Information</h3>
              <div className="space-y-8 max-w-lg">
                <div className="relative border border-gray-300 p-3 rounded-sm focus-within:border-blue-600 transition-all">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-gray-500">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full outline-none text-sm font-medium" />
                </div>
                
                <div className="relative bg-gray-50 border border-gray-200 p-3 rounded-sm cursor-not-allowed">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-gray-400">Email Address</label>
                  <input value={formData.email} disabled className="w-full bg-transparent outline-none text-sm text-gray-400 italic" />
                </div>

                <div className="relative border border-gray-300 p-3 rounded-sm focus-within:border-blue-600 transition-all">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-gray-500">Mobile Number</label>
                  <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full outline-none text-sm font-medium" />
                </div>

                <button 
                  onClick={handleSave} 
                  className="bg-[#fb641b] hover:bg-[#e65a17] text-white px-16 py-3 rounded-sm font-bold uppercase text-sm shadow-lg transform transition active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB: ORDERS (Empty State) */}
          {activeTab === "orders" && (
            <div className="flex flex-col items-center justify-center h-full p-10 py-20">
              <img 
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders-empty_31631b.png" 
                alt="Empty" 
                className="w-56 opacity-80"
              />
              <p className="mt-6 text-lg font-semibold text-gray-700">No Orders Found</p>
              <p className="text-gray-400 text-sm mt-1">Check out our latest beauty products!</p>
              <button className="mt-6 bg-[#2874f0] text-white px-10 py-2 rounded-sm font-bold uppercase text-sm">Shop Now</button>
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Manage Addresses</h3>
              <div className="border border-blue-100 p-6 rounded-sm bg-blue-50/10 border-dashed">
                <button className="text-blue-600 font-bold text-sm">+ ADD A NEW ADDRESS</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <input name="address" placeholder="Address" value={formData.addresses[0]?.address} onChange={handleAddressChange} className="col-span-2 border border-gray-300 p-3 text-sm rounded-sm" />
                  <input name="city" placeholder="City" value={formData.addresses[0]?.city} onChange={handleAddressChange} className="border border-gray-300 p-3 text-sm rounded-sm" />
                  <input name="pincode" placeholder="Pincode" value={formData.addresses[0]?.pincode} onChange={handleAddressChange} className="border border-gray-300 p-3 text-sm rounded-sm" />
                </div>
                <button onClick={handleSave} className="mt-6 bg-[#2874f0] text-white px-10 py-2 rounded-sm font-bold uppercase text-sm">Save Address</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}