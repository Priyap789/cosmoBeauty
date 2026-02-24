import { useEffect, useState, useRef } from "react";
import ProductCard from "../../components/ProductCard";
import DontMissOut from "../../components/DontMissOut";

const API_URL = "http://localhost:8000/api/products/offers";

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🔥 Prevents double API calls in React Strict Mode (Development)
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch offers");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      
      {/* 🔥 Gradient Hero Section - Matches Contact Page */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Exclusive Offers</h1>
        <p className="mt-3 text-sm opacity-90 max-w-md mx-auto">
          Premium products at discounted prices. Grab them before they're gone!
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center mb-10">
            {error}
          </div>
        )}

        {/* Product Grid Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">Available Deals</h2>
          <div className="h-px flex-grow mx-6 bg-gray-200 hidden md:block"></div>
          <span className="text-sm text-gray-500 font-medium bg-white px-4 py-1 rounded-full border">
            {products.length} Items
          </span>
        </div>

        {/* Product Grid */}
        {products.length === 0 && !error ? (
          <div className="bg-white p-20 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
            <p className="text-gray-400 font-medium">No active offers available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="transition-all duration-300 hover:scale-[1.02]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="mt-24">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <DontMissOut />
          </div>
        </div>

      </div>
    </div>
  );
}