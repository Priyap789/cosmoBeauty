import { Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";

function LoginForm({ onClose, switchToSignup }) {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
      
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-pink-600"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
        Login
      </h2>

      {/* Inputs with Icons */}
      <Input
        type="email"
        placeholder="Enter your email"
        icon={Mail}
      />

      <Input
        type="password"
        placeholder="Enter your password"
        icon={Lock}
      />

      <Button text="Sign In" />

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
