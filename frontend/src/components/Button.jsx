import React from "react";

function Button({ text, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600 transition"
    >
      {text}
    </button>
  );
}

export default Button;