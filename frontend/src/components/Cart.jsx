function Cart({ onCheckout }) {
  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      
      <p>1 x Beauty Product - ₹999</p>                                     

      <button
        onClick={onCheckout}
        className="mt-6 w-full bg-pink-500 text-white py-2 rounded-lg"
      >
        Checkout
      </button>

    </div>
  );
}

export default Cart;
