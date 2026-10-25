import React, { useState } from 'react';
import { ScreenType, StudyTask, DeskLampConfig } from '../../types/index.ts';
import {
  Bot,
  Mic,
  Brain,
  Zap,
  BookOpen,
  DollarSign,
  Briefcase,
  Flame,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth.ts';

interface HomeScreenProps {
  setActiveScreen: (screen: ScreenType) => void;
  tasks: StudyTask[];
  deskLamp: DeskLampConfig;
  streakDays: number;
  cognitiveXp: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveScreen,
  tasks,
  deskLamp,
  streakDays,
  cognitiveXp,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const handleLaunchCopilot = () => {
    soundEngine.playHapticPulse(240, 80);
    setActiveScreen('copilot');
  };

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto">
      {/* Edge Node Status Strip */}
      <div className="bg-[#121826]/80 border border-[#27354d]/60 rounded-xl p-3 flex items-center justify-between text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Local Neural Engine Ready</span>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded font-mono">
            4.2 TOPS
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Airgapped Private</span>
        </div>
      </div>

      {/* Hero: Autonomous Student Agent (Matching Image 15) */}
      <div className="bg-gradient-to-b from-[#141b2a] to-[#0f1422] border border-[#26354f] rounded-2xl p-5 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
        {/* Subtle ambient lighting backdrop */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white tracking-tight">
                Autonomous Student Agent
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Edge NPU
                </span>
                <span className="text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Voice STT/TTS
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Zero-cloud study summaries, debt simulations & career coaching. Runs 100% locally on device without wifi dependency.
        </p>

        {/* Language selector chips */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400 font-medium">Languages:</span>
          {(['English', 'Hindi', 'Punjabi'] as const).map((lang) => {
            const labels = {
              English: 'English',
              Hindi: 'Hindi (हिंदी)',
              Punjabi: 'Punjabi (ਪੰਜਾਬੀ)',
            };
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  soundEngine.playHapticPulse(180, 50);
                  setSelectedLanguage(lang);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-[#121927] text-slate-400 border-[#26354f] hover:text-slate-200'
                }`}
              >
                {labels[lang]}
              </button>
            );
          })}
        </div>

        {/* Big CTA: Launch Multilingual AI Copilot */}
        <button
          onClick={handleLaunchCopilot}
          className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 20px -2px rgba(6, 182, 212, 0.4)',
          }}
        >
          <Mic className="w-4 h-4 text-white" />
          <span>Launch Multilingual AI Copilot</span>
        </button>
      </div>

      {/* Grid of Key Hub Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Focus & Streak Card */}
        <div
          onClick={() => setActiveScreen('planner')}
          className="bg-[#121826]/90 border border-[#27354d]/60 hover:border-violet-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-[#161e2f] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">
              Focus & Pomodoro
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
              <Flame className="w-3.5 h-3.5" />
              <span>{streakDays}d</span>
            </div>
          </div>
          <div className="text-xl font-heading font-bold text-white mb-1">
            25:00 Block
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{pendingTasksCount} tasks in backlog</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Wellness & HRV Card */}
        <div
          onClick={() => setActiveScreen('wellness')}
          className="bg-[#121826]/90 border border-[#27354d]/60 hover:border-cyan-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-[#161e2f] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              Wellness & HRV
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="text-xl font-heading font-bold text-white mb-1">
            ALPHA VORTEX
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Level 7/10 • Elevated</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Student Finance Hub Card */}
        <div
          onClick={() => setActiveScreen('finance')}
          className="bg-[#121826]/90 border border-[#27354d]/60 hover:border-emerald-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-[#161e2f] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Student Finance
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-medium">
              Safe Burn
            </span>
          </div>
          <div className="text-xl font-heading font-bold text-emerald-300 mb-1">
            $420.00 left
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>$14/day safe burn</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* AI Career & ATS Card */}
        <div
          onClick={() => setActiveScreen('career')}
          className="bg-[#121826]/90 border border-[#27354d]/60 hover:border-cyan-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-[#161e2f] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              ATS Accelerator
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
              89 / 100
            </span>
          </div>
          <div className="text-xl font-heading font-bold text-white mb-1">
            Top 7% Cohort
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Tier 1 ML Match</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Smart IoT Lamp Live Status */}
      <div className="bg-[#121826]/90 border border-[#27354d]/60 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
            style={{
              backgroundColor: `${deskLamp.colorHex}25`,
              borderColor: `${deskLamp.colorHex}60`,
              boxShadow: `0 0 16px ${deskLamp.colorHex}40`,
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: deskLamp.colorHex }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Smart Desk Lamp</span>
              <span className="text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded">
                ESP32 / Pi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {deskLamp.isOn ? `${deskLamp.colorName} (${deskLamp.colorHex}) • Focus Mode Active` : 'Lamp Standby'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('planner')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 rounded-lg bg-[#182133] border border-[#2b3b55]"
        >
          Configure
        </button>
      </div>

      {/* Cognitive XP & League Preview */}
      <div
        onClick={() => setActiveScreen('leaderboard')}
        className="bg-gradient-to-r from-[#141b2b] to-[#171f30] border border-[#2b3b57] rounded-xl p-3.5 cursor-pointer hover:border-cyan-500/40 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Diamond Scholar Tier IV</span>
              <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                #3 Rank
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {cognitiveXp.toLocaleString()} / 2,000 Cognitive XP (Top 2%)
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-cyan-400" />
      </div>
    </div>
  );
};
