import {
  Heart,
  ShieldCheck,
  Award,
  Target,
  Users,
  Package,
  Star,
  Truck,
  RotateCcw,
  Headphones
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="w-full bg-gray-50">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">About Cosmo</h1>
        <p className="mt-3 text-sm">
          Your trusted destination for premium beauty products
        </p>
      </div>

      {/* Our Story */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Story
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Cosmo was founded with a simple vision: to make premium beauty
          products accessible to everyone. We believe that self-care and
          beauty should be inclusive, affordable, and of the highest quality.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <Heart className="mx-auto text-pink-500 mb-3" size={40} />
            <h3 className="font-semibold text-lg">Customer First</h3>
            <p className="text-gray-600 text-sm mt-2">
              Your satisfaction is our top priority.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <Award className="mx-auto text-purple-500 mb-3" size={40} />
            <h3 className="font-semibold text-lg">Quality Assured</h3>
            <p className="text-gray-600 text-sm mt-2">
              Every product meets high quality standards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ShieldCheck className="mx-auto text-pink-500 mb-3" size={40} />
            <h3 className="font-semibold text-lg">100% Authentic</h3>
            <p className="text-gray-600 text-sm mt-2">
              Guaranteed original and genuine products.
            </p>
          </div>

        </div>

        {/* Mission Section */}
        <div className="bg-white mt-12 p-8 rounded-xl shadow text-left">
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-purple-600" size={28} />
            <h3 className="text-xl font-semibold text-gray-800">
              Our Mission
            </h3>
          </div>
          <p className="text-gray-600">
            To empower individuals to look and feel their best by providing
            premium beauty products at affordable prices.
          </p>
        </div>



        {/* Why Choose Section */}
        <div className="bg-pink-50 mt-12 p-8 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Why Choose Cosmo?
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-pink-500" />
                <span>Wide Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-pink-500" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-pink-500" />
                <span>Cash on Delivery</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-purple-500" />
                <span>Affordable Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-purple-500" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={18} className="text-purple-500" />
                <span>Expert Support</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
