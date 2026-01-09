import { useEffect, useState } from "react";
import Button from "./Button"; // adjust path

const OfferImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Auto slide every 2 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(nextSlide,3000);
    return () => clearInterval(timer);
  }, [currentIndex, images.length]);

  if (!images.length) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">

      {/* Slider */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full flex-shrink-0">

            {/* 👇 Width = full, Height from image ratio */}
            <div className="w-full aspect-[3/1]">
              <img
                src={img}
                alt={`Offer image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        ))}
      </div>

      {/* Left Arrow – full image height */}
      <div className="absolute left-0 top-0 h-full flex items-center px-2">
        <Button text="❮" onClick={prevSlide} />
      </div>

      {/* Right Arrow – full image height */}
      <div className="absolute right-0 top-0 h-full flex items-center px-2">
        <Button text="❯" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default OfferImageSlider;
