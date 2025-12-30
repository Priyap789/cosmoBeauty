import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10">
        {isLogin ? (
          <LoginForm
            onClose={onClose}
            switchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onClose={onClose}
            switchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
