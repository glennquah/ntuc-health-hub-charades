import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="py-20 bg-coffee-dark text-cream">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-medium inline-block px-4 py-1 mb-4 bg-cream/10 rounded-full">
            Visit Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Come Say Hello
          </h2>
          <p className="text-lg text-cream/80 mb-12">
            We're located in the heart of the city, ready to serve you the perfect cup of coffee
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="p-6 rounded-2xl bg-cream/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
                <p className="text-cream/80">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const contactInfo = [
  {
    title: "Address",
    content: "123 Coffee Street, Cityville, ST 12345",
  },
  {
    title: "Hours",
    content: "Mon-Fri: 7am - 7pm\nSat-Sun: 8am - 6pm",
  },
  {
    title: "Contact",
    content: "hello@homecafe.com\n(555) 123-4567",
  },
];

export default Contact;