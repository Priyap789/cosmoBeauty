import { useState } from "react";
import categories from "./categoriesData";

const CategoryBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  return (
    <div className="bg-white border-b shadow-sm relative z-40">
      {/* Category Row */}
      <div className="max-w-7xl mx-auto flex justify-between px-6 py-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="relative text-center cursor-pointer"
            onMouseEnter={() => {
              setActiveCategory(index);
              setActiveSub(null);
            }}
            onMouseLeave={() => setActiveCategory(null)}
          > 
            <img
              src={cat.image}
              alt={cat.name}
              className="w-14 h-14 mx-auto"
            />
            <p className="text-sm font-medium mt-1">{cat.name}</p>

            {/* Mega Menu */}
            {activeCategory === index && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[720px] bg-white shadow-xl rounded-md flex">
                
                {/* Left Subcategories */}
                <div className="w-1/2 border-r">
                  {cat.subcategories.map((sub, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveSub(i)}
                      className="px-6 py-3 flex justify-between hover:bg-gray-100"
                    >
                      <span>{sub.name}</span>
                      <span>›</span>
                    </div>
                  ))}
                </div>

                {/* Right Items */}
                <div className="w-1/2 px-6 py-4">
                  {activeSub !== null &&
                    cat.subcategories[activeSub].items.map((item, i) => (
                      <p
                        key={i}
                        className="py-2 text-sm hover:text-pink-600 cursor-pointer"
                      >
                        {item}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
