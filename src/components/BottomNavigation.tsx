import React from 'react';
import { ScreenType } from '../types/index.ts';
import { Home, HeartPulse, CheckSquare, CreditCard, Users, Bot, Award, Briefcase, GraduationCap } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
}


export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeScreen,
  setActiveScreen,
}) => {
  const navItems: { id: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'smart-campus', label: 'CGC Campus', icon: GraduationCap },
    { id: 'wellness', label: 'Wellness', icon: HeartPulse },
    { id: 'planner', label: 'Planner', icon: CheckSquare },
    { id: 'finance', label: 'Finance', icon: CreditCard },
  ];


  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/85 backdrop-blur-xl border-t border-[#334155]/40 py-2 px-3 flex items-center justify-around max-w-md mx-auto"
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] relative transition-all duration-200 ${
              isActive ? 'text-[#06b6d4]' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
            aria-label={item.label}
          >
            <div className="relative">
              <Icon className="w-5 h-5 transition-transform duration-200" />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
              )}
            </div>
            <span
              className={`text-[11px] mt-1 font-medium tracking-tight ${
                isActive ? 'text-[#06b6d4] font-semibold' : 'text-[#64748b]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Quick switcher to extra screens: Copilot, Career, Leaderboard */}
      <div className="flex items-center gap-1 border-l border-[#334155]/40 pl-2">
        <button
          onClick={() => setActiveScreen(activeScreen === 'copilot' ? 'home' : 'copilot')}
          aria-label="AI Copilot"
          title="AI Copilot"
          className={`p-2 rounded-xl transition-colors ${
            activeScreen === 'copilot'
              ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-[#64748b] hover:text-cyan-400'
          }`}
        >
          <Bot className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveScreen(activeScreen === 'community' ? 'home' : 'community')}
          aria-label="Peer Community"
          title="Peer Community"
          className={`p-2 rounded-xl transition-colors ${
            activeScreen === 'community'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-[#64748b] hover:text-cyan-400'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveScreen(activeScreen === 'career' ? 'home' : 'career')}
          aria-label="AI Career Accelerator"
          title="AI Career Accelerator"
          className={`p-2 rounded-xl transition-colors ${
            activeScreen === 'career'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-[#64748b] hover:text-cyan-400'
          }`}
        >
          <Briefcase className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveScreen(activeScreen === 'leaderboard' ? 'home' : 'leaderboard')}
          aria-label="Leaderboard & Synergy"
          title="Leaderboard & Synergy"
          className={`p-2 rounded-xl transition-colors ${
            activeScreen === 'leaderboard'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-[#64748b] hover:text-cyan-400'
          }`}
        >
          <Award className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
