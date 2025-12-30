import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../redux/cartSlice";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.18);
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT – CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 flex gap-4 items-center shadow-sm"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="w-8 h-8 flex items-center justify-center border rounded-md"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="w-8 h-8 flex items-center justify-center border rounded-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() =>
                        dispatch(removeFromCart(item.id))
                      }
                      className="text-gray-400 hover:text-red-500 mt-3"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT – ORDER SUMMARY */}
            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>

                <hr />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg mt-6 font-medium">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-pink-600 text-sm mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
