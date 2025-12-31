import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";

function SignupForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    console.log("Submitting formData:", formData); // Debugging

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
      } else {
        setMessage(data.message);
        setFormData({ name: "", email: "", password: "" }); // reset form
        switchToLogin(); // optionally go to login page
      }

      setLoading(false);
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-pink-600">
        ✕
      </button>
      <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" name="name" placeholder="Enter your name" icon={User} value={formData.name} onChange={handleChange} />
        <Input type="email" name="email" placeholder="Enter your email" icon={Mail} value={formData.email} onChange={handleChange} />
        <Input type="password" name="password" placeholder="Enter your password" icon={Lock} value={formData.password} onChange={handleChange} />
        <Button text={loading ? "Creating..." : "Create Account"} type="submit" />
      </form>

      {message && <p className="text-center text-green-500 mt-2">{message}</p>}
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}

      <p className="text-center mt-4 text-sm">
        Already have an account?
        <button onClick={switchToLogin} className="text-pink-600 ml-1 font-medium">Login</button>
      </p>
    </div>
  );
}

export default SignupForm;
