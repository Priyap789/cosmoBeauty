import { useState } from "react";
import { Mail } from "lucide-react";
import Input from "./input";
import Button from "./Button";

function ForgotPassword({ onOtpSent, onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:8000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        onOtpSent(email); // 👈 open reset popup
      }

    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
      <button onClick={onBack} className="absolute top-3 left-3">
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your registered email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          text={loading ? "Sending..." : "Send OTP"}
          type="submit"
        />
      </form>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
