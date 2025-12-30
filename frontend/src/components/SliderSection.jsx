import { useState } from "react";
import sliderData from "../data/sliderData";
import Button from "./Button";

function SliderSection() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === sliderData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}  
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50">
        <Button text="❮" onClick={prevSlide} />
      </div>

      
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50">
        <Button text="❯" onClick={nextSlide} />
      </div>
    </section>
  );
}

export default SliderSection;
