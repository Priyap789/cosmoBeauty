import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
