import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null); // "login" | "signup" | null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // =====================
  // LOGOUT WITH SWEET ALERT
  // =====================
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const navClass = ({ isActive }) =>
    `hover:text-pink-600 ${
      isActive
        ? "text-pink-600 underline underline-offset-8 decoration-2"
        : ""
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      
      {/* Logo */}
      <div
        className="cursor-pointer flex items-center"
        onClick={() => navigate("/")}
      >
        <img
          src="/image/cosmo_logo.png"
          alt="COSMO Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Menu */}
      <ul className="hidden md:flex gap-4 font-medium items-center text-pink-800">
        <li><NavLink to="/" end className={navClass}>HOME</NavLink></li>
        <li><NavLink to="/products" className={navClass}>PRODUCTS</NavLink></li>
        <li><NavLink to="/aboutus" className={navClass}>ABOUT US</NavLink></li>
        <li><NavLink to="/contactus" className={navClass}>CONTACT US</NavLink></li>
        <li><NavLink to="/offers" className={navClass}>OFFERS</NavLink></li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* User Icon */}
        <div className="cursor-pointer" onClick={() => navigate("/profile")}>
          <User />
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
          <ShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white px-4 py-1 rounded-full"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setPopupType("login")}
            className="bg-pink-500 text-white px-4 py-1 rounded-full"
          >
            Login
          </button>
        )}
      </div>

      {/* LOGIN / SIGNUP POPUP */}
      {popupType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {popupType === "login" && (
            <LoginForm
              onClose={() => setPopupType(null)}
              switchToSignup={() => setPopupType("signup")}
              onLoginSuccess={() => setIsLoggedIn(true)} // update Navbar
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