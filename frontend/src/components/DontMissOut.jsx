import React from "react";

const DontMissOut = () => {
  return (
    <section className="w-full bg-pink-50 py-14 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Don&apos;t Miss Out!
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          These special offers are available for a limited time only. Shop now
          and save big on your favorite beauty products.
        </p>

        {/* Info Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">
            <span className="text-green-500">✔</span>
            Free Shipping on Orders Over ₹999
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">
            <span className="text-green-500">✔</span>
            Cash on Delivery Available
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">
            <span className="text-green-500">✔</span>
            Easy Returns Within 7 Days
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontMissOut;
