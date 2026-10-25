/**
 * NeuroNexus+ Decoupled Pure Mathematical & State Calculations
 */

export interface LoanCalculationResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
  termMonths: number;
}

export interface EarlyPayoffResult {
  interestSaved: number;
  monthsAccelerated: number;
  newMonths: number;
  newTotalInterest: number;
}

export function calculateLoanEMI(
  principal: number,
  annualRatePct: number,
  years: number
): LoanCalculationResult {
  if (principal <= 0) {
    return { monthlyInstallment: 0, totalInterest: 0, totalRepayment: 0, termMonths: years * 12 };
  }
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRatePct / 100 / 12;

  if (r === 0) {
    const monthly = principal / n;
    return {
      monthlyInstallment: Number(monthly.toFixed(2)),
      totalInterest: 0,
      totalRepayment: principal,
      termMonths: n,
    };
  }

  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - principal;

  return {
    monthlyInstallment: Number(emi.toFixed(2)),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment),
    termMonths: n,
  };
}

export function calculateEarlyPayoff(
  principal: number,
  annualRatePct: number,
  years: number,
  extraMonthlyPayment: number
): EarlyPayoffResult {
  const standard = calculateLoanEMI(principal, annualRatePct, years);
  if (extraMonthlyPayment <= 0 || principal <= 0) {
    return {
      interestSaved: 0,
      monthsAccelerated: 0,
      newMonths: standard.termMonths,
      newTotalInterest: standard.totalInterest,
    };
  }

  const r = annualRatePct / 100 / 12;
  const monthlyPay = standard.monthlyInstallment + extraMonthlyPayment;

  let balance = principal;
  let months = 0;
  let accumulatedInterest = 0;

  while (balance > 0.01 && months < standard.termMonths * 2) {
    months++;
    const interest = balance * r;
    accumulatedInterest += interest;
    const principalPaid = monthlyPay - interest;
    balance -= principalPaid;
    if (balance < 0) balance = 0;
  }

  const interestSaved = Math.max(0, Math.round(standard.totalInterest - accumulatedInterest));
  const monthsAccelerated = Math.max(0, standard.termMonths - months);

  return {
    interestSaved,
    monthsAccelerated,
    newMonths: months,
    newTotalInterest: Math.round(accumulatedInterest),
  };
}

export interface CognitiveLevelInfo {
  level: number;
  title: string;
  nextTitle: string;
  currentXp: number;
  tierStartXp: number;
  tierTargetXp: number;
  xpNeeded: number;
  progressPct: number;
}

export function calculateCognitiveLevel(totalXp: number): CognitiveLevelInfo {
  const levels = [
    { level: 1, title: 'Novice Learner', xpNeeded: 250 },
    { level: 2, title: 'Apprentice Thinker', xpNeeded: 500 },
    { level: 3, title: 'Deep Worker', xpNeeded: 850 },
    { level: 4, title: 'Cognitive Strategist', xpNeeded: 1200 },
    { level: 5, title: 'Focus Master', xpNeeded: 2000 },
    { level: 6, title: 'Neuro-Architect', xpNeeded: 3000 },
    { level: 7, title: 'Grandmaster Synapse', xpNeeded: 5000 },
  ];

  let currentLevelIdx = 0;
  for (let i = 0; i < levels.length; i++) {
    if (totalXp >= (levels[i - 1]?.xpNeeded || 0)) {
      currentLevelIdx = i;
    }
  }

  const current = levels[currentLevelIdx];
  const next = levels[currentLevelIdx + 1] || { level: current.level + 1, title: 'Transcendent Thinker', xpNeeded: current.xpNeeded * 1.5 };
  const prevXp = currentLevelIdx > 0 ? levels[currentLevelIdx - 1].xpNeeded : 0;
  const tierTargetXp = current.xpNeeded;
  const xpNeeded = Math.max(0, tierTargetXp - totalXp);
  const tierRange = tierTargetXp - prevXp;
  const progressInTier = Math.max(0, totalXp - prevXp);
  const progressPct = Math.min(100, Math.round((progressInTier / tierRange) * 100));

  return {
    level: current.level,
    title: current.title,
    nextTitle: next.title,
    currentXp: totalXp,
    tierStartXp: prevXp,
    tierTargetXp,
    xpNeeded,
    progressPct,
  };
}

export type BoxBreathingPhase = 'Inhale' | 'Hold (In)' | 'Exhale' | 'Pause (Rest)';

export interface BoxBreathingState {
  phase: BoxBreathingPhase;
  phaseSecondsLeft: number;
  phaseProgressPct: number;
  hapticHz: string;
  guidanceText: string;
}

export function getBoxBreathingState(secondsInCycle: number, phaseDuration = 4): BoxBreathingState {
  const totalCycle = phaseDuration * 4;
  const normalizedSec = secondsInCycle % totalCycle;
  const phaseIndex = Math.floor(normalizedSec / phaseDuration);
  const phaseProgress = (normalizedSec % phaseDuration) / phaseDuration;
  const phaseSecondsLeft = Math.ceil(phaseDuration - (normalizedSec % phaseDuration));

  switch (phaseIndex) {
    case 0:
      return {
        phase: 'Inhale',
        phaseSecondsLeft,
        phaseProgressPct: Math.round(phaseProgress * 100),
        hapticHz: '40 -> 180 Hz Rising Swell',
        guidanceText: 'Draw breath smoothly into the diaphragm',
      };
    case 1:
      return {
        phase: 'Hold (In)',
        phaseSecondsLeft,
        phaseProgressPct: Math.round(phaseProgress * 100),
        hapticHz: '1 pulse/s Steady Cadence',
        guidanceText: 'Maintain chest expansion with relaxed shoulders',
      };
    case 2:
      return {
        phase: 'Exhale',
        phaseSecondsLeft,
        phaseProgressPct: Math.round(phaseProgress * 100),
        hapticHz: '180 -> 30 Hz Resonant Wave',
        guidanceText: 'Slowly release breath to engage parasympathetic tone',
      };
    case 3:
    default:
      return {
        phase: 'Pause (Rest)',
        phaseSecondsLeft,
        phaseProgressPct: Math.round(phaseProgress * 100),
        hapticHz: '0 Hz Quiet Baseline',
        guidanceText: 'Rest in stillness before next inspiration',
      };
  }
}
