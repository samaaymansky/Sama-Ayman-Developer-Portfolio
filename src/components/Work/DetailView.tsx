import React, { useEffect, useState } from 'react';
import type { GameProject } from '../../types';
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  ExternalLink, 
  Brain, 
  Flame, 
  Gamepad2, 
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface DetailViewProps {
  game: GameProject;
  onBack: () => void;
}

interface ViewerImage {
  src: string;
  alt: string;
}

export const DetailView: React.FC<DetailViewProps> = ({ game, onBack }) => {
  const isPsych = game.subgenre === 'Psychological Horror';
  const canExpandImages = game.id === 'solitude' || game.id === 'null_game';
  const [expandedImages, setExpandedImages] = useState<{
    images: ViewerImage[];
    currentIndex: number;
  } | null>(null);
  const expandedImage = expandedImages?.images[expandedImages.currentIndex] ?? null;

  const openImageViewer = (images: ViewerImage[], index: number) => {
    setExpandedImages({ images, currentIndex: index });
  };

  const navigateExpandedImage = (direction: -1 | 1) => {
    setExpandedImages((current) => {
      if (!current) return current;
      const { images, currentIndex } = current;
      return {
        images,
        currentIndex: (currentIndex + direction + images.length) % images.length
      };
    });
  };

  useEffect(() => {
    if (!expandedImages) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedImages(null);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateExpandedImage(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateExpandedImage(1);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expandedImages]);

  return (
    <article className="min-h-screen pt-24 pb-28 text-slate-200">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playClick(440);
              onBack();
            }}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to games</span>
          </button>

        </div>

        {/* Hero Banner Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-blue-500/25 bg-[#0b1220] aspect-[16/7] sm:aspect-[16/6] shadow-2xl shadow-blue-950/50">
          {game.banner ? (
            <img
              src={game.banner}
              alt={game.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0c1629] via-[#070b14] to-[#04070d] flex items-center justify-center">
              <span className="font-mono text-blue-500/40 text-2xl tracking-widest uppercase">
                {game.title}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/60 to-transparent" />

          {/* Banner bottom titles */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md border ${
                isPsych
                  ? 'bg-blue-950/80 border-blue-500/40 text-cyan-300'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}>
                {isPsych ? <Brain className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                <span>{game.subgenre}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-950/80 border border-blue-500/40 text-blue-300 backdrop-blur-md">
                {game.engine}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                {game.statusLabel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {game.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-sans max-w-2xl">
              {game.tagline}
            </p>
          </div>
        </div>

        {/* 2-Column Overview & Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Description Column */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">About the Game</h2>
              <div className="space-y-4 text-slate-300 font-sans text-base leading-relaxed">
                {game.overview.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Mechanics Highlights */}
            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-bold text-white">Core Mechanics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.mechanicsHighlights.map((mech, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0b1220] border border-blue-900/40 space-y-1.5">
                    <div className="text-cyan-300 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{mech.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {mech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Project Meta Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0c1424] border border-blue-500/20 shadow-xl space-y-4">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Project Details
              </h3>

              <div className="space-y-3 text-xs font-sans">
                {game.meta.map((m, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-blue-900/30">
                    <span className="text-slate-400">{m.label}</span>
                    {m.link ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                      >
                        <span>{m.value}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-white font-medium">{m.value}</span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* In-depth Features */}
        {game.features && game.features.length > 0 && (
          <section className="pt-6 space-y-6 max-w-4xl mx-auto w-full">
            <h3 className="text-lg font-bold text-white text-center">Design &amp; Mechanics Breakdown</h3>
            <div className="space-y-6">
              {game.features.map((feat, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-blue-900/40 bg-[#090e1a]">
                  {feat.image && (
                    <div className="aspect-[16/9] w-full bg-[#05080f] overflow-hidden">
                      {canExpandImages ? (
                        <button
                          type="button"
                          className="h-full w-full cursor-zoom-in"
                          aria-label={`Expand ${feat.title} image`}
                          onClick={() => openImageViewer(
                            game.features.map(({ image, title }) => ({ src: image, alt: title })),
                            idx
                          )}
                        >
                          <img
                            src={feat.image}
                            alt={feat.title}
                            className={feat.imageFit === 'contain'
                              ? 'w-full h-full object-contain'
                              : 'w-full h-full object-cover'}
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ) : (
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className={feat.imageFit === 'contain'
                            ? 'w-full h-full object-contain'
                            : 'w-full h-full object-cover'}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{feat.title}</span>
                    </h4>
                    <p className="text-sm text-slate-300 font-sans leading-relaxed">
                      {feat.text}
                    </p>
                    {feat.caption && (
                      <p className="text-xs text-slate-500 font-mono italic pt-1">
                        {feat.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Screenshot Gallery Filmstrip */}
        {game.gallery && game.gallery.length > 0 && (
          <div className="pt-8 space-y-4 border-t border-blue-900/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Gallery</h3>
              <span className="text-xs font-mono text-slate-500">
                {game.gallery.length} Screenshots
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.gallery.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group rounded-xl overflow-hidden border border-blue-900/40 bg-[#090e1a] hover:border-cyan-400/50 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#060911]">
                    {canExpandImages ? (
                      <button
                        type="button"
                        className="h-full w-full cursor-zoom-in"
                        aria-label={`Expand image: ${item.caption}`}
                        onClick={() => openImageViewer(
                          game.gallery.map(({ image, caption }) => ({ src: image, alt: caption })),
                          idx
                        )}
                      >
                        <img
                          src={item.image}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  {item.caption && (
                    <div className="p-3 text-xs font-mono text-slate-400 truncate">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedImage && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Image viewer: ${expandedImage.alt}`}
            onClick={() => setExpandedImages(null)}
          >
            <div
              className="relative flex h-full w-full items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                autoFocus
                className="absolute right-0 top-0 z-10 rounded-lg border border-white/20 bg-black/75 px-3 py-1.5 text-sm text-white hover:bg-black"
                onClick={() => setExpandedImages(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="group absolute left-0 z-10 rounded-full border border-white/20 bg-black/75 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-200 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] active:scale-95 motion-reduce:transition-none sm:left-4"
                aria-label="Previous image"
                onClick={() => navigateExpandedImage(-1)}
              >
                <ChevronLeft className="h-6 w-6 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
              </button>
              <img
                src={expandedImage.src}
                alt={expandedImage.alt}
                className="max-h-[85vh] max-w-[95vw] object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                className="group absolute right-0 z-10 rounded-full border border-white/20 bg-black/75 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-200 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] active:scale-95 motion-reduce:transition-none sm:right-4"
                aria-label="Next image"
                onClick={() => navigateExpandedImage(1)}
              >
                <ChevronRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>
              <div className="absolute bottom-0 rounded bg-black/75 px-3 py-1 text-center text-xs text-white">
                {expandedImage.alt} · {expandedImages?.currentIndex !== undefined ? expandedImages.currentIndex + 1 : 1}
                {' / '}{expandedImages?.images.length}
              </div>
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
