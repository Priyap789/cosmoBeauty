import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(""); // Track focus for labels

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData({ ...formData, phone: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit Indian mobile number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/contact/contactus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Something went wrong",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Message sent successfully!",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= LABEL HANDLER =================
  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field) =>
    setFocusedField((prev) => (formData[field] ? prev : ""));

  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center"
      >
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-sm opacity-90">
          We'd love to hear from you. Get in touch with us!
        </p>
      </motion.div>

      {/* MAIN SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold">📞 Phone</p>
              <p className="text-sm text-gray-600">+91 84909 98002</p>
              <p className="text-sm text-gray-600">+91 80000 12345</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold">✉ Email</p>
              <p className="text-sm text-gray-600">support@cosmo.com</p>
              <p className="text-sm text-gray-600">info@cosmo.com</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold">📍 Address</p>
              <p className="text-sm text-gray-600">Nadiad, Gujarat, India</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-6 relative"
          >
            <h2 className="text-xl font-semibold">Send us a Message</h2>

            {/* INPUT COMPONENT */}
            {["name", "email", "phone", "message"].map((field) => (
              <div key={field} className="relative">
                {field !== "message" ? (
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field)}
                    onBlur={() => handleBlur(field)}
                    maxLength={field === "phone" ? 10 : undefined}
                    className={`w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500
                      peer ${errors[field] ? "border-red-500" : "border-gray-300"}`}
                  />
                ) : (
                  <textarea
                    rows="4"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field)}
                    onBlur={() => handleBlur(field)}
                    className={`w-full border rounded-lg px-4 pt-5 pb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500
                      peer resize-none ${errors[field] ? "border-red-500" : "border-gray-300"}`}
                  ></textarea>
                )}

                {/* FLOATING LABEL */}
                <label
                  className={`absolute left-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
                    ${
                      focusedField === field || formData[field]
                        ? "-top-2 text-xs text-pink-500 bg-white px-1"
                        : "top-4"
                    }`}
                >
                  {field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : field === "phone"
                    ? "Phone Number"
                    : "Your Message"}
                </label>

                {/* ERROR MESSAGE */}
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;