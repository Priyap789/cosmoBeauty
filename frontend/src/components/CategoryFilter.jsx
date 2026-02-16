import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

const categories = [
  { name: "Skincare", sub: ["Face Wash", "Face Scrub", "Face Cream", "Face Serum"] },
  { name: "Body", sub: ["Body Lotion", "Body Scrub", "Body Cream"] },
  { name: "Makeup", sub: ["Lipstick", "Eyes", "Bluser", "Tools"] },
  { name: "Haircare", sub: ["Shampoo", "Conditioner", "Hair Treatment Cream", "Hair Colour Shampoo", "Neon Hair Colour Spray"] },
];

export default function CategoryFilter({ selected, onChange }) {
  const [openCategories, setOpenCategories] = useState(["Skincare"]);

  const toggleCategory = (name) => {
    setOpenCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const toggleSubCategory = (sub) => {
    if (selected.includes(sub)) {
      onChange(selected.filter((s) => s !== sub));
    } else {
      onChange([...selected, sub]);
    }
  };

  return (
    <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* 🟣 Header */}
      <div className="bg-pink-50/50 px-5 py-4 border-b border-pink-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-pink-600" />
          <h3 className="font-bold text-gray-800 tracking-tight">Filters</h3>
        </div>
        {selected.length > 0 && (
          <button 
            onClick={() => onChange([])}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-4"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-4 space-y-1">
        {categories.map((cat) => {
          const isOpen = openCategories.includes(cat.name);
          const hasSelected = cat.sub.some(s => selected.includes(s));

          return (
            <div key={cat.name} className="group">
              {/* 🟣 Main Category Toggle */}
              <button
                onClick={() => toggleCategory(cat.name)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  isOpen ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold transition-colors ${
                    isOpen || hasSelected ? "text-pink-600" : "text-gray-700"
                  }`}>
                    {cat.name}
                  </span>
                  {hasSelected && !isOpen && (
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-gray-400 group-hover:text-pink-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400 group-hover:text-pink-500" />
                )}
              </button>

              {/* 🟣 Sub-Categories List */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}>
                <div className="pl-4 pr-2 pb-3 space-y-1">
                  {cat.sub.map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center justify-between group/item py-2 px-3 rounded-lg cursor-pointer hover:bg-pink-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(sub)}
                            onChange={() => toggleSubCategory(sub)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-pink-500 checked:border-pink-500 transition-all"
                          />
                          <svg
                            className="absolute h-3.5 w-3.5 pointer-events-none hidden peer-checked:block stroke-white mt-[1px] ml-[1px]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className={`text-sm transition-colors ${
                          selected.includes(sub) ? "text-gray-900 font-medium" : "text-gray-500"
                        }`}>
                          {sub}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}