import { useState } from "react";

function ResetPassword({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        setMessage("Password reset successful ✅");

        setTimeout(() => {
          onBack(); // 👈 return to login popup
        }, 2000);
      }

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">

      <button
        onClick={onBack}
        className="absolute top-3 right-3"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">
        Reset Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </form>

      {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
    </div>
  );
}

export default ResetPassword;
