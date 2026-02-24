import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-pink-50 px-6 md:px-12 py-16 flex flex-col md:flex-row items-center overflow-hidden">
      
      {/* Left Content */}
      <motion.div 
        className="md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }} // Start invisible and slightly to the left
        animate={{ opacity: 1, x: 0 }}    // Animate to full visibility and original position
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Your Natural Beauty
        </h2>

        <p className="text-gray-600 mb-6">
          Premium skincare, makeup, and haircare products made just for you.
        </p>

        <div className="flex gap-4 justify-center md:justify-start">
          <motion.button
            whileHover={{ scale: 1.05 }} // Subtle pop on hover
            whileTap={{ scale: 0.95 }}   // Subtle shrink on click
            onClick={() => navigate("/products")}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 shadow-md"
          >
            Shop Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/offers")}
            className="border border-pink-500 text-pink-600 px-6 py-2 rounded-lg hover:bg-pink-50 shadow-sm"
          >
            View Offers
          </motion.button>
        </div>
      </motion.div>

      {/* Right Image Container */}
      <motion.div 
        className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }} // Start small and invisible
        animate={{ opacity: 1, scale: 1 }}    // Scale up to normal size
        transition={{ duration: 1, delay: 0.2 }} // Slight delay after text starts
      >
        <img
          src="/image/image2_homepage.jpg"
          alt="Must have personal care products"
          className="rounded-xl w-full max-w-2xl h-auto object-cover shadow-lg"
        />
      </motion.div>
      
    </section>
  );
}

export default Hero;