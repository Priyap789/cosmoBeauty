import { useState, useEffect } from "react";
import sliderData from "../data/sliderData";
import Button from "./Button";

function SliderSection() {
  const [current, setCurrent] = useState(0);
  const total = sliderData.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  // 🔁 Auto slide (SUGAR-like)
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="relative w-full bg-white overflow-hidden">

      {/* Slider height */}
      <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]">

        {/* Slider Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {sliderData.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full h-full flex items-center justify-center"
            >
              {/* Proper image display (NO crop) */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          text="❮"
          onClick={prevSlide}
          className="bg-black/70 hover:bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
        />
      </div>

      {/* Right Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          text="❯"
          onClick={nextSlide}
          className="bg-black/70 hover:bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
        />
      </div>

      {/* Dots (SUGAR style) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliderData.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
              current === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default SliderSection;
