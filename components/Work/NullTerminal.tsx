import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { nullCoverImg, nullTerminalImg } from '../../data/projects';
import { Terminal, Shield, Radio, RefreshCw, Cpu, Activity } from 'lucide-react';

interface NullTerminalProps {
  onOpenDetails: () => void;
}

export const NullTerminal: React.FC<NullTerminalProps> = ({ onOpenDetails }) => {
  const [activeCamera, setActiveCamera] = useState<'CAM_01' | 'CAM_02'>('CAM_01');
  const [desyncLevel, setDesyncLevel] = useState<number>(35);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(
    ['NULL SYSTEM v2.4 // STATUS: SIGNAL DEGRADATION DETECTED', 'CORRIDOR 4B: DISORIENTATION LEVEL AT 68%']
  );

  const incidentLogs = [
    'FACILITY LOG 04-12: The corridor geometry shifted 14 degrees south after sector power loss. Personnel inside reported footsteps matching their own pace with a 0.5s delay.',
    'DIAGNOSTIC 08-01: Terminal console 09 continues transmitting keystrokes from an unoccupied station. Camera feed shows empty operator chair.',
    'AUDIO SURVEILLANCE: Low-frequency resonant hum (38Hz) detected behind drywall. No HVAC equipment located in this quadrant.',
    'INCIDENT REPORT: Subject turned around after 40 meters of hallway; the exit door was no longer visible.'
  ];

  const handleCameraSwitch = (cam: 'CAM_01' | 'CAM_02') => {
    sounds.playTerminalBeep(900);
    setActiveCamera(cam);
    setConsoleOutput(prev => [
      ...prev.slice(-3),
      `FEED SWITCHED -> ${cam}: RESOLUTION SYNC AT ${(100 - desyncLevel)}%`
    ]);
  };

  const handleScanCorridor = () => {
    sounds.playStaticBurst();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      sounds.playTerminalBeep(1200);
      setConsoleOutput(prev => [
        ...prev.slice(-3),
        `RADAR ECHO: Spatial anomaly located 18m ahead in corridor. Vector unmapped.`
      ]);
    }, 600);
  };

  const handleDecryptNextLog = () => {
    sounds.playTerminalBeep(750);
    const nextIdx = (logIndex + 1) % incidentLogs.length;
    setLogIndex(nextIdx);
    setConsoleOutput(prev => [
      ...prev.slice(-3),
      `DECRYPTED LOG #${nextIdx + 1}: ${incidentLogs[nextIdx].slice(0, 65)}...`
    ]);
  };

  const handleSonarPing = () => {
    sounds.playAnomalyChime();
    setConsoleOutput(prev => [
      ...prev.slice(-3),
      `SONAR PING: Corrupted sound signature returned from adjacent ventilation shaft.`
    ]);
  };

  return (
    <div className="mt-6 border border-slate-800 bg-[#05080c] p-5 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">Interactive Terminal Console</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Liminal Corridor Diagnostic</span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Mess with NULL's facility diagnostics: cycle surveillance cameras, decrypt incident logs, and calibrate corridor desync.
          </p>
        </div>

        {/* Camera Selector */}
        <div className="flex items-center gap-1 bg-black/60 p-1 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => handleCameraSwitch('CAM_01')}
            className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              activeCamera === 'CAM_01'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CAM 01 // Hallway
          </button>
          <button
            type="button"
            onClick={() => handleCameraSwitch('CAM_02')}
            className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              activeCamera === 'CAM_02'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CAM 02 // Terminal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Terminal Screen with CRT Scanlines */}
        <div className="lg:col-span-7 relative overflow-hidden border border-emerald-900/60 bg-black min-h-[260px] sm:min-h-[320px] rounded-none">
          <img
            src={activeCamera === 'CAM_01' ? nullCoverImg : nullTerminalImg}
            alt="Facility Security Feed"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isScanning ? 'opacity-40 filter blur-xs' : 'opacity-85'
            }`}
          />

          {/* CRT scanlines overlay */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-80" />

          {/* Green phosphor vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-emerald-950/20 pointer-events-none" />

          {/* Feed HUD */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-emerald-400 pointer-events-none">
            <div className="bg-black/80 px-2 py-0.5 border border-emerald-900/80 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE FEED: {activeCamera}</span>
            </div>
            <span className="bg-black/80 text-emerald-300 px-2 py-0.5 border border-emerald-900/80 text-[10px]">
              DESYNC: {desyncLevel}%
            </span>
          </div>

          {/* Current Incident Log Snippet */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/90 p-3 border border-emerald-800/60 text-xs font-mono text-emerald-300">
            <div className="text-[10px] text-emerald-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Incident Decrypt #{logIndex + 1}</span>
              <span>Tap 'Decrypt Log' to cycle</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-200">
              "{incidentLogs[logIndex]}"
            </p>
          </div>
        </div>

        {/* Diagnostic Command Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Terminal Diagnostic Commands</span>
            <span className="text-emerald-400">RELAY ONLINE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            
            {/* Command: Scan Corridor */}
            <button
              type="button"
              onClick={handleScanCorridor}
              disabled={isScanning}
              className="p-3 border border-slate-800 hover:border-emerald-600 bg-[#0a0f16] hover:bg-emerald-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[SCAN_CORRIDORS]</span>
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">EXECUTE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Pings the clinical corridor for structural geometry shifts.
              </p>
            </button>

            {/* Command: Decrypt Log */}
            <button
              type="button"
              onClick={handleDecryptNextLog}
              className="p-3 border border-slate-800 hover:border-emerald-600 bg-[#0a0f16] hover:bg-emerald-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[DECRYPT_INCIDENT_LOG]</span>
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">CYCLE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Recovers corrupted facility memory logs from terminal console 09.
              </p>
            </button>

            {/* Command: Audio Sonar */}
            <button
              type="button"
              onClick={handleSonarPing}
              className="p-3 border border-slate-800 hover:border-emerald-600 bg-[#0a0f16] hover:bg-emerald-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[PING_SPATIAL_AUDIO]</span>
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">TEST</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Sends a directional acoustic wave to test room reverb.
              </p>
            </button>

          </div>

          {/* Desync Slider */}
          <div className="p-3 border border-slate-800 bg-[#0a0f16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Facility Desync Calibration</span>
              <span className="text-emerald-400">{desyncLevel}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={desyncLevel}
              onChange={(e) => {
                setDesyncLevel(Number(e.target.value));
                sounds.playSliderTick();
              }}
              className="w-full h-1 bg-slate-800 rounded-none appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>Stable (5%)</span>
              <span>Corrupted (95%)</span>
            </div>
          </div>

          {/* Console Log Feed */}
          <div className="p-2.5 bg-black border border-emerald-900/60 font-mono text-[11px] text-emerald-400 space-y-1 min-h-[58px]">
            {consoleOutput.map((line, idx) => (
              <div key={idx} className="truncate">
                &gt; {line}
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">
              Roblox Studio · Luau (In Dev)
            </span>

            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                onOpenDetails();
              }}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              <span>View Full NULL Systems Dossier →</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
