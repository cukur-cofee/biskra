import { motion } from "framer-motion";

export default function Story() {
  return (
    <section id="story" className="py-32 bg-card relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-primary/20 relative z-10 bg-card flex items-center justify-center">
              <span className="font-script text-6xl text-primary/30 select-none">Çukur</span>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary/40 z-0" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary/40 z-0" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="font-script text-3xl text-primary mb-4 block">Our Heritage</span>
            <h2 className="font-heading text-5xl md:text-6xl uppercase tracking-[0.1em] text-foreground mb-8 leading-tight">
              MORE THAN <br />
              <span className="text-primary">JUST COFFEE</span>
            </h2>
            
            <div className="space-y-6 text-foreground/70 font-light text-lg leading-relaxed">
              <p>
                Çukur Coffee was born from a simple yet profound vision: to create a space that feels like an extension of the family home, while delivering an uncompromisingly luxurious coffee experience.
              </p>
              <p>
                Located in the heart of Biskra, our cafeteria blends the rich, warm hospitality of North Africa with the meticulous craft of a European coffee atelier. Every surface, from the matte black counters to the warm amber lighting, has been curated to create an atmosphere of unhurried elegance.
              </p>
              <p>
                Whether you are here for a perfectly extracted espresso, a handcrafted crêpe, or simply to share a moment with loved ones, Çukur is your sanctuary. We don't just serve coffee; we curate moments.
              </p>
            </div>

            <div className="mt-12 pt-12 border-t border-primary/10">
              <div className="font-heading text-xl uppercase tracking-widest text-foreground">
                Founded with passion, <br/>
                <span className="text-primary">sustained by family.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
