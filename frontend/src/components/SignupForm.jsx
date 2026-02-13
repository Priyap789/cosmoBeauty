import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";

function SignupForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================
  // SIGNUP
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // 🔥 SHOW OTP INPUT
      setShowOtp(true);

    } catch (err) {
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP
  // ==========================
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Email Verified Successfully ✅");
      switchToLogin();

    } catch (err) {
      console.error("OTP Error:", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">

      {!showOtp && (
        <>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-pink-600"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              text={loading ? "Creating..." : "Create Account"}
              type="submit"
            />
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?
            <button
              onClick={switchToLogin}
              className="text-pink-600 ml-1 font-medium"
            >
              Login
            </button>
          </p>
        </>
      )}

      {/* ================= OTP SECTION ================= */}
      {showOtp && (
        <div className="text-center">
          <h2 className="text-xl font-bold text-pink-700 mb-4">
            Verify Your Email
          </h2>

          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />

          <Button text="Verify OTP" onClick={handleVerifyOtp} />
        </div>
      )}
    </div>
  );
}

export default SignupForm;
