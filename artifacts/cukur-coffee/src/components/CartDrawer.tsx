import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Checkout from "./Checkout";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-x-0 bottom-0 top-8 md:top-9 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed right-0 top-8 md:top-9 bottom-0 z-50 w-full max-w-sm bg-[#111111] border-l border-primary/20 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <span className="font-heading text-lg uppercase tracking-widest text-foreground">
                  Cart
                </span>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-heading px-2 py-0.5 rounded-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-foreground/40 hover:text-primary transition-colors"
                data-testid="button-close-cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  >
                    <ShoppingBag size={40} className="text-primary/20" />
                    <p className="font-heading text-foreground/30 uppercase tracking-widest text-sm">
                      Your cart is empty
                    </p>
                    <button
                      onClick={closeCart}
                      className="text-primary text-xs font-heading uppercase tracking-widest border border-primary/30 px-6 py-2 rounded-lg hover:bg-primary/10 transition-all"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 bg-card/40 border border-primary/10 rounded-lg p-3"
                      data-testid={`cart-item-${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {/* Gold accent bar */}
                      <div className="w-1 self-stretch rounded-full bg-primary/60 flex-shrink-0" />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm tracking-wide text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-primary text-xs font-heading mt-0.5">
                          {item.price} DA
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="w-7 h-7 rounded-md border border-primary/20 flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all active:scale-90"
                          data-testid={`btn-decrease-${item.name}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-heading text-sm text-foreground w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.name, 1)}
                          className="w-7 h-7 rounded-md border border-primary/20 flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all active:scale-90"
                          data-testid={`btn-increase-${item.name}`}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.name)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-foreground/30 hover:text-red-400 transition-colors ml-1"
                          data-testid={`btn-remove-${item.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-primary/10 flex flex-col gap-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs uppercase tracking-widest text-foreground/50">
                    Subtotal
                  </span>
                  <span className="font-heading text-xl text-primary">
                    {totalPrice.toLocaleString()} <span className="text-xs text-foreground/40">DA</span>
                  </span>
                </div>
                {/* Checkout button */}
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-heading uppercase tracking-widest text-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(200,165,106,0.25)]"
                  data-testid="button-checkout"
                >
                  Place Order
                </button>
                <p className="text-center text-foreground/30 text-[10px] font-body">
                  Order confirmed by phone or WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Checkout modal */}
      {showCheckout && (
        <Checkout onClose={() => setShowCheckout(false)} />
      )}
    </AnimatePresence>
  );
}
