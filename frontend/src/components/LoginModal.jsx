import { useState } from "react";

function LoginModal({ isOpen, onClose }) {
  const [isSignup, setIsSignup] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-8 rounded-xl relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        {/* FORM */}
        {isSignup ? (
          <>
            {/* Signup Form */}
            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Full Name"
            />
            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Email"
            />
            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Password"
              type="password"
            />

            <button className="w-full bg-pink-600 text-white py-2 rounded-lg">
              Sign Up
            </button>

            <p className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => setIsSignup(false)}
                className="text-pink-600 cursor-pointer font-semibold"
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Login Form */}
            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Email"
            />
            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Password"
              type="password"
            />

            <button className="w-full bg-pink-600 text-white py-2 rounded-lg">
              Login
            </button>

            <p className="text-center mt-4 text-sm">
              Don’t have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                className="text-pink-600 cursor-pointer font-semibold"
              >
                Sign up
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
