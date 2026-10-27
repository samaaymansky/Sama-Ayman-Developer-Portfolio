import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Shield, Swords, Zap, RefreshCw, Activity, Volume2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

type BossPhase = 'IDLE' | 'WINDUP' | 'ACTIVE' | 'RECOVERY' | 'STAGGERED';

export const CombatParrySandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tunable combat design sliders
  const [telegraphDuration, setTelegraphDuration] = useState<number>(600); // ms
  const [parryWindow, setParryWindow] = useState<number>(120); // ms (active parry frame window)
  const [hitStopDuration, setHitStopDuration] = useState<number>(64); // ms freeze-frame
  const [screenShake, setScreenShake] = useState<number>(0.6); // trauma scale

  // Combat status
  const [bossHp, setBossHp] = useState<number>(100);
  const [bossPoise, setBossPoise] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [combatLog, setCombatLog] = useState<string>('Combat simulation ready. Press Parry [F] or Dodge [Space].');
  const [parryCount, setParryCount] = useState<number>(0);
  const [lastParryDelta, setLastParryDelta] = useState<number | null>(null);

  // State refs for animation loop
  const stateRef = useRef({
    bossState: 'IDLE' as BossPhase,
    stateTimer: 0,
    bossX: 480,
    bossY: 260,
    playerX: 200,
    playerY: 260,
    playerAction: 'IDLE' as 'IDLE' | 'PARRY' | 'DODGE' | 'ATTACK',
    playerActionTimer: 0,
    parryStartTime: 0,
    dodgeStartTime: 0,
    attackType: 'HEAVY_OVERHEAD' as 'HEAVY_OVERHEAD' | 'RAPID_THRUST' | 'SPIN_SWEEP',
    hitStopUntil: 0,
    trauma: 0,
    shakeX: 0,
    shakeY: 0,
    sparks: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[]
  });

  const triggerShake = (amount: number) => {
    stateRef.current.trauma = Math.min(1, stateRef.current.trauma + amount * screenShake);
  };

  const handlePlayerParry = useCallback(() => {
    const s = stateRef.current;
    if (s.playerAction !== 'IDLE') return;

    s.playerAction = 'PARRY';
    s.playerActionTimer = 220; // 220ms total parry animation
    s.parryStartTime = performance.now();
    sounds.playClick(800);

    // Check timing against active strike window
    if (s.bossState === 'ACTIVE' || (s.bossState === 'WINDUP' && s.stateTimer <= parryWindow)) {
      // Perfect Parry!
      sounds.playParrySuccess();
      const delta = Math.round(s.stateTimer);
      setLastParryDelta(delta);
      setParryCount((prev) => prev + 1);
      setCombatLog(`PERFECT PARRY! Offset: ${delta}ms. Boss posture cracked!`);
      triggerShake(0.85);

      // Hit-stop freeze frame
      s.hitStopUntil = performance.now() + hitStopDuration;

      // Crack poise
      setBossPoise((prev) => {
        const next = Math.max(0, prev - 45);
        if (next === 0) {
          s.bossState = 'STAGGERED';
          s.stateTimer = 2200; // 2.2s vulnerability window
          setCombatLog('CRITICAL STAGGER! Boss is vulnerable to riposte strikes!');
        } else {
          s.bossState = 'RECOVERY';
          s.stateTimer = 500;
        }
        return next;
      });

      // Emit sparks
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 4 + Math.random() * 8;
        s.sparks.push({
          x: (s.bossX + s.playerX) / 2,
          y: s.bossY - 20,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1.0,
          color: '#f59e0b'
        });
      }
    }
  }, [parryWindow, hitStopDuration, screenShake]);

  const handlePlayerDodge = useCallback(() => {
    const s = stateRef.current;
    if (s.playerAction !== 'IDLE') return;

    s.playerAction = 'DODGE';
    s.playerActionTimer = 340; // 340ms roll i-frames
    s.dodgeStartTime = performance.now();
    sounds.playClick(400);
    setCombatLog('Dodge roll executed (Invulnerability frames active).');
  }, []);

  const handlePlayerAttack = useCallback(() => {
    const s = stateRef.current;
    if (s.playerAction !== 'IDLE') return;

    s.playerAction = 'ATTACK';
    s.playerActionTimer = 300;
    sounds.playClick(600);

    // If boss is staggered or in recovery, deal massive damage
    if (s.bossState === 'STAGGERED') {
      sounds.playHit();
      triggerShake(0.7);
      s.hitStopUntil = performance.now() + hitStopDuration * 1.5;
      setBossHp((prev) => Math.max(0, prev - 35));
      setCombatLog('RIPOSTE PUNISH! Dealt 35 critical damage to staggered boss.');
    } else if (s.bossState === 'RECOVERY') {
      sounds.playHit();
      setBossHp((prev) => Math.max(0, prev - 15));
      setCombatLog('Punish hit during boss recovery! Dealt 15 damage.');
    } else {
      setCombatLog('Glancing blow deflected by boss active stance.');
    }
  }, [hitStopDuration, screenShake]);

  const resetEncounter = () => {
    sounds.playClick(500);
    const s = stateRef.current;
    s.bossState = 'IDLE';
    s.stateTimer = 600;
    s.playerAction = 'IDLE';
    s.playerActionTimer = 0;
    s.sparks = [];
    setBossHp(100);
    setBossPoise(100);
    setPlayerHp(100);
    setLastParryDelta(null);
    setCombatLog('Boss encounter reset. Ready for attack cycle.');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        handlePlayerParry();
      } else if (e.key === ' ' || e.key === 'Shift') {
        e.preventDefault();
        handlePlayerDodge();
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        handlePlayerAttack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayerParry, handlePlayerDodge, handlePlayerAttack]);

  // Main Render & Combat Tick
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min(now - lastTime, 40);
      lastTime = now;

      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Hit-stop freeze check
      if (now < s.hitStopUntil) {
        // Freeze frame active, skip simulation tick but keep rendering
        return;
      }

      // Update Screen Shake Trauma decay
      if (s.trauma > 0) {
        s.trauma = Math.max(0, s.trauma - (dt / 1000) * 1.8);
        const shakeMag = s.trauma * s.trauma * 14;
        s.shakeX = (Math.random() * 2 - 1) * shakeMag;
        s.shakeY = (Math.random() * 2 - 1) * shakeMag;
      } else {
        s.shakeX = 0;
        s.shakeY = 0;
      }

      // Update Player Action Timer
      if (s.playerActionTimer > 0) {
        s.playerActionTimer -= dt;
        if (s.playerActionTimer <= 0) {
          s.playerAction = 'IDLE';
        }
      }

      // Update Boss State Machine
      s.stateTimer -= dt;

      if (s.bossState === 'IDLE') {
        if (s.stateTimer <= 0) {
          // Transition to Windup
          s.bossState = 'WINDUP';
          s.stateTimer = telegraphDuration;
          sounds.playClick(320);
        }
      } else if (s.bossState === 'WINDUP') {
        if (s.stateTimer <= 0) {
          // Windup complete -> ACTIVE SWEEP (90ms active strike)
          s.bossState = 'ACTIVE';
          s.stateTimer = 90;
          sounds.playClick(750);
        }
      } else if (s.bossState === 'ACTIVE') {
        if (s.stateTimer <= 0) {
          // Strike concluded without parry
          // Did player dodge?
          const isDodging = s.playerAction === 'DODGE';
          if (!isDodging) {
            // Player hit!
            sounds.playHit();
            triggerShake(0.65);
            setPlayerHp((prev) => Math.max(0, prev - 20));
            setCombatLog('HIT RECEIVED! 20 damage taken. Missing parry window.');
          } else {
            setCombatLog('DODGE SUCCESSFUL! Cleanly avoided the strike radius.');
          }

          s.bossState = 'RECOVERY';
          s.stateTimer = 700; // 700ms cooldown
        }
      } else if (s.bossState === 'RECOVERY') {
        if (s.stateTimer <= 0) {
          s.bossState = 'IDLE';
          s.stateTimer = 500 + Math.random() * 400; // Paced cadence
        }
      } else if (s.bossState === 'STAGGERED') {
        if (s.stateTimer <= 0) {
          // Poise resets
          setBossPoise(100);
          s.bossState = 'IDLE';
          s.stateTimer = 800;
          setCombatLog('Boss recovered poise composure.');
        }
      }

      // Slowly regenerate poise if not broken
      if (s.bossState === 'IDLE' && bossPoise < 100 && bossPoise > 0) {
        setBossPoise((prev) => Math.min(100, prev + (dt / 1000) * 12));
      }

      // Update Sparks
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const p = s.sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.life -= 0.035;
        if (p.life <= 0) {
          s.sparks.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      ctx.save();
      ctx.translate(s.shakeX, s.shakeY);

      ctx.fillStyle = '#080a0f';
      ctx.fillRect(-20, -20, width + 40, height + 40);

      // Arena Floor
      const groundY = 320;
      ctx.fillStyle = '#111827';
      ctx.fillRect(-20, groundY, width + 40, height - groundY + 40);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-20, groundY);
      ctx.lineTo(width + 20, groundY);
      ctx.stroke();

      // Draw Sparks
      for (const p of s.sparks) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Boss Telegraph Attack Arc (Dynamic visual warning)
      if (s.bossState === 'WINDUP') {
        const progress = 1 - Math.max(0, s.stateTimer) / telegraphDuration;
        ctx.beginPath();
        ctx.arc(s.bossX, s.bossY - 30, 80 + progress * 20, Math.PI * 0.75, Math.PI * 1.45);
        ctx.strokeStyle = progress > 0.8 ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 3 + progress * 4;
        ctx.stroke();

        // Telegraph Flash ring on weapon apex
        ctx.beginPath();
        ctx.arc(s.bossX - 70, s.bossY - 60, 10 + progress * 8, 0, Math.PI * 2);
        ctx.fillStyle = progress > 0.8 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)';
        ctx.fill();
      } else if (s.bossState === 'ACTIVE') {
        // Red slash trail
        ctx.beginPath();
        ctx.moveTo(s.bossX - 40, s.bossY - 80);
        ctx.quadraticCurveTo(s.playerX + 40, s.bossY - 10, s.playerX - 20, s.bossY + 20);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      // 1. Draw Player Character
      ctx.save();
      ctx.translate(s.playerX, s.playerY);

      // Player body
      ctx.beginPath();
      ctx.arc(0, -28, 16, 0, Math.PI * 2);
      ctx.fillStyle = s.playerAction === 'DODGE' ? '#38bdf8' : '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Player shield or blade position
      if (s.playerAction === 'PARRY') {
        // Glowing cyan/amber shield block pose
        ctx.beginPath();
        ctx.arc(22, -28, 26, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
      } else if (s.playerAction === 'ATTACK') {
        // Slash sword forward
        ctx.beginPath();
        ctx.moveTo(10, -25);
        ctx.lineTo(48, -25);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      ctx.restore();

      // 2. Draw Boss Automaton
      ctx.save();
      ctx.translate(s.bossX, s.bossY);

      // Boss Body (Heavy metallic sentinel)
      ctx.beginPath();
      ctx.arc(0, -45, 32, 0, Math.PI * 2);
      ctx.fillStyle =
        s.bossState === 'STAGGERED'
          ? '#475569'
          : s.bossState === 'WINDUP'
          ? '#991b1b'
          : s.bossState === 'ACTIVE'
          ? '#dc2626'
          : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = s.bossState === 'STAGGERED' ? '#94a3b8' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Boss Core Eye / Sensor
      ctx.beginPath();
      ctx.arc(-8, -48, 8, 0, Math.PI * 2);
      ctx.fillStyle = s.bossState === 'STAGGERED' ? '#64748b' : '#f87171';
      ctx.fill();

      // Boss Weapon / Greatblade
      ctx.save();
      if (s.bossState === 'WINDUP') {
        ctx.rotate(-0.8);
      } else if (s.bossState === 'ACTIVE') {
        ctx.rotate(0.9);
      } else if (s.bossState === 'STAGGERED') {
        ctx.rotate(1.4);
      }
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-60, -85, 18, 90);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(-60, -85, 18, 90);
      ctx.restore();

      ctx.restore();

      // Draw State Machine Tag above Boss
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`STATE: ${s.bossState}`, s.bossX - 45, s.bossY - 95);

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [telegraphDuration, parryWindow, hitStopDuration, screenShake, bossPoise]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Telegraphed Boss AI &amp; Parry Frame Data Sandbox</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Press [F] to Parry during active strike · [Space] to Dodge · [E] to Punish / Riposte
          </p>
        </div>

        {/* Live Boss Health & Poise Bar */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="w-32">
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>BOSS HP</span>
              <span className="text-white tabular-nums">{bossHp}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-150"
                style={{ width: `${bossHp}%` }}
              />
            </div>
          </div>

          <div className="w-32">
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>POSTURE / POISE</span>
              <span className="text-amber-400 tabular-nums">{Math.round(bossPoise)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-150"
                style={{ width: `${bossPoise}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Canvas Area */}
        <div className="lg:col-span-8 relative bg-[#080a0f] flex flex-col items-center justify-center p-2 min-h-[380px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={380}
            className="w-full h-auto rounded border border-slate-800/80 shadow-inner"
          />

          {/* Interactive Player Action Toolbar (Mobile & Mouse friendly) */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayerParry}
                className="px-3.5 py-2 text-xs font-mono font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded border border-cyan-400 shadow transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Parry [F]</span>
              </button>
              <button
                type="button"
                onClick={handlePlayerDodge}
                className="px-3.5 py-2 text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition-colors flex items-center gap-1.5"
              >
                <span>Dodge [Space]</span>
              </button>
              <button
                type="button"
                onClick={handlePlayerAttack}
                className="px-3.5 py-2 text-xs font-mono font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded border border-amber-300 transition-colors flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Riposte [E]</span>
              </button>
            </div>

            <button
              type="button"
              onClick={resetEncounter}
              className="p-2 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded transition-colors"
              title="Reset Boss Encounter"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status Combat Log */}
          <div className="absolute top-4 left-4 right-4 pointer-events-none">
            <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>{combatLog}</span>
              {lastParryDelta !== null && (
                <span className="text-emerald-400 font-bold ml-2 whitespace-nowrap">
                  Offset: +{lastParryDelta}ms
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Combat Design Tuner */}
        <div className="lg:col-span-4 bg-slate-950/70 p-5 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Frame Data Tuning</span>
            </span>
            <span>60Hz Normalized</span>
          </div>

          {/* Visual Frame Bar Timeline */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex justify-between">
              <span>Attack Phase Timeline</span>
              <span className="text-amber-400">Total: {telegraphDuration + 90 + 700}ms</span>
            </div>
            <div className="w-full h-5 bg-slate-900 rounded overflow-hidden flex text-[10px] font-mono font-bold leading-5 text-center">
              <div
                className="bg-amber-500/80 text-slate-950 truncate"
                style={{ width: `${(telegraphDuration / (telegraphDuration + 790)) * 100}%` }}
                title="Telegraph Windup"
              >
                Windup
              </div>
              <div
                className="bg-rose-500 text-white w-8 shrink-0"
                title="Active Hitbox"
              >
                Hit
              </div>
              <div
                className="bg-slate-700 text-slate-300 flex-1 truncate"
                title="Recovery Cooldown"
              >
                Recovery
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 font-mono text-xs">
            {/* Telegraph Duration */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Windup Telegraph</span>
                <span className="text-amber-400 tabular-nums">{telegraphDuration}ms</span>
              </div>
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={telegraphDuration}
                onChange={(e) => {
                  setTelegraphDuration(parseInt(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Parry Window */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Parry Leniency Window</span>
                <span className="text-amber-400 tabular-nums">{parryWindow}ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={parryWindow}
                onChange={(e) => {
                  setParryWindow(parseInt(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Souls (60ms)</span>
                <span>Action RPG (120ms)</span>
                <span>Casual (200ms)</span>
              </div>
            </div>

            {/* Hit-Stop Duration */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hit-Stop Freeze Frame</span>
                <span className="text-amber-400 tabular-nums">{hitStopDuration}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="8"
                value={hitStopDuration}
                onChange={(e) => {
                  setHitStopDuration(parseInt(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Camera Shake Trauma */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Impact Camera Trauma</span>
                <span className="text-amber-400 tabular-nums">{screenShake.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={screenShake}
                onChange={(e) => {
                  setScreenShake(parseFloat(e.target.value));
                  sounds.playSliderTick();
                }}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-sans text-slate-400 space-y-1">
            <div className="flex justify-between text-slate-300 font-mono">
              <span>Successful Parries:</span>
              <span className="text-emerald-400 font-bold tabular-nums">{parryCount}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Hit-stop temporarily dilates engine time scale to 0.05x on collision frame, allowing the eye to register weapon impact before releasing physics impulse vectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
