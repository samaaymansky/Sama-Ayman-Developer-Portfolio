import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Activity, 
  Zap, 
  Sparkles, 
  Sliders, 
  Radio, 
  ShieldAlert, 
  CheckCircle2,
  Code
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export interface GraphNode {
  id: string;
  title: string;
  category: 'trigger' | 'logic' | 'action' | 'math';
  x: number;
  y: number;
  inputs: { id: string; label: string }[];
  outputs: { id: string; label: string }[];
  params: Record<string, string | number | boolean>;
  activePulse?: boolean;
}

export interface GraphConnection {
  id: string;
  fromNodeId: string;
  fromOutputId: string;
  toNodeId: string;
  toInputId: string;
  pulseProgress?: number; // 0 to 1
}

const PRESET_GRAPHS: Record<string, { name: string; desc: string; nodes: GraphNode[]; connections: GraphConnection[] }> = {
  solitude: {
    name: 'Solitude: Night 2 Task & Horror Sequencer',
    desc: 'Sequences player chores, evaluates timing, and triggers atmospheric disturbances without jump scares.',
    nodes: [
      {
        id: 'node-1',
        title: 'Player Enters Kitchen',
        category: 'trigger',
        x: 60,
        y: 80,
        inputs: [],
        outputs: [{ id: 'out-exec', label: 'Exec' }, { id: 'out-time', label: 'TimeStamp' }],
        params: { room: 'Kitchen', hour: '02:45 AM' }
      },
      {
        id: 'node-2',
        title: 'Check Previous Chores',
        category: 'logic',
        x: 340,
        y: 60,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-true', label: 'All Done' }, { id: 'out-false', label: 'Incomplete' }],
        params: { requiredTasks: 'Dusting, Teeth' }
      },
      {
        id: 'node-3',
        title: 'Wash Dishes Task',
        category: 'action',
        x: 630,
        y: 40,
        inputs: [{ id: 'in-exec', label: 'Trigger' }],
        outputs: [{ id: 'out-done', label: 'On Finished' }],
        params: { durationSec: 4.5, allowCancel: false }
      },
      {
        id: 'node-4',
        title: 'Shift Ambient Lighting',
        category: 'action',
        x: 900,
        y: 60,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-next', label: 'Next' }],
        params: { coldBlueFactor: 0.85, shadowIntensity: 1.4 }
      },
      {
        id: 'node-5',
        title: 'Roll Psychological Anomaly',
        category: 'math',
        x: 630,
        y: 220,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-succeed', label: 'P(Creak) > 0.6' }],
        params: { probability: 0.75, targetRoom: 'Hallway' }
      },
      {
        id: 'node-6',
        title: 'Play Procedural Floor Creak',
        category: 'action',
        x: 920,
        y: 240,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [],
        params: { pitchVariation: 0.15, spatial3D: true }
      }
    ],
    connections: [
      { id: 'c1', fromNodeId: 'node-1', fromOutputId: 'out-exec', toNodeId: 'node-2', toInputId: 'in-exec' },
      { id: 'c2', fromNodeId: 'node-2', fromOutputId: 'out-true', toNodeId: 'node-3', toInputId: 'in-exec' },
      { id: 'c3', fromNodeId: 'node-3', fromOutputId: 'out-done', toNodeId: 'node-4', toInputId: 'in-exec' },
      { id: 'c4', fromNodeId: 'node-3', fromOutputId: 'out-done', toNodeId: 'node-5', toInputId: 'in-exec' },
      { id: 'c5', fromNodeId: 'node-5', fromOutputId: 'out-succeed', toNodeId: 'node-6', toInputId: 'in-exec' }
    ]
  },
  combat: {
    name: 'Combat: Parry Frame Window & Poise Stagger',
    desc: 'Determines whether an enemy swing falls within the active 6-frame parry window or inflicts chip damage.',
    nodes: [
      {
        id: 'c-1',
        title: 'Enemy Swing Telegraph',
        category: 'trigger',
        x: 60,
        y: 100,
        inputs: [],
        outputs: [{ id: 'out-exec', label: 'Exec' }, { id: 'out-frame', label: 'Frame #' }],
        params: { windupMs: 600, poiseDmg: 35 }
      },
      {
        id: 'c-2',
        title: 'Active Parry Frame Window',
        category: 'logic',
        x: 350,
        y: 80,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-perfect', label: 'Perfect (120ms)' }, { id: 'out-late', label: 'Late / Block' }, { id: 'out-miss', label: 'Whiff' }],
        params: { bufferWindowMs: 120, coyoteFrames: 3 }
      },
      {
        id: 'c-3',
        title: 'Trigger Freeze-Frame Hitstop',
        category: 'action',
        x: 680,
        y: 50,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-next', label: 'Next' }],
        params: { freezeMs: 64, cameraTrauma: 0.8 }
      },
      {
        id: 'c-4',
        title: 'Deduct Boss Poise Bar',
        category: 'math',
        x: 940,
        y: 60,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-stagger', label: 'If Poise <= 0' }],
        params: { poiseBreakAmount: 40, criticalMultiplier: 2.5 }
      },
      {
        id: 'c-5',
        title: 'Play Metallic Deflection Clang',
        category: 'action',
        x: 680,
        y: 230,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [],
        params: { sparksCount: 24, pitch: 'High C#' }
      }
    ],
    connections: [
      { id: 'c-conn-1', fromNodeId: 'c-1', fromOutputId: 'out-exec', toNodeId: 'c-2', toInputId: 'in-exec' },
      { id: 'c-conn-2', fromNodeId: 'c-2', fromOutputId: 'out-perfect', toNodeId: 'c-3', toInputId: 'in-exec' },
      { id: 'c-conn-3', fromNodeId: 'c-2', fromOutputId: 'out-perfect', toNodeId: 'c-5', toInputId: 'in-exec' },
      { id: 'c-conn-4', fromNodeId: 'c-3', fromOutputId: 'out-next', toNodeId: 'c-4', toInputId: 'in-exec' }
    ]
  },
  facility: {
    name: 'Null: Surveillance Radar & Desync Corruptor',
    desc: 'Monitors player distance to anomaly anomalies and triggers CRT phosphor glitching when desync reaches 75%.',
    nodes: [
      {
        id: 'f-1',
        title: 'Sonar Ping Interval',
        category: 'trigger',
        x: 60,
        y: 110,
        inputs: [],
        outputs: [{ id: 'out-exec', label: 'Clock Tick' }],
        params: { intervalMs: 2500, scanSector: 'Sub-Level B' }
      },
      {
        id: 'f-2',
        title: 'Calculate Distance to Entity',
        category: 'math',
        x: 350,
        y: 90,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-close', label: 'Dist < 15m' }, { id: 'out-far', label: 'Dist > 15m' }],
        params: { detectionRadius: 18.0 }
      },
      {
        id: 'f-3',
        title: 'Desync Monitor Scanlines',
        category: 'action',
        x: 680,
        y: 60,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [{ id: 'out-next', label: 'Next' }],
        params: { jitterAmount: '35px', crtWarp: 1.25 }
      },
      {
        id: 'f-4',
        title: 'Distort Radio Comms',
        category: 'action',
        x: 680,
        y: 230,
        inputs: [{ id: 'in-exec', label: 'Exec' }],
        outputs: [],
        params: { bandpassFreq: 450, staticBurst: true }
      }
    ],
    connections: [
      { id: 'f-c-1', fromNodeId: 'f-1', fromOutputId: 'out-exec', toNodeId: 'f-2', toInputId: 'in-exec' },
      { id: 'f-c-2', fromNodeId: 'f-2', fromOutputId: 'out-close', toNodeId: 'f-3', toInputId: 'in-exec' },
      { id: 'f-c-3', fromNodeId: 'f-2', fromOutputId: 'out-close', toNodeId: 'f-4', toInputId: 'in-exec' }
    ]
  }
};

