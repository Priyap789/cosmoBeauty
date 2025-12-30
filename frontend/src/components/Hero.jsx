import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate(); 

  return (
    <section className="bg-pink-50 px-6 md:px-12 py-16 flex flex-col md:flex-row items-center">

      {/* Left Content */}
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Your Natural Beauty
        </h2>

        <p className="text-gray-600 mb-6">
          Premium skincare, makeup, and haircare products made just for you.
        </p>

        <div className="flex gap-4 justify-center md:justify-start">
          
          <button
            onClick={() => navigate("/products")}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Shop Now
            
          </button>

          
          <button
            onClick={() => navigate("/offers")}
            className="border border-pink-500 text-pink-600 px-6 py-2 rounded-lg hover:bg-pink-50"
          >
            View Offers
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <img
          src="/image/logo.png"   
          alt="Beauty Products"
          className="rounded-xl w-80"
        />
      </div>

    </section>
  );
}

export default Hero;
