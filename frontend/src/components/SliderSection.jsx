import { useState, useEffect } from "react";
import sliderData from "../data/sliderData";

function SliderSection() {
  const [current, setCurrent] = useState(0);
  const total = sliderData.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="relative w-full overflow-hidden bg-[#f3f3f3]">
      {/* Container using Aspect Ratio instead of fixed heights.
        Mobile: 16/9 | Tablet: 21/9 | Desktop: 3/1 (Wide Banner)
      */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]">
        
        {/* Slider Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {sliderData.map((slide, index) => (
            <a 
              key={slide.id} 
              href={slide.link} 
              className="min-w-full h-full block"
            >
              <img
                src={slide.image}
                alt={slide.title}
                // 'object-contain' ensures the whole image is visible
                // 'w-full h-full' ensures it fills the aspect-ratio box
                className="w-full h-full object-contain md:object-cover" 
                loading={index === 0 ? "eager" : "lazy"}
              />
            </a>
          ))}
        </div>

        {/* Navigation Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="p-2 focus:outline-none"
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  current === index 
                    ? "w-8 bg-black" 
                    : "w-4 bg-black/20 hover:bg-black/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SliderSection;