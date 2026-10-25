import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Send,
  Sliders,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth.ts';
import { getBoxBreathingState } from '../../utils/neuroMath.ts';
import { BiometricHealthSync } from '../BiometricHealthSync.tsx';

interface WellnessScreenProps {
  onEarnXp?: (amount: number) => void;
}

export const WellnessScreen: React.FC<WellnessScreenProps> = ({ onEarnXp }) => {
  // Live Biometric state from Wearable sync
  const [liveStress, setLiveStress] = useState<number>(7.0);
  const [liveStressState, setLiveStressState] = useState<string>('Elevated');
  const [liveHeartRate, setLiveHeartRate] = useState<number>(74);

  // Mood check-in state
  const [moodInput, setMoodInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<'Great' | 'Stressed' | 'Exhausted' | 'Overwhelmed'>('Stressed');
  const [moodLogs, setMoodLogs] = useState<string[]>([
    'Stressed - CS240 Algorithms prep overload',
  ]);

  // Box Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathElapsedSec, setBreathElapsedSec] = useState(0);

  // Soundscape state
  const [activeSoundtrack, setActiveSoundtrack] = useState<'Rain' | 'Lofi' | 'Beta'>('Rain');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(72);

  // Tactile mode
  const [tactileMode, setTactileMode] = useState<'Resonant Wave' | 'Cadence Ticks' | 'Coherence Pace'>('Resonant Wave');

  // Mindful break timer
  const [isMindfulBreakActive, setIsMindfulBreakActive] = useState(false);
  const [mindfulBreakSecLeft, setMindfulBreakSecLeft] = useState(300);

  // Breathing timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathElapsedSec((prev) => {
          const next = prev + 1;
          const current = getBoxBreathingState(next);
          // Play micro pulse at phase boundary
          if (next % 4 === 0) {
            soundEngine.playHapticPulse(current.phase === 'Inhale' ? 180 : 80, 80);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Mindful break timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMindfulBreakActive && mindfulBreakSecLeft > 0) {
      interval = setInterval(() => {
        setMindfulBreakSecLeft((prev) => {
          if (prev <= 1) {
            setIsMindfulBreakActive(false);
            onEarnXp?.(25);
            soundEngine.playHapticPulse(440, 300);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMindfulBreakActive, mindfulBreakSecLeft, onEarnXp]);

  const breathingState = getBoxBreathingState(breathElapsedSec);

  const toggleSoundscape = (track: 'Rain' | 'Lofi' | 'Beta') => {
    setActiveSoundtrack(track);
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      if (track === 'Rain') {
        soundEngine.startCampusRain(audioVolume / 1000);
      } else {
        soundEngine.startBinauralAlpha(432, 10, audioVolume / 1000);
      }
    } else if (activeSoundtrack === track) {
      setIsPlayingAudio(false);
      soundEngine.stopCampusRain();
      soundEngine.stopBinauralAlpha();
    } else {
      soundEngine.stopCampusRain();
      soundEngine.stopBinauralAlpha();
      if (track === 'Rain') {
        soundEngine.startCampusRain(audioVolume / 1000);
      } else {
        soundEngine.startBinauralAlpha(432, 10, audioVolume / 1000);
      }
    }
  };

  const handleTestPulse = () => {
    soundEngine.playHapticPulse(160, 150);
  };

  const handleAddMoodLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodInput.trim()) return;
    setMoodLogs([`${selectedMood} - ${moodInput.trim()}`, ...moodLogs]);
    setMoodInput('');
    soundEngine.playHapticPulse(200, 60);
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* Header title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span>Wellness Hub</span>
            <span className="text-pink-400">🧠</span>
          </h2>
          <p className="text-xs text-slate-400">
            Biometric load tracking & cognitive recovery
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            NEURAL STATE
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.3)]">
            ALPHA VORTEX
          </span>
        </div>
      </div>

      {/* Real-time Wearable Biometric Health Sync */}
      <BiometricHealthSync
        onStressChange={(stress, state) => {
          setLiveStress(stress);
          setLiveStressState(state);
        }}
        onHeartRateChange={(bpm) => {
          setLiveHeartRate(bpm);
        }}
      />

      {/* 1. Live Face-Mesh Telemetry (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Live Face-Mesh Telemetry
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            AI LIVE
          </span>
        </div>

        {/* Interactive Simulated Mesh Visualizer */}
        <div className="relative h-44 rounded-xl bg-[#090d16] border border-[#1b2538] flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle grid backdrop */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* HUD Top Left Stats */}
          <div className="absolute top-2.5 left-3 text-[10px] font-mono space-y-0.5 text-left z-10">
            <div className="text-slate-400">
              MICRO-EXPR: <span className="text-cyan-300 font-semibold">CORRUGATOR +14%</span>
            </div>
            <div className="text-rose-400 font-semibold">
              BLINK FREQ: 28/MIN (ELEVATED)
            </div>
          </div>

          {/* Animated Face Wireframe */}
          <svg className="w-40 h-32 relative z-0" viewBox="0 0 160 120">
            {/* Outer Head Contour */}
            <path
              d="M 40 40 Q 80 15 120 40 Q 130 85 80 115 Q 30 85 40 40 Z"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-40 animate-pulse"
            />
            {/* Forehead Points */}
            <circle cx="80" cy="30" r="2.5" fill="#4cd7f6" />
            <circle cx="60" cy="35" r="2" fill="#06b6d4" />
            <circle cx="100" cy="35" r="2" fill="#06b6d4" />

            {/* Eyebrows */}
            <path d="M 50 45 Q 65 42 75 46" fill="none" stroke="#4cd7f6" strokeWidth="1.5" />
            <path d="M 85 46 Q 95 42 110 45" fill="none" stroke="#4cd7f6" strokeWidth="1.5" />

            {/* Eyes */}
            <circle cx="63" cy="52" r="3" fill="#4cd7f6" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="97" cy="52" r="3" fill="#4cd7f6" className="animate-ping" style={{ animationDuration: '3s' }} />

            {/* Nose Bridge */}
            <path d="M 80 50 L 80 72 L 75 76 L 85 76" fill="none" stroke="#06b6d4" strokeWidth="1" />

            {/* Mouth / Smile Line */}
            <path d="M 64 90 Q 80 96 96 90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

            {/* Mesh triangulation nodes */}
            <line x1="60" y1="35" x2="80" y2="50" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="100" y1="35" x2="80" y2="50" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="63" y1="52" x2="80" y2="72" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="97" y1="52" x2="80" y2="72" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="80" y1="76" x2="64" y2="90" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="80" y1="76" x2="96" y2="90" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
          </svg>

          {/* HUD Bottom Info */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>MESH: 468 PTS</span>
            <span>FPS: 30</span>
          </div>
        </div>

        {/* Cognitive Overload Pattern Alert */}
        <div className="mt-3 bg-[#172033] border border-[#2d3d5e] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Stressed / Fatigued detected</p>
              <p className="text-[11px] text-slate-400">Cognitive overload pattern recognized</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-1 rounded-lg">
            82% CONF
          </span>
        </div>

        {/* Manual Check-in Form */}
        <div className="mt-4 pt-3 border-t border-[#232f46]">
          <p className="text-xs text-slate-300 font-medium mb-2">
            Manual check-in: How are you feeling right now?
          </p>
          <form onSubmit={handleAddMoodLog} className="flex items-center gap-2 mb-2.5">
            <input
              type="text"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="Type thoughts or select mood pill..."
              className="flex-1 bg-[#0d121c] border border-[#27354d] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mood Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Great', emoji: '😊', label: 'Great' },
              { id: 'Stressed', emoji: '😰', label: 'Stressed' },
              { id: 'Exhausted', emoji: '🥱', label: 'Exhausted' },
              { id: 'Overwhelmed', emoji: '🗂️', label: 'Overwhelmed' },
            ].map((pill) => {
              const isSelected = selectedMood === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setSelectedMood(pill.id as typeof selectedMood);
                    soundEngine.playHapticPulse(150, 40);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                      : 'bg-[#151d2c] border-[#293850] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{pill.emoji}</span>
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Composite Stress Metric (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${liveStress <= 3 ? 'text-emerald-400' : liveStress <= 6 ? 'text-amber-400' : 'text-rose-400'}`} />
            <h3 className="font-heading font-bold text-sm text-white">
              Composite Stress Metric
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              HR: {liveHeartRate} BPM
            </span>
            <span className={`text-xs font-semibold ${liveStress <= 3 ? 'text-emerald-400' : liveStress <= 6 ? 'text-amber-400' : 'text-rose-400'}`}>
              {liveStressState}
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-heading font-extrabold text-white">
              Level {liveStress.toFixed(1)}
            </span>
            <span className="text-sm text-slate-400">/ 10</span>
          </div>
          <span className={`text-xs font-medium flex items-center gap-0.5 ${liveStress >= 6 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {liveStress >= 6 ? '↗ +1.8 vs yesterday' : '↘ -1.2 vs baseline'}
          </span>
        </div>

        {/* Tri-color gauge bar */}
        <div className="h-2.5 w-full bg-[#1c263a] rounded-full overflow-hidden flex relative">
          <div className="w-3/10 bg-emerald-500/40" />
          <div className="w-3/10 bg-amber-500/40" />
          <div className="w-4/10 bg-rose-500/60" />
          {/* Active pointer indicator */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_10px_#ffffff] transition-all duration-300"
            style={{ left: `${Math.min(96, Math.max(2, (liveStress / 10) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
          <span className={liveStress <= 3 ? 'text-emerald-400 font-semibold' : ''}>Relaxed (1-3)</span>
          <span className={liveStress > 3 && liveStress <= 6 ? 'text-amber-400 font-semibold' : ''}>Optimal (4-6)</span>
          <span className={liveStress > 6 ? 'text-rose-400 font-semibold' : ''}>High Load (7-10)</span>
        </div>
      </div>

      {/* 3. Remedial Protocols: Interactive Box Breathing (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Remedial Protocols
            </h3>
          </div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
            AI RECOMMENDATION
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                PARASYMPATHETIC RESET
              </span>
              <span className="text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                BLE HAPTICS
              </span>
            </div>
            <h4 className="font-heading font-bold text-base text-white">
              Interactive Box Breathing
            </h4>
            <p className="text-xs text-slate-400">
              4s Inhale • 4s Hold • 4s Exhale • 4s Pause
            </p>
          </div>

          <button
            onClick={() => {
              const nextState = !isBreathingActive;
              setIsBreathingActive(nextState);
              soundEngine.playHapticPulse(nextState ? 220 : 120, 80);
            }}
            aria-label={isBreathingActive ? "Pause breathing" : "Start breathing"}
            className="w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-cyan-500/25 active:scale-95"
          >
            {isBreathingActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
        </div>

        {/* Connected BLE Device Pill */}
        <div className="bg-[#161f31] border border-[#263753] rounded-xl p-2.5 flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Nordic nRF52 / Apple Watch</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">BLE 5.2 Tactile Pacer</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            SYNCED
          </span>
        </div>

        {/* Animated Breathing Circle */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer animated halo ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-cyan-400/40 transition-all duration-1000 ${
                isBreathingActive ? 'scale-110 opacity-80' : 'scale-100 opacity-30'
              }`}
              style={{
                boxShadow: isBreathingActive ? '0 0 32px rgba(6, 182, 212, 0.4)' : 'none',
              }}
            />

            {/* Core Circular HUD */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#121c2d] to-[#18263e] border border-cyan-400/60 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {isBreathingActive ? breathingState.phase : 'READY'}
              </span>
              <span className="text-2xl font-heading font-extrabold text-white">
                {isBreathingActive ? `${breathingState.phaseSecondsLeft}s` : '4s'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 font-medium text-center max-w-xs">
            {isBreathingActive
              ? breathingState.guidanceText
              : 'Press Start to initiate 4-4-4-4 vagal tone stabilization sequence'}
          </p>

          <p className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-1 font-mono">
            <span>♡ Target: Lower HRV by 8 bpm & Cortisol stabilization</span>
          </p>
        </div>

        {/* 4-Phase Tactile Haptic Protocol Cards */}
        <div className="mt-2 pt-3 border-t border-[#232f46]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">4-Phase Tactile Haptic Protocol</span>
            <span className="text-[10px] font-mono">Motor Frequency Mapped</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border transition-colors ${
              breathingState.phase === 'Inhale' && isBreathingActive
                ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#151d2c] border-[#24334b]'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300">↗ Inhale (4s)</span>
                <span className="text-[10px] font-mono text-slate-400">40→180 Hz</span>
              </div>
              <p className="text-[11px] text-slate-400">Rising swell tactile ramp</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              breathingState.phase === 'Hold (In)' && isBreathingActive
                ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#151d2c] border-[#24334b]'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-violet-300">⏸ Hold (4s)</span>
                <span className="text-[10px] font-mono text-slate-400">1 pulse/s</span>
              </div>
              <p className="text-[11px] text-slate-400">Steady micro-tick pulse cadence</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              breathingState.phase === 'Exhale' && isBreathingActive
                ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#151d2c] border-[#24334b]'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-300">↘ Exhale (4s)</span>
                <span className="text-[10px] font-mono text-slate-400">180→30 Hz</span>
              </div>
              <p className="text-[11px] text-slate-400">Smooth resonant release wave</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              breathingState.phase === 'Pause (Rest)' && isBreathingActive
                ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#151d2c] border-[#24334b]'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-300">☾ Pause (4s)</span>
                <span className="text-[10px] font-mono text-slate-400">0 Hz (Rest)</span>
              </div>
              <p className="text-[11px] text-slate-400">Stillness / quiet haptic baseline</p>
            </div>
          </div>
        </div>

        {/* Tactile Feedback Mode switcher & Test Pulse */}
        <div className="mt-3 bg-[#151e2e] border border-[#273752] rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Tactile Feedback Mode
            </span>
            <span className="text-[10px] font-mono">Linear Resonant Actuator</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {[
              { id: 'Resonant Wave', label: 'Resonant Wave', sub: 'Active Mode' },
              { id: 'Cadence Ticks', label: 'Cadence Ticks', sub: '1Hz Metronome' },
              { id: 'Coherence Pace', label: 'Coherence P...', sub: 'Vagal Tone Sync' },
            ].map((mode) => {
              const isSelected = tactileMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setTactileMode(mode.id as typeof tactileMode);
                    soundEngine.playHapticPulse(140, 50);
                  }}
                  className={`p-2 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-[#101724] border-[#223048] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{mode.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{mode.sub}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-cyan-400">☊</span>
              <span>Haptic Output: <strong>High (85%)</strong></span>
            </div>
            <button
              onClick={handleTestPulse}
              className="px-3 py-1.5 rounded-lg bg-[#1e2a42] hover:bg-[#273859] text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Pulse</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Binaural Soundscape Player (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Binaural Soundscape Player
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            • 432Hz Mode
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { id: 'Rain', title: 'Rain on Campus', sub: 'Pink Noise' },
            { id: 'Lofi', title: 'Lo-fi Study', sub: '64 BPM Calm' },
            { id: 'Beta', title: 'Beta Waves', sub: '14Hz Focus' },
          ].map((track) => {
            const isSelected = activeSoundtrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => toggleSoundscape(track.id as 'Rain' | 'Lofi' | 'Beta')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#151e2e] border-[#25354e] text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-bold leading-tight truncate">{track.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{track.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Current track bar & scrubber */}
        <div className="bg-[#151e2e] border border-[#263753] rounded-xl p-3 flex items-center justify-between gap-3">
          <button
            onClick={() => toggleSoundscape(activeSoundtrack)}
            className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-white">Campus Quad Shower</span>
              <span className="text-[11px] font-mono text-slate-400">{audioVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={audioVolume}
              onChange={(e) => setAudioVolume(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-[#233148] rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio) {
                setIsPlayingAudio(false);
                soundEngine.stopCampusRain();
                soundEngine.stopBinauralAlpha();
              }
            }}
            className="text-slate-400 hover:text-white"
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 5. 5-Min Mindful Break (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">5-Min Mindful Break</span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                +25 XP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isMindfulBreakActive
                ? `Break in progress: ${Math.floor(mindfulBreakSecLeft / 60)}:${(mindfulBreakSecLeft % 60).toString().padStart(2, '0')}`
                : 'Step away from screens to reboot working memory'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsMindfulBreakActive(!isMindfulBreakActive);
            soundEngine.playHapticPulse(260, 80);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>{isMindfulBreakActive ? 'Pause' : 'Start'}</span>
          <Clock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Weekly Equilibrium Trend (Image 7) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">
              Weekly Equilibrium Trend
            </h3>
            <p className="text-xs text-slate-400">Stress load vs. Relaxation index</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-slate-300 text-[11px]">Stress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 text-[11px]">Relax</span>
            </div>
          </div>
        </div>

        {/* Dynamic Curved SVG Chart */}
        <div className="h-32 w-full pt-2">
          <svg className="w-full h-full" viewBox="0 0 320 100" preserveAspectRatio="none">
            {/* Horizontal guide lines */}
            <line x1="0" y1="25" x2="320" y2="25" stroke="#233148" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="320" y2="50" stroke="#233148" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="75" x2="320" y2="75" stroke="#233148" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* Stress line (Violet/Pink) */}
            <path
              d="M 10 70 Q 60 70 110 65 T 210 68 T 260 30 T 310 40"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            {/* Relax line (Emerald) */}
            <path
              d="M 10 45 Q 60 48 110 50 T 210 50 T 260 85 T 310 75"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Endpoint dots */}
            <circle cx="310" cy="40" r="4" fill="#a855f7" />
            <circle cx="310" cy="75" r="4" fill="#10b981" />
          </svg>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span className="text-cyan-400 font-bold">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
