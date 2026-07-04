import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function Counter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, inView]);

  return (
    <div ref={nodeRef} className="text-4xl md:text-6xl font-heading text-primary tracking-wider mb-2">
      {count}{suffix}
    </div>
  );
}

export default function Stats() {
  const stats = [
    { value: 15, suffix: "+", label: "Team Members" },
    { value: 541, suffix: "+", label: "Happy Customers" },
    { value: 100, suffix: "%", label: "Passion" },
    { value: 1, suffix: "", label: "Location" },
  ];

  return (
    <section className="py-24 bg-background border-y border-primary/10 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <Counter end={stat.value} suffix={stat.suffix} />
              <div className="font-sans text-sm uppercase tracking-[0.2em] text-foreground/60">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
