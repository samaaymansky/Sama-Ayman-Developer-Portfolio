import React, { useState } from 'react';
import { Mail, Check, Copy, MessageSquare, Youtube, Twitter } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { SectionGlowDivider } from '../Common/SectionGlowDivider';

interface ContactSectionProps {
  onOpenDrawer?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    sounds.playClick(600);
    navigator.clipboard?.writeText('skyhelyn@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact-section" className="py-24 relative overflow-hidden">
      {/* Cyan glow */}
      <div 
        className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        
        {/* Section Heading */}
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs text-blue-400 tracking-wider uppercase mb-2">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Let's talk</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Open to collaborations, freelance work, and studio inquiries for Limits Studios.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0c1424] border border-blue-500/20 space-y-4 text-center">
            <span className="font-mono text-xs text-blue-300 uppercase block">Direct Email</span>
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 font-mono text-sm mx-auto w-full max-w-lg">
              <span className="text-white">skyhelyn@gmail.com</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href="mailto:skyhelyn@gmail.com"
                onClick={() => sounds.playClick(600)}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md shadow-blue-600/25 border border-blue-400/40"
              >
                <Mail className="w-4 h-4 text-blue-200" />
                <span>Email me directly</span>
              </a>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playClick(500)}
              className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2 min-w-[110px]"
            >
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span>Discord</span>
            </a>

            <a
              href="https://www.youtube.com/@LIMITSStudios"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playClick(500)}
              className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2 min-w-[110px]"
            >
              <Youtube className="w-5 h-5 text-blue-400" />
              <span>YouTube</span>
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playClick(500)}
              className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2 min-w-[110px]"
            >
              <Twitter className="w-5 h-5 text-blue-400" />
              <span>X / Twitter</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
