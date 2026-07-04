import { useState, useRef, useEffect, useCallback } from "react";
import {
  Palmtree,
  Flower2,
  Citrus,
  Snowflake,
  Cherry,
  Umbrella,
  Waves,
  Heart,
  Star,
  Check,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const offers = [
  {
    id: 1,
    num: "01",
    icon: Palmtree,
    name: "Blue Summer",
    oldPrice: 600,
    newPrice: 499,
    discount: 17,
    items: ["Mojito Bleu", "Mini Pancakes ×6"],
    tagline: "Fraîcheur & Gourmandise",
    accent: "#00d4ff",
    accentDark: "#0099cc",
    glowColor: "rgba(0,212,255,0.35)",
    gradientFrom: "#001828",
    gradientTo: "#00334d",
    image: "/images/blue-summer.png",
    secondImage: "/images/mini-pancakes.png",
  },
  {
    id: 2,
    num: "02",
    icon: Flower2,
    name: "Pink Summer",
    oldPrice: 800,
    newPrice: 650,
    discount: 19,
    items: ["Pink Lady", "Mini Donuts ×6"],
    tagline: "Douceur & Plaisir",
    accent: "#ff5fa0",
    accentDark: "#cc2060",
    glowColor: "rgba(255,95,160,0.35)",
    gradientFrom: "#1e0015",
    gradientTo: "#450030",
    image: "/images/pink-summer.png",
    secondImage: "/images/mini-donuts.png",
  },
  {
    id: 3,
    num: "03",
    icon: Citrus,
    name: "Tropical Mix",
    oldPrice: 950,
    newPrice: 799,
    discount: 16,
    items: ["Milkshake Mangue", "Jus Ananas"],
    tagline: "Saveurs Exotiques",
    accent: "#ffb800",
    accentDark: "#cc8800",
    glowColor: "rgba(255,184,0,0.35)",
    gradientFrom: "#1a1000",
    gradientTo: "#3d2800",
    image: "/images/tropical-mix.png",
    secondImage: "/images/jus-ananas.png",
  },
  {
    id: 4,
    num: "04",
    icon: Snowflake,
    name: "Cool Vibes",
    oldPrice: 800,
    newPrice: 690,
    discount: 14,
    items: ["Iced Caramel Latte", "Mojito Fruits"],
    tagline: "La Fraîcheur à Chaque Gorgée",
    accent: "#00e8a0",
    accentDark: "#00aa70",
    glowColor: "rgba(0,232,160,0.35)",
    gradientFrom: "#001510",
    gradientTo: "#003828",
    image: "/images/cool-vibes.png",
    secondImage: "/images/mojito-fruits.png",
  },
  {
    id: 5,
    num: "05",
    icon: Cherry,
    name: "Red Fresh",
    oldPrice: 850,
    newPrice: 699,
    discount: 18,
    items: ["Jus Fraise", "Mojito Rouge"],
    tagline: "Fruits Rouges 100% Plaisir",
    accent: "#ff3a3a",
    accentDark: "#cc0000",
    glowColor: "rgba(255,58,58,0.35)",
    gradientFrom: "#1e0000",
    gradientTo: "#4a0000",
    image: "/images/red-fresh.png",
  },
  {
    id: 6,
    num: "06",
    icon: Umbrella,
    name: "Tropic Dream",
    oldPrice: 1100,
    newPrice: 899,
    discount: 18,
    items: ["Piña Colada", "Jus Cocktail de Fruits"],
    tagline: "L'Été en Mode Paradis",
    accent: "#ff8c00",
    accentDark: "#cc6600",
    glowColor: "rgba(255,140,0,0.35)",
    gradientFrom: "#1a0800",
    gradientTo: "#3d1800",
    image: "/images/juice.png",
  },
  {
    id: 7,
    num: "07",
    icon: Waves,
    name: "Lagoon Pack",
    oldPrice: 1000,
    newPrice: 799,
    discount: 20,
    items: ["Lagon Bleu", "Mojito Bleu"],
    tagline: "Double Fraîcheur",
    accent: "#1e90ff",
    accentDark: "#0060cc",
    glowColor: "rgba(30,144,255,0.35)",
    gradientFrom: "#000d20",
    gradientTo: "#001a40",
    image: "/images/milkshake.png",
  },
  {
    id: 8,
    num: "08",
    icon: Heart,
    name: "Duo Summer",
    oldPrice: 800,
    newPrice: 699,
    discount: 13,
    items: ["2 Mojitos au Choix"],
    tagline: "À Partager à Deux",
    accent: "#ff70c0",
    accentDark: "#cc3090",
    glowColor: "rgba(255,112,192,0.35)",
    gradientFrom: "#1a0012",
    gradientTo: "#40002a",
    image: "/images/duo-summer.png",
  },
  {
    id: 9,
    num: "09",
    icon: Star,
    name: "Best Summer Offer",
    oldPrice: 1150,
    newPrice: 999,
    discount: 13,
    items: ["Frappuccino Chocolat", "Mojito Fruits", "Jus Orange"],
    tagline: "Le Meilleur de l'Été",
    accent: "#ffd700",
    accentDark: "#ccaa00",
    glowColor: "rgba(255,215,0,0.35)",
    gradientFrom: "#181200",
    gradientTo: "#3a2d00",
    image: "/images/frappuccino.png",
    secondImage: "/images/mojito-fruits.png",
  },
];

type Offer = (typeof offers)[0];

export default function SummerOffers() {
  const [active, setActive] = useState(1);
  const [added, setAdded] = useState<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addItem } = useCart();

  const goTo = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  const prev = () => goTo((active - 1 + offers.length) % offers.length);
  const next = () => goTo((active + 1) % offers.length);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setActive((a) => (a + 1) % offers.length);
    }, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  const handleAddToCart = (offer: Offer) => {
    if (!offer.newPrice) return;
    addItem({
      name: offer.name,
      price: `${offer.newPrice} DA`,
      category: "Summer Offer",
    });
    setAdded(offer.id);
    setTimeout(() => setAdded(null), 1800);
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActive((a) => (a + 1) % offers.length);
    }, 4000);
  };

  const current = offers[active];

  return (
    <section
      id="summer-offers"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0505 50%, #050505 100%)",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 60%, ${current.glowColor} 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${current.accent}88 50%, transparent 100%)`,
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${current.accent}44 50%, transparent 100%)`,
          transition: "background 0.6s ease",
        }}
      />

      <div className="relative z-10 text-center mb-12 px-4">
        <div
          className="inline-flex items-center gap-3 mb-4 px-5 py-2 rounded-full"
          style={{
            background: `${current.accent}15`,
            border: `1px solid ${current.accent}40`,
            transition: "all 0.5s ease",
          }}
        >
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: current.accent, transition: "color 0.5s ease" }}
          >
            Offres Exclusives d'Été
          </span>
        </div>

        <h2 className="text-white leading-none mb-2" style={{ fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
          SUMMER{" "}
          <span style={{ color: current.accent, transition: "color 0.5s ease" }}>
            OFFERS
          </span>
        </h2>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Boissons froides · Offre limitée
        </p>
      </div>

      <div
        className="relative mx-auto"
        style={{
          height: "520px",
          maxWidth: "900px",
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {offers.map((offer, i) => {
          let offset = i - active;
          const total = offers.length;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          const isCenter = offset === 0;
          const tx = offset * 230;
          const scale = isCenter ? 1 : abs === 1 ? 0.76 : 0.57;
          const ry = offset * -15;
          const opacity = isCenter ? 1 : abs === 1 ? 0.65 : 0.35;
          const z = isCenter ? 20 : abs === 1 ? 10 : 1;
          const brightness = isCenter ? 1 : abs === 1 ? 0.55 : 0.3;

          return (
            <div
              key={offer.id}
              onClick={() => !isCenter && goTo(i)}
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                marginLeft: "-145px",
                width: "290px",
                transform: `translateX(${tx}px) scale(${scale}) rotateY(${ry}deg)`,
                zIndex: z,
                opacity,
                filter: `brightness(${brightness})`,
                transition: "all 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)",
                cursor: isCenter ? "default" : "pointer",
                transformOrigin: "center center",
              }}
            >
              <Card
                offer={offer}
                isActive={isCenter}
                justAdded={added === offer.id}
                onAdd={() => handleAddToCart(offer)}
              />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 mt-8 px-4">
        <div className="flex items-center gap-5">
          <button
            onClick={prev}
            className="flex items-center justify-center rounded-full font-bold transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              width: "44px",
              height: "44px",
              background: `${current.accent}18`,
              border: `1.5px solid ${current.accent}60`,
              color: current.accent,
              fontSize: "22px",
              transition: "all 0.4s ease",
            }}
          >
            ‹
          </button>

          <div className="flex gap-2 items-center">
            {offers.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === active ? "28px" : "6px",
                  height: "6px",
                  background: i === active ? current.accent : "rgba(255,255,255,0.15)",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex items-center justify-center rounded-full font-bold transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              width: "44px",
              height: "44px",
              background: `${current.accent}18`,
              border: `1.5px solid ${current.accent}60`,
              color: current.accent,
              fontSize: "22px",
              transition: "all 0.4s ease",
            }}
          >
            ›
          </button>
        </div>

        <p
          className="text-xs tracking-widest uppercase font-medium"
          style={{ color: current.accent + "99", transition: "color 0.5s ease" }}
        >
          {current.num} — {current.name}
        </p>
      </div>
    </section>
  );
}

function Card({
  offer,
  isActive,
  justAdded,
  onAdd,
}: {
  offer: Offer;
  isActive: boolean;
  justAdded: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      style={{
        width: "290px",
        minHeight: "490px",
        background: `linear-gradient(160deg, ${offer.gradientFrom} 0%, ${offer.gradientTo} 100%)`,
        borderRadius: "28px",
        border: `1px solid ${offer.accent}${isActive ? "55" : "22"}`,
        boxShadow: isActive
          ? `0 0 0 1px ${offer.accent}22, 0 30px 80px -10px ${offer.glowColor}, inset 0 1px 0 ${offer.accent}30`
          : "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.5s ease, border-color 0.5s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${offer.accent}, transparent)`,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${offer.accent}08 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div className="flex items-start justify-between px-5 pt-5 relative z-10">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: `${offer.accent}18`,
            border: `1px solid ${offer.accent}40`,
          }}
        >
          <span style={{ color: offer.accent, fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>
            -{offer.discount}%
          </span>
        </div>
        <span
          className="font-black text-xs"
          style={{ color: offer.accent + "66", letterSpacing: "0.1em" }}
        >
          {offer.num}
        </span>
      </div>

      <div
        className="relative flex items-center justify-center"
        style={{ height: "230px", marginTop: "8px" }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "16px",
            background: offer.accent,
            filter: "blur(20px)",
            opacity: isActive ? 0.5 : 0.2,
            transition: "opacity 0.5s ease",
            borderRadius: "50%",
          }}
        />
        {offer.secondImage ? (
          <div
            className="relative z-10 flex items-center justify-center gap-2"
            style={{ height: "100%" }}
          >
            <img
              src={offer.image}
              alt={offer.name}
              style={{
                height: "170px",
                width: "150px",
                objectFit: "contain",
                filter: isActive
                  ? `drop-shadow(0 0 24px ${offer.accent}66)`
                  : "none",
                transition: "filter 0.5s ease",
              }}
            />
            <span
              className="font-black leading-none"
              style={{ color: offer.accent, fontSize: "28px" }}
            >
              +
            </span>
            <img
              src={offer.secondImage}
              alt={`${offer.name} extra`}
              style={{
                height: "170px",
                width: "150px",
                objectFit: "contain",
                filter: isActive
                  ? `drop-shadow(0 0 24px ${offer.accent}66)`
                  : "none",
                transition: "filter 0.5s ease",
              }}
            />
          </div>
        ) : (
          <img
            src={offer.image}
            alt={offer.name}
            style={{
              height: "210px",
              width: "210px",
              objectFit: "contain",
              filter: isActive
                ? `drop-shadow(0 0 24px ${offer.accent}66)`
                : "none",
              transition: "filter 0.5s ease",
              position: "relative",
              zIndex: 1,
            }}
          />
        )}
      </div>

      <div className="px-5 pb-6 flex flex-col gap-3 flex-1 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <offer.icon size={17} style={{ color: offer.accent }} strokeWidth={2} />
            <span
              className="font-black uppercase tracking-wide leading-none"
              style={{ color: offer.accent, fontSize: "17px" }}
            >
              {offer.name}
            </span>
          </div>
          <p
            className="text-xs mt-0.5"
            style={{ color: offer.accent + "70", letterSpacing: "0.05em" }}
          >
            {offer.tagline}
          </p>
        </div>

        <div
          className="rounded-xl px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {offer.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-gray-300"
              style={{ paddingTop: i > 0 ? "5px" : "0", paddingBottom: i < offer.items.length - 1 ? "5px" : "0", borderBottom: i < offer.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <span style={{ color: offer.accent, fontSize: "8px" }}>◆</span>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div
              className="text-xs line-through leading-none mb-0.5"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {offer.oldPrice} DA
            </div>
            <div
              className="font-black leading-none"
              style={{ color: offer.accent, fontSize: "28px", letterSpacing: "-0.02em" }}
            >
              {offer.newPrice} <span className="text-sm font-bold">DA</span>
            </div>
          </div>

          <button
            onClick={onAdd}
            className="relative overflow-hidden flex items-center gap-1.5 font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              padding: "9px 14px",
              background: justAdded ? "#16a34a" : offer.accent,
              color: "#000",
              fontSize: "11px",
              letterSpacing: "0.03em",
              boxShadow: justAdded
                ? "0 4px 20px rgba(22,163,74,0.5)"
                : `0 4px 20px ${offer.glowColor}`,
              transition: "background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {justAdded ? (
              <>
                <Check size={14} />
                <span style={{ color: "#fff" }}>تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>إضافة للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
