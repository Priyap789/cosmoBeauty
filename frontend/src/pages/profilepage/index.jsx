import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/profile";

export default function Profile() {
  const token = localStorage.getItem("token"); // use JWT instead of userId

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
    if (!token) return; // no token, skip fetch

    axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setFormData(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  // Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Address change
  const handleAddressChange = (e) => {
    const updatedAddress = { ...formData.addresses[0] };
    updatedAddress[e.target.name] = e.target.value;

    setFormData({
      ...formData,
      addresses: [updatedAddress],
    });
  };

  // Save
  const handleSave = async () => {
    if (!token) return alert("User not authenticated");

    try {
      const res = await axios.put(`${API_URL}/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile Updated");
      setFormData(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        disabled
        className="border p-2 w-full mb-3 bg-gray-100"
      />

      <input
        type="text"
        name="mobile"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <h3 className="font-semibold mt-4">Address</h3>

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.addresses[0]?.address || ""}
        onChange={handleAddressChange}
        className="border p-2 w-full mb-3"
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.addresses[0]?.city || ""}
        onChange={handleAddressChange}
        className="border p-2 w-full mb-3"
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.addresses[0]?.state || ""}
        onChange={handleAddressChange}
        className="border p-2 w-full mb-3"
      />

      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={formData.addresses[0]?.pincode || ""}
        onChange={handleAddressChange}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={handleSave}
        className="bg-black text-white px-5 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
