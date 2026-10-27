import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { sevenMinCoverImg, sevenMinBunkerImg } from '../../data/projects';
import { Play, Pause, RotateCcw, ShieldAlert, Flame, Gauge, AlertTriangle, Zap } from 'lucide-react';

interface SevenMinutesLockdownProps {
  onOpenDetails: () => void;
}

export const SevenMinutesLockdown: React.FC<SevenMinutesLockdownProps> = ({ onOpenDetails }) => {
  // 7 minutes in tenths of seconds (7 * 60 * 10 = 4200 tenths)
  const [tenthsLeft, setTenthsLeft] = useState<number>(4200);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [doorsWelded, setDoorsWelded] = useState<number>(0);
  const [steamVented, setSteamVented] = useState<boolean>(false);
  const [incidentStatus, setIncidentStatus] = useState<string>(
    'CONTAINMENT ALERT: Automated facility incineration protocol primed. Breach lockdown active.'
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && tenthsLeft > 0) {
      timer = setInterval(() => {
        setTenthsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            sounds.playAnomalyChime();
            setIncidentStatus('ZERO REACHED: INCINERATION PROTOCOL FIRED. FACILITY COLLAPSE.');
            return 0;
          }
          // Heartbeat thump every 5 seconds when running
          if (prev % 50 === 0) {
            sounds.playHeartbeat();
          }
          return prev - 1;
        });
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, tenthsLeft]);

  const toggleRun = () => {
    sounds.playClick(850);
    setIsRunning(!isRunning);
    if (!isRunning) {
      setIncidentStatus('TIMER RUNNING: Every second spent looting burns survival buffer.');
    } else {
      setIncidentStatus('TIMER PAUSED: Tactical assessment hold.');
    }
  };

  const handleReset = () => {
    sounds.playClick(500);
    setIsRunning(false);
    setTenthsLeft(4200);
    setDoorsWelded(0);
    setSteamVented(false);
    setIncidentStatus('CONTAINMENT ALERT: Automated facility incineration protocol primed. Breach lockdown active.');
  };

  // Weld Door buys +30 seconds
  const handleWeldDoor = () => {
    sounds.playWeldSpark();
    setDoorsWelded(prev => prev + 1);
    setTenthsLeft(prev => Math.min(4200, prev + 300));
    setIncidentStatus(`BLAST DOOR #${doorsWelded + 1} HYDRAULICALLY SEALED. Stalker slowed down. Buffer extended (+30s).`);
  };

  // Vent Steam
  const handleVentSteam = () => {
    sounds.playSteamVent();
    setSteamVented(true);
    setIncidentStatus('AUXILIARY VALVE PURGED: Heavy steam blinds enemy sightlines in corridor.');
    setTimeout(() => setSteamVented(false), 3000);
  };

  const formatClock = (tenths: number) => {
    const totalSecs = Math.floor(tenths / 10);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const dec = tenths % 10;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${dec}`;
  };

  return (
    <div className="mt-6 border border-slate-800 bg-[#090607] p-5 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="uppercase tracking-wider">Interactive Lockdown Simulator</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Unity 6 Real-Time Escape Loop</span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Mess with the ticking-clock mechanics of 7 MINUTES: real-time wrist countdown, tactical barricades, and panic pacing.
          </p>
        </div>

        {/* Live Clock Display & Controls */}
        <div className="flex items-center gap-2 bg-black p-1.5 border border-amber-900/60 shrink-0">
          <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-amber-400 px-3 select-none">
            {formatClock(tenthsLeft)}
          </div>
          <button
            type="button"
            onClick={toggleRun}
            className="p-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition-colors cursor-pointer"
            title={isRunning ? 'Pause Timer' : 'Start Countdown'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Reset to 7:00.0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Bunker Viewport */}
        <div className="lg:col-span-7 relative overflow-hidden border border-amber-900/50 bg-black min-h-[260px] sm:min-h-[320px]">
          <img
            src={steamVented ? sevenMinBunkerImg : sevenMinCoverImg}
            alt="7 Minutes Subterranean Bunker"
            className="w-full h-full object-cover opacity-90 transition-all duration-500"
          />

          {/* Steam / Smoke effect overlay */}
          {steamVented && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xs animate-pulse pointer-events-none" />
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

          {/* Wrist Display HUD Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-amber-400 pointer-events-none">
            <div className="bg-black/85 px-2.5 py-1 border border-amber-800/80 flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>CONTAINMENT PROTOCOL: ACTIVE</span>
            </div>
            <span className="bg-black/85 text-amber-300 px-2 py-0.5 border border-amber-800/80 text-[10px]">
              DOORS WELDED: {doorsWelded}
            </span>
          </div>

          {/* Countdown Clock Floating on Viewport */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md px-6 py-3 border border-amber-500/30 text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-500/80 mb-0.5">
                Wrist Device Chronometer
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wider">
                {formatClock(tenthsLeft)}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                {isRunning ? 'COUNTDOWN IN PROGRESS' : 'CLICK PLAY TO ENGAGE ESCAPE'}
              </div>
            </div>
          </div>
        </div>

        {/* Survival Decision Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Tactical Survival Actions</span>
            <span className="text-amber-500">UNITY 6 PROTOTYPE</span>
          </div>

          <div className="space-y-2">
            
            {/* Action 1: Weld Blast Door */}
            <button
              type="button"
              onClick={handleWeldDoor}
              className="w-full p-3 border border-slate-800 hover:border-amber-600 bg-[#120a0d] hover:bg-amber-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>[WELD_BLAST_DOOR]</span>
                </span>
                <span className="text-[10px] text-amber-500/80 font-mono">+30s BUFFER</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Seals the reinforced corridor hatch with torch arc sparks, buying time against stalkers.
              </p>
            </button>

            {/* Action 2: Vent Steam */}
            <button
              type="button"
              onClick={handleVentSteam}
              className="w-full p-3 border border-slate-800 hover:border-amber-600 bg-[#120a0d] hover:bg-amber-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>[VENT_AUXILIARY_STEAM]</span>
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400">DISCHARGE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Purges boiler pressure into the hallway to obscure visibility and disorient entities.
              </p>
            </button>

            {/* Action 3: Heartbeat Sensor */}
            <button
              type="button"
              onClick={() => {
                sounds.playHeartbeat();
                setIncidentStatus('BIOMETRIC PULSE: Heart rate 142 BPM. Adrenaline audio ducking active.');
              }}
              className="w-full p-3 border border-slate-800 hover:border-amber-600 bg-[#120a0d] hover:bg-amber-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>[CHECK_BIOMETRIC_PULSE]</span>
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400">142 BPM</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Auditions the low-frequency heartbeat audio system used during low-health encounters.
              </p>
            </button>

          </div>

          {/* Status Message Terminal */}
          <div className="p-3 bg-black border border-amber-900/60 text-[11px] font-mono text-amber-300 min-h-[46px] flex items-center">
            <span>&gt; {incidentStatus}</span>
          </div>

          {/* Action Links */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400">
              Target Engine: Unity 6 · C#
            </span>

            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                onOpenDetails();
              }}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              <span>View 7 MINUTES Combat Specs →</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
