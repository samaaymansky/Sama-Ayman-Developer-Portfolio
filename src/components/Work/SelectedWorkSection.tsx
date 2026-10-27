import React, { useState } from 'react';
import type { GameProject } from '../../types';
import { GAMES } from '../../data/projects';
import { sounds } from '../../utils/audio';
import { SectionGlowDivider } from '../Common/SectionGlowDivider';

interface SelectedWorkSectionProps {
  onSelectGame: (gameId: string) => void;
}

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({ onSelectGame }) => {
  const games = Object.values(GAMES);
  const releasedGames = games.filter((game) => game.status === 'live');
  const upcomingGames = games.filter((game) => game.status !== 'live');
  const [displayMode, setDisplayMode] = useState<'showcase' | 'dossier' | 'grid'>('showcase');

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const rx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const ry = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    card.style.setProperty('--rx', rx.toFixed(3));
    card.style.setProperty('--ry', ry.toFixed(3));
  };

  const resetPointerPosition = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--rx', '0');
    event.currentTarget.style.setProperty('--ry', '0');
  };

  const selectGame = (gameId: string) => {
    const game = GAMES[gameId];
    if (!game || game.status === 'planned') return;

    sounds.playClick(600);
    onSelectGame(gameId);
  };

  const renderShowcaseCard = (game: GameProject) => (
    <button
      key={game.id}
      type="button"
      className="featured-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerPosition}
      onClick={() => selectGame(game.id)}
    >
      <div className="featured-media spotlight">
        {game.thumb && (
          <img
            src={game.thumb}
            alt={`${game.title} official banner`}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="featured-scrim" />
      </div>
      <div className="featured-title-wrap">
        <h3>{game.title}</h3>
      </div>
      <div className="featured-meta">
        <div className="featured-meta-top">
          <span className={`pill ${game.status}`}>
            <span className="dot" />
            {game.statusLabel}
          </span>
          <span className="work-tag">{game.engine}</span>
        </div>
        <p className="work-desc">{game.desc}</p>
        <span className="work-link">View case study &rarr;</span>
      </div>
    </button>
  );

  const renderProjectCard = (game: GameProject, mode: 'dossier' | 'grid') => (
    <button
      key={game.id}
      type="button"
      className={`project-mode-card spotlight raise ${mode}`}
      disabled={game.status === 'planned'}
      onClick={() => selectGame(game.id)}
    >
      <span className="project-mode-image">
        {game.thumb && (
          <img
            src={game.thumb}
            alt={`${game.title} cover`}
            referrerPolicy="no-referrer"
          />
        )}
        <span className="project-mode-image-scrim" />
        <span className={`pill ${game.status}`}>
          <span className="dot" />
          {game.statusLabel}
        </span>
      </span>
      <span className="project-mode-content">
        <span className="project-mode-eyebrow">{game.subgenre} · {game.engine}</span>
        <span className="project-mode-title">{game.title}</span>
        <span className="project-mode-description">{game.desc}</span>
        {mode === 'dossier' && game.mechanicsHighlights.length > 0 && (
          <span className="project-mode-mechanics">
            {game.mechanicsHighlights.slice(0, 3).map(({ title }) => (
              <span key={title}>{title}</span>
            ))}
          </span>
        )}
        <span className="project-mode-link">
          {game.status === 'planned' ? 'Details coming soon' : <>View case study <span aria-hidden="true">→</span></>}
        </span>
      </span>
    </button>
  );

  return (
    <section className="selected-work-section" id="work-section">
      <div className="work-ambient work-ambient-cyan absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px] bg-[radial-gradient(circle,rgba(56,189,248,0.4)_0%,transparent_70%)]" />
      <div className="work-ambient work-ambient-blue absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] bg-[radial-gradient(circle,rgba(59,130,246,0.35)_0%,transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        <div className="selected-work-heading">
          <div className="block-head">
            <p className="block-eyebrow">SELECTED WORK</p>
            <h2 className="block-title">Projects</h2>
            <p className="block-sub">Games I&apos;ve designed and built at LIMITS Studios.</p>
          </div>
          <div className="work-view-switcher" role="group" aria-label="Project display mode">
            {([
              ['showcase', 'Cinematic'],
              ['dossier', 'Detailed'],
              ['grid', 'Grid']
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                aria-pressed={displayMode === mode}
                className={displayMode === mode ? 'active' : ''}
                onClick={() => {
                  sounds.playClick(700);
                  setDisplayMode(mode);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

          {displayMode === 'showcase' && (
            <div className="work-bento">
              {releasedGames.map(renderShowcaseCard)}

              <div className="index-list">
                {upcomingGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className="index-row spotlight raise"
                    disabled={game.status === 'planned'}
                    onClick={() => selectGame(game.id)}
                  >
                    <span className="index-num">{String(games.indexOf(game) + 1).padStart(2, '0')}</span>
                    <span className="index-title">{game.title}</span>
                    <span className="index-desc">{game.desc}</span>
                    <span className={`pill ${game.status}`}>
                      <span className="dot" />
                      {game.statusLabel}
                    </span>
                    <span className="index-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {displayMode === 'dossier' && (
            <div className="project-mode-list">
              {games.map((game) => renderProjectCard(game, 'dossier'))}
            </div>
          )}
          {displayMode === 'grid' && (
            <div className="project-mode-grid">
              {games.map((game) => renderProjectCard(game, 'grid'))}
            </div>
          )}
        </div>
    </section>
  );
};
