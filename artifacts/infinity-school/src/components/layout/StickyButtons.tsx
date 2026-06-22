import { Phone, MessageCircle } from "lucide-react";

export function StickyButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <a 
        href="tel:+919118502112"
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 group relative"
        aria-label="Call Us"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping group-hover:animate-none"></span>
        <Phone size={24} className="relative z-10" />
      </a>
      
      <a 
        href="https://wa.me/919118502112"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-110 group relative"
        aria-label="WhatsApp Us"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping group-hover:animate-none" style={{ animationDelay: '500ms' }}></span>
        <MessageCircle size={28} className="relative z-10" />
      </a>
    </div>
  );
}