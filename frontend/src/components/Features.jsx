import { motion } from "framer-motion"; // Added for animations
import { Truck, ShieldCheck, Sparkles } from "lucide-react";

function Features() {
  // Animation Variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time between each card animation
      },
    },
  };

  // Animation Variants for individual items
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section className="bg-white py-14 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Animates once when 20% visible
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-4"
      >
        {/* Feature 1 */}
        <motion.div variants={itemVariants}>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <Truck className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">Free Shipping</h3>
          <p className="text-gray-500 text-sm">On orders above ₹999</p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div variants={itemVariants}>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <ShieldCheck className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">100% Authentic</h3>
          <p className="text-gray-500 text-sm">Genuine products guaranteed</p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div variants={itemVariants}>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <Sparkles className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">Premium Quality</h3>
          <p className="text-gray-500 text-sm">Tested & certified products</p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Features;