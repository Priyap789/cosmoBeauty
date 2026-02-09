import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const categories = [
  {
    name: "Skincare",
    sub: ["Face Wash", "Face Scrub", "Face Cream", "Face Serum"],
  },
  { name: "Body", 
    sub: ["Body Lotion", "Body Scrub", "Body Cream", ] 
  },
  { name: "Makeup", 
    sub: ["Lipstick", "Eyes", "Bluser", "Tools"] 
  },
  { name: "Haircare", 
    sub: ["Shampoo", "Conditioner", "Hair Treatment Cream", "Hair Colour Shampoo", "Neon Hair Colour Spray"] 
  },
];

export default function CategoryFilter({ selected, onChange }) {
  const [openCategories, setOpenCategories] = useState(["Skincare"]);

  const toggleCategory = (name) => {
    setOpenCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
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
    <div className="w-64 bg-white border rounded-lg p-4 w-4">
      <p className="text-lg text-pink-500 font-semibold mb-5 ">Category</p>

      {categories.map((cat) => {
        const isOpen = openCategories.includes(cat.name);

        return (
          <div key={cat.name} className="mb-2">
            {/* Main Category */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleCategory(cat.name)}
            >
              <span className="font-medium text-sm w-28">{cat.name}</span>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {/* Sub Categories */}
            {isOpen && cat.sub.length > 0 && (
              <div className="mt-2 ml-4 space-y-2 ">
                {cat.sub.map((sub) => (
                  <label
                    key={sub}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(sub)}
                      onChange={() => toggleSubCategory(sub)}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
