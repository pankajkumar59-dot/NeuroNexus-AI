import React from 'react';
import { ScreenType } from '../types/index.ts';
import { Bell, ArrowLeft, Cpu, Smartphone, Monitor } from 'lucide-react';

interface NavbarProps {
  activeScreen: ScreenType;
  setActiveScreen: (s: ScreenType) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (m: boolean) => void;
  onPostAnonClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  isMobileFrame,
  setIsMobileFrame,
  onPostAnonClick,
}) => {
  const getScreenDetails = () => {
    switch (activeScreen) {
      case 'home':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Graviton 2025 • All Engines Online',
          badge: 'LIVE DEMO',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'wellness':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Biometric load tracking & cognitive recovery',
          badge: 'SYNCED',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
      case 'planner':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Study Planner & Focus',
          badge: 'ESP32 / Pi ACTIVE',
          badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        };
      case 'finance':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Student Finance Hub',
          badge: 'HEALTHY BURN',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'career':
        return {
          title: 'NeuroNexus+',
          subtitle: 'AI Career Accelerator',
          badge: 'CAREER SYNC',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
      case 'leaderboard':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Focus Aura: 98%',
          badge: 'DIAMOND IV',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
      case 'community':
        return {
          title: 'NeuroNexus+',
          subtitle: 'Student Community • 24 Live',
          badge: 'ENCRYPTED',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'smart-campus':
        return {
          title: 'CGC Smart Campus',
          subtitle: 'Jhanjeri, Mohali • Campus Life Connected',
          badge: 'CAMPUS ONLINE',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      case 'copilot':
        return {
          title: 'NeuroNexus Copilot',
          subtitle: 'Offline Mode • LLaMA 3.2 1B',
          badge: 'NPU READY',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
    }
  };


  const details = getScreenDetails();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-[#334155]/40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {activeScreen !== 'home' && (
          <button
            onClick={() => setActiveScreen('home')}
            aria-label="Back to home"
            className="w-8 h-8 rounded-full bg-[#171b26] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs tracking-tighter">NX</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0b0f19] animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-white text-base tracking-tight">
                {details.title}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[190px] sm:max-w-xs font-sans">
              {details.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle between mobile phone viewport frame and wide layout - only show on desktop workstation */}
        {!isMobileFrame && (
          <button
            onClick={() => setIsMobileFrame(true)}
            title="Switch to Mobile Phone Frame"
            aria-label="Toggle layout mode"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#171b26]/90 border border-[#334155]/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mobile Frame</span>
          </button>
        )}

        {activeScreen === 'community' && onPostAnonClick && (
          <button
            onClick={onPostAnonClick}
            className="text-xs bg-[#171b26] hover:bg-[#1e293b] text-cyan-400 border border-cyan-500/40 px-3 py-1.5 rounded-full font-medium transition-colors"
          >
            Post Anonymously
          </button>
        )}

        <div className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${details.badgeColor}`}>
          <Cpu className="w-3 h-3" />
          <span>{details.badge}</span>
        </div>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-[#171b26] border border-[#334155]/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>
      </div>
    </header>
  );
};
