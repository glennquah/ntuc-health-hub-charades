import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Serene cafe environment"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <motion.div 
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span 
          className="inline-block px-4 py-1 mb-4 text-sm tracking-wider text-cream bg-coffee-dark/80 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to
        </motion.span>
        <h1 className="text-5xl md:text-7xl font-bold text-cream mb-6">
          Home Cafe
        </h1>
        <p className="text-xl md:text-2xl text-cream/90 max-w-2xl mx-auto mb-8">
          Experience the art of coffee in the comfort of your neighborhood
        </p>
        <motion.button
          className="px-8 py-3 bg-cream text-coffee-dark rounded-full text-lg font-medium 
                     transition-transform hover:scale-105 active:scale-95"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          Explore Menu
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;