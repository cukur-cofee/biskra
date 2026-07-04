import { motion } from "framer-motion";
import { Coffee, Heart, Star, Users } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Star size={28} className="text-primary mb-4" strokeWidth={1.5} />,
      title: "Premium Quality",
      desc: "Carefully sourced beans and exquisite ingredients for an unforgettable taste."
    },
    {
      icon: <Users size={28} className="text-primary mb-4" strokeWidth={1.5} />,
      title: "Family Atmosphere",
      desc: "A warm, inviting space where every guest is treated like family."
    },
    {
      icon: <Coffee size={28} className="text-primary mb-4" strokeWidth={1.5} />,
      title: "Delicious Treats",
      desc: "Handcrafted desserts, crêpes, and gaufres made fresh daily."
    },
    {
      icon: <Heart size={28} className="text-primary mb-4" strokeWidth={1.5} />,
      title: "Made With Love",
      desc: "Every cup and plate is prepared with passion and meticulous attention to detail."
    }
  ];

  return (
    <section className="py-20 bg-background border-y border-primary/10 relative z-10">
      <div className="container mx-auto px-6">
        {/* 2-column grid on mobile, 4-column on desktop — no horizontal scroll */}
        <div className="grid grid-cols-2 gap-3
                        md:gap-4
                        lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card p-3 rounded-xl flex flex-col items-center text-center group hover:border-primary/50 transition-colors
                         md:p-8"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-500 scale-75 md:scale-100">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xs md:text-xl uppercase tracking-widest text-foreground mb-1.5 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/60 text-[10px] md:text-sm leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
