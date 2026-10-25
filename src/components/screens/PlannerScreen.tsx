import React, { useState, useEffect } from 'react';
import { StudyTask, DeskLampConfig } from '../../types/index.ts';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth.ts';

interface PlannerScreenProps {
  tasks: StudyTask[];
  setTasks: React.Dispatch<React.SetStateAction<StudyTask[]>>;
  deskLamp: DeskLampConfig;
  setDeskLamp: React.Dispatch<React.SetStateAction<DeskLampConfig>>;
  streakDays: number;
  cognitiveXp: number;
  onEarnXp: (amount: number) => void;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  tasks,
  setTasks,
  deskLamp,
  setDeskLamp,
  streakDays,
  cognitiveXp,
  onEarnXp,
}) => {
  // Timer State
  const [timerMode, setTimerMode] = useState<'25m' | '5m' | '15m'>('25m');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLampExpanded, setIsLampExpanded] = useState(true);

  // New task input state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('Today, 11:59 PM');
  const [newTaskTag, setNewTaskTag] = useState<'Urgent & Important (Do First)' | 'Scheduled' | 'Quick Wins'>(
    'Urgent & Important (Do First)'
  );

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEngine.stopBinauralAlpha();
            confetti();
            onEarnXp(timerMode === '25m' ? 100 : 25);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, timerMode, onEarnXp]);

  const handleModeChange = (mode: '25m' | '5m' | '15m') => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    soundEngine.stopBinauralAlpha();
    if (mode === '25m') setSecondsRemaining(25 * 60);
    else if (mode === '5m') setSecondsRemaining(5 * 60);
    else if (mode === '15m') setSecondsRemaining(15 * 60);
  };

  const handleToggleTimer = () => {
    const nextRunning = !isTimerRunning;
    setIsTimerRunning(nextRunning);
    soundEngine.playHapticPulse(nextRunning ? 260 : 120, 80);
    // Play binaural alpha wave during focus mode
    if (timerMode === '25m') {
      soundEngine.toggleBinaural(nextRunning);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    soundEngine.stopBinauralAlpha();
    if (timerMode === '25m') setSecondsRemaining(25 * 60);
    else if (modeMatches('5m')) setSecondsRemaining(5 * 60);
    else setSecondsRemaining(15 * 60);
  };

  const modeMatches = (m: string) => timerMode === m;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            soundEngine.playHapticPulse(300, 100);
            confetti();
            onEarnXp(t.xpReward);
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subtitle: 'Cognitive load scheduled by AI Co-pilot',
      tag: newTaskTag,
      dueDate: newTaskDue,
      xpReward: newTaskTag === 'Urgent & Important (Do First)' ? 120 : newTaskTag === 'Scheduled' ? 80 : 45,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    soundEngine.playHapticPulse(200, 50);
  };

  const totalDuration = timerMode === '25m' ? 25 * 60 : timerMode === '5m' ? 5 * 60 : 15 * 60;
  const progressRatio = (totalDuration - secondsRemaining) / totalDuration;
  const strokeDashoffset = 440 - 440 * progressRatio;

  const activeTaskCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Cognitive XP and Streak Banner (Image 5 & 11) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 bg-[#172238] border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{streakDays}-Day Streak</span>
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              COGNITIVE XP
            </span>
            <span className="text-sm font-mono font-bold text-white">
              <strong className="text-cyan-300">{cognitiveXp.toLocaleString()}</strong> / 2,000
            </span>
          </div>
        </div>

        <h3 className="text-xl font-heading font-extrabold text-white mb-2">
          Level 5 Focus Master
        </h3>

        {/* Level progress bar */}
        <div className="h-2 w-full bg-[#1b2538] rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round(((cognitiveXp - 1200) / 800) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>72% to Level 6 Neuro-Architect</span>
          <span className="text-cyan-400 font-medium">+550 XP needed</span>
        </div>
      </div>

      {/* 2. Pomodoro Deep Work Block Circular Timer (Image 5 & 11) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg flex flex-col items-center">
        {/* Preset Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
          <button
            onClick={() => handleModeChange('25m')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === '25m'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#172033] text-slate-300 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleModeChange('5m')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === '5m'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#172033] text-slate-300 hover:text-white'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => handleModeChange('15m')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === '15m'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#172033] text-slate-300 hover:text-white'
            }`}
          >
            15m Long Break
          </button>
        </div>

        {/* Circular Ring & Counter */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background track circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#1a2436"
              strokeWidth="6"
            />
            {/* Animated progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="6"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4cd7f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              DEEP WORK BLOCK
            </span>
            <span className="text-4xl font-heading font-extrabold text-white tracking-tight my-1">
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-[11px] font-medium text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Binaural Alpha Waves
            </span>
          </div>
        </div>

        {/* Controls: Start/Pause and Reset */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={handleToggleTimer}
            className="flex-1 py-3 px-4 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 18px -2px rgba(6, 182, 212, 0.35)',
            }}
          >
            {isTimerRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isTimerRunning ? 'Pause Focus' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleResetTimer}
            aria-label="Reset timer"
            className="w-12 h-12 rounded-xl bg-[#172033] hover:bg-[#1e2a44] border border-[#263753] text-slate-300 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Smart Desk Lamp IoT Control Card (Image 5 & Expanded in Image 11) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg relative"
              style={{
                backgroundColor: `${deskLamp.colorHex}20`,
                borderColor: `${deskLamp.colorHex}60`,
                boxShadow: deskLamp.isOn ? `0 0 16px ${deskLamp.colorHex}50` : 'none',
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: deskLamp.colorHex }} />
              {deskLamp.isOn && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#121826]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">Smart Desk Lamp</h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.2 rounded">
                  ESP32 / Pi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {deskLamp.isOn
                  ? `${deskLamp.colorName} (${deskLamp.colorHex}) - Focus Mode Triggered`
                  : 'Lighting Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLampExpanded(!isLampExpanded)}
              aria-label="Expand lamp configuration"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#172033]"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={deskLamp.isOn}
                onChange={() => {
                  setDeskLamp((prev) => ({ ...prev, isOn: !prev.isOn }));
                  soundEngine.playHapticPulse(180, 50);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1f2b40] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Expanded IoT controls matching Image 11 */}
        {isLampExpanded && (
          <div className="mt-3 pt-3 border-t border-[#232f46] space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span className="text-emerald-400">● ESP32-S3 Connected</span>
              <span>192.168.1.42</span>
              <span className="text-cyan-400 cursor-pointer hover:underline">BLE Configure &gt;</span>
            </div>

            {/* Circadian Auto-Sync */}
            <div className="bg-[#161f30] border border-[#273752] rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold text-slate-200">Circadian Auto-Sync</span>
                  <div className="text-[11px] text-slate-400">
                    3200K Melatonin Protection <span className="text-amber-400 font-medium">Golden Hour</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDeskLamp((p) => ({ ...p, circadianAutoSync: !p.circadianAutoSync }))}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  deskLamp.circadianAutoSync
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                ● Auto
              </button>
            </div>

            {/* Dual-Monitor ARGB Backlight */}
            <div className="bg-[#161f30] border border-[#273752] rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-slate-200">Dual-Monitor ARGB Backlight</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300">● Synced</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span className="bg-[#101724] px-2 py-0.5 rounded border border-[#24354f]">
                  Rainbow Wave (60 FPS)
                </span>
                <span className="font-mono">4.5s cycle</span>
              </div>
            </div>

            {/* Bedtime Wind-Down & Dawn Simulator */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#161f30] border border-[#273752] rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    Wind-Down
                  </span>
                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1 rounded">
                    Shield On
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  1800K Ultra-Warm Candle (11:30 PM, 30m fade)
                </p>
              </div>

              <div className="bg-[#161f30] border border-[#273752] rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-cyan-400" />
                    Dawn Sim
                  </span>
                  <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-400 px-1 rounded">
                    Armed
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  07:15 AM Sunrise (20m Ramp 1800K → 6500K)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. AI Task Backlog (Image 5 & 11) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">AI Task Backlog</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
            {activeTaskCount} Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Cognitive load sorted by urgency and peak focus windows
        </p>

        {/* Add task bar */}
        <form onSubmit={handleAddTask} className="bg-[#0f1422] border border-[#27354d] rounded-xl p-2.5 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add study task, problem set, or reading..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none mb-2"
          />
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1e2a3f]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {newTaskDue}
              </span>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#1c273c] hover:bg-[#253654] text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Flow</span>
            </button>
          </div>
        </form>

        {/* Task list matching mockups */}
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-[#0f1422]/60 border-[#1f293d] opacity-50'
                  : 'bg-[#151e2e] border-[#253650] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-500 hover:border-cyan-400'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        task.tag === 'Urgent & Important (Do First)'
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                          : task.tag === 'Scheduled'
                          ? 'bg-violet-950/70 text-violet-300 border border-violet-800/60'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {task.tag}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      +{task.xpReward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-0.5 font-mono">
                    🕒 {task.dueDate}
                  </p>
                  <h4 className={`text-sm font-bold text-white leading-snug ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{task.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
