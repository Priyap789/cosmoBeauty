const ContactUs = () => {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-pink-50 py-20 text-center">
        <h1 className="text-4xl font-bold text-pink-600">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          We'd love to hear from you 💄
        </p>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Get in Touch
          </h2>

          <p className="text-gray-600 mb-6">
            Have a question about our products or orders? Reach out to us anytime.
          </p>

          <div className="space-y-4 text-gray-700">
            <p><strong>Email:</strong> support@cosmo.com</p>
            <p><strong>Phone:</strong> +91 84909 98002</p>
            <p><strong>Address:</strong> Nadiad, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-3 focus:outline-pink-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-3 focus:outline-pink-500"
          />
          <input
            type=""
            placeholder="Your Number"
            className="w-full border rounded-lg px-4 py-3 focus:outline-pink-500"
          />

          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full border rounded-lg px-4 py-3 focus:outline-pink-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
