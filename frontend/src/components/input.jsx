function Input({ type, name, placeholder, icon: Icon, value, onChange }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value} // ← bind value
        onChange={onChange} // ← handle change
        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        required
      />
    </div>
  );
}

export default Input;
