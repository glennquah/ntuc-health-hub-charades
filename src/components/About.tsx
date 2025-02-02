import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-medium text-coffee inline-block px-4 py-1 mb-4 bg-coffee/10 rounded-full">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-6">
            A Cozy Corner in Your Neighborhood
          </h2>
          <p className="text-lg text-coffee-dark/80 leading-relaxed mb-8">
            We believe that great coffee brings people together. Our home cafe started with a simple 
            dream: to create a warm, welcoming space where our community can gather, connect, and 
            enjoy expertly crafted beverages and delicious treats.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-white rounded-2xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-12 h-12 bg-coffee/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-coffee-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-coffee-dark/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    title: "Artisanal Coffee",
    description: "Hand-selected beans and expert brewing methods for the perfect cup",
    icon: <span className="text-2xl">☕️</span>,
  },
  {
    title: "Cozy Atmosphere",
    description: "A warm, inviting space designed for comfort and connection",
    icon: <span className="text-2xl">🏡</span>,
  },
  {
    title: "Community Focus",
    description: "Building relationships one cup at a time",
    icon: <span className="text-2xl">💝</span>,
  },
];

export default About;