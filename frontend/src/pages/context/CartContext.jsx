import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /* -------------------------------------------------
     ADD TO CART
     - New product → add with qty
     - Existing product → REPLACE qty
  -------------------------------------------------- */
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        // Replace quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty }
            : item
        );
      }

      // New item
      return [...prev, { ...product, qty }];
    });
  };

  /* -------------------------------------------------
     UPDATE QUANTITY (Cart Page +/-)
  -------------------------------------------------- */
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  /* -------------------------------------------------
     REMOVE ITEM
  -------------------------------------------------- */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* -------------------------------------------------
     CLEAR CART (Optional – Checkout)
  -------------------------------------------------- */
  const clearCart = () => {
    setCart([]);
  };

  /* -------------------------------------------------
     CALCULATE SUBTOTAL
  -------------------------------------------------- */
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  /* -------------------------------------------------
     LOCAL STORAGE (Persistence)
  -------------------------------------------------- */
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
