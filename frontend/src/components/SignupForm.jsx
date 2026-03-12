import { useState } from "react";
import { User, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import Input from "./input";
import Button from "./Button";
import Swal from "sweetalert2";

function SignupForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP digit change
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) { // only digits
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      // auto-focus next input
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ==========================
  // SEND OTP
  // ==========================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to send OTP",
        });
        return;
      }

      setShowOtp(true); // show OTP input
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "Check your email for the 6-digit OTP.",
      });

    } catch (err) {
      console.error("Send OTP Error:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP
  // ==========================
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.join(""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: data.message || "Invalid OTP",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your email has been verified successfully.",
      }).then(() => {
        switchToLogin();
      });

    } catch (err) {
      console.error("OTP Verification Error:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "OTP verification failed. Please try again.",
      });
    }
  };

  // Cancel OTP verification
  const handleCancelOtp = () => {
    setShowOtp(false);
    setOtp(["", "", "", "", "", ""]); // reset OTP
    Swal.fire({
      icon: "info",
      title: "Cancelled",
      text: "OTP verification cancelled.",
    });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">

      {!showOtp && (
        <>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-pink-600">
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">Sign Up</h2>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input type="text" name="name" placeholder="Enter your name" icon={User} value={formData.name} onChange={handleChange} />
            <Input type="email" name="email" placeholder="Enter your email" icon={Mail} value={formData.email} onChange={handleChange} />

            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button text={loading ? "Sending OTP..." : "Create Account"} type="submit" />
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?
            <button onClick={switchToLogin} className="text-pink-600 ml-1 font-medium">Login</button>
          </p>
        </>
      )}

      {/* ================= OTP SECTION ================= */}
      {showOtp && (
        <div className="text-center relative">
          <button onClick={handleCancelOtp} className="absolute top-3 right-3 text-gray-500 hover:text-pink-600">
            <X />
          </button>

          <h2 className="text-xl font-bold text-pink-700 mb-4">Verify Your Email</h2>
          <p className="mb-4">Enter the 6-digit OTP sent to your email</p>

          <div className="flex justify-between mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                maxLength={1}
                className="w-10 h-12 text-center border rounded"
              />
            ))}
          </div>

          <Button text="Verify OTP" onClick={handleVerifyOtp} />
        </div>
      )}
    </div>
  );
}

export default SignupForm;