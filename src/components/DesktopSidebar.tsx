import React from 'react';
import { ScreenType } from '../types/index.ts';
import {
  LayoutDashboard,
  HeartPulse,
  BookOpen,
  CreditCard,
  Briefcase,
  Award,
  Users,
  Cpu,
  Radio,
  Settings,
  Sparkles,
} from 'lucide-react';

interface DesktopSidebarProps {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeScreen,
  setActiveScreen,
}) => {
  const menuItems: {
    id: ScreenType;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    badgeDot?: boolean;
  }[] = [
    { id: 'home', label: 'Dashboard Hub', icon: LayoutDashboard },
    { id: 'wellness', label: 'Wellness & HRV', icon: HeartPulse, badge: '68ms' },
    { id: 'planner', label: 'Study & IoT Control', icon: BookOpen, badgeDot: true },
    { id: 'finance', label: 'Student Finance', icon: CreditCard },
    { id: 'career', label: 'AI Career & ATS', icon: Briefcase, badge: '89/100' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award, badge: '#3' },
    { id: 'community', label: 'Peer Community', icon: Users },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0c101c] border-r border-[#1f293d] flex flex-col justify-between p-4 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/20 border border-cyan-400/40 flex items-center justify-center">
              <span className="text-cyan-300 font-bold text-xs tracking-tighter">NX+</span>
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c101c]" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-white text-base tracking-tight">
              NeuroNexus+
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              EDGE NODE ACTIVE
            </p>
          </div>
        </div>

        {/* AI Study Co-Pilot Action Button */}
        <button
          onClick={() => setActiveScreen('copilot')}
          className="w-full mb-6 py-3 px-4 rounded-xl font-heading font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 18px -2px rgba(6, 182, 212, 0.35)',
          }}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>AI Study Co-Pilot</span>
        </button>

        {/* Nav list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#182030] text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131926]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                        item.badge.includes('#')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badgeDot && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                  )}
                  {isActive && (
                    <span className="w-1.5 h-4 rounded-full bg-cyan-400 ml-1.5" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Edge Telemetry & Hardware status */}
      <div className="pt-4 border-t border-[#1f293d]/80 space-y-3">
        <div className="bg-[#121724] border border-[#232d42] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Local NPU</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-semibold">
            4.2 TOPS • 28°C
          </span>
        </div>

        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edge Telemetry</span>
          </div>
          <div className="hover:text-slate-200 cursor-pointer">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </aside>
  );
};
