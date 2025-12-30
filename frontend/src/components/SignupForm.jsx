import { User, Mail, Lock } from "lucide-react";
import Input from "./input";
import Button from "./Button";

function SignupForm({ onClose, switchToLogin }) {
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
        Sign Up
      </h2>

      {/* Inputs with Icons */}
      <Input type="text" placeholder="Enter your name" icon={User} />
      <Input type="email" placeholder="Enter your email" icon={Mail} />
      <Input type="password" placeholder="Enter your password" icon={Lock} />

      <Button text="Create Account" />

      <p className="text-center mt-4 text-sm">
        Already have an account?
        <button
          onClick={switchToLogin}
          className="text-pink-600 ml-1 font-medium"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default SignupForm;
