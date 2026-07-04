import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData } from "@/data/menuData";

const getPrice = (category: string, name: string) => {
  const item = menuData.items.find((i) => i.category === category && i.name === name);
  if (!item) return 0;
  const raw = item.price.split("/")[0].replace(/[^0-9]/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
};

const basePrice = getPrice("Nos Crêpes", "Classic");

const bases = [
  { id: "crepe", label: "Crêpe", price: getPrice("Nos Crêpes", "Classic") },
  { id: "gaufre", label: "Gaufre", price: getPrice("Nos Gaufres", "Classic") },
];

// Topping add-on prices are derived from the real menu: the difference
// between the flavored item's price and the Classic base price.
const toppingFromMenu = (name: string) => getPrice("Nos Crêpes", name) - basePrice;

const toppings = [
  { id: "mordjene", label: "Mordjene", price: toppingFromMenu("Mordjene") },
  { id: "nutella", label: "Nutella", price: toppingFromMenu("Nutella") },
  { id: "fraise", label: "Fraise", price: toppingFromMenu("Fraise") },
  { id: "banane", label: "Banane", price: toppingFromMenu("Banane") },
  { id: "ananas", label: "Ananas", price: toppingFromMenu("Ananas") },
  { id: "pistache", label: "Pistachio", price: toppingFromMenu("Pistachio") },
];

export default function BuildYourRecipe() {
  const [baseId, setBaseId] = useState(bases[0].id);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const base = bases.find((b) => b.id === baseId)!;

  const total = useMemo(() => {
    const toppingsTotal = toppings
      .filter((t) => selectedToppings.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0);
    return base.price + toppingsTotal;
  }, [base, selectedToppings]);

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const toppingLabels = toppings
      .filter((t) => selectedToppings.includes(t.id))
      .map((t) => t.label);
    const name =
      toppingLabels.length > 0
        ? `${base.label} · ${toppingLabels.join(", ")}`
        : base.label;

    addItem({
      name,
      price: `${total} DA`,
      category: "Créez Votre Recette",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      id="build-your-recipe"
      className="relative py-20 bg-background border-t border-primary/10"
    >
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary">
            Personnalisez Votre Création
          </span>
          <h2 className="font-heading text-3xl md:text-5xl uppercase tracking-widest text-foreground mt-3">
            Créez Votre Recette
          </h2>
          <div className="w-16 h-px bg-primary/40 mx-auto mt-5" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-heading">
              1
            </span>
            <h3 className="font-heading text-sm md:text-base uppercase tracking-widest text-foreground">
              Choisissez Votre Base
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {bases.map((b) => {
              const isSelected = b.id === baseId;
              return (
                <button
                  key={b.id}
                  onClick={() => setBaseId(b.id)}
                  className={`relative rounded-xl p-6 flex flex-col items-center gap-2 border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-primary/15 hover:border-primary/40"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  <UtensilsCrossed
                    size={26}
                    className={isSelected ? "text-primary" : "text-foreground/30"}
                  />
                  <span className="font-heading text-lg text-foreground">{b.label}</span>
                  <span className="text-sm text-primary font-semibold">{b.price} DA</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-heading">
              2
            </span>
            <h3 className="font-heading text-sm md:text-base uppercase tracking-widest text-foreground">
              Ajoutez Vos Toppings
            </h3>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {toppings.map((t) => {
              const isSelected = selectedToppings.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTopping(t.id)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-primary/20 text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {t.label}{" "}
                  <span className={isSelected ? "text-primary-foreground/80" : "text-primary"}>
                    +{t.price}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-primary/10 pt-6">
            <span className="text-xs md:text-sm uppercase tracking-widest text-foreground/50">
              Total Estimé
            </span>
            <span className="font-heading text-3xl md:text-4xl text-primary">
              {total} <span className="text-lg">DA</span>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-4 font-heading uppercase tracking-widest transition-all hover:scale-[1.02] ${
              added
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {added ? (
              <>
                <Check size={18} />
                Ajouté au Panier
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Ajouter au Panier
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
