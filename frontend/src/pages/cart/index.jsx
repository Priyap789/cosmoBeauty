import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../redux/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const updateQty = async (productId, newQty) => {
    try {
      await axios.put("http://localhost:8000/api/cart/update", {
        userId,
        productId,
        quantity: newQty,
      });
      dispatch(fetchCart(userId));
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (productId) => {
    await axios.delete("http://localhost:8000/api/cart/remove", {
      data: { userId, productId },
    });
    dispatch(fetchCart(userId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cartItems.length} items waiting for you
            </p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">
            <ArrowLeft size={18} />
            <span>Back to Shop</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems
                .filter((item) => item.product !== null)
                .map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center shadow-sm border border-gray-100 hover:border-pink-200 transition-colors group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 w-full sm:w-28 h-28 flex-shrink-0">
                      <img
                        src={`http://localhost:8000${item.product.images?.[0]}`}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-pink-600 font-semibold mt-1">
                        ₹{item.price} <span className="text-xs text-gray-400 font-normal">per unit</span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQty(item.product._id, item.quantity - 1);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-gray-600 transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-gray-600 transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Remove Item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal per item */}
                    <div className="text-right sm:border-l border-gray-100 sm:pl-6 w-full sm:w-auto">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Subtotal</p>
                      <p className="text-xl font-pink text-gray-900 mt-1">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Bag Total</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-gray-900">₹{tax}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  {shipping !== 0 && (
                    <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                      <p className="text-xs text-pink-700 leading-tight">
                        🎉 Add <span className="font-bold">₹{1000 - subtotal}</span> more to get <span className="font-bold">Free Shipping</span>!
                      </p>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-pink text-pink-600">₹{total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-pink transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center text-sm font-bold text-gray-400 mt-6 hover:text-pink-600 transition-colors uppercase tracking-widest"
                >
                  Continue Shopping
                </Link>

                
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;