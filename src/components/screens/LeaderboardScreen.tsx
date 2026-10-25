import React, { useState } from 'react';
import { LeaderboardStudent } from '../../types/index.ts';
import {
  Award,
  Zap,
  Clock,
  Shield,
  Share2,
  Swords,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth.ts';

interface LeaderboardScreenProps {
  students: LeaderboardStudent[];
  weeklyXp: number;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  students,
  weeklyXp,
}) => {
  const [activeTab, setActiveTab] = useState<'Campus Global' | 'CS Dept' | 'My Cohort'>('Campus Global');
  const [challengePeerName, setChallengePeerName] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleChallenge = () => {
    soundEngine.playHapticPulse(300, 80);
    setChallengePeerName('CyberPanda #109');
  };

  const handleShareMaskedCard = () => {
    soundEngine.playHapticPulse(200, 50);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Season & League Division Header (Image 13) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-[#172238] border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Season 4: Neuro-Championship</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            3 days left
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              CURRENT LEAGUE DIVISION
            </span>
            <h2 className="text-2xl font-heading font-extrabold text-white">
              Diamond Scholar
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex flex-col items-center justify-center text-cyan-300 shadow-inner">
            <span className="text-lg">💎</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">Tier IV</span>
          </div>
        </div>

        {/* Division Promotion Cutoff */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Division Promotion Cutoff</span>
            <span className="font-mono font-bold text-white">
              {weeklyXp.toLocaleString()} / 16,000 XP <span className="text-cyan-400 font-normal">(Top 2%)</span>
            </span>
          </div>
          <div className="h-2 w-full bg-[#1b2538] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
              style={{ width: `${Math.min(100, (weeklyXp / 16000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Weekly Synergy XP (Image 13) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✦</span>
            <h3 className="font-heading font-bold text-sm text-white">Weekly Synergy XP</h3>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            1.25x Active Boost!
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Combined Aggregate Score</span>
            <span className="text-3xl font-heading font-extrabold text-cyan-300">
              {weeklyXp.toLocaleString()}{' '}
              <span className="text-sm font-mono text-slate-400 font-normal">XP</span>
            </span>
          </div>

          <div className="bg-[#162136] border border-[#263753] rounded-xl px-3 py-2 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Campus Standing</span>
            <span className="text-sm font-bold text-cyan-400 flex items-center gap-1 font-mono">
              🏅 #3 Rank
            </span>
          </div>
        </div>

        {/* 3 Categories: Focus, Finance, Wellness */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-[#151e2e] border border-[#25354e] rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400">Focus XP</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <p className="text-base font-bold text-white font-mono">5,400</p>
            <p className="text-[10px] text-slate-400 mt-0.5">28h Pomodoro</p>
          </div>

          <div className="bg-[#151e2e] border border-[#25354e] rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400">Finance XP</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-base font-bold text-white font-mono">4,650</p>
            <p className="text-[10px] text-slate-400 mt-0.5">14d Goal Streak</p>
          </div>

          <div className="bg-[#151e2e] border border-[#25354e] rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400">Wellness XP</span>
              <span className="w-2 h-2 rounded-full bg-violet-400" />
            </div>
            <p className="text-base font-bold text-white font-mono">4,800</p>
            <p className="text-[10px] text-slate-400 mt-0.5">92% HRV Coh.</p>
          </div>
        </div>
      </div>

      {/* 3. League Standings & Leaderboard Table (Image 13) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-white">League Standings</h3>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Zero-Knowledge IDs
          </span>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 bg-[#0f1422] p-1 rounded-xl mb-4 border border-[#24334c]">
          {(['Campus Global', 'CS Dept', 'My Cohort'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  soundEngine.playHapticPulse(150, 40);
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Student Rows */}
        <div className="space-y-2">
          {students.map((student) => {
            const isCurrent = student.isCurrentUser;
            return (
              <div
                key={student.rank}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#17253d] to-[#121c2d] border-cyan-400/60 shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#151e2e] border-[#25354e]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        student.rank === 1
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : student.rank === 2
                          ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                          : student.rank === 3
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-[#1b2538] text-slate-400'
                      }`}
                    >
                      {student.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{student.name}</span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            student.tier === 'Diamond'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {student.tier}
                        </span>
                      </div>
                      {student.subtext && (
                        <p className="text-[11px] text-cyan-400 font-medium">{student.subtext}</p>
                      )}
                      {student.velocity && (
                        <p className="text-[11px] text-slate-400 font-mono">Velocity: {student.velocity}</p>
                      )}
                      {(student.streakFocus || student.streakFinance) && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-2">
                          {student.streakFocus && <span>🔥 {student.streakFocus}</span>}
                          {student.streakFinance && <span>💎 {student.streakFinance}</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {isCurrent && (
                      <span className="text-[9px] font-bold bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded uppercase tracking-wider block mb-0.5">
                        YOUR POSITION
                      </span>
                    )}
                    <span className="text-base font-heading font-extrabold text-white font-mono">
                      {student.xp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. League Milestones & Perks (Image 13) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-white">
            League Milestones & Perks
          </h3>
          <span className="text-xs font-mono font-bold text-cyan-400">Stage 4 / 5</span>
        </div>

        {/* Milestone Steps */}
        <div className="flex items-center justify-between px-2 py-2 mb-4 relative">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#25354e] -translate-y-1/2 z-0" />
          {[
            { label: 'Bronze', completed: true },
            { label: 'Silver', completed: true },
            { label: 'Gold', completed: true },
            { label: 'Diamond', current: true },
            { label: 'GM', locked: true },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.completed
                    ? 'bg-emerald-500 text-slate-950'
                    : step.current
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#06b6d4]'
                    : 'bg-[#1b2538] text-slate-500 border border-[#2c3d59]'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : step.current ? (
                  '💎'
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${step.current ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Next Grandmaster Unlocks Box */}
        <div className="bg-[#151e2e] border border-[#273752] rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              NEXT GRANDMASTER UNLOCKS
            </span>
            <span className="text-[10px] font-mono text-slate-400">Unlocks at 16,000 XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101724] border border-[#223048] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎨</span>
              <div>
                <p className="font-bold text-white">Cyber Aurora Desk Theme</p>
                <p className="text-[11px] text-slate-400">Smart ambient IoT light sync for st...</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101724] border border-[#223048] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">☕</span>
              <div>
                <p className="font-bold text-white">Campus Cafe 15% Voucher</p>
                <p className="text-[11px] text-slate-400">Redeemable at Engineering Library...</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* 5. Action Buttons (Image 13) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleChallenge}
          className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.99]"
        >
          <Swords className="w-4 h-4" />
          <span>Challenge Peer</span>
        </button>

        <button
          onClick={handleShareMaskedCard}
          className="py-3 px-4 rounded-xl bg-[#172033] hover:bg-[#1f2b44] border border-[#2b3c59] text-white font-heading font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Masked Card'}</span>
        </button>
      </div>

      {/* Challenge Peer Confirmation */}
      {challengePeerName && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-cyan-400/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-center">
            <Swords className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h4 className="font-heading font-bold text-base text-white mb-1">
              Challenge Sent to {challengePeerName}!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              A 25-minute Pomodoro duel has been scheduled. First to complete with zero tab distraction gains +150 Synergy XP!
            </p>
            <button
              onClick={() => {
                setChallengePeerName(null);
                confetti();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Ready to Focus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
