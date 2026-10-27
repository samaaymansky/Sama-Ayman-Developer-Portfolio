import React, { useState } from 'react';
import { GAMES } from '../../data/projects';
import type { GameProject } from '../../types';
import { 
  ArrowRight, 
  ExternalLink, 
  Gamepad2, 
  Layers, 
  Flame, 
  Brain, 
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  Film
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface WorkSectionProps {
  onSelectGame: (gameId: string) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onSelectGame }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Psychological Horror' | 'Action Horror' | 'Roblox' | 'Unity'>('all');
  const [displayMode, setDisplayMode] = useState<'showcase' | 'dossier' | 'grid'>('showcase');

  const gamesList = Object.values(GAMES);

  const filteredGames = gamesList.filter((game) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Psychological Horror' || activeFilter === 'Action Horror') {
      return game.subgenre === activeFilter;
    }
    if (activeFilter === 'Roblox') {
      return game.engine.toLowerCase().includes('roblox') || game.engine.toLowerCase().includes('luau');
    }
    if (activeFilter === 'Unity') {
      return game.engine.toLowerCase().includes('unity');
    }
    return true;
  });

  const handleFilterClick = (filter: typeof activeFilter) => {
    sounds.playClick(600);
    setActiveFilter(filter);
  };

  const handleDisplayMode = (mode: 'showcase' | 'dossier' | 'grid') => {
    sounds.playClick(700);
    setDisplayMode(mode);
  };

  return (
    <section id="work-section" className="py-20 bg-[#070a12] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div 
        className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>LIMITS Studios</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Horror Game Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selected Games
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Our games explore different sides of horror: psychological suspense and domestic unease on Roblox (<strong className="text-white">SOLITUDE</strong> &amp; <strong className="text-white">NULL</strong>), and fast-paced action survival in Unity (<strong className="text-white">7 MINUTES</strong>).
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#0b1220] border border-blue-500/20 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => handleDisplayMode('showcase')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  displayMode === 'showcase'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Cinematic Cards"
              >
                Cinematic
              </button>
              <button
                type="button"
                onClick={() => handleDisplayMode('dossier')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  displayMode === 'dossier'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Systems Dossier"
              >
                Detailed
              </button>
              <button
                type="button"
                onClick={() => handleDisplayMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  displayMode === 'grid'
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid"
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-8 overflow-x-auto text-xs font-mono scrollbar-none">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-blue-950/40 text-slate-400 border border-blue-900/40 hover:text-white'
            }`}
          >
            All Subgenres ({gamesList.length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('Psychological Horror')}
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'Psychological Horror'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-blue-950/40 text-slate-400 border border-blue-900/40 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span>Psychological Horror</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('Action Horror')}
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'Action Horror'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-blue-950/40 text-slate-400 border border-blue-900/40 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Action Horror</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('Roblox')}
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeFilter === 'Roblox'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-blue-950/40 text-slate-400 border border-blue-900/40 hover:text-white'
            }`}
          >
            Roblox (Luau)
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('Unity')}
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeFilter === 'Unity'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-blue-950/40 text-slate-400 border border-blue-900/40 hover:text-white'
            }`}
          >
            Unity (C#)
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODE 1: CINEMATIC SHOWCASE VIEW                              */}
        {/* ============================================================ */}
        {displayMode === 'showcase' && (
          <div className="space-y-8">
            {filteredGames.map((game, index) => {
              const isLead = index === 0;
              const isPsych = game.subgenre === 'Psychological Horror';
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    sounds.playClick(700);
                    onSelectGame(game.id);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border border-blue-500/25 bg-[#0b1220] cursor-pointer shadow-2xl shadow-blue-950/40 hover:border-blue-400/70 transition-all duration-300 ${
                    isLead
                      ? 'aspect-[16/9] sm:aspect-[16/7]'
                      : 'aspect-[16/10] sm:aspect-[16/6]'
                  }`}
                >
                  {/* Backdrop artwork */}
                  {game.thumb && (
                    <img
                      src={game.thumb}
                      alt={`${game.title} screenshot`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Dynamic Dark Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/60 to-transparent" />

                  {/* Top Badges Bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md border ${
                        isPsych
                          ? 'bg-blue-950/80 border-blue-500/40 text-cyan-300'
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      }`}>
                        {isPsych ? <Brain className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                        <span>{game.subgenre}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#070d18]/80 backdrop-blur-md border border-blue-900/60 text-slate-300">
                        {game.engine}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono backdrop-blur-md border ${
                      game.status === 'live'
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                        : game.status === 'progress'
                        ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                        : 'bg-slate-900/80 border-slate-700/60 text-slate-400'
                    }`}>
                      {game.statusLabel}
                    </span>
                  </div>

                  {/* Bottom Content Body */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{game.title}</span>
                      <span className="text-xs font-mono font-normal text-slate-400 group-hover:text-cyan-300 flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </h3>

                    <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl line-clamp-2">
                      {game.desc}
                    </p>

                    {/* Mechanics Highlights Quick Strip */}
                    <div className="pt-2 border-t border-blue-950/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      {game.mechanicsHighlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-cyan-400 font-bold">▸</span>
                          <span className="text-slate-300 font-medium">{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: DETAILED DOSSIER VIEW                                */}
        {/* ============================================================ */}
        {displayMode === 'dossier' && (
          <div className="space-y-6">
            {filteredGames.map((game) => {
              const isPsych = game.subgenre === 'Psychological Horror';
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    sounds.playClick(700);
                    onSelectGame(game.id);
                  }}
                  className="p-6 sm:p-8 rounded-2xl border border-blue-500/25 bg-[#0b1220] hover:border-blue-400/60 cursor-pointer transition-all duration-300 shadow-xl group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Left Column: Image preview */}
                  <div className="lg:col-span-5 relative rounded-xl overflow-hidden aspect-[16/10] bg-[#070b14] border border-blue-900/40">
                    {game.thumb && (
                      <img
                        src={game.thumb}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300">
                        {game.engine}
                      </span>
                      <span className="text-cyan-300 font-semibold">{game.statusLabel}</span>
                    </div>
                  </div>

                  {/* Right Column: Game Info */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                        isPsych
                          ? 'bg-blue-950/80 border-blue-500/40 text-cyan-300'
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      }`}>
                        {game.subgenre}
                      </span>
                      <span className="text-xs font-mono text-slate-500">·</span>
                      <span className="text-xs font-mono text-slate-400">{game.tagline}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>

                    <p className="text-sm text-slate-300 font-sans leading-relaxed">
                      {game.desc}
                    </p>

                    {/* Mechanics Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {game.mechanicsHighlights.map((mech, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 space-y-1">
                          <span className="font-mono text-xs font-bold text-cyan-300 block">
                            {mech.title}
                          </span>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                            {mech.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-400 group-hover:text-cyan-300 flex items-center gap-1">
                        <span>Open Complete Case Study &amp; Gallery</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 3: COMPACT GRID VIEW                                    */}
        {/* ============================================================ */}
        {displayMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  sounds.playClick(700);
                  onSelectGame(game.id);
                }}
                className="rounded-2xl border border-blue-500/25 bg-[#0b1220] hover:border-blue-400/60 cursor-pointer overflow-hidden transition-all duration-300 shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#070a12] overflow-hidden">
                    {game.thumb && (
                      <img
                        src={game.thumb}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/80 border border-blue-500/40 text-blue-300">
                        {game.engine}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase block">
                      {game.subgenre}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-blue-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{game.statusLabel}</span>
                  <span className="text-blue-400 group-hover:text-cyan-300 flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
