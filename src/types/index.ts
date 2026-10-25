export type ScreenType =
  | 'home'
  | 'wellness'
  | 'planner'
  | 'finance'
  | 'career'
  | 'leaderboard'
  | 'community'
  | 'copilot';

export interface StudyTask {
  id: string;
  title: string;
  subtitle: string;
  tag: 'Urgent & Important (Do First)' | 'Scheduled' | 'Quick Wins' | 'Normal';
  dueDate: string;
  xpReward: number;
  completed: boolean;
}

export interface ExpenseItem {
  id: string;
  amount: number;
  category: 'Housing' | 'Food' | 'Tuition' | 'Recreation' | 'Transit' | 'Books' | 'Other';
  date: string;
  note?: string;
}

export interface CommunityThread {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  supports?: number;
  comments: number;
  saved?: boolean;
  joinTableAction?: boolean;
  locationTag?: string;
  userLiked?: boolean;
  userSupported?: boolean;
}

export interface LeaderboardStudent {
  rank: number;
  name: string;
  tier: 'Diamond' | 'Cyber-Gold' | 'Platinum' | 'Gold';
  xp: number;
  streakFocus?: string;
  streakFinance?: string;
  velocity?: string;
  isCurrentUser?: boolean;
  subtext?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  hasLoanCard?: boolean;
  loanDetails?: {
    extraPerMonth: number;
    interestSaved: number;
    monthsAccelerated: number;
  };
  metrics?: string;
}

export interface DeskLampConfig {
  isOn: boolean;
  colorName: string;
  colorHex: string;
  circadianAutoSync: boolean;
  argbBacklightMode: string;
  bedtimeWindDown: boolean;
  dawnSimulator: boolean;
}
