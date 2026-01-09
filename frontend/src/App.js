import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import Home from "./pages/home";
import ProductsPage from "./pages/products";
import Offers from "./pages/offers";
import CategoryPage from "./pages/category";
import Skincare from "./pages/products/skincare";
import Lip from "./pages/products/makeup/lip";
import Eyes from "./pages/products/makeup/eyes";
import Face from "./pages/products/makeup/face";
import Tools from "./pages/products/makeup/tools";
import Bodywash from "./pages/products/hair-body/body-wash-cream";
import Shampoo from "./pages/products/hair-body/shampoo-conditioner";
import Layout from "./components/Layout";
import ProductDetail from "./pages/products/productdetails";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/cart";
import Payment from "./pages/payment";
import Faq from "./pages/faq";
import AboutUs from "./pages/aboutus";
import ContectUs from "./pages/contactus";
import { Toaster } from "react-hot-toast"; // ✅ ADD THIS
import ContactUs from "./pages/contactus";
import PrivacyPolicy from "./pages/privacypolicy";
import TermsConditions from "./pages/termsconditions";

function App() {
  return (
    <CartProvider>
      {/* ✅ Popup container */}
      <Toaster position="top-right" />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/products/skincare" element={<Skincare />} />
          <Route path="/products/makeup/lip" element={<Lip />} />
          <Route path="/products/makeup/eyes" element={<Eyes />} />
          <Route path="/products/makeup/face" element={<Face />} />
          <Route path="/products/makeup/tools" element={<Tools />} />
          <Route path="/products/hair-body/body-wash-cream" element={<Bodywash />} />
          <Route path="/products/hair-body/shampoo-conditioner" element={<Shampoo />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsconditions" element={<TermsConditions />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
