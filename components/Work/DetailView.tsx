import React, { useEffect } from 'react';
import type { GameProject } from '../../types';
import { sounds } from '../../utils/audio';

interface DetailViewProps {
  game: GameProject;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ game, onBack }) => {
  const facts = game.meta.filter(m => !m.link);
  const links = game.meta.filter(m => !!m.link);
  const isLive = game.status === 'live';
  const isProgress = game.status === 'progress';
  const pillClass = isLive ? 'live' : isProgress ? 'progress' : 'planned';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [game]);

  return (
    <div id="detail-view-container">
      <div className="wrap">
        <button 
          type="button" 
          className="back-link" 
          id="back-btn"
          onClick={() => {
            sounds.playClick(440);
            onBack();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to work
        </button>
      </div>

      <div id="detail-content" className="in">
        {/* Detail Hero Section */}
        <section className="detail-hero">
          <div className="wrap">
            <div className="detail-banner">
              {game.banner && (
                <img 
                  src={game.banner} 
                  alt={`${game.title} banner`}
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="detail-banner-scrim" />
              <div className="detail-banner-body">
                <span className={`pill ${pillClass}`}>
                  <span className="dot" />
                  {game.statusLabel}
                </span>
                <h1 className="detail-title">{game.title}</h1>
              </div>
            </div>

            {/* External Links */}
            {links.length > 0 && (
              <div className="hero-cta" style={{ margin: '20px 0 0' }}>
                {links.map(m => (
                  <a
                    key={m.label}
                    className="btn"
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.playClick(600)}
                  >
                    <span>{m.value}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M8 7h9v9" />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            {/* Facts Strip */}
            {facts.length > 0 && (
              <div className="stats-strip" style={{ marginTop: '22px' }}>
                {facts.map(m => (
                  <div key={m.label} className="stat-cell">
                    <span className="s-label">{m.label}</span>
                    <span className="s-value">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Detail Body Section: Overview & Features */}
        {(game.overview.length > 0 || game.features.length > 0) && (
          <section className="detail-body">
            <div className="wrap">
              {game.overview.length > 0 && (
                <div className="overview reveal in">
                  {game.overview.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {game.features.map((f, idx) => (
                <div key={idx} className="feature-block reveal in">
                  <div className="feature-text">
                    <p>{f.text}</p>
                  </div>
                  <div>
                    <div className="feature-media">
                      <img 
                        src={f.image} 
                        alt={f.caption} 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="feature-caption">{f.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {game.gallery && game.gallery.length > 0 && (
          <section className="gallery-wrap">
            <div className="wrap">
              <div className="block-head reveal in">
                <p className="block-eyebrow">Content</p>
                <h2 className="block-title" style={{ fontSize: '22px' }}>
                  Screens
                </h2>
                <p className="filmstrip-hint">Scroll to browse &rarr;</p>
              </div>
            </div>
            <div className="wrap">
              <div className="filmstrip">
                {game.gallery.map((it, idx) => (
                  <div key={idx} className="film-item reveal in">
                    <img 
                      src={it.image} 
                      alt={it.caption} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="gallery-cap">{it.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* In-Progress Empty Card */}
        {game.overview.length === 0 && game.features.length === 0 && (
          <section className="detail-body">
            <div className="wrap">
              <div className="empty-card reveal in">
                <span className={`pill ${pillClass}`}>
                  <span className="dot" />
                  Case study in progress
                </span>
                <p>
                  Full details for {game.title} — overview, systems, and screenshots — will be added here once the project reaches its next milestone.
                </p>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
