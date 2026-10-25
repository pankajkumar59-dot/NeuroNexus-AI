import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  RotateCcw,
  Upload,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth.ts';

export const CareerScreen: React.FC = () => {
  const [atsScore, setAtsScore] = useState(89);
  const [isRescanning, setIsRescanning] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');

  const handleRescan = () => {
    setIsRescanning(true);
    soundEngine.playHapticPulse(200, 60);
    setTimeout(() => {
      setIsRescanning(false);
      setAtsScore(93);
      confetti();
    }, 1200);
  };

  const handleLaunchLab = () => {
    soundEngine.playHapticPulse(250, 80);
    alert('Launching Interactive Lab: Distributed Inference with Docker & vLLM container!');
  };

  const handleOptimizeResume = () => {
    soundEngine.playHapticPulse(300, 100);
    setShowOptimizeModal(true);
    setOptimizedText(
      'Optimized Bullet Added:\n"• Engineered distributed inference pipeline on Kubernetes with TensorRT-LLM, cutting P99 latency by 62% (120ms → 46ms) across 4x A100 nodes."'
    );
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Cognitive Career Engine Header (Image 17) */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            COGNITIVE CAREER ENGINE
          </span>
          <h2 className="text-xl font-heading font-extrabold text-white">
            AI Career Accelerator
          </h2>
        </div>
        <span className="text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sync Active
        </span>
      </div>

      {/* Target Role & GPA Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold bg-[#172133] border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
          Target: ML / Full-Stack Engineer
        </span>
        <span className="text-xs font-semibold bg-[#172133] border border-violet-500/30 text-violet-300 px-3 py-1 rounded-lg">
          🎓 GPA 3.91 • Tier 1 Match
        </span>
      </div>

      {/* 2. ATS Compatibility Audit (Image 17) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">ATS Compatibility Audit</h3>
          </div>
          <button
            onClick={handleRescan}
            disabled={isRescanning}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin' : ''}`} />
            <span>{isRescanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>
        </div>

        {/* File Card */}
        <div className="bg-[#151e2e] border border-dashed border-[#293b58] rounded-xl p-3 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
              PDF
            </div>
            <div>
              <p className="text-xs font-bold text-white">Aravind_Resume_v3.pdf</p>
              <p className="text-[11px] text-slate-400">240 KB • Parsed via Gemini Pro</p>
            </div>
          </div>
          <button
            onClick={handleRescan}
            className="p-2 rounded-lg bg-[#1a2538] text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* Score & Metrics Progress Bars */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#121c2d] to-[#18263e] border border-cyan-400/50 flex flex-col items-center justify-center text-center shadow-lg flex-shrink-0">
            <span className="text-3xl font-heading font-extrabold text-cyan-300">{atsScore}</span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase mt-0.5">ATS Ready</span>
            <span className="text-[9px] text-slate-400">Top 7% of cohort</span>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Keywords Match</span>
                <span className="font-mono font-bold text-cyan-400">92%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[92%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Layout & Formatting</span>
                <span className="font-mono font-bold text-cyan-400">95%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Impact Metrics & ROI</span>
                <span className="font-mono font-bold text-violet-400">78%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full w-[78%]" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Parse Insights */}
        <div className="pt-3 border-t border-[#232f46] space-y-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            AI PARSE INSIGHTS
          </span>

          <div className="bg-[#172033] border border-[#273752] rounded-xl p-2.5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-snug">
              Add quantified ML pipeline latency benchmarks (e.g. &quot;Reduced inference from 120ms to 40ms&quot;).
            </p>
          </div>

          <div className="bg-[#172033] border border-[#273752] rounded-xl p-2.5 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-snug">
              Missing <strong className="text-cyan-300">Docker</strong> / <strong className="text-cyan-300">Kubernetes</strong> in top Skills cloud.
            </p>
          </div>

          <div className="bg-[#172033] border border-[#273752] rounded-xl p-2.5 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-snug">
              Strong action verbs detected: &quot;Engineered&quot;, &quot;Orchestrated&quot;, &quot;Benchmarked&quot;.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Skills Gap Matrix (Image 17) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Skills Gap Matrix</h3>
            <p className="text-[11px] text-slate-400">Live Industry Demand vs GitHub & Coursework</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            Live Sync
          </span>
        </div>

        <div className="space-y-3">
          {/* Skill 1 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                Python & PyTorch <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <span className="text-emerald-400 font-mono font-bold">95% • Mastered</span>
            </div>
            <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[95%]" />
            </div>
          </div>

          {/* Skill 2 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-white">Vector Databases & RAG</span>
              <span className="text-cyan-400 font-mono font-bold">80% • Competitive</span>
            </div>
            <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full w-[80%]" />
            </div>
          </div>

          {/* Skill 3 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-white">Distributed Systems</span>
              <span className="text-violet-400 font-mono font-bold">60% • In Progress</span>
            </div>
            <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
              <div className="h-full bg-violet-400 rounded-full w-[60%]" />
            </div>
          </div>

          {/* Skill 4 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-white">Kubernetes & CI/CD •</span>
              <span className="text-rose-400 font-mono font-bold">45% • Gap Detected</span>
            </div>
            <div className="h-1.5 w-full bg-[#1b2538] rounded-full overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full w-[45%]" />
            </div>
          </div>
        </div>

        {/* Recommended Action Card */}
        <div className="mt-4 bg-[#162033] border border-[#2a3c5c] rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-0.5">
              Recommended Remediation Action
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              Take <strong className="text-white">4h Micro-Module: Distributed Inference</strong> to bridge Docker & Kubernetes gaps and gain <strong className="text-emerald-400">+12% role readiness</strong>.
            </p>
            <button
              onClick={handleLaunchLab}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold mt-2 flex items-center gap-1"
            >
              <span>Launch interactive lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Predictive Career Path (Image 17) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="mb-3">
          <h3 className="font-heading font-bold text-sm text-white">Predictive Career Path</h3>
          <p className="text-[11px] text-slate-400">Calibrated on 14,000+ Alumni Trajectories</p>
        </div>

        <div className="relative pl-6 space-y-4 border-l border-[#27354d] ml-2">
          {/* Milestone 1 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-4 border-[#121826]" />
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-emerald-400 font-mono font-bold">SUMMER 2025 • TARGET</span>
              <span className="text-slate-400 font-mono text-[11px]">Q2 Target</span>
            </div>
            <h4 className="text-sm font-bold text-white">Applied AI Engineering Intern</h4>
            <p className="text-xs text-slate-400">Focus on LLM quantizations, TensorRT deployment, and production endpoints.</p>
          </div>

          {/* Milestone 2 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-4 border-[#121826]" />
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-cyan-400 font-mono font-bold">FALL 2025 • ACADEMIC</span>
              <span className="text-slate-400 font-mono text-[11px]">Q4 Target</span>
            </div>
            <h4 className="text-sm font-bold text-white">Capstone Research Paper</h4>
            <p className="text-xs text-slate-400">Autonomous agent graph planning with multimodal memory indexing.</p>
          </div>

          {/* Milestone 3 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-violet-400 border-4 border-[#121826]" />
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-violet-400 font-mono font-bold">POST-GRAD 2026 • DESTINATION</span>
              <span className="text-emerald-400 font-mono font-bold">$145k Avg Base</span>
            </div>
            <h4 className="text-sm font-bold text-white">Full-Time Cloud AI Systems Engineer</h4>
            <p className="text-xs text-slate-400">Top target hiring hubs: SF Bay Area, Seattle, Remote Tier-1.</p>
          </div>
        </div>

        {/* Accelerators Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#232f46] text-xs">
          <div className="bg-[#151e2e] border border-[#273752] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-cyan-400 block mb-1">
              HACKATHON PROMPT
            </span>
            <p className="text-xs font-semibold text-white mb-2 leading-tight">
              Build a low-latency RAG agent with Rust &...
            </p>
            <span className="text-cyan-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:underline">
              View Brief <ExternalLink className="w-3 h-3" />
            </span>
          </div>

          <div className="bg-[#151e2e] border border-[#273752] rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">
              ALUMNI MENTOR
            </span>
            <p className="text-xs font-semibold text-white mb-2 leading-tight">
              Elena Rostova <span className="text-slate-400 block font-normal">Staff ML at ScaleAI (&apos;22)</span>
            </p>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:underline">
              Request Intro <MessageSquare className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 5. Big Bottom Button: Optimize Resume with Local AI (Image 17) */}
      <button
        onClick={handleOptimizeResume}
        className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
        style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 20px -2px rgba(6, 182, 212, 0.4)',
        }}
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Optimize Resume with Local AI</span>
      </button>

      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Zero cloud egress • Local private model inference</span>
      </p>

      {/* Modal for Optimize Resume result */}
      {showOptimizeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-cyan-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-heading font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Local AI Resume Optimization
            </h3>
            <div className="bg-[#0b0f19] border border-[#273752] rounded-xl p-3 text-xs text-cyan-300 font-mono whitespace-pre-line mb-4">
              {optimizedText}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowOptimizeModal(false);
                  setAtsScore(96);
                  confetti();
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Apply To Master Resume
              </button>
              <button
                onClick={() => setShowOptimizeModal(false)}
                className="px-4 py-2 rounded-xl bg-[#172033] text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
