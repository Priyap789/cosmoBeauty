const AboutUs = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-pink-50 py-20 text-center">
        <h1 className="text-4xl font-bold text-pink-600">About COSMO</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Redefining beauty with 100% authentic and premium beauty products
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/image/aboutus.jpg"
          alt="About Cosmo"
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 mb-4">
            COSMO is your trusted destination for premium beauty, skincare,
            haircare, and cosmetic products. We bring you the best brands,
            carefully curated to enhance your natural beauty.
          </p>

          <p className="text-gray-600 mb-4">
            Our mission is to provide authentic products, transparent pricing,
            and a seamless shopping experience for beauty lovers.
          </p>

          <ul className="space-y-2 text-gray-700">
            <li>✔ 100% Genuine Products</li>
            <li>✔ Trusted Beauty Brands</li>
            <li>✔ Fast & Secure Delivery</li>
            <li>✔ Customer-Centric Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
