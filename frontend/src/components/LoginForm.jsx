import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function LoginForm({ onClose, switchToSignup }) {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setPopup(true);

      setTimeout(() => {
        onClose();
        window.location.href =
          data.role === "admin" ? "/admin/dashboard" : "/";
      }, 1500);

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ WHEN OTP SENT → OPEN RESET POPUP
  const handleOtpSent = (email) => {
    setResetEmail(email);
    setShowForgot(false);
    setShowReset(true);
  };

  // ✅ SHOW RESET PASSWORD POPUP
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

  // ✅ SHOW FORGOT PASSWORD POPUP
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

        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button
          text={loading ? "Signing In..." : "Sign In"}
          type="submit"
        />
      </form>

      {error && (
        <p className="text-red-600 text-center mt-3 text-sm">
          {error}
        </p>
      )}

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
