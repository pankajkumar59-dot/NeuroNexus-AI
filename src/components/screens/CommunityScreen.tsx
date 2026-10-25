import React, { useState } from 'react';
import { CommunityThread } from '../../types/index.ts';
import {
  Users,
  Send,
  Flame,
  Bookmark,
  MessageSquare,
  Sparkles,
  Heart,
  Lightbulb,
  Rocket,
  MapPin,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth.ts';

interface CommunityScreenProps {
  threads: CommunityThread[];
  setThreads: React.Dispatch<React.SetStateAction<CommunityThread[]>>;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  threads,
  setThreads,
}) => {
  const [activeTag, setActiveTag] = useState<string>('#All');
  const [newPostContent, setNewPostContent] = useState('');
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [joinedTables, setJoinedTables] = useState<Record<string, boolean>>({});

  const filterTags = ['#All', '#Exams', '#MentalHealth', '#BudgetHacks', '#StudyGroups'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newThread: CommunityThread = {
      id: `c-${Date.now()}`,
      author: 'GhostScholar #42 (You)',
      timeAgo: 'Just now',
      content: newPostContent.trim(),
      tags: [activeTag === '#All' ? '#Exams' : activeTag],
      likes: 1,
      supports: 0,
      comments: 0,
      userLiked: true,
    };

    setThreads([newThread, ...threads]);
    setNewPostContent('');
    soundEngine.playHapticPulse(250, 60);
    confetti();
  };

  const handleLike = (id: string) => {
    soundEngine.playHapticPulse(180, 40);
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const wasLiked = t.userLiked;
          return {
            ...t,
            userLiked: !wasLiked,
            likes: wasLiked ? t.likes - 1 : t.likes + 1,
          };
        }
        return t;
      })
    );
  };

  const handleToggleSave = (id: string) => {
    soundEngine.playHapticPulse(150, 40);
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleJoinTable = (id: string) => {
    soundEngine.playHapticPulse(280, 80);
    setJoinedTables((prev) => ({ ...prev, [id]: true }));
    confetti();
  };

  const filteredThreads = threads.filter((t) => {
    if (activeTag === '#All') return true;
    return t.tags.includes(activeTag);
  });

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Header with Live Active Indicator (Image 3) */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400">🌐</span>
            <span>Student Community</span>
          </h2>
          <p className="text-xs text-slate-400">Decentralized anonymous student exchange</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#142033] border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>⚡ Live • 24 active</span>
        </div>
      </div>

      {/* 2. Anonymous Posting Bar (Image 3) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-xs">
              🧠
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">GhostScholar #42</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Encrypted
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="flex items-center gap-2">
          <input
            type="text"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Post anonymously as GhostScholar #42..."
            className="flex-1 bg-[#0d121c] border border-[#263753] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            aria-label="Send anonymous post"
            className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-colors shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Quote of the Day (Image 3) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            QUOTE OF THE DAY
          </span>
          <span className="flex items-center gap-1 text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
            🔥 142
          </span>
        </div>

        <p className="text-sm font-heading font-medium text-white italic leading-relaxed mb-3">
          &quot;The expert in anything was once a beginner. Keep going!&quot;
        </p>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#232f46]">
          <span className="text-slate-400 text-[11px]">Curated for Peak Focus</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
            🌱 Mindset Boost
          </span>
        </div>
      </div>

      {/* 4. Filter Chips (Image 3) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTags.map((tag) => {
          const isSelected = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag);
                soundEngine.playHapticPulse(140, 30);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-[#151e2e] text-slate-400 hover:text-white border border-[#25354e]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* 5. Popular Threads Header & Feed (Image 3) */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
        <span className="uppercase tracking-wider font-mono text-[11px]">POPULAR THREADS</span>
        <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
          <span>Sort by Trending</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {filteredThreads.map((thread) => {
          const isSaved = savedPosts[thread.id];
          const hasJoined = joinedTables[thread.id];

          return (
            <div
              key={thread.id}
              className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg hover:border-cyan-500/30 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1b2538] border border-[#2c3d59] flex items-center justify-center text-xs text-cyan-400">
                    👤
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{thread.author}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">{thread.timeAgo}</span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="More options"
                  className="text-slate-500 hover:text-white p-1"
                >
                  •••
                </button>
              </div>

              {/* Content */}
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                {thread.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono font-medium bg-[#172033] text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {thread.locationTag && (
                  <span className="text-[10px] font-mono font-medium bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {thread.locationTag}
                  </span>
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#232f46] text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(thread.id)}
                    className={`flex items-center gap-1 font-mono transition-colors ${
                      thread.userLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${thread.userLiked ? 'fill-rose-400' : ''}`} />
                    <span>{thread.likes}</span>
                  </button>

                  {thread.supports !== undefined && (
                    <button
                      onClick={() => soundEngine.playHapticPulse(180, 40)}
                      className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 font-mono transition-colors"
                    >
                      <span>🫂</span>
                      <span>{thread.supports}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-slate-400 font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{thread.comments}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {thread.joinTableAction && (
                    <button
                      onClick={() => handleJoinTable(thread.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                        hasJoined
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Joined!</span>
                        </>
                      ) : (
                        <>
                          <span>Join Table</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleSave(thread.id)}
                    aria-label="Save thread"
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSaved ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
