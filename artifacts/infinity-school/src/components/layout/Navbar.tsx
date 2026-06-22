import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { name: "Results", path: "/results" },
    { name: "Hostel", path: "/hostel" },
    { name: "Admission", path: "/admission" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:flex justify-between items-center bg-primary text-primary-foreground px-6 py-2 text-sm font-inter">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>+91 9118502112</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>ipskursi@gmail.com</span>
          </div>
        </div>
        <div>
          <span className="font-semibold text-secondary">Admissions Open 2025-26</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`px-6 py-4 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="text-3xl text-secondary">∞</span> Infinity
            </span>
            <span className="text-xs text-muted-foreground font-inter tracking-wide hidden sm:block">
              Building Future Doctors & Engineers
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
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
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full px-6">
                Apply Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-border flex flex-col p-4 animate-in slide-in-from-top-2">
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
            <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white">
              Apply Now
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}