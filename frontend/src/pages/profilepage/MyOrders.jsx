export default function MyOrders() {
  const orders = []; // empty orders

  return (
    <div className="flex gap-6">
      
      {/* Filters */}
      <div className="w-1/4 bg-white p-4 border rounded h-fit">
        <h3 className="font-semibold mb-3">Filters</h3>

        <p className="text-sm font-medium mb-2">ORDER STATUS</p>

        {["On the way", "Delivered", "Cancelled", "Returned"].map(
          (status, i) => (
            <label key={i} className="flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" />
              {status}
            </label>
          )
        )}
      </div>

      {/* Orders Content */}
      <div className="w-3/4 bg-white border rounded flex items-center justify-center min-h-[400px]">
        {orders.length === 0 ? (
          <div className="text-center">
            <img
              src="https://rukminim1.flixcart.com/www/400/400/promos/30/07/2019/6e3ef1c3-19ac-4d05-a8c3-5bb0c56caa9f.png"
              alt="No Orders"
              className="mx-auto mb-4 w-32"
            />
            <h2 className="font-semibold text-lg mb-2">
              You have no orders
            </h2>
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              Start Shopping
            </button>
          </div>
        ) : (
          <div>Orders List Here</div>
        )}
      </div>
    </div>
  );
}
