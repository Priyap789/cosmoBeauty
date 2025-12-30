/*import React from "react";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded mb-4
                 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  );
}

export default Input;*/
function Input({ type, placeholder, icon: Icon }) {
  return (
    <div className="relative mb-4">
      
      {/* Icon */}
      {Icon && (
        <Icon
          size={20}
          className="absolute left-3 top-3 text-gray-400"
        />
      )}

      {/* Input */}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full py-2 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400
          ${Icon ? "pl-10" : "pl-4"}`}
      />
    </div>
  );
}

export default Input;

