import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../redux/cartSlice";
import { Trash2, Plus, Minus } from "lucide-react";
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems
            .filter((item) => item.product !== null)
            .map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-xl p-4 flex gap-4 items-center shadow-sm"
              >
                <img
                  src={`http://localhost:8000${item.product.images?.[0]}`}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} each
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => {
                      if (item.quantity > 1) {
                      updateQty(item.product._id, item.quantity - 1);
                      }
                    }}

                      className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100"

                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQty(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border rounded-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    onClick={() =>
                      removeItem(item.product._id)
                    }
                    className="text-red-500 mt-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary stays same */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

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
      <span>
        {shipping === 0 ? "Free" : `₹${shipping}`}
      </span>
    </div>

    {shipping !== 0 && (
      <p className="text-xs text-gray-500">
        Add ₹{1000 - subtotal} more for free shipping
      </p>
    )}

    <hr />

    <div className="flex justify-between font-semibold text-base">
      <span>Total</span>
      <span>₹{total}</span>
    </div>
  </div>

  <button
  onClick={() => navigate("/checkout")}
  className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
>
  Proceed to Checkout
</button>

  <Link
    to="/products"
    className="block text-center text-sm text-pink-600 mt-4"
  >
    Continue Shopping
  </Link>
</div>

        </div>
      )}
    </div>
  );
}

export default Cart;
