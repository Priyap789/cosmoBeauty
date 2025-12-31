import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import products from "../../data/products";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10">
      {/* Product Image */}
      <div className="flex-1 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-md object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-pink-400 uppercase">{product.category}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" />
          <span>{product.rating} ({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <p className="text-2xl font-bold">₹{product.price}</p>

        {/* Description */}
        <p className="text-gray-600">{product.description}</p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-4">
          <span>Quantity:</span>
          <div className="flex items-center border rounded">
            <button
              className="px-3 py-1"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="bg-pink-100 text-pink-600 px-6 py-2 rounded font-semibold hover:bg-pink-200"
          >
            Add to Cart
          </button>
          <button className="bg-pink-600 text-white px-6 py-2 rounded font-semibold hover:bg-pink-700">
            Buy Now
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 space-y-2">
          <p className="flex items-center gap-2 text-gray-600">
            <span className="text-pink-500">●</span> Free Shipping on orders
            above ₹999
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <span className="text-pink-500">●</span> 100% Authentic Products
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b">
            {["Description", "Ingredients", "How to Use"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab
                    ? "border-b-2 border-pink-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 text-gray-700">
            {activeTab === "Description" && <p>{product.description}</p>}
            {activeTab === "Ingredients" && (
              <ul className="list-disc pl-5 space-y-1">
                {product.ingredients?.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            )}
            {activeTab === "How to Use" && <p>{product.howToUse}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
