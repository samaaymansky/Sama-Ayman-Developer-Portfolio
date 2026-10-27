import React from 'react';
import { hallwayImg } from '../data/projects';
import { sounds } from '../utils/audio';

interface HeroProps {
  onViewWork: () => void;
  onExploreCapabilities: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onViewWork, 
  onExploreCapabilities 
}) => {
  return (
    <section className="hero" id="hero">
      <div className="hero-grid">
        <div className="hero-text">
          <span className="corner-tag">Founder &amp; lead designer, Limits Studios</span>
          <h1 className="mega grad-text">Sky</h1>
          <p className="hero-role-line">Technical Game Designer</p>
          <p className="hero-desc">
            I build both sides of a game: the technical systems that make it run — task logic, sequencing, UI state — and the creative direction that gives it atmosphere. My focus is horror games — atmosphere, systems, and the design work underneath them.
          </p>
          <div className="hero-cta">
            <button 
              type="button" 
              className="text-link" 
              onClick={() => {
                sounds.playClick(600);
                onViewWork();
              }}
            >
              <span>View selected work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button 
              type="button" 
              className="text-link" 
              style={{ borderColor: 'transparent', color: 'var(--text-3)' }}
              onClick={() => {
                sounds.playClick(500);
                onExploreCapabilities();
              }}
            >
              See capabilities
            </button>
          </div>
          <div className="hero-meta">
            <span><strong>Currently building —</strong> SOLITUDE + 2 unannounced titles</span>
            <span><strong>Studio focus —</strong> Horror games</span>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={hallwayImg} 
            alt="Scene from SOLITUDE" 
            referrerPolicy="no-referrer"
          />
          <div className="hero-image-tint-side" />
          <div className="hero-image-tint" />
        </div>
      </div>
    </section>
  );
};
