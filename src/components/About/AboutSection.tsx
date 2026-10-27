import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { SectionGlowDivider } from '../Common/SectionGlowDivider';

interface AboutSectionProps {
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact }) => {
  return (
    <section id="about-section" className="py-20 relative overflow-hidden">
      {/* Subtle blue accent glow */}
      <div 
        className="absolute top-[-140px] right-[-140px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        
        {/* Section Heading */}
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs text-blue-400 tracking-wider uppercase mb-2">About &amp; Studio Direction</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Who I am</h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Natural, human developer statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans space-y-4">
              <p>
                I am the founder of <strong className="text-white">LIMITS Studios</strong>.
                My passion is building horror games that give players genuine chills, whether that's the quiet unease of being alone in a dark house or the panic of a ticking timer in a locked bunker.
              </p>
              <p>
                I started on Roblox, where I created <strong className="text-white">SOLITUDE</strong> and <strong className="text-white">NULL</strong>. Both are psychological horror games focusing on atmosphere, subtle changes in familiar environments, and sound design rather than jump scares.
              </p>
              <p>
                My next project, <strong className="text-cyan-300">7 MINUTES</strong>, explores the 7-minute brain theory through different points of view in the same place.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick(600);
                  onOpenContact();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 text-sm font-medium transition-all"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Studio Card WITHOUT portrait picture */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Clean Info Card */}
            <div className="p-6 rounded-2xl bg-[#0d1424] border border-blue-500/20 shadow-xl shadow-blue-950/40 space-y-5">
              
              {/* Header: Name and Studio (NO portrait image) */}
              <div className="pb-4 border-b border-blue-900/40">
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-[11px] font-mono text-cyan-300 mb-2">
                  LIMITS Studios
                </div>
                <h3 className="text-2xl font-bold text-white font-sans tracking-tight">Sama Ayman</h3>
                <p className="text-xs text-blue-300 font-mono mt-0.5">Founder &amp; Technical Game Designer</p>
              </div>

              {/* Rows */}
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-2 border-b border-blue-900/30">
                  <span className="text-slate-400">Studio</span>
                  <span className="text-white font-semibold">LIMITS Studios</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-900/30">
                  <span className="text-slate-400">Specialty</span>
                  <span className="text-cyan-300 font-semibold">Horror Game Design &amp; Systems</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-900/30">
                  <span className="text-slate-400">Roblox Games</span>
                  <span className="text-white font-semibold">SOLITUDE, NULL</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-900/30">
                  <span className="text-slate-400">Unity Game</span>
                  <span className="text-rose-300 font-semibold">7 MINUTES</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-900/30">
                  <span className="text-slate-400">Engines &amp; Tools</span>
                  <span className="text-slate-200">Roblox Studio (Luau), Unity (C#)</span>
                </div>
              </div>

              {/* Contact mini list */}
              <div className="pt-2 space-y-2">
                <a
                  href="mailto:skyhelyn@gmail.com"
                  onClick={() => sounds.playClick(600)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-xs font-mono text-blue-200 transition-colors border border-blue-800/30"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>skyhelyn@gmail.com</span>
                </a>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.playClick(500)}
                    className="py-2 px-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-slate-300 hover:text-white transition-colors border border-blue-800/30"
                  >
                    Discord
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.playClick(500)}
                    className="py-2 px-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-slate-300 hover:text-white transition-colors border border-blue-800/30"
                  >
                    YouTube
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.playClick(500)}
                    className="py-2 px-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-slate-300 hover:text-white transition-colors border border-blue-800/30"
                  >
                    X (Twitter)
                  </a>
                  <a
                    href="https://limitsstudios.itch.io/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.playClick(500)}
                    className="py-2 px-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-slate-300 hover:text-white transition-colors border border-blue-800/30"
                  >
                    itch.io
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
