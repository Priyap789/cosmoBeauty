import { useState } from "react";

const categoriesData = [
  {
    name: "Skincare",
    sub: ["Face Wash", "Face Cream", "Face Serum", "Face Scrub"],
  },
  {
    name: "Body",
    sub: ["Body Lotion", "Body Scrub", "Body Cream"],
  },
  {
    name: "Haircare",
    sub: ["Shampoo", "Conditioner"],
  },
];

export default function CategoryFilter({ onFilterChange }) {
  const [selected, setSelected] = useState("All");

  const handleChange = (value) => {
    setSelected(value);

    // 🔹 Pass empty array for All, else pass selected value
    if (value === "All") {
      onFilterChange([]);
    } else {
      onFilterChange([value]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-64">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      {/* ALL */}
      <label className="flex items-center gap-2 mb-3 font-medium">
        <input
          type="radio"
          name="category"
          checked={selected === "All"}
          onChange={() => handleChange("All")}
        />
        All
      </label>

      {categoriesData.map((cat) => (
        <div key={cat.name} className="mb-4">
          {/* CATEGORY */}
          <label className="flex items-center gap-2 font-medium">
            <input
              type="radio"
              name="category"
              checked={selected === cat.name}
              onChange={() => handleChange(cat.name)}
            />
            {cat.name}
          </label>

          {/* SUB-CATEGORIES */}
          <div className="ml-6 mt-2 space-y-1">
            {cat.sub.map((sub) => (
              <label key={sub} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={selected === sub}
                  onChange={() => handleChange(sub)}
                />
                {sub}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
