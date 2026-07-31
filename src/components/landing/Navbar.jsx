// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';

import Logo from '../Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
        isScrolled 
          ? 'bg-[#111827]/85 backdrop-blur-md border-b border-[#1F2937] shadow-lg shadow-black/20 py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group text-decoration-none">
          <Logo size={36} />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="animated-link text-sm font-medium">Features</a>
          <a href="#workflow" className="animated-link text-sm font-medium">AI Workflow</a>
          <a href="#testimonials" className="animated-link text-sm font-medium">Testimonials</a>
          <a href="#faq" className="animated-link text-sm font-medium">FAQ</a>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-[12px] bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#374151] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="btn-primary-v2"
          >
            <span>Sign In</span>
            <ArrowRight size={16} strokeWidth={2} className="btn-arrow" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-[12px] bg-[#111827] border border-[#1F2937] text-[#94A3B8]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[12px] bg-[#111827] border border-[#1F2937] text-[#F8FAFC]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#1F2937] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F8FAFC] text-base font-medium py-1"
            >
              Features
            </a>
            <a 
              href="#workflow" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F8FAFC] text-base font-medium py-1"
            >
              AI Workflow
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F8FAFC] text-base font-medium py-1"
            >
              Testimonials
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F8FAFC] text-base font-medium py-1"
            >
              FAQ
            </a>
          </nav>
          
          <button 
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            className="w-full btn-primary-v2 mt-4"
          >
            <span>Sign In to Ascend</span>
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </header>
  );
}
