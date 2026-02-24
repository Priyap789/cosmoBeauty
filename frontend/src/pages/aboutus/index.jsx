import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Award,
  Target,
  Package,
  Truck,
  RotateCcw,
  Headphones,
  Users,
  Sparkles
} from "lucide-react";

const AboutUs = () => {
  // Animation Variants (Synced with your Contact Us style)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full bg-gray-50 overflow-hidden">
      
      {/* 🔥 Animated Gradient Hero Section - Matches Contact Us */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-16 text-center"
      >
        <h1 className="text-4xl font-bold">About Cosmo</h1>
        <p className="mt-3 text-sm opacity-90">
          Your trusted destination for premium beauty and self-care.
        </p>
      </motion.div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Story & Featured Stats Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          
          {/* LEFT SIDE - Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-pink-500" size={24} /> Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Cosmo was founded with a simple vision: to make premium beauty
                products accessible to everyone. We believe that self-care should 
                be inclusive, affordable, and of the highest quality.
              </p>
              <p>
                What started as a small boutique has grown into a community of beauty 
                enthusiasts who value authenticity and results over flashy marketing.
              </p>
            </div>
            
          </motion.div>

          {/* RIGHT SIDE - Feature Cards (Matches Contact Info Cards) */}
          <motion.div 
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <Heart className="text-pink-500" />, title: "Customer First", desc: "Your satisfaction is our top priority." },
              { icon: <Award className="text-purple-500" />, title: "Quality Assured", desc: "Every product meets high standards." },
              { icon: <ShieldCheck className="text-pink-500" />, title: "100% Authentic", desc: "Directly sourced from brands." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-transparent hover:border-pink-200 transition-colors flex items-center gap-4"
              >
                <div className="p-3 bg-gray-50 rounded-lg">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-700">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mission Statement Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-20"
        >
          <div className="p-5 bg-purple-100 rounded-2xl">
            <Target className="text-purple-600" size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-lg italic leading-relaxed">
              "To empower individuals to look and feel their best by providing
              premium, ethically sourced beauty products at prices that make sense."
            </p>
          </div>
        </motion.div>

        {/* Why Choose Section (Grid Style) */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Why Choose Cosmo?</h2>
            <p className="text-gray-500 text-sm mt-2">We go the extra mile for your beauty routine.</p>
          </div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <Package size={20} />, text: "Wide Selection" },
              { icon: <Truck size={20} />, text: "Fast Delivery" },
              { icon: <ShieldCheck size={20} />, text: "Secure Payment" },
              { icon: <Users size={20} />, text: "Beauty Experts" },
              { icon: <RotateCcw size={20} />, text: "Easy Returns" },
              { icon: <Headphones size={20} />, text: "24/7 Support" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-purple-200 transition-all"
              >
                <span className="text-pink-500 bg-pink-50 p-2 rounded-lg">{item.icon}</span>
                <span className="font-semibold text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;