import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/About/AboutSection';
import { WorkSection } from './components/Work/WorkSection';
import { CapabilitiesSection } from './components/Capabilities/CapabilitiesSection';
import { ContactSection } from './components/Contact/ContactSection';
import { DetailView } from './components/Work/DetailView';
import { Footer } from './components/Footer';
import { GAMES } from './data/projects';
import type { GameProject } from './types';

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Router based on window.location.hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '#/';
      const match = hash.match(/^#\/game\/([a-zA-Z0-9_-]+)/);
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

  // Spotlight mouse effect and card tilt effect
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest ? (target.closest('.spotlight') as HTMLElement | null) : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
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
      if (workEl) {
        window.scrollTo({
          top: workEl.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const scrollToSection = (id: string) => {
    if (selectedGameId) {
      window.location.hash = '#/';
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          window.scrollTo({
            top: el.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }, 50);
    } else {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }
  };

  const activeGame: GameProject | null = selectedGameId ? GAMES[selectedGameId] || null : null;

  return (
    <>
      {/* Background noise grain overlay */}
      <div className="grain" />

      {/* Sticky topbar */}
      <Navbar
        currentView={activeGame ? 'game-detail' : 'home'}
        onNavigateHome={closeGameDetail}
        onNavigateSection={scrollToSection}
      />

      {/* Main View Router */}
      {activeGame ? (
        <main id="detail" className="active">
          <DetailView
            game={activeGame}
            onBack={closeGameDetail}
          />
        </main>
      ) : (
        <main id="home">
          {/* Hero */}
          <Hero
            onViewWork={() => scrollToSection('work-section')}
            onExploreCapabilities={() => scrollToSection('craft-section')}
          />

          {/* Section 01: About */}
          <AboutSection />

          {/* Section 02: Selected Work */}
          <WorkSection
            onSelectGame={openGameDetail}
          />

          {/* Section 03: Capabilities */}
          <CapabilitiesSection />

          {/* Section 04: Contact */}
          <ContactSection />

          {/* Footer */}
          <Footer />
        </main>
      )}
    </>
  );
}
