import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import SliderSection from "../../components/SliderSection";
import SpecialOffers from "../../components/SpecialOffers";

function Home() {
  const [popupType, setPopupType] = useState(null); // "login" | "signup" | null

  // ✅ AUTO OPEN LOGIN IF resetToken EXISTS
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");

    if (token) {
      // small timeout ensures component fully loads
      setTimeout(() => {
        setPopupType("login");
      }, 100);
    }
  }, []);

  return (
    <>
      <SliderSection />
      <Hero />
      <SpecialOffers />
      <Features />

      {/* LOGIN / SIGNUP POPUP */}
      {popupType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
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

        </div>
      )}
    </>
  );
}

export default Home;
