import { StudyTask, ExpenseItem, CommunityThread, LeaderboardStudent, ChatMessage, DeskLampConfig } from '../types/index.ts';

export const initialTasks: StudyTask[] = [
  {
    id: 't-1',
    title: 'Complete CS240 Algo Problem Set',
    subtitle: 'Dynamic programming & memoization...',
    tag: 'Urgent & Important (Do First)',
    dueDate: 'due 11:59 PM',
    xpReward: 120,
    completed: false,
  },
  {
    id: 't-2',
    title: 'Review Financial Accounting Ch. 4',
    subtitle: 'Cash flow statements & working capital...',
    tag: 'Scheduled',
    dueDate: 'Tomorrow, 2:00 PM',
    xpReward: 80,
    completed: false,
  },
  {
    id: 't-3',
    title: 'Draft NeuroNexus+ Presentation ...',
    subtitle: 'Refine slide 3 problem statement & tech...',
    tag: 'Quick Wins',
    dueDate: '15 mins',
    xpReward: 45,
    completed: false,
  },
];

export const initialDeskLamp: DeskLampConfig = {
  isOn: true,
  colorName: 'Deep Violet',
  colorHex: '#8B5CF6',
  circadianAutoSync: true,
  argbBacklightMode: 'Rainbow Wave (60 FPS)',
  bedtimeWindDown: true,
  dawnSimulator: true,
};

export const initialExpenses: ExpenseItem[] = [
  { id: 'e-1', amount: 171, category: 'Housing', date: 'Oct 1', note: 'Monthly dorm maintenance split' },
  { id: 'e-2', amount: 95, category: 'Food', date: 'Oct 18', note: 'Campus dining points & groceries' },
  { id: 'e-3', amount: 76, category: 'Tuition', date: 'Oct 10', note: 'CS240 lab materials & textbook' },
  { id: 'e-4', amount: 38, category: 'Recreation', date: 'Oct 22', note: 'Bouldering gym pass' },
];

export const initialLeaderboard: LeaderboardStudent[] = [
  {
    rank: 1,
    name: 'QuantumFox #412',
    tier: 'Diamond',
    xp: 16420,
    streakFocus: '42d Focus',
    streakFinance: '18d Fin',
  },
  {
    rank: 2,
    name: 'CyberPanda #109',
    tier: 'Diamond',
    xp: 15100,
    velocity: '+1,240 XP Today',
  },
  {
    rank: 3,
    name: 'You (NeuralOwl #089)',
    tier: 'Diamond',
    xp: 14850,
    isCurrentUser: true,
    subtext: 'Aravind • CS Final Year • 320 XP to #2',
  },
  {
    rank: 4,
    name: 'VortexWolf #771',
    tier: 'Cyber-Gold',
    xp: 13900,
    streakFocus: 'Streak: 21d Focus Pomodoro',
  },
  {
    rank: 5,
    name: 'PixelFalcon #304',
    tier: 'Cyber-Gold',
    xp: 12850,
    streakFinance: 'Streak: 12d Finance Discipline',
  },
];

export const initialCommunityThreads: CommunityThread[] = [
  {
    id: 'c-1',
    author: 'Anonymous Scholar',
    timeAgo: '35 mins ago',
    content: 'Exams are next week and feeling the burnout. Any tips for managing sleep while studying for Linear Algebra?',
    tags: ['#MentalHealth', '#Exams'],
    likes: 24,
    supports: 15,
    comments: 8,
  },
  {
    id: 'c-2',
    author: 'Anonymous Saver',
    timeAgo: '2h ago',
    content: 'Found a grocery store discount hack near university quad! Saved $45 this week.',
    tags: ['#BudgetHacks'],
    likes: 42,
    supports: 19,
    comments: 11,
  },
  {
    id: 'c-3',
    author: 'Anonymous Hacker',
    timeAgo: '4h ago',
    content: 'Study group forming for CS240 Algorithms in library 3rd floor at 4 PM!',
    tags: ['#StudyGroups'],
    locationTag: 'Library Floor 3',
    likes: 12,
    comments: 5,
    joinTableAction: true,
  },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'ai',
    text: "Hey Alex! I'm your offline student copilot running directly on your device via Microsoft AI Studio. How can I help you excel today?",
    timestamp: '2:41 PM • Neural Engine',
  },
  {
    id: 'm-2',
    sender: 'user',
    text: 'Can you calculate how much I\'ll save if I pay $300/mo instead of $271 on my student loan?',
    timestamp: '2:43 PM',
  },
  {
    id: 'm-3',
    sender: 'ai',
    text: 'Great question! With a $25,000 balance at 5.5% interest, bumping your payment to $300/month delivers significant compounding efficiency:',
    timestamp: '2:43 PM • 18 tok/s local • Encrypted on device',
    hasLoanCard: true,
    loanDetails: {
      extraPerMonth: 29,
      interestSaved: 1142,
      monthsAccelerated: 14,
    },
  },
];
