function Checkout() {
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <input className="w-full border p-2 mb-3" placeholder="Address" />
      <input className="w-full border p-2 mb-3" placeholder="City" />

      <div className="flex items-center gap-2 mb-4">
        <input type="radio" checked />
        <span>Cash on Delivery</span>
      </div>

      <button className="w-full bg-pink-600 text-white py-2 rounded-lg">
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
