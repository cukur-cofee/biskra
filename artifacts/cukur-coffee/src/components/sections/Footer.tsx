import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import logoPath from "@assets/d80f3400-7b6c-4a50-bc84-4091c470652c_1783143873962.png";

// A custom TikTok icon since lucide doesn't have it natively or standard si might be missing
function TikTokIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a4 4 0 0 1-1.52-.3A8 8 0 0 1 13 21v-5a4 4 0 0 1-4-4Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="bg-card pt-24 pb-8 border-t border-primary/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={logoPath} alt="Çukur Coffee Logo" className="w-12 h-12 rounded-full border border-primary/50" />
              <span className="font-heading text-2xl tracking-widest text-primary">ÇUKUR</span>
            </div>
            <p className="text-foreground/60 font-light text-sm leading-relaxed max-w-xs">
              A luxury coffee atelier fusing North African warmth with European elegance. Unhurried, tactile, and confident.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.instagram.com/cukur_biskra/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61589092786783" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.tiktok.com/@cukur._.coffee" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <TikTokIcon className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-heading text-lg uppercase tracking-widest text-foreground">Navigation</h4>
            <div className="flex flex-col gap-3">
              {['Home', 'About', 'Menu', 'Gallery', 'Contact'].map((link) => (
                <a key={link} href={`#${link.toLowerCase() === 'about' ? 'story' : link.toLowerCase()}`} className="text-foreground/60 hover:text-primary text-sm uppercase tracking-wider transition-colors w-fit">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="font-heading text-lg uppercase tracking-widest text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.google.com/maps/place/VP4F%2B2RC+%C3%87ukur+coffee,+Biskra/@34.8461,5.7248,17z/data=!4m2!3m1!1s0x12f50900475cb8ed:0x48d30cd18d8fcfb1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-foreground/60 hover:text-primary text-sm transition-colors"
              >
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Çukur Coffee<br/>Biskra, Algeria</span>
              </a>
              <a href="tel:+213793513780" className="flex items-center gap-3 text-foreground/60 hover:text-primary text-sm transition-colors">
                <Phone size={18} className="text-primary shrink-0" />
                <span>07 93 51 37 80</span>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col gap-6">
            <h4 className="font-heading text-lg uppercase tracking-widest text-foreground">Hours</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-foreground/60 text-sm">
                <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <span className="uppercase tracking-wider">Mon - Fri</span>
                    <span className="text-primary">07:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="uppercase tracking-wider">Sat - Sun</span>
                    <span className="text-primary">08:00 - 00:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10 flex flex-col items-center justify-center gap-2 text-center text-xs font-light text-foreground/40 uppercase tracking-widest">
          <p>© 2026 ÇUKUR COFFEE. All Rights Reserved.</p>
          <p>Family Cafeteria</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.instagram.com/dreamteam.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline normal-case tracking-normal"
            >
              dreamteam.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
