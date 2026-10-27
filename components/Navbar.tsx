import React, { useState, useEffect } from 'react';
import { logoImg } from '../data/projects';
import { sounds } from '../utils/audio';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentView: 'home' | 'game-detail';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigateHome, 
  onNavigateSection,
  currentView 
}) => {
  const [activeSection, setActiveSection] = useState<string>('about-section');

  useEffect(() => {
    const handleScroll = () => {
      if (currentView !== 'home') return;
      const ids = ['about-section', 'work-section', 'craft-section', 'contact-section'];
      const thresholdY = 100;
      let current = '';
      for (const id of ids) {
        const sec = document.getElementById(id);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= thresholdY) {
            current = id;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    sounds.playClick(600);
    onNavigateSection(sectionId);
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a 
          href="#/" 
          className="brandmark" 
          id="brand-link"
          onClick={(e) => {
            e.preventDefault();
            sounds.playClick(600);
            onNavigateHome();
          }}
        >
          <img 
            className="brand-logo" 
            src={logoImg} 
            alt="Limits Studios logo" 
          />
          <span className="brand-text">
            Sky<small>Limits Studios</small>
          </span>
        </a>
        <nav className="top-nav" id="top-nav">
          <a
            href="#about-section"
            className={activeSection === 'about-section' ? 'active' : ''}
            onClick={(e) => handleLinkClick(e, 'about-section')}
          >
            <span className="lbl-full">About</span>
          </a>
          <a
            href="#work-section"
            className={activeSection === 'work-section' ? 'active' : ''}
            onClick={(e) => handleLinkClick(e, 'work-section')}
          >
            <span className="lbl-full">Work</span>
          </a>
          <a
            href="#craft-section"
            className={activeSection === 'craft-section' ? 'active' : ''}
            onClick={(e) => handleLinkClick(e, 'craft-section')}
          >
            <span className="lbl-full">Capabilities</span>
          </a>
          <a
            href="#contact-section"
            className="text-link nav-cta"
            onClick={(e) => handleLinkClick(e, 'contact-section')}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};
