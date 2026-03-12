import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./input";
import Button from "./Button";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

function LoginForm({ onClose, switchToSignup, onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =====================
  // LOGIN SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
        return;
      }

      // Save token and userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Notify Navbar to switch button
      if (onLoginSuccess) onLoginSuccess();

      // Show success popup
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have logged in successfully!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        onClose(); // Close login popup
        navigate(data.role === "admin" ? "/admin/dashbord" : "/");
      });

    } catch (err) {
      console.error("Server Error:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to login. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // WHEN OTP SENT → OPEN RESET POPUP
  // =====================
  const handleOtpSent = (email) => {
    setResetEmail(email);
    setShowForgot(false);
    setShowReset(true);
  };

  // =====================
  // SHOW RESET PASSWORD POPUP
  // =====================
  if (showReset) {
    return (
      <ResetPassword
        email={resetEmail}
        onBack={() => {
          setShowReset(false);
          setShowForgot(false);
        }}
      />
    );
  }

  // =====================
  // SHOW FORGOT PASSWORD POPUP
  // =====================
  if (showForgot) {
    return (
      <ForgotPassword
        onBack={() => setShowForgot(false)}
        onOtpSent={handleOtpSent}
      />
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
      {!popup && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-600"
        >
          ✕
        </button>
      )}

      <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required
        />

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

        <Button
          text={loading ? "Signing In..." : "Sign In"}
          type="submit"
        />
      </form>

      <p
        onClick={() => setShowForgot(true)}
        className="text-sm text-center mt-3 text-pink-600 cursor-pointer hover:underline"
      >
        Forgot password?
      </p>

      {!popup && (
        <p className="text-center mt-4 text-sm">
          Don’t have an account?
          <button
            onClick={switchToSignup}
            className="text-pink-600 ml-1 font-medium"
          >
            Sign Up
          </button>
        </p>
      )}
    </div>
  );
}

export default LoginForm;