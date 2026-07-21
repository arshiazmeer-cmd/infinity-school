import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, Download, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";
import { BROCHURE_URL, BROCHURE_FILENAME } from "@/lib/brochure";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Faculty", path: "/faculty" },
    { name: "Hostel", path: "/hostel" },
    { name: "Admission", path: "/admission" },
    { name: "Disclosure", path: "/disclosure" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center bg-primary text-primary-foreground px-6 py-2 text-sm font-inter">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <a href="tel:+919118502112" className="hover:text-secondary transition-colors">+91 9118502112</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <a href="mailto:ipskursi@gmail.com" className="hover:text-secondary transition-colors">ipskursi@gmail.com</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-secondary">Admissions Open 2026–27</span>
          <a
            href={BROCHURE_URL}
            download={BROCHURE_FILENAME}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-secondary text-white px-3 py-1 rounded-full hover:bg-secondary/90 transition-colors font-semibold"
          >
            <Download size={12} /> Download Brochure
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`px-6 py-3 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src={logoImg} alt="Infinity Public School Logo" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors hover:text-secondary ${location === link.path ? "text-secondary" : "text-foreground"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/admission">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full px-5 text-sm">
                Apply Now
              </Button>
            </Link>
            <Link href="/teacher/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-full px-5 text-sm flex items-center gap-1.5 transition-colors">
                <GraduationCap size={15} />
                Teacher Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-semibold rounded-full px-5 text-sm flex items-center gap-1.5 transition-colors">
                <Shield size={15} />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-border flex flex-col p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 p-4 mb-2">
            <img src={logoImg} alt="Infinity Public School Logo" className="h-12 w-auto object-contain" />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`py-3 px-4 rounded-md text-sm font-semibold ${location === link.path ? "bg-primary/10 text-primary" : "text-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admission" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white">Apply Now</Button>
          </Link>
          <Link href="/teacher/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-2">
              <GraduationCap size={15} />
              Teacher Login
            </Button>
          </Link>
          <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full mt-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center justify-center gap-2">
              <Shield size={15} />
              Admin Login
            </Button>
          </Link>
          <a
            href={BROCHURE_URL}
            download={BROCHURE_FILENAME}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-2 w-full border border-primary text-primary rounded-md py-2 text-sm font-semibold hover:bg-primary/5 transition-colors"
          >
            <Download size={14} /> Download Brochure
          </a>
        </div>
      )}
    </header>
  );
}
