import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { sounds } from '../utils/audio';
import { limitsStudiosLogo } from '../data/images';

interface NavbarProps {
  onOpenContact: () => void;
  onNavigateHome: () => void;
  currentView: 'home' | 'game-detail';
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onNavigateHome, currentView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId?: string) => {
    sounds.playClick(560);
    if (currentView !== 'home') {
      onNavigateHome();
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#070a12]/92 backdrop-blur-md border-blue-500/20 shadow-lg shadow-black/40'
          : 'bg-[#070a12]/75 backdrop-blur-sm border-blue-500/10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand identity: LIMITS Studios & Sama Ayman */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick(600);
            onNavigateHome();
          }}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          {/* Logo container */}
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-blue-500/30 bg-[#090e1a] p-1 group-hover:border-blue-400 transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center">
            <img 
              src={limitsStudiosLogo}
              alt="LIMITS Studios logo" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white font-sans group-hover:text-blue-300 transition-colors flex items-center gap-2">
              <span>LIMITS Studios</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                Horror
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Sama Ayman · Game Designer
            </div>
          </div>
        </button>

        {/* Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => handleNavClick('work-section')}
            className="hover:text-blue-400 transition-colors cursor-pointer text-left"
          >
            Games
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about-section')}
            className="hover:text-blue-400 transition-colors cursor-pointer text-left"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('craft-section')}
            className="hover:text-blue-400 transition-colors cursor-pointer text-left"
          >
            Skills
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('contact-section')}
            className="hover:text-blue-400 transition-colors cursor-pointer text-left"
          >
            Contact
          </button>
        </nav>

        {/* Contact action */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              sounds.playClick(650);
              onOpenContact();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-600/25 border border-blue-400/40"
          >
            <Mail className="w-3.5 h-3.5 text-blue-200" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
