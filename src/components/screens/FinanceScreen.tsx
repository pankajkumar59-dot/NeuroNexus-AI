import React, { useState } from 'react';
import { ExpenseItem } from '../../types/index.ts';
import {
  CreditCard,
  RotateCcw,
  Plus,
  DollarSign,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { calculateLoanEMI, calculateEarlyPayoff } from '../../utils/neuroMath.ts';
import { soundEngine } from '../../utils/audioSynth.ts';

interface FinanceScreenProps {
  expenses: ExpenseItem[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
  onSyncLoanToChat?: (details: { principal: number; rate: number; years: number; emi: number }) => void;
}

export const FinanceScreen: React.FC<FinanceScreenProps> = ({
  expenses,
  setExpenses,
  onSyncLoanToChat,
}) => {
  // Loan Simulator Inputs
  const [principal, setPrincipal] = useState(25000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [termYears, setTermYears] = useState(10);

  // Micro invest toggle
  const [isMicroInvestOn, setIsMicroInvestOn] = useState(true);

  // Expense Logger Input
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Food' | 'Transit' | 'Books' | 'Other'>('Food');

  // Calculate live EMI
  const loanCalc = calculateLoanEMI(principal, interestRate, termYears);
  const earlyPayoffCalc = calculateEarlyPayoff(principal, interestRate, termYears, 25);

  // Runway metrics
  const totalBudget = 800;
  const currentSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const runwayLeft = Math.max(0, totalBudget - currentSpent);
  const safeBurnPerDay = Math.round(runwayLeft / 30);

  const handleResetLoan = () => {
    setPrincipal(25000);
    setInterestRate(5.5);
    setTermYears(10);
    soundEngine.playHapticPulse(150, 40);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      amount: amt,
      category: expenseCategory,
      date: 'Today',
      note: `Quick log ${expenseCategory}`,
    };
    setExpenses([newExp, ...expenses]);
    setExpenseAmount('');
    soundEngine.playHapticPulse(220, 60);
  };

  return (
    <div className="space-y-4 pb-28 max-w-xl mx-auto">
      {/* 1. Monthly Runway Metrics (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            MONTHLY RUNWAY METRICS
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Healthy Pace
          </span>
        </div>

        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl font-heading font-extrabold text-white">
            ${runwayLeft}
          </span>
          <span className="text-slate-400 text-sm font-mono font-medium">.00 left</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-[#1b2538] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((runwayLeft / totalBudget) * 100))}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-t border-[#232f46] text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Total Budget</span>
            <span className="font-bold text-white">${totalBudget}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Spent to Date</span>
            <span className="font-bold text-rose-400">${currentSpent}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Safe Burn</span>
            <span className="font-bold text-cyan-300">${safeBurnPerDay}/day</span>
          </div>
        </div>

        {/* Graduation Emergency Fund */}
        <div className="mt-2 pt-2 border-t border-[#232f46] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Graduation Emergency Fund</span>
          </div>
          <span className="font-mono font-bold text-emerald-400">78% Target</span>
        </div>
      </div>

      {/* 2. Loan EMI Simulator (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Loan EMI Simulator</h3>
              <p className="text-[11px] text-slate-400">Undergraduate & Grad Federal/Private</p>
            </div>
          </div>

          <button
            onClick={handleResetLoan}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 my-4">
          {/* Principal */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Principal Borrowed</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                ${principal.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="80000"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-[#1f2c42] rounded-lg cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Interest Rate (APR)</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {interestRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="14"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-[#1f2c42] rounded-lg cursor-pointer"
            />
          </div>

          {/* Repayment Term */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Repayment Term</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {termYears} Years
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-[#1f2c42] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Output Calculation Box */}
        <div className="bg-[#151e2e] border border-[#273752] rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              ESTIMATED MONTHLY INSTALLMENT
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-medium">
              Standard Plan
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-heading font-extrabold text-cyan-300">
              ${loanCalc.monthlyInstallment}
            </span>
            <span className="text-xs text-slate-400 font-mono">/mo</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-[#232f46] text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Total Interest Payable</span>
              <span className="font-bold text-white font-mono">${loanCalc.totalInterest.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Total Principal + Interest</span>
              <span className="font-bold text-white font-mono">${loanCalc.totalRepayment.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Expense Distribution (Donut Chart) (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-white">Expense Distribution</h3>
          <span className="text-xs text-slate-400 font-medium">Current Semester</span>
        </div>

        <div className="flex items-center justify-around gap-4">
          {/* Donut Chart SVG */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Housing 45% (Cyan) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray="226.2"
                strokeDashoffset="0"
              />
              {/* Food 25% (Emerald) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray="226.2"
                strokeDashoffset="124.4"
              />
              {/* Tuition 20% (Violet) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#a855f7"
                strokeWidth="10"
                strokeDasharray="226.2"
                strokeDashoffset="180.9"
              />
              {/* Rec 10% (Teal) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="10"
                strokeDasharray="226.2"
                strokeDashoffset="203.5"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400">Total</span>
              <span className="text-sm font-heading font-bold text-white">${currentSpent}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Housing & Dorm</span>
              </div>
              <span className="font-mono font-bold text-white">45%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Food & Dining</span>
              </div>
              <span className="font-mono font-bold text-white">25%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                <span className="text-slate-300">Tuition & Books</span>
              </div>
              <span className="font-mono font-bold text-white">20%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-300">Recreation & Fun</span>
              </div>
              <span className="font-mono font-bold text-white">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Compound Micro-Invest (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Compound Micro-Invest</h3>
              <p className="text-[11px] text-slate-400">Auto-stash loose change during study terms</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isMicroInvestOn}
              onChange={() => setIsMicroInvestOn(!isMicroInvestOn)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1f2b40] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
          </label>
        </div>

        <div className="bg-[#151e2e] border border-[#273752] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Projection (4-Year Degree)
            </span>
            <span className="text-xs text-slate-200">
              Invest <strong className="text-emerald-400">$50/mo</strong> during college
            </span>
          </div>
          <span className="text-base font-heading font-bold text-emerald-400 font-mono">
            ~$4,200 <span className="text-[10px] text-slate-400 font-sans block font-normal">at graduation</span>
          </span>
        </div>
      </div>

      {/* 5. Quick Expense Logger (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">Quick Expense Logger</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Real-time sync</span>
        </div>

        <form onSubmit={handleAddExpense} className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
            <input
              type="number"
              step="0.01"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0d121c] border border-[#27354d] rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        <div className="flex items-center gap-2">
          {[
            { id: 'Food', label: '🍔 Food' },
            { id: 'Transit', label: '🚆 Transit' },
            { id: 'Books', label: '📖 Books' },
            { id: 'Other', label: '••• Other' },
          ].map((cat) => {
            const isSelected = expenseCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setExpenseCategory(cat.id as typeof expenseCategory)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#151e2e] border-[#25354e] text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. AI Debt Acceleration insight card (Image 19) */}
      <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono tracking-wider text-cyan-400 font-bold uppercase block mb-1">
            AI DEBT ACCELERATION
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Paying an extra <strong className="text-cyan-300">$25/month</strong> toward your $25k loan principal can shorten your repayment schedule by{' '}
            <strong className="text-emerald-400">{earlyPayoffCalc.monthsAccelerated} months</strong> and eliminate over{' '}
            <strong className="text-emerald-400">${earlyPayoffCalc.interestSaved.toLocaleString()}</strong> in compounding interest.
          </p>
        </div>
      </div>
    </div>
  );
};
