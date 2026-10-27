import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/About/AboutSection';
import { SelectedWorkSection } from './components/Work/SelectedWorkSection';
import { DetailView } from './components/Work/DetailView';
import { CapabilitiesSection } from './components/Capabilities/CapabilitiesSection';
import { ContactSection } from './components/Contact/ContactSection';
import { Footer } from './components/Footer';
import { GAMES } from './data/projects';
import { grainTextureStyle } from './data/images';

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Hash-based routing to preserve direct links like #/game/solitude
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/^#\/game\/([a-zA-Z0-9_]+)/);
      if (match && GAMES[match[1]]) {
        setSelectedGameId(match[1]);
        window.scrollTo(0, 0);
      } else {
        setSelectedGameId(null);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const spotlight = event.target.closest<HTMLElement>('.spotlight');
      if (!spotlight) return;

      const bounds = spotlight.getBoundingClientRect();
      spotlight.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      spotlight.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => document.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const openGameDetail = (gameId: string) => {
    window.location.hash = `#/game/${gameId}`;
  };

  const closeGameDetail = () => {
    window.location.hash = '#/';
    setTimeout(() => {
      const workEl = document.getElementById('work-section');
      workEl?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToSection = (id: string) => {
    if (selectedGameId) {
      window.location.hash = '#/';
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeGame = selectedGameId ? GAMES[selectedGameId] || null : null;

  return (
    <div className="min-h-screen text-[#f1f5f9] font-sans selection:bg-blue-600/30 selection:text-cyan-200">
      
      {/* Subtle atmospheric overlay */}
      <div className="grain-overlay" style={grainTextureStyle} />

      {/* Topbar */}
      <Navbar
        currentView={activeGame ? 'game-detail' : 'home'}
        onNavigateHome={closeGameDetail}
        onOpenContact={() => scrollToSection('contact-section')}
      />

      {/* Main View Router */}
      <main id="main-content">
        {activeGame ? (
          <DetailView
            game={activeGame}
            onBack={closeGameDetail}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onViewWork={() => scrollToSection('work-section')}
              onExploreCapabilities={() => scrollToSection('craft-section')}
            />

            {/* About Section (Founder of LIMITS Studios, no portrait image) */}
            <AboutSection
              onOpenContact={() => scrollToSection('contact-section')}
            />

            {/* Selected Work */}
            <SelectedWorkSection onSelectGame={openGameDetail} />

            {/* Capabilities Section */}
            <CapabilitiesSection />

            {/* Contact Section */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
