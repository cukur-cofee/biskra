import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { menuData } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useAdminData } from "@/context/AdminDataContext";

const getCategoryImage = (cat: string) => {
  const images: Record<string, string> = {
    "Café": "https://res.cloudinary.com/sfdktww4/image/upload/espresso.png",
    "Milkshake": "https://res.cloudinary.com/sfdktww4/image/upload/milkshake.png",
    "Frappuccino": "https://res.cloudinary.com/sfdktww4/image/upload/frappuccino.png",
    "Jus Naturel": "https://res.cloudinary.com/sfdktww4/image/upload/juice.png",
  };
  return images[cat] || "https://res.cloudinary.com/sfdktww4/image/upload/espresso.png";
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function AddButton({ item }: { item: { name: string; price: string; category: string } }) {
  const { addItem } = useCart();
  const [popped, setPopped] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setPopped(true);
    setTimeout(() => setPopped(false), 400);
  };

  return (
    <motion.button
      onClick={handleAdd}
      animate={popped ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="w-7 h-7 flex-shrink-0 rounded-md border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-90"
      data-testid={`btn-add-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
      aria-label={`Add ${item.name}`}
    >
      <Plus size={14} />
    </motion.button>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0]);
  const [direction, setDirection] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const { menuOverrides, nameOverrides, promos } = useAdminData();

  const activeIndex = menuData.categories.indexOf(activeCategory);
  const rawItems = menuData.items.filter((item) => item.category === activeCategory);
  const activeItems = rawItems.map(item => ({
    ...item,
    name:  nameOverrides[item.name]  ?? item.name,
    price: menuOverrides[item.name] ?? item.price,
  }));
  const isFirstRender = useRef(true);

  const handleCategoryChange = (cat: string) => {
    const newIndex = menuData.categories.indexOf(cat);
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveCategory(cat);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  return (
    <section id="menu" className="bg-background relative">

      {/* ── DESKTOP layout ─────────────────────────────────── */}
      <div className="hidden lg:block py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="font-script text-3xl text-primary mb-2 block">Our Offerings</span>
            <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest text-foreground">
              The Menu
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-6" />
          </div>

          <div className="flex gap-24">
            {/* Sidebar */}
            <div className="w-1/4">
              <div className="sticky top-32 flex flex-col gap-2">
                {menuData.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-6 py-4 rounded-lg font-heading uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(200,165,106,0.2)]"
                        : "text-foreground/60 hover:text-primary hover:bg-card/50"
                    }`}
                    data-testid={`btn-category-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="w-3/4">
              <div className="grid grid-cols-2 gap-8">
                <motion.div
                  key={`img-${activeCategory}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl overflow-hidden aspect-square relative border border-primary/20 row-span-2"
                >
                  <img
                    src={getCategoryImage(activeCategory)}
                    alt={activeCategory}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="font-heading text-3xl text-primary uppercase tracking-widest mb-2">
                      {activeCategory}
                    </h3>
                    <p className="text-foreground/70 font-light text-sm">
                      Experience the finest selection of our premium offerings.
                    </p>
                  </div>
                </motion.div>

                <div className="col-span-1 row-span-2 glass-card rounded-2xl p-8 h-fit">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      {activeItems.map((item, idx) => (
                        <div key={idx} className="group flex items-center gap-3">
                          <div className="flex-1 flex items-end justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading text-lg tracking-wider text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              {promos[item.name] && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                                  {promos[item.name]}
                                </span>
                              )}
                            </div>
                            <div className="flex-grow border-b border-dashed border-primary/20 relative top-[-6px]" />
                            <span className="font-heading text-xl text-primary whitespace-nowrap">
                              {item.price}{" "}
                              <span className="text-xs text-foreground/50">DA</span>
                            </span>
                          </div>
                          <AddButton item={item} />
                        </div>
                      ))}
                      {activeItems.length === 0 && (
                        <p className="text-foreground/50 italic">No items found.</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE layout ──────────────────────────────────── */}
      <div className="lg:hidden pt-16 pb-6">
        <div className="text-center mb-8 px-6">
          <span className="font-script text-3xl text-primary mb-2 block">Our Offerings</span>
          <h2 className="font-heading text-4xl uppercase tracking-widest text-foreground">The Menu</h2>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </div>

        {/* Sticky tabs bar */}
        <div className="sticky top-[68px] z-40 bg-background/96 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="h-[2px] bg-primary/10">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${((activeIndex + 1) / menuData.categories.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <span className="font-heading text-[10px] uppercase tracking-widest text-foreground/30">Category</span>
            <span className="font-heading text-[10px] text-primary/60">
              {activeIndex + 1} / {menuData.categories.length}
            </span>
          </div>
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
            {menuData.categories.map((cat) => {
              const isActive = cat === activeCategory;
              const count = menuData.items.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => handleCategoryChange(cat)}
                  data-testid={`mobile-tab-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-heading uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(200,165,106,0.35)]"
                      : "bg-card/60 text-foreground/40 border border-primary/10 hover:text-foreground/70"
                  }`}
                >
                  {cat}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm leading-none ${isActive ? "bg-black/20 text-white/70" : "bg-primary/10 text-primary/50"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="px-4 pt-5 pb-10 min-h-[60vh] overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeCategory}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-2xl uppercase tracking-widest text-primary leading-none">
                    {activeCategory}
                  </h3>
                  <p className="text-foreground/30 text-[11px] mt-1 font-body">
                    {activeItems.length} items available
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { const p = menuData.categories[activeIndex - 1]; if (p) handleCategoryChange(p); }}
                    disabled={activeIndex === 0}
                    className="w-8 h-8 rounded-lg border border-primary/20 flex items-center justify-center text-primary/50 disabled:opacity-20 hover:border-primary hover:text-primary transition-all active:scale-90"
                    data-testid="btn-prev-category"
                  >‹</button>
                  <button
                    onClick={() => { const n = menuData.categories[activeIndex + 1]; if (n) handleCategoryChange(n); }}
                    disabled={activeIndex === menuData.categories.length - 1}
                    className="w-8 h-8 rounded-lg border border-primary/20 flex items-center justify-center text-primary/50 disabled:opacity-20 hover:border-primary hover:text-primary transition-all active:scale-90"
                    data-testid="btn-next-category"
                  >›</button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {activeItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.035, duration: 0.25 }}
                    className="group flex items-stretch bg-card/40 border border-primary/10 rounded-lg overflow-hidden"
                    data-testid={`mobile-item-${idx}`}
                  >
                    <div className="flex-shrink-0 w-9 flex items-center justify-center bg-primary/5 border-r border-primary/10">
                      <span className="font-heading text-[10px] text-primary/30">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1 px-4 py-3.5 flex items-center gap-2">
                      <span className="font-heading text-[15px] tracking-wide text-foreground/90 group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      {promos[item.name] && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
                          {promos[item.name]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 px-3 bg-primary/5 border-l border-primary/10">
                      <div className="text-right">
                        <span className="font-heading text-base text-primary leading-none">{item.price}</span>
                        {item.price !== "-" && (
                          <span className="block text-[9px] text-foreground/30 leading-none mt-0.5">DA</span>
                        )}
                      </div>
                      <AddButton item={item} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
