import { motion } from "framer-motion";

const Menu = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-medium text-coffee inline-block px-4 py-1 mb-4 bg-coffee/10 rounded-full">
            Our Offerings
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-6">
            Featured Menu
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="group relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold text-cream mb-2">
                    {item.name}
                  </h3>
                  <p className="text-cream/90 mb-2">
                    {item.description}
                  </p>
                  <span className="text-lg font-medium text-cream">
                    ${item.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const menuItems = [
  {
    name: "Signature Latte",
    description: "House-made vanilla syrup, espresso, steamed milk",
    price: "4.50",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    name: "Pour Over",
    description: "Single-origin beans, hand-poured to perfection",
    price: "3.75",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  },
  {
    name: "Artisan Pastries",
    description: "Freshly baked daily, perfect with coffee",
    price: "3.25",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
  },
];

export default Menu;