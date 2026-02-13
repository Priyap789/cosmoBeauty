import React from "react";

const SpecialOffers = () => {
  return (
    <section className="w-full px-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-300 via-fuchsia-600 to-purple-200 py-14">

        {/* Header */}
        <div className="text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h.01M3 11l9.293 9.293a1 1 0 001.414 0L21 13.414a1 1 0 000-1.414L11.707 3.707A1 1 0 0011 3H5a2 2 0 00-2 2v6z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-semibold">Special Offers</h2>
          <p className="mt-2 text-sm opacity-90">
            Discover amazing deals on premium beauty products. Limited time
            offers!
          </p>
        </div>

        {/* Stats Cards */}
        
      </div>

      {/* Spacer for floating cards */}
      <div className="h-16" />
    </section>
  );
};

export default SpecialOffers;
