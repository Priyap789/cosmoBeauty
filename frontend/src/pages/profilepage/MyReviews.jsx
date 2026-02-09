export default function MyReviews() {
  return (
    <div className="bg-white border rounded p-8 min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <img
          src="https://rukminim1.flixcart.com/www/400/400/promos/19/08/2019/8b7b0a38-1c62-4c3d-bf3f-1dbb6c9a5c1b.png"
          alt="No Reviews"
          className="mx-auto mb-4 w-32"
        />
        <h2 className="text-lg font-semibold mb-2">
          You haven't reviewed any items yet
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Your reviews will appear here once you’ve shared them
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Start Shopping
        </button>
      </div>
    </div>
  );
}
