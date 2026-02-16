import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:8000/api/contact/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setStatus("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setStatus("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50">

      {/* 🔥 Gradient Hero Section */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-sm">
          We'd love to hear from you. Get in touch with us!
        </p>
      </div>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>

          <div className="space-y-4">

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">📞 Phone</p>
              <p className="text-gray-600 text-sm">+91 84909 98002</p>
              <p className="text-gray-600 text-sm">+91 80000 12345</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">✉ Email</p>
              <p className="text-gray-600 text-sm">support@cosmo.com</p>
              <p className="text-gray-600 text-sm">info@cosmo.com</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">📍 Address</p>
              <p className="text-gray-600 text-sm">
                Nadiad, Gujarat, India
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">🕒 Business Hours</p>
              <p className="text-gray-600 text-sm">
                Mon - Sat: 9:00 AM - 8:00 PM
              </p>
              <p className="text-gray-600 text-sm">
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            Send us a Message
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Fill out the form below and we’ll get back to you within 24 hours.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-purple-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3 focus:outline-purple-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border rounded-lg px-4 py-3 focus:outline-purple-500"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-purple-500"
              >
                <option value="">Select a subject</option>
                <option value="Order">Order Related</option>
                <option value="Product">Product Inquiry</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you..."
              className="w-full border rounded-lg px-4 py-3 focus:outline-purple-500"
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <p className="text-center text-green-600 text-sm mt-2">
              {status}
            </p>
          )}
        </form>

      </div>
    </div>
  );
};

export default ContactUs;
