import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScreenType } from '../../types/index.ts';
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  ShieldCheck,
  Zap,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowRight,
  CreditCard,
  Check,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth.ts';
import { generateLocalAiResponse } from '../../services/localAiEngine.ts';

interface CopilotScreenProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setActiveScreen: (s: ScreenType) => void;
  onSyncLoan?: () => void;
}

export const CopilotScreen: React.FC<CopilotScreenProps> = ({
  messages,
  setMessages,
  setActiveScreen,
  onSyncLoan,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [syncedState, setSyncedState] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    soundEngine.playHapticPulse(200, 50);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setIsTyping(false);
      soundEngine.playHapticPulse(250, 70);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || 'Answer synthesized.',
        timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${data.source || 'Gemini 3.8 Flash'} • Encrypted`,
        hasLoanCard: Boolean(data.hasLoanCard),
        loanDetails: data.loanDetails,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('API error, using local edge engine:', err);
      setIsTyping(false);

      // Instant local edge neural answer
      const localAnswer = generateLocalAiResponse(text);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: localAnswer.reply,
        timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${localAnswer.source} • Offline Mode`,
        hasLoanCard: localAnswer.hasLoanCard,
        loanDetails: localAnswer.loanDetails,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      soundEngine.playHapticPulse(300, 100);
    }
  };

  const handleSyncToFinance = () => {
    soundEngine.playHapticPulse(280, 80);
    setSyncedState(true);
    confetti();
    onSyncLoan?.();
    setTimeout(() => {
      setActiveScreen('finance');
    }, 1000);
  };

  const handleSetReminder = () => {
    soundEngine.playHapticPulse(200, 60);
    setReminderSet(true);
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto flex flex-col h-full">
      {/* 1. Offline Mode Badges (Image 9) */}
      <div className="space-y-2">
        <div className="bg-[#121826] border border-[#27354d] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">
              Offline Mode • <strong>LLaMA 3.2 1B (Microsoft AI Studio)</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            NPU Ready
          </span>
        </div>

        <div className="bg-[#10192b] border border-emerald-500/30 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px]">
              Running locally on device • 0ms latency • Zero data telemetry • Privacy Guaranteed
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        </div>
      </div>

      {/* 2. Suggested Prompt Pills (Image 9) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { label: '📚 Explain CS240 dynamic programming', prompt: 'Explain CS240 dynamic programming memoization vs tabulation' },
          { label: '💰 How can I save on student debt?', prompt: "Can you calculate how much I'll save if I pay $300/mo instead of $271 on my student loan?" },
          { label: '🎯 Prepare 25m Focus Block', prompt: 'Set up a high-focus study block for CS240 algorithms' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.prompt)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#151e2e] border border-[#263753] text-slate-300 hover:border-cyan-400 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Session Divider */}
      <div className="text-center my-1">
        <span className="text-[11px] font-mono text-slate-500">
          Today, 2:41 PM • Edge Session
        </span>
      </div>

      {/* 4. Chat Messages Transcript */}
      <div className="space-y-4 flex-1">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-end gap-2 max-w-[90%]">
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                    isAi
                      ? 'bg-[#141c2c] border border-[#263650] text-slate-200'
                      : 'bg-cyan-500 text-slate-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Loan Card (Image 9 exact match!) */}
                  {msg.hasLoanCard && msg.loanDetails && (
                    <div className="mt-3 bg-[#0d131f] border border-[#233148] rounded-xl p-3 space-y-3 text-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Loan Amortization Delta</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                          +${msg.loanDetails.extraPerMonth}/mo extra
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#121927] border border-[#1f2d42] p-2.5 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Interest Saved</span>
                          <span className="text-base font-bold text-cyan-400 font-mono">
                            ${msg.loanDetails.interestSaved.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">in interest charges</span>
                        </div>

                        <div className="bg-[#121927] border border-[#1f2d42] p-2.5 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Time Accelerated</span>
                          <span className="text-base font-bold text-cyan-400 font-mono">
                            {msg.loanDetails.monthsAccelerated} Mo.
                          </span>
                          <span className="text-[10px] text-slate-400 block">earlier debt freedom</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Would you like me to push this update to your Finance Hub?
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <button
                          onClick={handleSyncToFinance}
                          className="w-full py-2 px-3 rounded-lg font-heading font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-[0.99]"
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                          }}
                        >
                          {syncedState ? <Check className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          <span>{syncedState ? 'Synced to Finance Hub!' : 'Sync to Finance Hub'}</span>
                        </button>

                        <button
                          onClick={handleSetReminder}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#162033] hover:bg-[#1e2a42] border border-[#273752] text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{reminderSet ? 'Reminder Set for 1st of Month' : 'Set Reminder'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isAi && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      title="Read aloud"
                      className="mt-2 text-slate-400 hover:text-cyan-400 text-[10px] flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  )}
                </div>

                {!isAi && (
                  <div className="w-7 h-7 rounded-full bg-[#1d273a] border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0">
                    A
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Bot className="w-4 h-4 animate-spin" />
            <span>LLaMA 3.2 1B executing local tensor weights...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 5. Bottom Prompt Input Bar (Image 9) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-2.5 shadow-xl mt-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => soundEngine.playHapticPulse(180, 50)}
            className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-[#182236] transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => soundEngine.playHapticPulse(150, 40)}
            className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-[#182236] transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Copilot anything..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none px-2"
          />

          <button
            type="submit"
            aria-label="Send query"
            className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-colors shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-2 pt-2 mt-1 border-t border-[#1c273b]">
          <span>⚙ Microsoft AI Studio Offline Engine</span>
          <span>Device Memory: 2.1 GB</span>
        </div>
      </div>
    </div>
  );
};
