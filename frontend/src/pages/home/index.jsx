import { useState } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
//import Cart from "../../components/Cart";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import SliderSection from "../../components/SliderSection";



function Home() {
  const [popupType, setPopupType] = useState(null); // "login" | "signup" | null
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      {/*Navbar*/}
     
      <SliderSection/>
      <Hero />
      <Features/>
      

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
