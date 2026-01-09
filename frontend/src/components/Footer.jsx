import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-[#0b1220] text-gray-300 pt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">✨ COSMO</h2>
          <p className="text-sm text-gray-400">
            Your trusted partner for premium beauty products. Discover the best in skincare, makeup, and haircare.
          </p>
      
          <div className="flex gap-3 mt-4">
            <Facebook className="w-5 h-5 cursor-pointer" />
            <Instagram className="w-5 h-5 cursor-pointer"/>
            <Twitter className="w-5 h-5 cursor-pointer"  />
            
          </div>
        </div>
      
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-pink-500">My Account</Link></li>
            <li><Link to="/privacypolicy" className="hover:text-pink-500">Privacy Policy</Link></li>
            <li><Link to="/termsconditions" className="hover:text-pink-500">Terms & Conditions</Link></li>
            <li><Link to="/" className="hover:text-pink-500">Shipping Info</Link></li>
            <li><Link to="/faq" className="hover:text-pink-500">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-1 text-pink-500" />
            <p>nadiad-387002</p>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm">
            <Phone className="w-4 h-4 text-pink-500" />
            <p>+91 84909 98002 </p>
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-sm">
            <Mail className="w-4 h-4 text-pink-500" />
            <p>support@cosmo.com</p>
          </div>
        </div>

      </div>
      
      

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-12 py-4 text-center text-sm text-gray-400">
        © 2025 COSMO. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}

export default Footer;
