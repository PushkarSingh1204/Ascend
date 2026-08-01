// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ArrowRight, X } from 'lucide-react';
import Logo from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'AI Analysis', href: '#workflow' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Resources', href: '/resources' },
  ];

  const handleNavClick = (e, href) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-lg shadow-black/10 py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        
        {/* Brand Logo (Left) */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); navigate('/'); }} 
          className="flex items-center gap-3 group text-decoration-none"
        >
          <Logo size={34} animated={true} />
        </a>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link, idx) => (
            <a 
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="animated-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions (Right) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-bright transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="btn-secondary-v2 text-xs py-2.5 px-4"
          >
            Sign In
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="btn-primary-v2 text-xs py-2.5 px-4"
          >
            <span>Get Started</span>
            <ArrowRight size={14} strokeWidth={2.5} className="btn-arrow" />
          </button>
        </div>

        {/* Mobile Menu Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-card border border-border text-foreground flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <span 
              className={`w-5 h-[2px] bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span 
              className={`w-5 h-[2px] bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`w-5 h-[2px] bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[70px] z-40 bg-background/95 backdrop-blur-md border-b border-border px-6 py-8 flex flex-col justify-between md:hidden"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-foreground text-lg font-bold py-2 border-b border-border/40 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="space-y-3 pt-6">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                className="w-full btn-primary-v2 text-sm py-3"
              >
                <span>Sign In to Ascend</span>
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
