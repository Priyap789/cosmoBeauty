import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-pink-100 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
