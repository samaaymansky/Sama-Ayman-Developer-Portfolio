import React from 'react';
import { SKILLS } from '../../data/projects';
import { 
  Gamepad2, 
  Brain, 
  FileCode2, 
  Layers, 
  Lightbulb, 
  Volume2, 
  Box, 
  TrendingUp 
} from 'lucide-react';
import { SectionGlowDivider } from '../Common/SectionGlowDivider';

export const CapabilitiesSection: React.FC = () => {
  const getIcon = (name: string, isAlt: boolean) => {
    const className = `w-5 h-5 ${isAlt ? 'text-cyan-400' : 'text-blue-400'}`;
    switch (name) {
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'FileCode2':
        return <FileCode2 className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'Volume2':
        return <Volume2 className={className} />;
      case 'Box':
        return <Box className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      default:
        return <Box className={className} />;
    }
  };

  return (
    <section id="craft-section" className="py-20 relative overflow-hidden">
      {/* Subtle blue accent glow */}
      <div 
        className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        
        {/* Section Heading */}
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs text-blue-400 tracking-wider uppercase mb-2">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design &amp; Technical Skills
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            The core skills and tools behind our horror games at LIMITS Studios.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS.map((skill, index) => {
            const isAlt = index % 2 === 1;
            return (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-[#0b1220] border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 space-y-3 group"
              >
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 w-fit group-hover:scale-110 transition-transform">
                  {getIcon(skill.iconName, isAlt)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {skill.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
