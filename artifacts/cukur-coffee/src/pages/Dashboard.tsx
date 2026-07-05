import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, LogOut, Plus, Trash2, Tag, Coffee, Sun, Check, Loader2, Eye, EyeOff, Upload, ImageIcon, Pencil } from "lucide-react";
import { menuData } from "@/data/menuData";
import { saveAdminData, fetchAdminData, uploadToCloudinary, type AdminData, type ExtraOffer } from "@/lib/jsonbin";
import { useAdminData } from "@/context/AdminDataContext";

const ADMIN_PASSWORD = "cukur2026";

// ─── Login ────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1200); }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <p className="font-script text-primary text-3xl mb-1">Çukur Coffee</p>
          <h1 className="text-white font-heading text-xl uppercase tracking-widest">لوحة التحكم</h1>
        </div>
        <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
          <label className="text-white/60 text-sm font-heading uppercase tracking-widest">كلمة المرور</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={e => setPw(e.target.value)}
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white outline-none transition-all pr-10 ${
                err ? "border-red-500 animate-shake" : "border-white/20 focus:border-primary"
              }`}
              placeholder="••••••••"
              autoFocus
            />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {show ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {err && <p className="text-red-400 text-sm text-center">كلمة المرور غير صحيحة</p>}
          <button type="submit"
            className="mt-2 bg-primary text-black font-heading font-bold uppercase tracking-widest py-3 rounded-xl hover:opacity-90 transition-opacity">
            دخول
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────
type Tab = "menu" | "promos" | "offers";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "menu",   label: "الأسعار والأسماء", icon: Coffee },
  { id: "promos", label: "الملصقات",          icon: Tag   },
  { id: "offers", label: "عروض الصيف",        icon: Sun   },
];

// ─── Menu Tab (price + name editing) ──────────────────────
function MenuTab({
  overrides, setOverrides,
  nameOverrides, setNameOverrides,
}: {
  overrides: Record<string, string>;
  setOverrides: (v: Record<string, string>) => void;
  nameOverrides: Record<string, string>;
  setNameOverrides: (v: Record<string, string>) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0]);
  const items = menuData.items.filter(i => i.category === activeCategory);

  return (
    <div className="flex gap-4 h-full">
      {/* sidebar */}
      <div className="w-44 flex-shrink-0 flex flex-col gap-1 overflow-y-auto pr-1">
        {menuData.categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`text-left text-xs px-3 py-2 rounded-lg font-heading uppercase tracking-wide transition-all ${
              activeCategory === cat
                ? "bg-primary text-black font-bold"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* items */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <p className="text-white/30 text-[11px] mb-1 flex items-center gap-1">
          <Pencil size={11}/> يمكنك تعديل اسم المنتج والسعر — اتركه فارغاً للإبقاء على الأصلي
        </p>
        {items.map(item => {
          const key = item.name;
          const hasOverridePrice = !!overrides[key];
          const hasOverrideName  = !!nameOverrides[key];
          const hasAny = hasOverridePrice || hasOverrideName;
          return (
            <div key={key}
              className={`flex flex-col gap-2 px-4 py-3 rounded-xl border transition-all ${
                hasAny ? "border-primary/40 bg-primary/5" : "border-white/10 bg-white/5"
              }`}>
              {/* top row: original name + badges */}
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[11px]">أصلي:</span>
                <span className="text-white/60 text-xs font-heading">{item.name}</span>
                <span className="text-white/25 text-[11px] mx-1">·</span>
                <span className="text-white/40 text-[11px]">{item.price} DA</span>
                {hasAny && (
                  <button onClick={() => {
                    const np = { ...overrides }; delete np[key];
                    const nn = { ...nameOverrides }; delete nn[key];
                    setOverrides(np);
                    setNameOverrides(nn);
                  }} className="ml-auto text-white/25 hover:text-red-400 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>

              {/* inputs row */}
              <div className="flex items-center gap-2">
                {/* name input */}
                <div className="flex-1 flex items-center gap-1">
                  <Pencil size={12} className="text-white/30 flex-shrink-0"/>
                  <input
                    type="text"
                    placeholder={item.name}
                    value={nameOverrides[key] ?? ""}
                    onChange={e => {
                      const val = e.target.value;
                      const next = { ...nameOverrides };
                      if (val) next[key] = val; else delete next[key];
                      setNameOverrides(next);
                    }}
                    className="flex-1 min-w-0 bg-white/10 border border-white/20 focus:border-primary rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                  />
                </div>

                {/* price input */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="text"
                    placeholder={item.price}
                    value={overrides[key] ?? ""}
                    onChange={e => {
                      const val = e.target.value;
                      const next = { ...overrides };
                      if (val) next[key] = val; else delete next[key];
                      setOverrides(next);
                    }}
                    className="w-20 bg-white/10 border border-white/20 focus:border-primary rounded-lg px-2 py-1.5 text-white text-sm outline-none text-center"
                  />
                  <span className="text-white/40 text-xs">DA</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Promos Tab ───────────────────────────────────────────
function PromosTab({
  promos, setPromos,
}: {
  promos: Record<string, string>;
  setPromos: (v: Record<string, string>) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0]);
  const items = menuData.items.filter(i => i.category === activeCategory);

  return (
    <div className="flex gap-4 h-full">
      <div className="w-44 flex-shrink-0 flex flex-col gap-1 overflow-y-auto pr-1">
        {menuData.categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`text-left text-xs px-3 py-2 rounded-lg font-heading uppercase tracking-wide transition-all ${
              activeCategory === cat
                ? "bg-primary text-black font-bold"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <p className="text-white/40 text-xs mb-1">
          الملصق الأحمر يظهر فوق اسم المنتج في المنيو — اكتب نصاً مثل: جديد · ‑20% · محدود
        </p>
        {items.map(item => {
          const key = item.name;
          const hasPromo = !!promos[key];
          return (
            <div key={key}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                hasPromo ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-white/5"
              }`}>
              <span className="flex-1 text-white/90 text-sm font-heading">{item.name}</span>
              {hasPromo && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {promos[key]}
                </span>
              )}
              <input
                type="text"
                placeholder="نص الملصق..."
                value={promos[key] ?? ""}
                onChange={e => {
                  const val = e.target.value;
                  const next = { ...promos };
                  if (val) next[key] = val; else delete next[key];
                  setPromos(next);
                }}
                className="w-32 bg-white/10 border border-white/20 focus:border-red-400 rounded-lg px-2 py-1.5 text-white text-sm outline-none text-center"
              />
              {hasPromo && (
                <button onClick={() => {
                  const next = { ...promos };
                  delete next[key];
                  setPromos(next);
                }} className="text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 size={14}/>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cloudinary Upload Button ─────────────────────────────
function CloudinaryUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    // local preview
    const local = URL.createObjectURL(file);
    setPreview(local);

    try {
      const url = await uploadToCloudinary(file);
      setPreview(url);
      onUploaded(url);
    } catch {
      setError("فشل الرفع — تحقق من إعدادات Cloudinary");
      setPreview("");
    } finally {
      setUploading(false);
      // reset so same file can be re-selected
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:border-primary rounded-xl px-4 py-3 text-white text-sm font-heading uppercase tracking-widest transition-all disabled:opacity-50"
      >
        {uploading
          ? <><Loader2 size={16} className="animate-spin"/> جاري الرفع...</>
          : <><Upload size={16}/> رفع صورة من الهاتف</>
        }
      </button>

      {preview && !uploading && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-primary/30">
          <img src={preview} alt="preview" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Check size={24} className="text-green-400"/>
          </div>
        </div>
      )}

      {!preview && !uploading && (
        <div className="w-full h-24 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
          <ImageIcon size={24} className="text-white/20"/>
        </div>
      )}

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  );
}

// ─── Offers Tab ───────────────────────────────────────────
const ACCENT_OPTIONS = [
  { label: "ذهبي",    value: "#ffb800" },
  { label: "أزرق",    value: "#00d4ff" },
  { label: "أخضر",    value: "#00e8a0" },
  { label: "وردي",    value: "#ff5fa0" },
  { label: "برتقالي", value: "#ff8c00" },
  { label: "أحمر",    value: "#ff3a3a" },
];

function OffersTab({
  extraOffers, setExtraOffers,
}: {
  extraOffers: ExtraOffer[];
  setExtraOffers: (v: ExtraOffer[]) => void;
}) {
  const empty: Omit<ExtraOffer, "id"> = {
    name: "", oldPrice: 0, newPrice: 0, items: [], image: "",
    accent: "#ffb800", tagline: "",
  };
  const [form, setForm] = useState(empty);
  const [itemsText, setItemsText] = useState("");

  const add = () => {
    if (!form.name || !form.newPrice || !form.image) return;
    const newOffer: ExtraOffer = {
      ...form,
      id: Date.now(),
      items: itemsText.split(",").map(s => s.trim()).filter(Boolean),
    };
    setExtraOffers([...extraOffers, newOffer]);
    setForm(empty);
    setItemsText("");
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      {/* existing extra offers */}
      {extraOffers.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-white/40 text-xs uppercase tracking-widest font-heading">العروض المضافة</p>
          {extraOffers.map(offer => (
            <div key={offer.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
              {offer.image && (
                <img src={offer.image} alt={offer.name}
                  className="w-10 h-10 object-cover rounded-lg flex-shrink-0"/>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-heading text-sm">{offer.name}</p>
                <p className="text-white/40 text-xs">{offer.newPrice} DA · {offer.items.join(", ")}</p>
              </div>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: offer.accent }}/>
              <button onClick={() => setExtraOffers(extraOffers.filter(o => o.id !== offer.id))}
                className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* add form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-white/60 text-xs uppercase tracking-widest font-heading">إضافة عرض جديد</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[11px]">اسم العرض *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Summer Special"
              className="bg-white/10 border border-white/20 focus:border-primary rounded-lg px-3 py-2 text-white text-sm outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[11px]">وصف قصير</label>
            <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
              placeholder="Fraîcheur & Gourmandise"
              className="bg-white/10 border border-white/20 focus:border-primary rounded-lg px-3 py-2 text-white text-sm outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[11px]">السعر الأصلي (DA)</label>
            <input type="number" value={form.oldPrice || ""} onChange={e => setForm(f => ({ ...f, oldPrice: +e.target.value }))}
              placeholder="800"
              className="bg-white/10 border border-white/20 focus:border-primary rounded-lg px-3 py-2 text-white text-sm outline-none"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[11px]">السعر الجديد (DA) *</label>
            <input type="number" value={form.newPrice || ""} onChange={e => setForm(f => ({ ...f, newPrice: +e.target.value }))}
              placeholder="650"
              className="bg-white/10 border border-white/20 focus:border-primary rounded-lg px-3 py-2 text-white text-sm outline-none"/>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-[11px]">المحتويات (افصل بفاصلة)</label>
          <input value={itemsText} onChange={e => setItemsText(e.target.value)}
            placeholder="Mojito Bleu, Mini Pancakes ×6"
            className="bg-white/10 border border-white/20 focus:border-primary rounded-lg px-3 py-2 text-white text-sm outline-none"/>
        </div>

        {/* Image upload section */}
        <div className="flex flex-col gap-2">
          <label className="text-white/40 text-[11px]">صورة العرض *</label>

          {/* Upload from phone */}
          <CloudinaryUpload onUploaded={url => setForm(f => ({ ...f, image: url }))} />
          {form.image && (
            <img src={form.image} alt="preview"
              className="w-full h-28 object-cover rounded-xl border border-white/10 mt-1"/>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/40 text-[11px]">اللون</label>
          <div className="flex gap-2 flex-wrap">
            {ACCENT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setForm(f => ({ ...f, accent: opt.value }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  form.accent === opt.value ? "border-white/40 bg-white/10" : "border-white/10"
                }`}>
                <span className="w-3 h-3 rounded-full" style={{ background: opt.value }}/>
                <span className="text-white/70">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={add}
          disabled={!form.name || !form.newPrice || !form.image}
          className="flex items-center justify-center gap-2 bg-primary text-black font-heading font-bold uppercase tracking-widest py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30">
          <Plus size={16}/> إضافة العرض
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
export default function Dashboard() {
  const { refresh } = useAdminData();
  const [authed, setAuthed]     = useState(false);
  const [tab, setTab]           = useState<Tab>("menu");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [overrides, setOverrides]         = useState<Record<string, string>>({});
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({});
  const [promos, setPromos]               = useState<Record<string, string>>({});
  const [extraOffers, setExtraOffers]     = useState<ExtraOffer[]>([]);

  useEffect(() => {
    if (!authed) return;
    fetchAdminData().then(d => {
      setOverrides(d.menuOverrides ?? {});
      setNameOverrides(d.nameOverrides ?? {});
      setPromos(d.promos ?? {});
      setExtraOffers(d.extraOffers ?? []);
    });
  }, [authed]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(false);
    const data: AdminData = { menuOverrides: overrides, nameOverrides, promos, extraOffers };
    const ok = await saveAdminData(data);
    if (ok) {
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 4000);
    }
    setSaving(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="font-script text-primary text-xl">Çukur Coffee</span>
          <span className="text-white/40 text-xs ml-3 font-heading uppercase tracking-widest">لوحة التحكم</span>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-green-400 text-sm">
                <Check size={14}/> تم الحفظ
              </motion.span>
            )}
            {saveError && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-red-400 text-sm">
                ⚠ فشل الحفظ، تحقق من الاتصال
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-primary text-black font-heading font-bold uppercase tracking-widest px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin"/> : <Save size={15}/>}
            {saving ? "يتم الحفظ..." : "حفظ التغييرات"}
          </button>
          <button onClick={() => setAuthed(false)}
            className="text-white/30 hover:text-white/60 transition-colors p-2">
            <LogOut size={16}/>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6 flex gap-1 flex-shrink-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-heading uppercase tracking-widest border-b-2 transition-all -mb-px ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {tab === "menu" && (
              <MenuTab
                overrides={overrides}     setOverrides={setOverrides}
                nameOverrides={nameOverrides} setNameOverrides={setNameOverrides}
              />
            )}
            {tab === "promos" && <PromosTab promos={promos} setPromos={setPromos}/>}
            {tab === "offers" && <OffersTab extraOffers={extraOffers} setExtraOffers={setExtraOffers}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
