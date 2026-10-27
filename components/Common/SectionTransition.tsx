import React from 'react';

interface SectionTransitionProps {
  variant?: 'fade' | 'frequency' | 'abyss';
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({ variant = 'frequency' }) => {
  return (
    <div className="relative w-full py-10 md:py-14 overflow-hidden pointer-events-none select-none">
      {/* Deep atmospheric gradient blending top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06080d] to-transparent" />

      {variant === 'frequency' && (
        <div className="relative max-w-4xl mx-auto px-6 flex items-center justify-center">
          {/* Left fading filament */}
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-700/60 to-cyan-500/40" />

          {/* Center diegetic frequency reticle / pulse */}
          <div className="mx-4 flex items-center gap-1.5 opacity-60">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
            <span className="w-1 h-2 rounded-full bg-slate-500/80" />
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400/90 rotate-45" />
            <span className="w-1 h-3 rounded-full bg-slate-400" />
            <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="w-1 h-3 rounded-full bg-slate-400" />
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400/90 rotate-45" />
            <span className="w-1 h-2 rounded-full bg-slate-500/80" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          {/* Right fading filament */}
          <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/40 via-slate-700/60 to-transparent" />
        </div>
      )}

      {variant === 'abyss' && (
        <div className="relative max-w-xl mx-auto px-6 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
        </div>
      )}

      {variant === 'fade' && (
        <div className="h-12 w-full bg-gradient-to-b from-transparent via-[#06080d]/80 to-transparent" />
      )}
    </div>
  );
};
