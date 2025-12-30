import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-pink-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
