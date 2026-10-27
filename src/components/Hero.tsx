import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';
import { SectionGlowDivider } from './Common/SectionGlowDivider';

interface HeroProps {
  onViewWork: () => void;
  onExploreCapabilities: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onViewWork, 
  onExploreCapabilities
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient blue gradients */}
      <div 
        className="absolute top-[-160px] right-[-100px] w-[580px] h-[580px] rounded-full pointer-events-none opacity-35 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-25 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        <div className="max-w-3xl">
          
          {/* Main Editorial Text Column */}
          <div className="space-y-6">
            
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Founder, LIMITS Studios</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                Sama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">Ayman</span>
              </h1>
              <p className="text-base sm:text-lg text-blue-300/90 font-mono mt-2 font-medium">
                Technical Game Designer · Horror Game Studio
              </p>
            </div>

            {/* Direct, human narrative */}
            <div className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-sans space-y-3">
              <p>
                <strong className="text-white">LIMITS Studios</strong> is an independent game development studio focused on horror games with an emphasis on atmosphere, storytelling, and gameplay. From psychological horror projects like <em>SOLITUDE</em> and <em>NULL</em> to future experimental concepts, the studio explores different ways to build tension and create memorable player experiences.
              </p>
              <p className="text-sm sm:text-base text-slate-400">
                I work across Roblox and Unity, creating atmospheric experiences and developing new horror concepts.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick(600);
                  onViewWork();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40"
              >
                <span>View Games</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick(520);
                  onExploreCapabilities();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/40 rounded-xl transition-all"
              >
                <span>Design Skills</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
