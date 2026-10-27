import React from 'react';
import { SectionGlowDivider } from './Common/SectionGlowDivider';

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 bg-[#04070d] border-t border-blue-900/30 text-slate-400 font-sans text-xs">
      <div className="max-w-6xl mx-auto px-6">
        <SectionGlowDivider />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Studio branding */}
        <div className="text-center sm:text-left">
          <span className="font-semibold text-slate-200">LIMITS Studios</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Horror Game Development &amp; Design</span>
        </div>

        {/* Right: Copyright */}
        <div className="font-mono text-slate-500 text-center sm:text-right">
          Sama Ayman · {new Date().getFullYear()}
        </div>

        </div>
      </div>
    </footer>
  );
};
