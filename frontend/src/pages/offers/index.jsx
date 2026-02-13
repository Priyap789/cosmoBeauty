import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import SpecialOffers from "../../components/SpecialOffers";
import DontMissOut from "../../components/DontMissOut";

const API_URL = "http://localhost:8000/api/products/offers";

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
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
    return <p className="text-center py-10">Loading offers...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  if (products.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No active offers right now.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <SpecialOffers/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <div>
        
        <DontMissOut/>
      
      </div>
    </div>
    
  );
}
