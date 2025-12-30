import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setToast("Added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, toast }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
