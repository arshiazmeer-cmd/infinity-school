import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Download } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { BROCHURE_URL, BROCHURE_FILENAME } from "@/lib/brochure";

export function Footer() {
  return (
    <footer className="bg-[#042b47] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center">
            <div className="bg-white rounded-xl p-2 inline-block">
              <img src={logoImg} alt="Infinity Public School Logo" className="h-14 w-auto object-contain" />
            </div>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            A premier integrated school combining academic excellence with IIT-JEE and NEET preparation under one roof in Kursi, Barabanki.
          </p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/profile.php?id=100095246302881" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/infinity.kursi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://www.youtube.com/@InfinityKursi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] transition-colors" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
          <a
            href={BROCHURE_URL}
            download={BROCHURE_FILENAME}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-secondary/90 transition-colors"
          >
            <Download size={14} /> Download Brochure
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { label: 'About Us', path: '/about' },
              { label: 'Our Faculty', path: '/faculty' },
              { label: 'Photo Gallery', path: '/gallery' },
              { label: 'Hostel Facilities', path: '/hostel' },
              { label: 'Admission Process', path: '/admission' },
              { label: 'Public Disclosure', path: '/disclosure' },
              { label: 'FAQs', path: '/faq' },
            ].map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="text-gray-300 hover:text-secondary transition-colors text-sm flex items-center gap-2">
                  <span className="text-secondary text-xs">▸</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Programs</h3>
          <ul className="space-y-3">
            {['Early Foundation (Nur–5)', 'Foundation (6–8)', 'Pre-Foundation (9–10)', 'IIT-JEE Program', 'NEET Program', 'Integrated Schooling'].map((item) => (
              <li key={item}>
                <Link href="/admission" className="text-gray-300 hover:text-secondary transition-colors text-sm flex items-center gap-2">
                  <span className="text-secondary text-xs">▸</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-gray-300 items-start">
              <MapPin size={18} className="text-secondary shrink-0 mt-1" />
              <span>Infinity Public School,<br />Kursi, Barabanki,<br />Uttar Pradesh, India</span>
            </li>
            <li className="flex gap-3 text-sm text-gray-300 items-center">
              <Phone size={18} className="text-secondary shrink-0" />
              <a href="tel:+919118502112" className="hover:text-secondary transition-colors">+91 9118502112</a>
            </li>
            <li className="flex gap-3 text-sm text-gray-300 items-center">
              <Mail size={18} className="text-secondary shrink-0" />
              <a href="mailto:ipskursi@gmail.com" className="hover:text-secondary transition-colors">ipskursi@gmail.com</a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a href="https://www.facebook.com/profile.php?id=100095246302881" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-secondary transition-colors flex items-center gap-1">
              <Facebook size={14} /> Facebook
            </a>
            <a href="https://www.instagram.com/infinity.kursi/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-secondary transition-colors flex items-center gap-1">
              <Instagram size={14} /> Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Infinity Public School, Kursi, Barabanki. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/faq" className="hover:text-white transition-colors">FAQs</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admission" className="hover:text-white transition-colors">Admission</Link>
        </div>
      </div>
    </footer>
  );
}
