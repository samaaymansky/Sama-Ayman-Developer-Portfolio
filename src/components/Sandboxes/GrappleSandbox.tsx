import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RefreshCw, Play, Pause, Compass, Sliders, Info, Zap } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface Anchor {
  x: number;
  y: number;
  r: number;
  label?: string;
}

export const GrappleSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tunable physics parameters
  const [gravity, setGravity] = useState<number>(0.35);
  const [tension, setTension] = useState<number>(0.08);
  const [damping, setDamping] = useState<number>(0.985);
  const [reelSpeed, setReelSpeed] = useState<number>(2.2);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    tensionForce: 0,
    gForce: 1.0,
    isGrappling: false
  });

  // State refs for animation loop
  const stateRef = useRef({
    pos: { x: 140, y: 320 },
    vel: { x: 0, y: 0 },
    radius: 12,
    grounded: false,
    grapple: null as { anchorX: number; anchorY: number; restLength: number } | null,
    keys: { left: false, right: false, up: false, down: false },
    anchors: [
      { x: 180, y: 80, r: 10, label: 'A1' },
      { x: 380, y: 60, r: 10, label: 'A2' },
      { x: 580, y: 90, r: 10, label: 'A3' },
      { x: 280, y: 160, r: 8, label: 'P1' },
      { x: 480, y: 150, r: 8, label: 'P2' }
    ] as Anchor[],
    obstacles: [
      { x: 240, y: 240, w: 70, h: 20 },
      { x: 450, y: 220, w: 80, h: 20 }
    ],
    history: [] as { x: number; y: number }[]
  });

  // Presets
  const applyPreset = (presetName: string) => {
    sounds.playClick(680);
    if (presetName === 'pathfinder') {
      setGravity(0.38);
      setTension(0.12);
      setDamping(0.99);
      setReelSpeed(3.0);
    } else if (presetName === 'titanfall') {
      setGravity(0.32);
      setTension(0.09);
      setDamping(0.98);
      setReelSpeed(2.0);
    } else if (presetName === 'pendulum') {
      setGravity(0.42);
      setTension(0.22);
      setDamping(0.998);
      setReelSpeed(0.5);
    } else if (presetName === 'heavy') {
      setGravity(0.5);
      setTension(0.05);
      setDamping(0.95);
      setReelSpeed(1.2);
    }
  };

  const resetSimulation = useCallback(() => {
    sounds.playClick(500);
    const s = stateRef.current;
    s.pos = { x: 140, y: 320 };
    s.vel = { x: 0, y: 0 };
    s.grapple = null;
    s.history = [];
  }, []);

  // Hook canvas interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const s = stateRef.current;

    // If currently grappling, detach
    if (s.grapple) {
      s.grapple = null;
      sounds.playClick(440);
      return;
    }

    // Find nearest anchor
    let closest: Anchor | null = null;
    let minDist = 320; // Max reach

    for (const a of s.anchors) {
      const d = Math.hypot(a.x - clickX, a.y - clickY);
      if (d < 50) {
        closest = a;
        break;
      }
      const distFromPlayer = Math.hypot(a.x - s.pos.x, a.y - s.pos.y);
      if (distFromPlayer < minDist) {
        minDist = distFromPlayer;
        closest = a;
      }
    }

    if (closest) {
      const currentDist = Math.hypot(closest.x - s.pos.x, closest.y - s.pos.y);
      s.grapple = {
        anchorX: closest.x,
        anchorY: closest.y,
        restLength: currentDist
      };
      sounds.playGrappleLatch();
    } else {
      // Fire freeform grapple anchor directly to point clicked
      const dist = Math.hypot(clickX - s.pos.x, clickY - s.pos.y);
      if (dist < 340) {
        s.grapple = {
          anchorX: clickX,
          anchorY: clickY,
          restLength: dist
        };
        sounds.playGrappleShoot();
      }
    }
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling if focused on sandbox
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
          return;
        }
      }
      const k = stateRef.current.keys;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') k.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') k.right = true;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        k.up = true;
        if (stateRef.current.grounded) {
          stateRef.current.vel.y = -8.5;
          stateRef.current.grounded = false;
          sounds.playJump();
        }
      }
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') k.down = true;
      if (e.key === ' ' || e.key === 'q' || e.key === 'Q') {
        // Space / Q detaches or launches
        if (stateRef.current.grapple) {
          stateRef.current.grapple = null;
          sounds.playClick(500);
        } else if (stateRef.current.grounded) {
          stateRef.current.vel.y = -8.5;
          stateRef.current.grounded = false;
          sounds.playJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = stateRef.current.keys;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') k.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') k.right = false;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') k.up = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') k.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Physics & Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTick = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      if (!isRunning) return;

      const dt = Math.min((now - lastTick) / 1000, 0.033);
      lastTick = now;

      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const groundY = height - 40;

      // 1. Apply Horizontal Input
      const moveAccel = 0.55;
      if (s.keys.left) s.vel.x -= moveAccel;
      if (s.keys.right) s.vel.x += moveAccel;

      // 2. Apply Gravity
      s.vel.y += gravity;

      // 3. Grapple Spring & Reel Physics
      let currentTensionForce = 0;
      if (s.grapple) {
        const dx = s.grapple.anchorX - s.pos.x;
        const dy = s.grapple.anchorY - s.pos.y;
        const currentDist = Math.hypot(dx, dy);

        // Reel-in active if holding W or automatically shortening tether
        if (s.keys.up || currentDist > 120) {
          s.grapple.restLength = Math.max(60, s.grapple.restLength - reelSpeed);
        }
        if (s.keys.down) {
          s.grapple.restLength = Math.min(320, s.grapple.restLength + reelSpeed);
        }

        const delta = currentDist - s.grapple.restLength;
        if (delta > 0 && currentDist > 0.001) {
          const nx = dx / currentDist;
          const ny = dy / currentDist;

          // Hooke's Law spring tension
          const springForce = delta * tension;
          currentTensionForce = springForce;

          s.vel.x += nx * springForce;
          s.vel.y += ny * springForce;

          // Tangential swing damping
          s.vel.x *= damping;
          s.vel.y *= damping;
        }
      }

      // Air resistance
      s.vel.x *= 0.982;
      s.vel.y *= 0.995;

      // Clamp max velocity
      const speed = Math.hypot(s.vel.x, s.vel.y);
      if (speed > 22) {
        s.vel.x = (s.vel.x / speed) * 22;
        s.vel.y = (s.vel.y / speed) * 22;
      }

      // 4. Integrate Position (Verlet/Euler)
      s.pos.x += s.vel.x;
      s.pos.y += s.vel.y;

      // 5. Collision: Ground
      if (s.pos.y + s.radius >= groundY) {
        if (!s.grounded && s.vel.y > 2.5) {
          sounds.playLand();
        }
        s.pos.y = groundY - s.radius;
        s.vel.y = 0;
        s.grounded = true;
        s.vel.x *= 0.82; // Ground friction
      } else {
        s.grounded = false;
      }

      // Collision: Boundaries
      if (s.pos.x - s.radius < 20) {
        s.pos.x = 20 + s.radius;
        s.vel.x *= -0.4;
      } else if (s.pos.x + s.radius > width - 20) {
        s.pos.x = width - 20 - s.radius;
        s.vel.x *= -0.4;
      }
      if (s.pos.y - s.radius < 20) {
        s.pos.y = 20 + s.radius;
        s.vel.y *= -0.4;
      }

      // Collision: Obstacles
      for (const obs of s.obstacles) {
        if (
          s.pos.x + s.radius > obs.x &&
          s.pos.x - s.radius < obs.x + obs.w &&
          s.pos.y + s.radius > obs.y &&
          s.pos.y - s.radius < obs.y + obs.h
        ) {
          // Resolve top bounce
          if (s.vel.y > 0 && s.pos.y < obs.y + 10) {
            s.pos.y = obs.y - s.radius;
            s.vel.y = 0;
            s.grounded = true;
          }
        }
      }

      // Record trajectory history
      s.history.push({ x: s.pos.x, y: s.pos.y });
      if (s.history.length > 40) s.history.shift();

      // Telemetry computation
      const curSpeed = Math.hypot(s.vel.x, s.vel.y);
      const gCalc = 1.0 + Math.abs(currentTensionForce / (gravity * 10 || 1));

      setTelemetry({
        speed: Math.round(curSpeed * 10) / 10,
        tensionForce: Math.round(currentTensionForce * 100) / 100,
        gForce: Math.round(gCalc * 10) / 10,
        isGrappling: !!s.grapple
      });

      // ---------------- RENDER ----------------
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Ground
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw Obstacles
      for (const obs of s.obstacles) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

        // Pattern on obstacle
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(obs.x + 2, obs.y + 2, obs.w - 4, 3);
      }

      // Draw Anchors
      for (const a of s.anchors) {
        const isTargeted = s.grapple && s.grapple.anchorX === a.x && s.grapple.anchorY === a.y;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = isTargeted ? '#f59e0b' : '#334155';
        ctx.fill();
        ctx.strokeStyle = isTargeted ? '#fbbf24' : '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isTargeted ? '#ffffff' : '#94a3b8';
        ctx.fill();

        // Label
        if (a.label) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px monospace';
          ctx.fillText(a.label, a.x - 6, a.y - a.r - 4);
        }
      }

      // Draw Trajectory Trail
      if (showTrajectory && s.history.length > 2) {
        ctx.beginPath();
        ctx.moveTo(s.history[0].x, s.history[0].y);
        for (let i = 1; i < s.history.length; i++) {
          ctx.lineTo(s.history[i].x, s.history[i].y);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Grapple Cable
      if (s.grapple) {
        ctx.beginPath();
        ctx.moveTo(s.pos.x, s.pos.y);
        ctx.lineTo(s.grapple.anchorX, s.grapple.anchorY);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dynamic cable strain pulse
        ctx.beginPath();
        ctx.arc(s.grapple.anchorX, s.grapple.anchorY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Velocity and Force Vectors
      if (showVectors) {
        // Velocity Vector (Cyan)
        const vScale = 4;
        ctx.beginPath();
        ctx.moveTo(s.pos.x, s.pos.y);
        ctx.lineTo(s.pos.x + s.vel.x * vScale, s.pos.y + s.vel.y * vScale);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vector arrowhead
        const angle = Math.atan2(s.vel.y, s.vel.x);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(s.pos.x + s.vel.x * vScale, s.pos.y + s.vel.y * vScale, 3, 0, Math.PI * 2);
        ctx.fill();

        // Tension Vector (Amber)
        if (s.grapple) {
          const dx = s.grapple.anchorX - s.pos.x;
          const dy = s.grapple.anchorY - s.pos.y;
          const d = Math.hypot(dx, dy);
          if (d > 0) {
            const tx = (dx / d) * (currentTensionForce * 15);
            const ty = (dy / d) * (currentTensionForce * 15);
            ctx.beginPath();
            ctx.moveTo(s.pos.x, s.pos.y);
            ctx.lineTo(s.pos.x + tx, s.pos.y + ty);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      // Draw Player Probe
      ctx.save();
      ctx.translate(s.pos.x, s.pos.y);

      // Rotate body toward movement direction
      const moveAngle = Math.atan2(s.vel.y, s.vel.x);
      ctx.rotate(curSpeed > 0.5 ? moveAngle : 0);

      // Outer kinetic shell
      ctx.beginPath();
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.grapple ? '#f59e0b' : '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Core visor / directional lens
      ctx.beginPath();
      ctx.arc(s.radius * 0.45, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#090b0e';
      ctx.fill();

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gravity, tension, damping, reelSpeed, showVectors, showTrajectory, isRunning]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Sandbox Header */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Kinetic Grapple &amp; Momentum Vector Field</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Click any anchor node to tether · WASD / Space to navigate &amp; jump · Space / Click to release
          </p>
        </div>

        {/* Real-time Telemetry HUD (Tabular Numerals) */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-400">Velocity:</span>
            <span className="text-cyan-400 font-bold tabular-nums">{telemetry.speed} u/s</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-400">Tension:</span>
            <span className="text-amber-400 font-bold tabular-nums">{telemetry.tensionForce} N</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-400">G-Force:</span>
            <span className="text-emerald-400 font-bold tabular-nums">{telemetry.gForce} g</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Canvas Area */}
        <div className="lg:col-span-8 relative bg-[#080a0f] flex items-center justify-center p-2 min-h-[380px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            onClick={handleCanvasClick}
            className="w-full h-auto cursor-crosshair rounded border border-slate-800/80 touch-none shadow-inner"
          />

          {/* Quick On-Canvas Help Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-400 space-y-0.5">
            <div><span className="text-amber-400">MOUSE:</span> Click anchor to grapple</div>
            <div><span className="text-cyan-400">KEYS:</span> A/D move · W jump · Space detach</div>
          </div>

          {/* Simulation Toggle and Reset Buttons */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                setIsRunning(!isRunning);
              }}
              className="p-2 text-xs font-mono bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 transition-colors"
              title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              className="p-2 text-xs font-mono bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 transition-colors"
              title="Reset Probe Position"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Physics Inspector & Parameter Tuner */}
        <div className="lg:col-span-4 bg-slate-950/70 p-5 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Spring Solver Math</span>
              </span>
              <span>Hooke&apos;s Law</span>
            </div>

            {/* Presets Strip */}
            <div className="mt-3">
              <div className="text-[11px] font-mono text-slate-400 mb-1.5">Game Feel Profiles:</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('pathfinder')}
                  className="px-2.5 py-1.5 text-xs font-sans text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors truncate"
                >
                  Apex Pathfinder Sling
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('titanfall')}
                  className="px-2.5 py-1.5 text-xs font-sans text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors truncate"
                >
                  Titanfall 2 Hook
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('pendulum')}
                  className="px-2.5 py-1.5 text-xs font-sans text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors truncate"
                >
                  Pure Pendulum Swing
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('heavy')}
                  className="px-2.5 py-1.5 text-xs font-sans text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors truncate"
                >
                  Industrial Crane
                </button>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 font-mono text-xs">
            {/* Hook Tension */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hook Tension (k)</span>
                <span className="text-amber-400 tabular-nums">{tension.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.005"
                value={tension}
                onChange={(e) => {
                  setTension(parseFloat(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Gravity Multiplier */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Gravity Scale (g)</span>
                <span className="text-amber-400 tabular-nums">{gravity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.02"
                value={gravity}
                onChange={(e) => {
                  setGravity(parseFloat(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Reel Speed */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Reel-in Rate (dr/dt)</span>
                <span className="text-amber-400 tabular-nums">{reelSpeed.toFixed(1)} u/s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.2"
                value={reelSpeed}
                onChange={(e) => {
                  setReelSpeed(parseFloat(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Cable Damping */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Centrifugal Damping</span>
                <span className="text-amber-400 tabular-nums">{damping.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.940"
                max="0.999"
                step="0.002"
                value={damping}
                onChange={(e) => {
                  setDamping(parseFloat(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showVectors}
                onChange={(e) => {
                  sounds.playClick(620);
                  setShowVectors(e.target.checked);
                }}
                className="rounded accent-amber-400 bg-slate-800 border-slate-700"
              />
              <span>Velocity Vectors</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showTrajectory}
                onChange={(e) => {
                  sounds.playClick(620);
                  setShowTrajectory(e.target.checked);
                }}
                className="rounded accent-amber-400 bg-slate-800 border-slate-700"
              />
              <span>Trajectory Trail</span>
            </label>
          </div>

          {/* Technical Architecture Insight */}
          <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-sans text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-semibold block mb-0.5">Technical Implementation:</span>
            Sub-stepped Euler integration solves cable elasticity: <span className="font-mono text-slate-300">F = -k·(x - x₀) - c·v</span>.
            Centrifugal acceleration boosts player tangential escape angle upon cable release.
          </div>
        </div>
      </div>
    </div>
  );
};
