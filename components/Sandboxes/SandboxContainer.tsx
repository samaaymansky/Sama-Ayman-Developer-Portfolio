import React, { useState } from 'react';
import { GrappleSandbox } from './GrappleSandbox';
import { CombatParrySandbox } from './CombatParrySandbox';
import { WfcProcGenSandbox } from './WfcProcGenSandbox';
import { NodeGraphSandbox } from './NodeGraphSandbox';
import { GameFeelWorkshop } from '../FeelLab/GameFeelWorkshop';
import { Zap, Shield, Grid, GitBranch, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

export type SandboxTab = 'node' | 'grapple' | 'parry' | 'wfc' | 'feel';

interface SandboxContainerProps {
  activeTab?: SandboxTab;
  onTabChange?: (tab: SandboxTab) => void;
}

export const SandboxContainer: React.FC<SandboxContainerProps> = ({ 
  activeTab: externalTab, 
  onTabChange 
}) => {
  const [internalTab, setInternalTab] = useState<SandboxTab>('node');
  const activeTab = externalTab ?? internalTab;

  const handleSelect = (tab: SandboxTab) => {
    sounds.playClick(650);
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <section id="sandboxes" className="py-20 border-b border-white/10 bg-[#06080d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>Technical Mechanics Lab</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>In-Browser Simulation Engines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Interactive Systems &amp; Visual Logic
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed font-sans">
              Test live mathematical systems directly in the browser: visual node graphs for event sequencing,
              Verlet physics pendulum grapples, 6-frame combat parry windows, and wave function collapse dungeons.
            </p>
          </div>

          {/* Interactive Switcher */}
          <div className="flex items-center gap-1 p-1 bg-black/60 border border-white/10 rounded-xl overflow-x-auto shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => handleSelect('node')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'node'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>01. Visual Node Graph</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('grapple')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'grapple'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>02. Kinetic Grapple</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('parry')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'parry'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>03. Parry Frame Data</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('wfc')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'wfc'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>04. WFC ProcGen</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('feel')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'feel'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>05. 3C Game Feel</span>
            </button>
          </div>
        </div>

        {/* Active Sandbox Render */}
        <div className="transition-all">
          {activeTab === 'node' && <NodeGraphSandbox />}
          {activeTab === 'grapple' && <GrappleSandbox />}
          {activeTab === 'parry' && <CombatParrySandbox />}
          {activeTab === 'wfc' && <WfcProcGenSandbox />}
          {activeTab === 'feel' && <GameFeelWorkshop />}
        </div>

      </div>
    </section>
  );
};