const CATEGORY_COLORS = {
  trigger: {
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40',
    header: 'bg-emerald-900/60 text-emerald-300',
    pin: 'bg-emerald-400',
    badge: 'text-emerald-400 border-emerald-500/30'
  },
  logic: {
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/40',
    header: 'bg-amber-900/60 text-amber-300',
    pin: 'bg-amber-400',
    badge: 'text-amber-400 border-amber-500/30'
  },
  action: {
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-500/40',
    header: 'bg-cyan-900/60 text-cyan-300',
    pin: 'bg-cyan-400',
    badge: 'text-cyan-400 border-cyan-500/30'
  },
  math: {
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/40',
    header: 'bg-purple-900/60 text-purple-300',
    pin: 'bg-purple-400',
    badge: 'text-purple-400 border-purple-500/30'
  }
};

export const NodeGraphSandbox: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('solitude');
  const [nodes, setNodes] = useState<GraphNode[]>(PRESET_GRAPHS.solitude.nodes);
  const [connections, setConnections] = useState<GraphConnection[]>(PRESET_GRAPHS.solitude.connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([
    'Visual Scripting Node Graph initialized.',
    'Ready for live signal execution flow.'
  ]);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pulse animation state
  const animationFrameRef = useRef<number | null>(null);
  const pulseBeadsRef = useRef<{ connId: string; progress: number }[]>([]);

  const loadPreset = (presetKey: string) => {
    sounds.playClick(680);
    setActivePreset(presetKey);
    const p = PRESET_GRAPHS[presetKey];
    setNodes(JSON.parse(JSON.stringify(p.nodes)));
    setConnections(JSON.parse(JSON.stringify(p.connections)));
    setSelectedNodeId(p.nodes[0]?.id || null);
    setExecutionLog([
      `Loaded graph preset: "${p.name}"`,
      p.desc
    ]);
  };

  const handleMouseDownNode = (e: React.MouseEvent, node: GraphNode) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') return;
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    dragOffsetRef.current = {
      x: e.clientX - node.x,
      y: e.clientY - node.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(1050, e.clientX - rect.left - 40));
    const newY = Math.max(10, Math.min(480, e.clientY - rect.top - 20));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Run execution pulse through the graph
  const handleExecutePulse = useCallback(() => {
    if (isExecuting) return;
    setIsExecuting(true);
    sounds.playClick(750);
    sounds.playTerminalBeep();

    setExecutionLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ▶ TRIGGER EXECUTION: Signal dispatched from root event node.`,
      ...prev.slice(0, 8)
    ]);

    // Animate pulse through connections
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        sounds.playClick(820);
        // Highlight first nodes
        setNodes((prev) =>
          prev.map((n, i) => (i === 0 ? { ...n, activePulse: true } : { ...n, activePulse: false }))
        );
      } else if (step === 2) {
        sounds.playStaticBurst();
        setNodes((prev) =>
          prev.map((n, i) => (i === 1 ? { ...n, activePulse: true } : { ...n, activePulse: false }))
        );
      } else if (step === 3) {
        sounds.playAnomalyChime();
        setNodes((prev) =>
          prev.map((n, i) => (i > 1 && i < 4 ? { ...n, activePulse: true } : { ...n, activePulse: false }))
        );
      } else if (step >= 4) {
        sounds.playDoorLock();
        setNodes((prev) =>
          prev.map((n, i) => (i >= 4 ? { ...n, activePulse: true } : { ...n, activePulse: false }))
        );
        clearInterval(interval);
        setTimeout(() => {
          setNodes((prev) => prev.map((n) => ({ ...n, activePulse: false })));
          setIsExecuting(false);
          setExecutionLog((prev) => [
            `[${new Date().toLocaleTimeString()}] ✔ Node execution cycle completed cleanly across ${nodes.length} nodes.`,
            ...prev.slice(0, 8)
          ]);
        }, 600);
      }
    }, 450);
  }, [isExecuting, nodes.length]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="bg-[#07090e] border border-cyan-500/25 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Bar with Presets & Controls */}
      <div className="bg-[#0b0f17] border-b border-white/10 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold font-display text-white">Visual Logic & Node Graph Sequencer</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Live Blueprint Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Interactive behavior trees, task chains & frame data graphs. Drag nodes, adjust parameters, and fire signal pulses.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center bg-black/60 p-1 rounded-lg border border-white/10 text-xs font-mono">
            {Object.keys(PRESET_GRAPHS).map((key) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className={`px-3 py-1.5 rounded transition-all capitalize ${
                  activePreset === key
                    ? 'bg-cyan-500 text-black font-semibold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={handleExecutePulse}
            disabled={isExecuting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all shadow-lg ${
              isExecuting
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing Flow...' : 'Fire Signal Pulse'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Node Graph Interactive Canvas */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-3 relative h-[520px] bg-[#05070a] overflow-hidden select-none cursor-crosshair border-b lg:border-b-0 lg:border-r border-white/10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0),
              linear-gradient(to right, rgba(0, 240, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 120px 120px, 120px 120px'
          }}
        >
          {/* SVG Connection Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {connections.map((c) => {
              const fromN = nodes.find((n) => n.id === c.fromNodeId);
              const toN = nodes.find((n) => n.id === c.toNodeId);
              if (!fromN || !toN) return null;

              const x1 = fromN.x + 220; // right side of node
              const y1 = fromN.y + 40;
              const x2 = toN.x; // left side of node
              const y2 = toN.y + 40;

              const dx = Math.abs(x2 - x1) * 0.55;
              const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              const isConnectedActive = fromN.activePulse || toN.activePulse;

              return (
                <g key={c.id}>
                  {/* Background shadow path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#000"
                    strokeWidth="5"
                    strokeOpacity="0.6"
                  />
                  {/* Glowing Connection wire */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isConnectedActive ? '#22d3ee' : '#334155'}
                    strokeWidth={isConnectedActive ? '3' : '2'}
                    strokeDasharray={isConnectedActive ? '6 4' : undefined}
                    className={isConnectedActive ? 'animate-pulse' : ''}
                    filter={isConnectedActive ? 'url(#glow)' : undefined}
                  />
                  {/* Center pin connector indicator */}
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={(y1 + y2) / 2}
                    r={isConnectedActive ? 4 : 2}
                    fill={isConnectedActive ? '#22d3ee' : '#64748b'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Draggable Node Cards */}
          {nodes.map((node) => {
            const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.action;
            const isSelected = selectedNodeId === node.id;
            const isPulsing = node.activePulse;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '220px'
                }}
                className={`absolute z-10 rounded-xl border transition-shadow cursor-grab active:cursor-grabbing backdrop-blur-md ${
                  colors.bg
                } ${colors.border} ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/20'
                    : 'shadow-lg hover:border-white/30'
                } ${isPulsing ? 'ring-4 ring-emerald-400 scale-105 transition-transform' : ''}`}
              >
                {/* Node Header */}
                <div
                  className={`px-3 py-2 rounded-t-xl flex items-center justify-between border-b border-white/10 ${colors.header}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div className={`w-2 h-2 rounded-full ${colors.pin}`} />
                    <span className="font-mono text-xs font-bold truncate">{node.title}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
                    {node.category}
                  </span>
                </div>

                {/* Node Body with Ports and parameters */}
                <div className="p-3 text-[11px] font-mono space-y-2">
                  {/* Inputs and Outputs row */}
                  <div className="flex justify-between items-center text-zinc-400 text-[10px]">
                    <div>
                      {node.inputs.map((inp) => (
                        <div key={inp.id} className="flex items-center gap-1 my-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                          <span>{inp.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      {node.outputs.map((out) => (
                        <div key={out.id} className="flex items-center justify-end gap-1 my-0.5">
                          <span>{out.label}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Parameter Pill */}
                  <div className="pt-1.5 border-t border-white/5 flex flex-wrap gap-1">
                    {Object.entries(node.params).map(([k, v]) => (
                      <span
                        key={k}
                        className="bg-black/50 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 border border-white/5 truncate max-w-full"
                      >
                        {k}: <strong className="text-cyan-300">{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Canvas watermark instructions */}
          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-zinc-500 pointer-events-none flex items-center gap-3">
            <span>Click & Drag to reposition nodes</span>
            <span>·</span>
            <span>Click a node to inspect & calibrate live variables</span>
          </div>
        </div>

        {/* Right Sidebar: Node Inspector & Execution Log */}
        <div className="bg-[#080c14] p-4 flex flex-col justify-between space-y-4 text-xs font-mono">
          {/* Selected Node Properties */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Node Inspector
              </h4>
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Node Title</label>
                  <p className="text-zinc-200 font-semibold text-xs mt-0.5">{selectedNode.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-zinc-500">Category:</span>
                    <p className="text-cyan-400 uppercase font-bold">{selectedNode.category}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Coordinates:</span>
                    <p className="text-zinc-300">X:{Math.round(selectedNode.x)} Y:{Math.round(selectedNode.y)}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <label className="text-[10px] text-zinc-500 uppercase block">Tunable Parameters</label>
                  {Object.entries(selectedNode.params).map(([paramKey, val]) => (
                    <div key={paramKey} className="bg-black/40 p-2 rounded border border-white/10 space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>{paramKey}</span>
                        <span className="text-cyan-300 font-bold">{String(val)}</span>
                      </div>
                      {typeof val === 'number' && (
                        <input
                          type="range"
                          min="0"
                          max={val > 10 ? val * 2 : 10}
                          step={val < 1 ? '0.05' : '1'}
                          value={val}
                          onChange={(e) => {
                            const newNum = parseFloat(e.target.value);
                            setNodes((prev) =>
                              prev.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, params: { ...n.params, [paramKey]: newNum } }
                                  : n
                              )
                            );
                          }}
                          className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded appearance-none cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic">Select any node on the canvas to inspect its variables.</p>
            )}
          </div>

          {/* Real-Time Execution Console */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-2 text-[10px] uppercase tracking-wider font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flow Signal Log</span>
            </div>
            <div className="h-32 overflow-y-auto rounded bg-black/60 p-2 border border-white/5 space-y-1 text-[10px] font-mono text-zinc-400">
              {executionLog.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
