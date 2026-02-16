import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import SliderSection from "../../components/SliderSection";
//import SpecialOffers from "../../components/SpecialOffers";

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
      {/* --- SUGAR STYLE VIDEO SECTION --- */}
      {/* --- Sugar Cosmetics Style Video Banner --- */}
{/* SUGAR Style Feature Section 
/*<section className="w-full bg-[#ad86f1] py-12 px-4 md:px-10">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
    
    {/* Left Side: Video (The "Visual") 
    <div className="md:w-1/2 w-full relative">
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Floating Text Overlay like the image *
        <div className="absolute bottom-8 left-8 text-white">
          <p className="italic text-2xl font-light">Super</p>
          <h2 className="text-4xl font-bold tracking-widest uppercase">Hydrating</h2>
        </div>
      </div>
    </div>

    {/* Right Side: Description (The "Content") 
    <div className="md:w-1/2 w-full text-white space-y-6">
      <h3 className="text-sm font-semibold tracking-[0.2em] uppercase opacity-80">
        Glide Peptide Serum
      </h3>
      <h2 className="text-3xl md:text-5xl font-bold leading-tight">
        LIPSTICK
      </h2>
      <p className="text-lg leading-relaxed opacity-90">
        Experience the perfect blend of rich, saturated color and deep hydration. 
        Our serum-infused matte formula gives you feather-light comfort that 
        lasts all day.
      </p>
      <ul className="space-y-2 text-sm font-medium">
        <li>• Infused with Hyaluronic Acid</li>
        <li>• 8+ Hours of comfortable wear</li>
        <li>• Rich, high-pigment finish</li>
      </ul>
      <button className="mt-4 px-8 py-3 bg-white text-[#ad86f1] font-bold rounded-full hover:bg-opacity-90 transition-all uppercase tracking-wider">
        Shop Now
      </button>
    </div>

  </div>
</section>
      

       LOGIN / SIGNUP POPUP */}
       <Features />
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
