import React from 'react';
import { SKILLS } from '../../data/projects';

export const CapabilitiesSection: React.FC = () => {
  const tiers = ['t-lg', 't-md', 't-sm', 't-lg', 't-md', 't-lg', 't-sm'];

  return (
    <section className="block" id="craft-section">
      <div className="wrap">
        <div className="scroll-glow in" />
        <div className="block-head reveal in">
          <p className="block-eyebrow">03 — Capabilities</p>
          <h2 className="block-title">What I bring to a project</h2>
        </div>
        <div className="cap-cloud" id="cap-grid">
          {SKILLS.map((s, i) => (
            <span 
              key={s.name} 
              className={`cap-item reveal in ${tiers[i % tiers.length]}`}
            >
              <span className="idx">{String(i + 1).padStart(2, '0')}</span> {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
