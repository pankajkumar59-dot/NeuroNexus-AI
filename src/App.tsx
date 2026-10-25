import React, { useState, useEffect } from 'react';
import { ScreenType, StudyTask, ExpenseItem, LeaderboardStudent, CommunityThread, ChatMessage, DeskLampConfig } from './types/index.ts';
import {
  initialTasks,
  initialDeskLamp,
  initialExpenses,
  initialLeaderboard,
  initialCommunityThreads,
  initialChatMessages,
} from './data/seedData.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { DesktopSidebar } from './components/DesktopSidebar.tsx';
import { DesktopCopilotDock } from './components/DesktopCopilotDock.tsx';
import { HomeScreen } from './components/screens/HomeScreen.tsx';
import { WellnessScreen } from './components/screens/WellnessScreen.tsx';
import { PlannerScreen } from './components/screens/PlannerScreen.tsx';
import { FinanceScreen } from './components/screens/FinanceScreen.tsx';
import { CareerScreen } from './components/screens/CareerScreen.tsx';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen.tsx';
import { CommunityScreen } from './components/screens/CommunityScreen.tsx';
import { CopilotScreen } from './components/screens/CopilotScreen.tsx';
import { CosmicBackground, BackgroundTheme } from './components/CosmicBackground.tsx';
import { Smartphone, Monitor, Palette } from 'lucide-react';

export default function App() {
  // Check URL params for initial screen or mobile frame
  const searchParams = new URLSearchParams(window.location.search);
  const initialParamScreen = searchParams.get('screen') as ScreenType | null;

  const [activeScreen, setActiveScreen] = useState<ScreenType>(initialParamScreen || 'home');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('synapse');

  // Application State
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [deskLamp, setDeskLamp] = useState<DeskLampConfig>(initialDeskLamp);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [students, setStudents] = useState<LeaderboardStudent[]>(initialLeaderboard);
  const [threads, setThreads] = useState<CommunityThread[]>(initialCommunityThreads);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [streakDays, setStreakDays] = useState(12);
  const [cognitiveXp, setCognitiveXp] = useState(1450);
  const [selectedModel, setSelectedModel] = useState('LLaMA 2 7B');

  const handleEarnXp = (amount: number) => {
    setCognitiveXp((prev) => prev + amount);
    setStudents((prev) =>
      prev.map((s) => (s.isCurrentUser ? { ...s, xp: s.xp + amount } : s))
    );
  };

  const handleDockSendMessage = async (text: string) => {
    setActiveScreen('copilot');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || 'Synthesized answer ready.',
        timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${data.source || selectedModel}`,
        hasLoanCard: Boolean(data.hasLoanCard),
        loanDetails: data.loanDetails,
      };
      setChatMessages((prev) => [...prev, aiReply]);
    } catch {
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `Synthesized offline via ${selectedModel}: Processed query "${text}" with 0ms cloud egress.`,
        timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Local Edge NPU`,
      };
      setChatMessages((prev) => [...prev, aiReply]);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <HomeScreen
            setActiveScreen={setActiveScreen}
            tasks={tasks}
            deskLamp={deskLamp}
            streakDays={streakDays}
            cognitiveXp={cognitiveXp}
          />
        );
      case 'wellness':
        return <WellnessScreen onEarnXp={handleEarnXp} />;
      case 'planner':
        return (
          <PlannerScreen
            tasks={tasks}
            setTasks={setTasks}
            deskLamp={deskLamp}
            setDeskLamp={setDeskLamp}
            streakDays={streakDays}
            cognitiveXp={cognitiveXp}
            onEarnXp={handleEarnXp}
          />
        );
      case 'finance':
        return (
          <FinanceScreen
            expenses={expenses}
            setExpenses={setExpenses}
            onSyncLoanToChat={() => setActiveScreen('copilot')}
          />
        );
      case 'career':
        return <CareerScreen />;
      case 'leaderboard':
        return <LeaderboardScreen students={students} weeklyXp={14850} />;
      case 'community':
        return <CommunityScreen threads={threads} setThreads={setThreads} />;
      case 'copilot':
        return (
          <CopilotScreen
            messages={chatMessages}
            setMessages={setChatMessages}
            setActiveScreen={setActiveScreen}
            onSyncLoan={() => {
              // Mark synced
            }}
          />
        );
      default:
        return (
          <HomeScreen
            setActiveScreen={setActiveScreen}
            tasks={tasks}
            deskLamp={deskLamp}
            streakDays={streakDays}
            cognitiveXp={cognitiveXp}
          />
        );
    }
  };

  return (
    <div className="min-h-screen text-[#dfe2f1] flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Animated Cosmic Translucent Background */}
      <CosmicBackground theme={bgTheme} />

      {/* If Mobile Frame Mode is enabled */}
      {isMobileFrame ? (
        <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 bg-transparent">
          <div className="mb-3 flex items-center justify-between w-full max-w-md px-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Mobile Emulation Mode
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBgTheme(bgTheme === 'synapse' ? 'grid' : bgTheme === 'grid' ? 'aurora' : 'synapse')}
                title="Change cosmic background theme"
                className="text-[11px] flex items-center gap-1 text-slate-300 hover:text-cyan-400 bg-[#141b2a]/80 backdrop-blur-md border border-[#27354d] px-2.5 py-1 rounded-full font-medium"
              >
                <Palette className="w-3 h-3 text-cyan-400" />
                <span className="capitalize">{bgTheme}</span>
              </button>
              <button
                onClick={() => setIsMobileFrame(false)}
                className="text-xs flex items-center gap-1 text-slate-300 hover:text-white bg-[#141b2a]/80 backdrop-blur-md border border-[#27354d] px-3 py-1 rounded-full font-medium"
              >
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Workstation</span>
              </button>
            </div>
          </div>

          <div
            className="w-full max-w-md h-[844px] bg-[#0b0f19] rounded-[40px] border-[6px] border-[#1e273a] shadow-2xl flex flex-col overflow-hidden relative"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(6, 182, 212, 0.1)',
            }}
          >
            {/* Phone speaker / camera notch */}
            <div className="h-6 w-full bg-[#0b0f19] flex items-center justify-center pt-1 z-50">
              <div className="w-28 h-4 bg-[#1e273a] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#0b0f19] mr-2" />
                <div className="w-2 h-2 rounded-full bg-[#273752]" />
              </div>
            </div>

            <Navbar
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              isMobileFrame={isMobileFrame}
              setIsMobileFrame={setIsMobileFrame}
              onPostAnonClick={() => setActiveScreen('community')}
            />

            <main className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
              {renderScreen()}
            </main>

            <BottomNavigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          </div>
        </div>
      ) : (
        /* Full Desktop Workstation View (Matching Image 1 & Responsive) */
        <div className="flex-1 flex flex-row w-full min-h-screen">
          {/* Desktop Left Sidebar (Image 1) */}
          <div className="hidden lg:block">
            <DesktopSidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Navbar
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              isMobileFrame={isMobileFrame}
              setIsMobileFrame={setIsMobileFrame}
              onPostAnonClick={() => setActiveScreen('community')}
            />

            {/* Scrollable Center Content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 no-scrollbar">
              {renderScreen()}
            </main>

            {/* Desktop Copilot Prompt Dock (Image 1) */}
            <div className="hidden lg:block">
              <DesktopCopilotDock
                onSendMessage={handleDockSendMessage}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            </div>

            {/* Mobile Bottom Navigation (shown on screens < 1024px) */}
            <div className="lg:hidden">
              <BottomNavigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
