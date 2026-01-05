import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";
function LoginForm({ onClose, switchToSignup }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("") ;
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);
        setFormData({ email: "", password: "" });
        onClose();
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-pink-600"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button text={loading ? "Signing In..." : "Sign In"} type="submit" />
      </form>

      {message && <p className="text-center text-green-500 mt-2">{message}</p>}
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      <p className="text-center mt-4 text-sm">
        Don’t have an account?
        <button
          onClick={switchToSignup}
          className="text-pink-600 ml-1 font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
