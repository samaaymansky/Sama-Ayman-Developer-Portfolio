import React, { useState } from 'react';
import { GrappleSandbox } from './GrappleSandbox';
import { CombatParrySandbox } from './CombatParrySandbox';
import { WfcProcGenSandbox } from './WfcProcGenSandbox';
import { Zap, Shield, Grid } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface SandboxContainerProps {
  activeTab: 'grapple' | 'parry' | 'wfc';
  onTabChange: (tab: 'grapple' | 'parry' | 'wfc') => void;
}

export const SandboxContainer: React.FC<SandboxContainerProps> = ({ activeTab, onTabChange }) => {
  const handleSelect = (tab: 'grapple' | 'parry' | 'wfc') => {
    sounds.playClick(650);
    onTabChange(tab);
  };

  return (
    <section id="sandboxes" className="py-20 md:py-28 border-b border-slate-800/80 bg-[#090b0e] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <span>Interactive System Prototypes</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>In-Browser Live Simulation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
              Playable Mechanics Sandboxes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Great technical game design is measured in tactile player agency and responsive math.
              Test live simulations directly below: tweak friction curves, calibrate parry frame windows,
              and watch procedural dungeons collapse in real time.
            </p>
          </div>

          {/* Interactive Segmented Switcher (Functional Buttons, No Static Pills) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => handleSelect('grapple')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'grapple'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>01. Kinetic Grapple</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('parry')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'parry'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>02. Boss AI &amp; Parry</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('wfc')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'wfc'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>03. WFC Dungeon</span>
            </button>
          </div>
        </div>

        {/* Active Sandbox Render */}
        <div>
          {activeTab === 'grapple' && <GrappleSandbox />}
          {activeTab === 'parry' && <CombatParrySandbox />}
          {activeTab === 'wfc' && <WfcProcGenSandbox />}
        </div>

      </div>
    </section>
  );
};
