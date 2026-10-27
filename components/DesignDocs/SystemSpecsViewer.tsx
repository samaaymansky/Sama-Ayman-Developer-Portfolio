import React, { useState } from 'react';
import { Calculator, Dices, Layers, TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const SystemSpecsViewer: React.FC = () => {
  // Armor mitigation state
  const [armor, setArmor] = useState<number>(120);
  const [rawDamage, setRawDamage] = useState<number>(250);
  const [kConstant, setKConstant] = useState<number>(100);
  const [formulaType, setFormulaType] = useState<'hyperbolic' | 'flat' | 'exponential'>('hyperbolic');

  // Loot drop simulator state
  const [dropRuns, setDropRuns] = useState<number>(500);
  const [dropResults, setDropResults] = useState<{
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    pityTriggered: number;
  }>({
    common: 340,
    rare: 115,
    epic: 38,
    legendary: 7,
    pityTriggered: 2
  });

  // Calculate mitigation
  let reductionPercent = 0;
  let finalDamage = rawDamage;

  if (formulaType === 'hyperbolic') {
    reductionPercent = (armor / (armor + kConstant)) * 100;
    finalDamage = Math.max(1, rawDamage * (1 - reductionPercent / 100));
  } else if (formulaType === 'flat') {
    finalDamage = Math.max(1, rawDamage - armor * 0.85);
    reductionPercent = ((rawDamage - finalDamage) / rawDamage) * 100;
  } else if (formulaType === 'exponential') {
    reductionPercent = (1 - Math.exp(-armor / (kConstant * 1.5))) * 100;
    finalDamage = Math.max(1, rawDamage * (1 - reductionPercent / 100));
  }

  const effectiveHealth = (1000 / (1 - reductionPercent / 100)).toFixed(0);

  // Run Monte Carlo Drop Simulation
  const runSimulation = () => {
    sounds.playClick(800);
    let common = 0;
    let rare = 0;
    let epic = 0;
    let legendary = 0;
    let pity = 0;
    let pityCounter = 0;

    for (let i = 0; i < dropRuns; i++) {
      pityCounter++;
      // Hard pity guarantee at 80 pulls
      if (pityCounter >= 80) {
        legendary++;
        pity++;
        pityCounter = 0;
        continue;
      }

      const roll = Math.random() * 100;
      if (roll < 1.6) {
        legendary++;
        pityCounter = 0;
      } else if (roll < 1.6 + 9.4) {
        epic++;
      } else if (roll < 1.6 + 9.4 + 28.0) {
        rare++;
      } else {
        common++;
      }
    }

    setDropResults({
      common,
      rare,
      epic,
      legendary,
      pityTriggered: pity
    });
  };

  return (
    <section id="system-specs" className="py-20 md:py-28 border-b border-slate-800/80 bg-[#090b0e] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-12 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <span>Mathematical Balancing &amp; Systems Architecture</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>GDD Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
            Deterministic Economy &amp; Combat Mathematics
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            Gameplay balance lives in spreadsheet formulas and algorithmic curves before it ever touches
            a 3D model. Below are two production models I use to tune combat survivability and progression curves.
          </p>
        </div>

        {/* 2-Column Math Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Model 1: Armor Mitigation & Effective Health (EHP) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">Armor Mitigation &amp; EHP Curve</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Combat Damage Model</span>
            </div>

            {/* Formula Type Tabs (Buttons) */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick(600);
                  setFormulaType('hyperbolic');
                }}
                className={`flex-1 py-1.5 px-2 rounded transition-colors whitespace-nowrap ${
                  formulaType === 'hyperbolic' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hyperbolic (LoL/Dota)
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick(600);
                  setFormulaType('exponential');
                }}
                className={`flex-1 py-1.5 px-2 rounded transition-colors whitespace-nowrap ${
                  formulaType === 'exponential' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exponential Falloff
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick(600);
                  setFormulaType('flat');
                }}
                className={`flex-1 py-1.5 px-2 rounded transition-colors whitespace-nowrap ${
                  formulaType === 'flat' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flat Threshold
              </button>
            </div>

            {/* Formula Representation */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400 text-center">
              {formulaType === 'hyperbolic' && 'Mitigation % = Armor / (Armor + K) · 100%'}
              {formulaType === 'exponential' && 'Mitigation % = (1 - e^(-Armor / (1.5 · K))) · 100%'}
              {formulaType === 'flat' && 'Damage Taken = max(1, RawDamage - Armor · 0.85)'}
            </div>

            {/* Sliders */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Player Armor Rating:</span>
                  <span className="text-amber-400 tabular-nums">{armor}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={armor}
                  onChange={(e) => {
                    setArmor(parseInt(e.target.value));
                    sounds.playSliderTick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Incoming Strike Raw Damage:</span>
                  <span className="text-amber-400 tabular-nums">{rawDamage}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={rawDamage}
                  onChange={(e) => {
                    setRawDamage(parseInt(e.target.value));
                    sounds.playSliderTick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Resulting Quantitative Proof Panel */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Mitigation</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {reductionPercent.toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Net Damage</span>
                <span className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                  {finalDamage.toFixed(0)}
                </span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Effective HP</span>
                <span className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                  {effectiveHealth}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Hyperbolic mitigation prevents runaway invulnerability while ensuring every +10 armor point yields consistent +10% effective health against physical attacks.
            </p>
          </div>

          {/* Model 2: Monte Carlo Loot Drop Curve Simulator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Dices className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">Loot Rarity &amp; Pity Curve Simulator</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Progression Math</span>
            </div>

            {/* Simulation Trigger Controls */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Simulation Batch Size: <strong className="text-amber-400 tabular-nums">{dropRuns} Pulls</strong>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDropRuns(100)}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      dropRuns === 100 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    100
                  </button>
                  <button
                    type="button"
                    onClick={() => setDropRuns(500)}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      dropRuns === 500 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    500
                  </button>
                  <button
                    type="button"
                    onClick={() => setDropRuns(1000)}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      dropRuns === 1000 ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    1,000
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={runSimulation}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs rounded transition-colors flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Dices className="w-4 h-4" />
                <span>Simulate Drops</span>
              </button>
            </div>

            {/* Distribution Visualizer (Bar Chart Breakdown) */}
            <div className="space-y-3 font-mono text-xs">
              {/* Common */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Common (Base 60.0%)</span>
                  <span className="text-white tabular-nums">
                    {dropResults.common} ({((dropResults.common / dropRuns) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-slate-500 transition-all duration-300"
                    style={{ width: `${(dropResults.common / dropRuns) * 100}%` }}
                  />
                </div>
              </div>

              {/* Rare */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Rare (Base 28.0%)</span>
                  <span className="text-cyan-400 tabular-nums">
                    {dropResults.rare} ({((dropResults.rare / dropRuns) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${(dropResults.rare / dropRuns) * 100}%` }}
                  />
                </div>
              </div>

              {/* Epic */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Epic (Base 9.4%)</span>
                  <span className="text-purple-400 tabular-nums">
                    {dropResults.epic} ({((dropResults.epic / dropRuns) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${(dropResults.epic / dropRuns) * 100}%` }}
                  />
                </div>
              </div>

              {/* Legendary */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Legendary (Base 1.6% + Pity)</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {dropResults.legendary} ({((dropResults.legendary / dropRuns) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${(dropResults.legendary / dropRuns) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pity Stats Strip */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Hard Pity Triggers (&ge;80 dry streak):</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {dropResults.pityTriggered} saved drops
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Dynamic bad-luck protection curves flatten Poisson variance, protecting player retention from statistical outlier dry spells without inflating market economy inflation.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
