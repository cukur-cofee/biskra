export default function AnnouncementBar() {
  const message =
    "HAPPY HOUR · 16:00 – 18:00 · -20% SUR MOJITO · MILKSHAKE · ICED COFFEE · JUS NATUREL   •   ساعة السعادة · 16:00 – 18:00 · خصم 20% على الموخيتو · الميلك شيك · القهوة المثلجة · العصير الطبيعي";

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#FFD500] text-black overflow-hidden py-1.5">
      <div className="marquee-track flex whitespace-nowrap">
        <span className="marquee-content flex items-center shrink-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-6 text-[11px] md:text-xs font-bold uppercase tracking-wider">
              {message}
            </span>
          ))}
        </span>
        <span className="marquee-content flex items-center shrink-0" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-6 text-[11px] md:text-xs font-bold uppercase tracking-wider">
              {message}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
