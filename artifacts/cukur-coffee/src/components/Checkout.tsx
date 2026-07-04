import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getLoyaltyStatus, recordOrder, sendTelegramOrder, type LoyaltyStatus } from "@/lib/loyalty";

interface Props { onClose: () => void }


export default function Checkout({ onClose }: Props) {
  const { items, totalPrice, clearCart, closeCart } = useCart();

  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [address,   setAddress]   = useState("");
  const [notes,     setNotes]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [loyalty,   setLoyalty]   = useState<LoyaltyStatus | null>(null);

  // Check loyalty whenever phone changes (min 9 chars)
  useEffect(() => {
    const cleaned = phone.replace(/\s+/g, "");
    if (cleaned.length >= 9) {
      setLoyalty(getLoyaltyStatus(cleaned));
    } else {
      setLoyalty(null);
    }
  }, [phone]);

  const discountedTotal =
    loyalty?.discount === 100 ? 0
    : loyalty?.discount === 50 ? Math.round(totalPrice * 0.5)
    : totalPrice;

  const finalTotal = discountedTotal;

  // Helper: parse item line price safely
  const itemLinePrice = (price: string, qty: number) => {
    const num = parseInt(price.split("/")[0], 10);
    return isNaN(num) ? 0 : num * qty;
  };

  // ── Telegram send ────────────────────────────────────
  const handleTelegram = async () => {
    setSending(true);
    const cleanPhone = phone.replace(/\s+/g, "");
    const recorded = recordOrder(cleanPhone);
    const disc = recorded.posInCycle === 5 ? 50 : recorded.posInCycle === 10 ? 100 : 0;
    const sentTotal = disc === 100 ? 0 : disc === 50 ? Math.round(totalPrice * 0.5) : totalPrice;
    await sendTelegramOrder({
      name, phone, address, notes,
      items: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: itemLinePrice(i.price, i.quantity).toString(),
      })),
      originalTotal: totalPrice,
      finalTotal: sentTotal,
      loyalty: recorded,
    });
    setSending(false);
    clearCart();
    closeCart();
    onClose();
  };


  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full sm:max-w-md bg-[#111111] border border-primary/20 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] overflow-y-auto"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="px-6 py-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl uppercase tracking-widest text-foreground">
              {submitted ? "تأكيد الطلب" : "بياناتك"}
            </h3>
            <button onClick={onClose} className="text-foreground/40 hover:text-primary transition-colors">
              <X size={20} />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-4">
              {/* Name */}
              <Field label="الاسم الكامل">
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="اسمك"
                  className="input-base" data-testid="input-checkout-name" />
              </Field>

              {/* Phone */}
              <Field label="رقم الهاتف">
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="05XX XXX XXX"
                  className="input-base" data-testid="input-checkout-phone" />
              </Field>

              {/* Address */}
              <Field label="الموقع / العنوان">
                <input required value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="الحي، الشارع…"
                  className="input-base" data-testid="input-checkout-address" />
              </Field>

              {/* Loyalty card — appears once phone is long enough */}
              <AnimatePresence>
                {loyalty && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl border border-primary/25 bg-primary/5 p-4 flex flex-col gap-3"
                  >
                    <p className="font-heading text-[11px] uppercase tracking-widest text-primary/70 text-center">
                      بطاقة الولاء
                    </p>

                    {/* Circles */}
                    <LoyaltyDots posInCycle={loyalty.posInCycle} />

                    {/* Status text */}
                    <p className="text-center text-xs font-body text-foreground/50">
                      {loyalty.total === 0
                        ? "أول طلب! ابدأ رحلتك مع Çukur ☕"
                        : `إجمالي طلباتك: ${loyalty.total} • الطلب رقم ${loyalty.posInCycle} من 10`}
                    </p>

                    {/* Discount badge */}
                    {loyalty.discount > 0 && (
                      <motion.div
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className={`rounded-lg px-4 py-2 text-center font-heading text-sm tracking-wide ${
                          loyalty.discount === 100
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-primary/15 border border-primary/30 text-primary"
                        }`}
                      >
                        {loyalty.discount === 100
                          ? "🎉 هذا الطلب مجاني تماماً!"
                          : "🎊 تخفيض 50% على هذا الطلب!"}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notes */}
              <Field label="ملاحظات (اختياري)">
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="حساسية، طلبات خاصة…" rows={2}
                  className="input-base resize-none" data-testid="input-checkout-notes" />
              </Field>

              {/* Order summary */}
              <OrderSummary items={items} total={totalPrice} finalTotal={finalTotal} discount={loyalty?.discount ?? 0} />

              <button type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-heading uppercase tracking-widest text-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-review-order">
                مراجعة الطلب
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Customer info */}
              <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-lg p-4">
                <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-heading text-sm text-foreground">{name}</p>
                  <p className="text-foreground/50 text-xs font-body">{phone}</p>
                  {address && <p className="text-foreground/50 text-xs font-body">📍 {address}</p>}
                  {notes && <p className="text-foreground/40 text-xs font-body italic">{notes}</p>}
                </div>
              </div>

              <OrderSummary items={items} total={totalPrice} finalTotal={finalTotal} discount={loyalty?.discount ?? 0} />

              {/* Loyalty card on confirm screen */}
              {loyalty && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-col gap-2">
                  <LoyaltyDots posInCycle={loyalty.posInCycle} />
                  {loyalty.discount > 0 && (
                    <p className={`text-center text-xs font-heading ${loyalty.discount === 100 ? "text-emerald-400" : "text-primary"}`}>
                      {loyalty.discount === 100 ? "🎉 مجاني تماماً!" : "🎊 تخفيض 50% مطبّق"}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleTelegram}
                disabled={sending}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-heading uppercase tracking-widest text-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                data-testid="button-send-order"
              >
                {sending ? "جاري الإرسال…" : "إرسال الطلب"}
              </button>

              <button onClick={() => setSubmitted(false)}
                className="text-foreground/30 text-xs font-body text-center hover:text-foreground/50 transition-colors">
                تعديل البيانات
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-heading text-[11px] uppercase tracking-widest text-foreground/40">{label}</label>
      {children}
    </div>
  );
}

function LoyaltyDots({ posInCycle }: { posInCycle: number }) {
  // 9 normal slots + 1 reward slot
  const slots = [1,2,3,4,5,6,7,8,9];
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {slots.map(n => {
        const done    = n < posInCycle;
        const current = n === posInCycle;
        const is5     = n === 5;
        return (
          <div key={n} className={`
            w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-heading transition-all
            ${done
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
              : current
              ? "border-2 border-primary text-primary animate-pulse"
              : "border border-primary/20 text-foreground/25"}
            ${is5 && !done ? "ring-1 ring-primary/40" : ""}
          `}>
            {is5 && !done ? "½" : n}
          </div>
        );
      })}
      {/* 10th slot = free */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-heading transition-all
        ${posInCycle === 10
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 animate-pulse"
          : posInCycle > 10
          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
          : "border border-primary/20 text-foreground/25"}
      `}>
        🎁
      </div>
    </div>
  );
}

function OrderSummary({
  items, total, finalTotal, discount,
}: {
  items: { name: string; quantity: number; price: string }[];
  total: number; finalTotal: number; discount: number;
}) {
  return (
    <div className="bg-card/30 border border-primary/10 rounded-lg p-4 flex flex-col gap-2 max-h-40 overflow-y-auto">
      {items.map(item => (
        <div key={item.name} className="flex justify-between text-xs">
          <span className="text-foreground/60 font-body">{item.name} ×{item.quantity}</span>
          <span className="text-primary font-heading">
            {item.price !== "-"
              ? `${(parseInt(item.price.split("/")[0], 10) * item.quantity).toLocaleString()} DA`
              : "—"}
          </span>
        </div>
      ))}
      <div className="border-t border-primary/10 mt-1 pt-2 space-y-1">
        {discount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-foreground/40 font-body line-through">{total.toLocaleString()} DA</span>
            <span className="text-foreground/40 font-heading text-[10px] uppercase">
              {discount === 100 ? "مجاني 100%" : "خصم 50%"}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-heading text-xs uppercase tracking-wider text-foreground/40">الإجمالي</span>
          <span className={`font-heading text-base ${discount > 0 ? (discount === 100 ? "text-emerald-400" : "text-primary") : "text-primary"}`}>
            {finalTotal === 0 ? "مجاني 🎉" : `${finalTotal.toLocaleString()} DA`}
          </span>
        </div>
      </div>
    </div>
  );
}
