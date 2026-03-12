import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import SliderSection from "../../components/SliderSection";

function Home() {
  const [popupType, setPopupType] = useState(null);

  // Auto open login popup if resetToken exists in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");

    if (token) {
      setTimeout(() => setPopupType("login"), 100);
    }
  }, []);

  return (
    <>
      <Navbar />

      <SliderSection />
      <Hero />
      <Features />
      

      {/* ANIMATED LOGIN / SIGNUP POPUP */}
      <AnimatePresence>
        {popupType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {popupType === "login" && (
                <LoginForm
                  onClose={() => setPopupType(null)}
                  switchToSignup={() => setPopupType("signup")}
                />
              )}
              {popupType === "signup" && (
                <SignupForm
                  onClose={() => setPopupType(null)}
                  switchToLogin={() => setPopupType("login")}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;