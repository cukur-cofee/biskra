import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

const boxes = [
  {
    id: 1,
    num: "01",
    name: "Pack de 5 Crêpes",
    price: 1500,
    image: "https://res.cloudinary.com/sfdktww4/image/upload/box-crepes.png",
    desc: "5 crêpes dorées à la perfection, garnies selon vos envies",
    badge: "Bestseller",
  },
  {
    id: 2,
    num: "02",
    name: "Pack de 2 Gaufres",
    price: 1500,
    image: "https://res.cloudinary.com/sfdktww4/image/upload/box-gaufres.png",
    desc: "2 gaufres croustillantes, moelleuses à l'intérieur",
    badge: null,
  },
  {
    id: 3,
    num: "03",
    name: "Pack de 24 Mini Donuts",
    price: 1500,
    image: "https://res.cloudinary.com/sfdktww4/image/upload/box-donuts.png",
    desc: "24 mini donuts tendres, idéals pour partager",
    badge: "Populaire",
    bigImage: true,
  },
  {
    id: 4,
    num: "04",
    name: "Pack de 24 Pancakes",
    price: 1500,
    image: "https://res.cloudinary.com/sfdktww4/image/upload/box-pancakes.png",
    desc: "24 mini pancakes moelleux, parfaits pour toute occasion",
    badge: null,
    bigImage: true,
  },
];

function BoxCard({ box, index }: { box: (typeof boxes)[0]; index: number }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ name: box.name, price: `${box.price} DA`, category: "Nos Boxes" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl border border-primary/15 bg-card overflow-hidden hover:border-primary/50 transition-all duration-500"
      style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.35)" }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(var(--primary-rgb, 180,140,80),0.12) 0%, transparent 70%)",
        }}
      />

      {/* Top strip with number */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-4 border-b border-primary/10">
        <span
          className="font-heading text-5xl font-black leading-none select-none"
          style={{ color: "rgba(180,140,80,0.12)", letterSpacing: "-0.04em" }}
        >
          {box.num}
        </span>
        {box.badge && (
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
            {box.badge}
          </span>
        )}
      </div>

      {/* Image display */}
      <div className="flex items-center justify-center py-6 px-4">
        <img
          src={box.image}
          alt={box.name}
          className="group-hover:scale-110 transition-transform duration-500"
          style={{
            height: box.bigImage ? "200px" : "140px",
            width: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
          }}
        />
      </div>

      {/* Content */}
      <div className="px-5 pb-6 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-primary/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-semibold">
              Nos Boxes
            </span>
          </div>
          <h3 className="font-heading text-lg md:text-xl uppercase tracking-wider text-foreground leading-tight">
            {box.name}
          </h3>
          <p className="text-sm text-foreground/50 mt-2 leading-relaxed">{box.desc}</p>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-primary/10">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">Prix</p>
            <p className="font-heading text-3xl text-primary leading-none">
              {box.price} <span className="text-base font-bold">DA</span>
            </p>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
              added
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? "Ajouté" : "Ajouter"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function NosBoxes() {
  return (
    <section className="relative py-24 bg-background border-t border-primary/10 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">
            À Partager
          </span>
          <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest text-foreground mt-3">
            Nos Boxes
          </h2>
          <div className="w-16 h-px bg-primary/40 mx-auto mt-5" />
          <p className="text-foreground/50 text-sm mt-5 max-w-md mx-auto leading-relaxed">
            Des box soigneusement composées pour des moments de partage inoubliables
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxes.map((box, i) => (
            <BoxCard key={box.id} box={box} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-xs text-foreground/30 tracking-widest uppercase mt-10"
        >
          {boxes.length} items disponibles · Biskra, Algeria
        </motion.p>
      </div>
    </section>
  );
}
