import React, { useRef } from 'react';
import { GAMES, WORK_ORDER, hallwayImg } from '../../data/projects';
import { sounds } from '../../utils/audio';

interface WorkSectionProps {
  onSelectGame: (gameId: string) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onSelectGame }) => {
  const featuredKey = WORK_ORDER[0]; // solitude
  const restKeys = WORK_ORDER.slice(1); // null, 7minutes
  const fg = GAMES[featuredKey];
  const cardRef = useRef<HTMLButtonElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const rx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ry = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cardRef.current.style.setProperty('--rx', rx.toFixed(3));
    cardRef.current.style.setProperty('--ry', ry.toFixed(3));
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0');
    cardRef.current.style.setProperty('--ry', '0');
  };

  return (
    <section className="block" id="work-section">
      <div className="wrap">
        <div className="scroll-glow in" />
        <div className="block-head reveal in">
          <p className="block-eyebrow">02 — Selected work</p>
          <h2 className="block-title">Projects</h2>
          <p className="block-sub">Games I&apos;ve designed and built at Limits Studios.</p>
        </div>

        <div className="work-bento" id="work-grid">
          {/* Featured Card: SOLITUDE */}
          {fg && (
            <button
              ref={cardRef}
              type="button"
              className="featured-card reveal in"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onClick={() => {
                sounds.playClick(600);
                onSelectGame(featuredKey);
              }}
            >
              <div className="featured-media spotlight">
                <img 
                  src={fg.thumb || hallwayImg} 
                  alt={`${fg.title} cover`} 
                  referrerPolicy="no-referrer"
                />
                <div className="featured-scrim" />
              </div>
              <div className="featured-title-wrap">
                <h3>{fg.title}</h3>
              </div>
              <div className="featured-meta">
                <div className="featured-meta-top">
                  <span className="pill live">
                    <span className="dot" />
                    {fg.statusLabel}
                  </span>
                  <span className="work-tag">Roblox</span>
                </div>
                <p className="work-desc">{fg.desc}</p>
                <span className="work-link">View case study &rarr;</span>
              </div>
            </button>
          )}

          {/* Index List: NULL & 7 minutes */}
          <div className="index-list reveal in">
            {restKeys.map((key, i) => {
              const g = GAMES[key];
              if (!g) return null;
              const isProgress = g.status === 'progress';
              return (
                <button
                  key={key}
                  type="button"
                  className="index-row spotlight raise"
                  onClick={() => {
                    sounds.playClick(600);
                    onSelectGame(key);
                  }}
                >
                  <span className="index-num">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <span className="index-title">{g.title}</span>
                  <span className="index-desc">{g.desc}</span>
                  <span className={`pill ${isProgress ? 'progress' : 'planned'}`}>
                    <span className="dot" />
                    {g.statusLabel}
                  </span>
                  <span className="index-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
