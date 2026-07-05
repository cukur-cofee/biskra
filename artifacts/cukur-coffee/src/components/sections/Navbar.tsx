import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
const logoPath = "https://res.cloudinary.com/sfdktww4/image/upload/logo.png";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { totalItems, openCart } = useCart();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#story" },
    { name: "Menu", href: "#menu" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#footer" },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <motion.header
      className={`fixed top-8 md:top-9 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-primary/20 py-2" : "bg-transparent py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between relative">

        {/* Logo — centered on mobile, left on desktop */}
        <button 
          onClick={handleLogoClick}
          className="md:flex items-center gap-3 group absolute left-1/2 -translate-x-1/2 top-2 md:top-auto md:static md:translate-x-0 flex bg-none border-none cursor-pointer" 
          data-testid="link-home"
        >
          <div className="relative w-20 h-20 md:w-12 md:h-12 rounded-full overflow-hidden border border-primary/50 group-hover:border-primary transition-colors">
            <img src={logoPath} alt="Çukur Coffee Logo" className="object-cover w-full h-full" />
          </div>
          <span className="font-heading text-xl tracking-widest text-primary hidden md:block">ÇUKUR</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors"
              data-testid={`link-nav-${link.name.toLowerCase()}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+213793513780" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Phone size={16} />
            <span className="text-sm font-medium tracking-wider">07 93 51 37 80</span>
          </a>

          {/* Desktop cart icon */}
          <button
            onClick={openCart}
            className="relative text-primary hover:text-primary/80 transition-colors"
            data-testid="button-cart-desktop"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-heading rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <a
            href="#menu"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-heading uppercase tracking-widest hover:bg-primary/90 transition-colors"
            data-testid="button-order-now"
          >
            Order Now
          </a>
        </div>

        {/* Mobile: toggle left + cart right */}
        <div className="md:hidden flex items-center w-full justify-between">
          <button
            className="text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile cart with badge */}
          <button
            className="relative text-primary"
            onClick={openCart}
            data-testid="button-cart"
            aria-label="Open cart"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-heading rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 py-6 px-6 flex flex-col gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg uppercase tracking-widest text-foreground hover:text-primary transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col items-center gap-4 mt-4 pt-4 border-t border-primary/20">
            <a href="tel:+213793513780" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Phone size={18} />
              <span className="font-medium tracking-wider">07 93 51 37 80</span>
            </a>
            <button
              onClick={() => { openCart(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 bg-card/50 border border-primary/30 text-primary px-8 py-3 rounded-lg text-sm font-heading uppercase tracking-widest w-full hover:bg-card transition-colors"
              data-testid="button-view-cart-menu"
            >
              <ShoppingCart size={16} />
              View Cart {totalItems > 0 && `(${totalItems})`}
            </button>
            <a
              href="#menu"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-heading uppercase tracking-widest hover:bg-primary/90 transition-colors w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Order Now
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
