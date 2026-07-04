import { motion } from "framer-motion";
import heroImageMobile from "@assets/c450c24d-8db2-4ddb-8e4b-a213e1915c51_1783143932687.png";
import heroImageDesktop from "@assets/639e978e-e565-44e7-884b-1923f8cd2610_1783143945724.png";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-28">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform md:hidden"
          style={{ backgroundImage: `url('${heroImageMobile}')` }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transform hidden md:block"
          style={{ backgroundImage: `url('${heroImageDesktop}')`, filter: 'blur(14px)' }}
        />
        <div className="absolute inset-0 hidden md:block" style={{ background: 'rgba(11,11,11,0.60)' }} />
        <div className="absolute inset-0 md:hidden" style={{ background: 'rgba(11,11,11,0.72)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-script text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 block">
            Family Cafeteria
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-[0.1em] text-primary leading-none mb-8"
        >
          Welcome To<br />Çukur Coffee
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-foreground/70 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide mb-12"
        >
          A luxury coffee atelier fusing North African warmth with European elegance. 
          Unhurried, tactile, and confident.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a
            href="#menu"
            className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-heading uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 w-full sm:w-auto"
            data-testid="link-explore-menu"
          >
            Explore Menu
          </a>
          <a
            href="#summer-offers"
            className="border border-primary text-primary px-10 py-4 rounded-lg font-heading uppercase tracking-widest hover:bg-primary/10 transition-all hover:scale-105 w-full sm:w-auto"
            data-testid="link-summer-offers"
          >
            Summer Offers
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-primary font-heading">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
