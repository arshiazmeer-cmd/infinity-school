import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#042b47] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex flex-col">
            <span className="text-3xl font-heading font-bold text-white flex items-center gap-2">
              <span className="text-4xl text-secondary">∞</span> Infinity
            </span>
            <span className="text-sm text-gray-300 font-inter tracking-wide mt-1">
              Public School
            </span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            Building Future Doctors & Engineers. A premier integrated coaching school combining academic schooling with IIT-JEE and NEET exam preparation under one roof.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Facebook size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><Youtube size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Quick Links</h3>
          <ul className="space-y-3">
            {['About Us', 'Our Faculty', 'Toppers & Results', 'Photo Gallery', 'Hostel Facilities', 'FAQs'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-gray-300 hover:text-secondary transition-colors text-sm flex items-center gap-2">
                  <span className="text-secondary text-xs">▸</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Programs</h3>
          <ul className="space-y-3">
            {['Early Foundation (Nur-5)', 'Foundation (6-8)', 'Pre-Foundation (9-10)', 'IIT-JEE Program', 'NEET Program', 'Integrated Schooling'].map((item) => (
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
          <h3 className="text-lg font-heading font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-gray-300 items-start">
              <MapPin size={18} className="text-secondary shrink-0 mt-1" />
              <span>Infinity Public School,<br />Kursi, Barabanki,<br />Uttar Pradesh, India</span>
            </li>
            <li className="flex gap-3 text-sm text-gray-300 items-center">
              <Phone size={18} className="text-secondary shrink-0" />
              <span>+91 9118502112</span>
            </li>
            <li className="flex gap-3 text-sm text-gray-300 items-center">
              <Mail size={18} className="text-secondary shrink-0" />
              <span>ipskursi@gmail.com</span>
            </li>
          </ul>
          <div className="mt-6">
            <span className="inline-block bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Admissions Open 2025-26
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Infinity Public School. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}