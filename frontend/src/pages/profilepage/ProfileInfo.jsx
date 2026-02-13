import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileInfo({ user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  // Load user data into form when user prop changes
  useEffect(() => {
    if (user) {
      const [firstName, lastName] = user.name ? user.name.split(" ") : ["", ""];
      setForm({
        firstName,
        lastName,
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });



const handleSave = async () => {
  // Basic validation
  if (!form.firstName?.trim() || !form.lastName?.trim()) {
    alert("Please enter both first and last name.");
    return;
  }
  if (!form.email?.trim()) {
    alert("Please enter your email.");
    return;
  }

  const updatedName = `${form.firstName.trim()} ${form.lastName.trim()}`;

  try {
    setLoading(true); // start loading

    const res = await axios.put(`http://localhost:8000/api/profile/${userId}`, {
      name: updatedName,
      email: form.email.trim(),
      mobile: form.mobile?.trim() || "",
    });

    // Update UI with new data
    setUser(res.data);
    setEdit(false);

    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);

    // Show backend error if available
    const message = err.response?.data?.message || "Failed to save changes.";
    alert(message);
  } finally {
    setLoading(false); // stop loading
  }
};


  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <button
          onClick={() => setEdit(!edit)}
          className="text-blue-600 text-sm"
        >
          {edit ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="firstName"
          value={form.firstName}
          disabled={!edit}
          onChange={handleChange}
          className="input"
          placeholder="First Name"
        />
        <input
          name="lastName"
          value={form.lastName}
          disabled={!edit}
          onChange={handleChange}
          className="input"
          placeholder="Last Name"
        />
      </div>

      <div className="mb-6">
        <input
          name="email"
          value={form.email}
          disabled={!edit}
          onChange={handleChange}
          className="input w-full"
          placeholder="Enter email address"
        />
      </div>

      <div className="mb-6">
        <input
          name="mobile"
          value={form.mobile}
          disabled={!edit}
          onChange={handleChange}
          className="input w-full"
          placeholder="Enter mobile number"
        />
      </div>

      {edit && (
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      )}

      <button className="text-red-500 text-sm mt-6">Delete Account</button>
    </>
  );
}
