// ── Loyalty card system ─────────────────────────────────
// Each phone number tracks total orders in localStorage.
// Cycle of 10: order #5 = 50% off, order #10 = FREE.

const BOT_TOKEN = "8604835546:AAGV-7jAFk7_EfUGR-_QQyUUF-z4lSEt3Fw";
const CHAT_ID   = "5794299315";

export interface LoyaltyStatus {
  total: number;          // all-time orders
  posInCycle: number;     // 1-10, where we are in this cycle
  discount: number;       // 0 | 50 | 100
}

function storageKey(phone: string) {
  return `loyalty_${phone.replace(/\s+/g, "")}`;
}

export function getLoyaltyStatus(phone: string): LoyaltyStatus {
  const raw = localStorage.getItem(storageKey(phone));
  const total = raw ? parseInt(raw, 10) : 0;
  const posInCycle = (total % 10) + 1;          // next order position
  let discount = 0;
  if (posInCycle === 5)  discount = 50;
  if (posInCycle === 10) discount = 100;
  return { total, posInCycle, discount };
}

export function recordOrder(phone: string): LoyaltyStatus {
  const raw = localStorage.getItem(storageKey(phone));
  const prev = raw ? parseInt(raw, 10) : 0;
  const newTotal = prev + 1;
  localStorage.setItem(storageKey(phone), String(newTotal));
  const posInCycle = ((newTotal - 1) % 10) + 1; // which slot THIS order occupied
  let discount = 0;
  if (posInCycle === 5)  discount = 50;
  if (posInCycle === 10) discount = 100;
  return { total: newTotal, posInCycle, discount };
}

export async function sendTelegramOrder(payload: {
  name: string;
  phone: string;
  address: string;
  notes: string;
  items: { name: string; quantity: number; price: string }[];
  originalTotal: number;
  finalTotal: number;
  loyalty: LoyaltyStatus;
}) {
  const { name, phone, address, notes, items, originalTotal, finalTotal, loyalty } = payload;

  const SLOTS = 9;
  const filled = Math.min(loyalty.posInCycle - 1, SLOTS);
  const dots   = Array.from({ length: SLOTS }, (_, i) =>
    i < filled ? "🟤" : "⚪"
  ).join("") + (loyalty.posInCycle === 10 ? "🎁" : "🎁");

  const discountLine =
    loyalty.discount === 100
      ? "\n🎉 <b>المرة العاشرة — مجاناً تماماً!</b>"
      : loyalty.discount === 50
      ? `\n🎊 <b>تخفيض 50%!</b> الإجمالي بعد الخصم: <b>${finalTotal.toLocaleString()} DA</b>`
      : "";

  const orderLines = items
    .map((i) => `• ${i.name} ×${i.quantity} — ${i.price} DA`)
    .join("\n");

  const text = [
    "🛒 <b>طلب جديد — Çukur Coffee</b>",
    "",
    `👤 <b>الاسم:</b> ${name}`,
    `📱 <b>الرقم:</b> ${phone}`,
    address ? `📍 <b>الموقع:</b> ${address}` : "",
    notes ? `📝 <b>ملاحظات:</b> ${notes}` : "",
    "",
    "🛍 <b>الطلب:</b>",
    orderLines,
    "",
    `💰 الإجمالي: <b>${originalTotal.toLocaleString()} DA</b>`,
    discountLine,
    "",
    "──────────────────",
    `🎫 <b>بطاقة الولاء</b>`,
    `الطلب رقم <b>${loyalty.posInCycle}</b> من 10  (إجمالي: ${loyalty.total})`,
    dots,
  ]
    .filter((l) => l !== "")
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("Telegram send failed:", e);
  }
}
