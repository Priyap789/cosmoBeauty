import { Link, useNavigate } from "react-router-dom";import {ShoppingCart } from "lucide-react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useSelector } from "react-redux";

function Navbar({ onLoginClick }) {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null); // "login" | "signup" | null
  const [showCart, setShowCart] = useState(false);
    const cartItems = useSelector(state => state.cart.items);

  return (


    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-pink-600 cursor-pointer"
          onClick={() => navigate("/")}>
        COSMO
      </h1>

      {/* Menu */}
      <ul className="hidden md:flex gap-4 font-medium items-center text-pink-800  ">

        <li>
          <Link to="/" className="hover:text-pink-600">HOME</Link>
        </li>
         <li>
          <Link to="/products" className="hover:text-pink-600">PRODUCTS</Link>
        </li>
         <li>
          <Link to="/aboutus" className="hover:text-pink-600">ABOUT US</Link>
        </li>
         <li>
          <Link to="/contactus" className="hover:text-pink-600">CONTECT US</Link>
        </li>
       

       { /*<li>
          <Link to="/products" className="hover:text-pink-600">
            PRODUCTS
          </Link>
        </li>

        <li>
          <Link to="/products/skincare" className="hover:text-pink-600">
            SKIN CARE
          </Link>
        </li>

        {/* MAKEUP 
        <li className="relative group">
          <span className="cursor-pointer hover:text-pink-600">
            MAKE UP
          </span>

          <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-48 py-2 z-50">
            <li>
              <Link
                to="/products/makeup/lip"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                LIP
              </Link>
            </li>
            <li>
              <Link
                to="/products/makeup/eyes"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                
                EYES
              </Link>
            </li>
            <li>
              <Link
                to="/products/makeup/face"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                FACE
              </Link>
            </li>
            <li>
              <Link
                to="/products/makeup/tools"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                TOOLS
              </Link>
            </li>
          </ul>
        </li>*/}

        {/* HAIR & BODY 
        <li className="relative group">
          <span className="cursor-pointer hover:text-pink-600">
            About Us
          </span>

          <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-60 py-2 z-50">
            <li>
              <Link
                to="/products/hair-body/shampoo-conditioner"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                SHAMPOO & CONDITIONER
              </Link>
            </li>
            <li>
              <Link
                to="/products/hair-body/body-wash-cream"
                className="block px-4 py-2 hover:bg-pink-100"
              >
                BODY WASH AND CREAM
              </Link>
            </li>
          </ul>
        </li>*/}

      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/*<Search className="cursor-pointer" />/*}
        
        {/*add to cart*/}
        <div
        className="relative cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        <ShoppingCart />

        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
            {cartItems.length}
          </span>
        )}
      </div>
        

        <button
          onClick={() => setPopupType("login")}
          className="bg-pink-500 text-white px-4 py-1 rounded-full"
        >
          Login
        </button>
      </div>
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
    </nav>
  );
}

export default Navbar;
