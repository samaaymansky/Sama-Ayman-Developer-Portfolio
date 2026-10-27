import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sliders, Sparkles, RefreshCw, Zap, Gauge, HeartHandshake } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const GameFeelWorkshop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tunable 3C Variables
  const [coyoteTime, setCoyoteTime] = useState<number>(140); // ms
  const [jumpBuffer, setJumpBuffer] = useState<number>(120); // ms
  const [jumpVelocity, setJumpVelocity] = useState<number>(11.5);
  const [gravity, setGravity] = useState<number>(0.55);
  const [variableJumpCut, setVariableJumpCut] = useState<boolean>(true);
  const [apexHangTime, setApexHangTime] = useState<boolean>(true);

  // Telemetry
  const [feedbackLog, setFeedbackLog] = useState<string>('Use A/D or Arrows to run, Space/W to jump!');
  const [coyoteTriggeredCount, setCoyoteTriggeredCount] = useState<number>(0);
  const [bufferTriggeredCount, setBufferTriggeredCount] = useState<number>(0);

  // State refs
  const stateRef = useRef({
    x: 100,
    y: 240,
    vx: 0,
    vy: 0,
    width: 22,
    height: 32,
    isGrounded: false,
    wasGrounded: false,
    lastTimeGrounded: 0,
    lastJumpInputTime: 0,
    jumpHeld: false,
    keys: { left: false, right: false, jump: false },
    platforms: [
      { x: 40, y: 280, w: 200, h: 16 },
      { x: 300, y: 220, w: 160, h: 16 },
      { x: 520, y: 170, w: 160, h: 16 },
      { x: 200, y: 120, w: 140, h: 16 }
    ],
    dustParticles: [] as { x: number; y: number; vx: number; vy: number; life: number }[]
  });

  const applyPreset = (preset: 'celeste' | 'stiff' | 'floaty') => {
    sounds.playClick(720);
    if (preset === 'celeste') {
      setCoyoteTime(140);
      setJumpBuffer(130);
      setJumpVelocity(11.5);
      setGravity(0.58);
      setVariableJumpCut(true);
      setApexHangTime(true);
      setFeedbackLog('Preset: Responsive "Celeste-style" tight 3C feel.');
    } else if (preset === 'stiff') {
      setCoyoteTime(0);
      setJumpBuffer(0);
      setJumpVelocity(10.0);
      setGravity(0.65);
      setVariableJumpCut(false);
      setApexHangTime(false);
      setFeedbackLog('Preset: Retro Stiff (0ms Coyote, 0ms Buffer, static jump height).');
    } else if (preset === 'floaty') {
      setCoyoteTime(200);
      setJumpBuffer(180);
      setJumpVelocity(8.5);
      setGravity(0.28);
      setVariableJumpCut(true);
      setApexHangTime(true);
      setFeedbackLog('Preset: Floaty Dreamy platformer feel.');
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') s.keys.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') s.keys.right = true;
      if (e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        s.keys.jump = true;
        s.jumpHeld = true;
        s.lastJumpInputTime = performance.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') s.keys.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') s.keys.right = false;
      if (e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        s.keys.jump = false;
        s.jumpHeld = false;
        // Variable Jump Cut: cut upward velocity if released before apex
        if (variableJumpCut && s.vy < -2.0) {
          s.vy *= 0.45;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [variableJumpCut]);

  // Main Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const floorY = height - 30;

      // 1. Horizontal Acceleration
      const accel = s.isGrounded ? 0.9 : 0.6;
      const maxSpd = 6.2;
      if (s.keys.left) s.vx = Math.max(-maxSpd, s.vx - accel);
      else if (s.keys.right) s.vx = Math.min(maxSpd, s.vx + accel);
      else s.vx *= s.isGrounded ? 0.78 : 0.94; // Deceleration friction

      // 2. Vertical Physics & Apex Hang Time
      let effectiveGravity = gravity;
      if (apexHangTime && Math.abs(s.vy) < 1.8 && !s.isGrounded) {
        effectiveGravity *= 0.5; // brief apex hang
      }
      s.vy += effectiveGravity;

      // 3. Jump Buffer & Coyote Time Decision Logic
      const timeSinceGrounded = now - s.lastTimeGrounded;
      const timeSinceJumpPressed = now - s.lastJumpInputTime;

      const canCoyoteJump = timeSinceGrounded <= coyoteTime;
      const hasBufferedJump = timeSinceJumpPressed <= jumpBuffer;

      if (hasBufferedJump && (s.isGrounded || canCoyoteJump)) {
        // Execute Jump!
        s.vy = -jumpVelocity;
        s.isGrounded = false;
        s.lastTimeGrounded = 0; // Consume coyote
        s.lastJumpInputTime = 0; // Consume buffer
        sounds.playJump();

        if (timeSinceGrounded > 16 && canCoyoteJump) {
          setCoyoteTriggeredCount((c) => c + 1);
          setFeedbackLog(`Coyote Jump saved player! (${Math.round(timeSinceGrounded)}ms after ledge)`);
        } else {
          setFeedbackLog('Clean Ground Jump triggered.');
        }

        // Emit dust particles
        for (let i = 0; i < 8; i++) {
          s.dustParticles.push({
            x: s.x + s.width / 2 + (Math.random() * 12 - 6),
            y: s.y + s.height,
            vx: (Math.random() * 2 - 1) * 2,
            vy: -Math.random() * 1.5,
            life: 1.0
          });
        }
      }

      // 4. Integrate Position
      s.x += s.vx;
      s.y += s.vy;

      // 5. Collision Checks
      s.wasGrounded = s.isGrounded;
      s.isGrounded = false;

      // Floor Collision
      if (s.y + s.height >= floorY) {
        s.y = floorY - s.height;
        s.vy = 0;
        s.isGrounded = true;
      }

      // Platform Collisions (One-way jump-through platforms)
      for (const plat of s.platforms) {
        const prevBottom = s.y + s.height - s.vy;
        if (
          s.x + s.width > plat.x &&
          s.x < plat.x + plat.w &&
          s.y + s.height >= plat.y &&
          prevBottom <= plat.y + 4 &&
          s.vy >= 0
        ) {
          s.y = plat.y - s.height;
          s.vy = 0;
          s.isGrounded = true;
        }
      }

      // Track Coyote timestamp when leaving ground
      if (s.isGrounded) {
        s.lastTimeGrounded = now;
        if (!s.wasGrounded && s.vy >= 0) {
          sounds.playLand();
          // Check if buffered jump waiting
          if (timeSinceJumpPressed <= jumpBuffer) {
            setBufferTriggeredCount((b) => b + 1);
          }
        }
      }

      // Screen boundary clamps
      if (s.x < 10) {
        s.x = 10;
        s.vx = 0;
      } else if (s.x + s.width > width - 10) {
        s.x = width - 10 - s.width;
        s.vx = 0;
      }

      // Update Dust Particles
      for (let i = s.dustParticles.length - 1; i >= 0; i--) {
        const p = s.dustParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) s.dustParticles.splice(i, 1);
      }

      // ---------------- RENDER ----------------
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, width, height);

      // Grid backdrop
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Floor
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, floorY, width, height - floorY);
      ctx.strokeStyle = '#374151';
      ctx.strokeRect(0, floorY, width, 2);

      // Platforms
      for (const plat of s.platforms) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);

        // Visual platform lip
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(plat.x, plat.y, plat.w, 2);
      }

      // Dust particles
      for (const p of s.dustParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.life})`;
        ctx.fill();
      }

      // Player Character (Dynamic capsule with squash & stretch)
      ctx.save();
      const centerX = s.x + s.width / 2;
      const centerY = s.y + s.height / 2;
      ctx.translate(centerX, centerY);

      // Squash and stretch scale calculation
      let sx = 1;
      let sy = 1;
      if (Math.abs(s.vy) > 2) {
        sy = 1.15;
        sx = 0.88;
      } else if (s.isGrounded && Math.abs(s.vx) > 0.5) {
        sx = 1.05;
        sy = 0.95;
      }
      ctx.scale(sx, sy);

      // Body Capsule
      ctx.fillStyle = s.isGrounded ? '#f59e0b' : '#38bdf8';
      ctx.fillRect(-s.width / 2, -s.height / 2, s.width, s.height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-s.width / 2, -s.height / 2, s.width, s.height);

      // Eyes facing direction
      const facingDir = s.vx >= 0 ? 1 : -1;
      ctx.fillStyle = '#090b0e';
      ctx.fillRect(facingDir * 3, -8, 4, 6);

      ctx.restore();

      // Coyote indicator halo above player if within coyote window
      if (!s.isGrounded && canCoyoteJump) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x + s.width / 2, s.y - 8, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [coyoteTime, jumpBuffer, jumpVelocity, gravity, variableJumpCut, apexHangTime]);

  return (
    <section id="feel-lab" className="py-20 md:py-28 border-b border-slate-800/80 bg-[#090b0e] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <span>Character, Camera, Controller</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Interactive 3C Feel Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
              The Anatomy of Responsive Game Feel
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              "Feel" isn&apos;t magic—it is precise latency calibration. Experience how Coyote Time
              (ledge forgiveness) and Jump Buffering prevent perceived missed inputs.
            </p>
          </div>

          {/* Profile Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => applyPreset('celeste')}
              className="px-3 py-1.5 text-xs font-mono rounded bg-amber-400 text-slate-950 font-bold transition-colors whitespace-nowrap"
            >
              Celeste Crisp
            </button>
            <button
              type="button"
              onClick={() => applyPreset('stiff')}
              className="px-3 py-1.5 text-xs font-mono rounded text-slate-400 hover:text-white bg-transparent transition-colors whitespace-nowrap"
            >
              Retro Stiff (0ms)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('floaty')}
              className="px-3 py-1.5 text-xs font-mono rounded text-slate-400 hover:text-white bg-transparent transition-colors whitespace-nowrap"
            >
              Floaty Casual
            </button>
          </div>
        </div>

        {/* Lab Component Stage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Platformer Canvas */}
          <div className="lg:col-span-8 bg-[#080a0f] p-4 flex flex-col items-center justify-center relative min-h-[380px]">
            <canvas
              ref={canvasRef}
              width={720}
              height={380}
              className="w-full h-auto rounded border border-slate-800 shadow-inner"
            />

            {/* Dynamic Status Strip */}
            <div className="absolute top-6 left-6 right-6 pointer-events-none flex items-center justify-between text-xs font-mono">
              <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded text-slate-200">
                {feedbackLog}
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded text-amber-400">
                  Coyote Saves: <strong className="tabular-nums">{coyoteTriggeredCount}</strong>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded text-cyan-400">
                  Buffer Saves: <strong className="tabular-nums">{bufferTriggeredCount}</strong>
                </div>
              </div>
            </div>

            {/* Quick Touch Controls (Mobile Friendly) */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onPointerDown={() => {
                  stateRef.current.keys.left = true;
                }}
                onPointerUp={() => {
                  stateRef.current.keys.left = false;
                }}
                className="w-10 h-10 bg-slate-900 border border-slate-700 rounded text-white flex items-center justify-center font-bold"
              >
                ◀
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  stateRef.current.keys.right = true;
                }}
                onPointerUp={() => {
                  stateRef.current.keys.right = false;
                }}
                className="w-10 h-10 bg-slate-900 border border-slate-700 rounded text-white flex items-center justify-center font-bold"
              >
                ▶
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  stateRef.current.keys.jump = true;
                  stateRef.current.jumpHeld = true;
                  stateRef.current.lastJumpInputTime = performance.now();
                }}
                onPointerUp={() => {
                  stateRef.current.keys.jump = false;
                  stateRef.current.jumpHeld = false;
                  if (variableJumpCut && stateRef.current.vy < -2.0) {
                    stateRef.current.vy *= 0.45;
                  }
                }}
                className="w-16 h-10 bg-amber-400 text-slate-950 font-bold rounded flex items-center justify-center"
              >
                JUMP
              </button>
            </div>
          </div>

          {/* 3C Parameters Tuner */}
          <div className="lg:col-span-4 bg-slate-950/70 p-6 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>3C Feel Variables</span>
              </span>
              <span>Sub-Frame Input</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Coyote Time */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Coyote Time Leniency</span>
                  <span className="text-amber-400 tabular-nums">{coyoteTime}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="10"
                  value={coyoteTime}
                  onChange={(e) => {
                    setCoyoteTime(parseInt(e.target.value));
                    sounds.playSliderTick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Allows jump execution after leaving ledge.</span>
              </div>

              {/* Jump Buffering */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Jump Input Buffer</span>
                  <span className="text-amber-400 tabular-nums">{jumpBuffer}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={jumpBuffer}
                  onChange={(e) => {
                    setJumpBuffer(parseInt(e.target.value));
                    sounds.playSliderTick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Executes jump upon touch-down if pressed early.</span>
              </div>

              {/* Gravity */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Fall Gravity Scale</span>
                  <span className="text-amber-400 tabular-nums">{gravity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="0.95"
                  step="0.05"
                  value={gravity}
                  onChange={(e) => {
                    setGravity(parseFloat(e.target.value));
                    sounds.playSliderTick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={variableJumpCut}
                    onChange={(e) => {
                      sounds.playClick(620);
                      setVariableJumpCut(e.target.checked);
                    }}
                    className="rounded accent-amber-400 bg-slate-800 border-slate-700"
                  />
                  <span>Variable Jump Height (Tap vs Hold)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={apexHangTime}
                    onChange={(e) => {
                      sounds.playClick(620);
                      setApexHangTime(e.target.checked);
                    }}
                    className="rounded accent-amber-400 bg-slate-800 border-slate-700"
                  />
                  <span>Apex Hang Time (Gravity Dilution at Peak)</span>
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-sans text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-0.5 font-semibold">Designer Takeaway:</strong>
              Humans experience an average ~150ms cognitive-motor lag. Without input buffering and coyote leniency, players falsely blame the physics engine for eaten inputs.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
