import React, { useState } from 'react';
import { ArrowUp, Mic, Volume2, AudioWaveform, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth.ts';

interface DesktopCopilotDockProps {
  onSendMessage: (text: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
}

export const DesktopCopilotDock: React.FC<DesktopCopilotDockProps> = ({
  onSendMessage,
  selectedModel,
  setSelectedModel,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleMicToggle = () => {
    soundEngine.playHapticPulse(320, 60);
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate speech input
      setTimeout(() => {
        setInputText("Can you calculate how much I'll save if I pay $300/mo instead of $271 on my student loan?");
        setIsListening(false);
      }, 1500);
    }
  };

  const models = ['LLaMA 2', 'GPT4All-J', 'LLaMA 3.2'];

  return (
    <div className="w-full bg-[#0d121e]/90 backdrop-blur-xl border-t border-[#1e273a] px-4 py-3 flex items-center justify-between gap-4">
      {/* Left Engine telemetry & Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#141b2a] border border-[#27354d] px-2.5 py-1.5 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">{selectedModel}</span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
            Q4_K_M
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 bg-[#141b2a] border border-[#27354d] px-2.5 py-1.5 rounded-lg text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">Airgapped (0ms Cloud)</span>
        </div>

        <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <span className="text-cyan-400 font-medium">42.4 t/s</span>
          <span>•</span>
          <span>3.8GB / 16GB</span>
        </div>

        {/* Engine switcher chips */}
        <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-[#222e44]">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                selectedModel.includes(model)
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Middle & Right Prompt Input bar */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask active Local Engine (${selectedModel})...`}
            className="w-full bg-[#131a29] border border-[#283750] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
          {isListening && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-cyan-400 animate-pulse font-mono">
              Listening...
            </span>
          )}
        </div>

        <button
          type="submit"
          aria-label="Send message"
          className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-colors shadow-md shadow-cyan-500/20"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleMicToggle}
          aria-label="Voice input"
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
            isListening
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
              : 'bg-[#141b2a] border-[#27354d] text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => soundEngine.startBinauralAlpha(432, 10, 0.05)}
          aria-label="Listen preview"
          title="Play 432Hz Binaural preview"
          className="w-9 h-9 rounded-xl bg-[#141b2a] border border-[#27354d] text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => soundEngine.playHapticPulse(150, 100)}
          aria-label="Haptic pulse test"
          title="Test Haptic Pulse"
          className="w-9 h-9 rounded-xl bg-[#141b2a] border border-[#27354d] text-slate-400 hover:text-violet-400 flex items-center justify-center transition-colors"
        >
          <AudioWaveform className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
