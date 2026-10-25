import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLoanEMI,
  calculateEarlyPayoff,
  calculateCognitiveLevel,
  getBoxBreathingState,
} from './neuroMath.ts';

test('calculateLoanEMI calculates accurate standard EMI for $25k at 5.5% 10yr', () => {
  // $25,000 borrowed, 5.5% APR, 10 years
  const res = calculateLoanEMI(25000, 5.5, 10);
  // Expected EMI is ~$271.32 (matches Image 19 perfectly!)
  assert.equal(res.monthlyInstallment, 271.32);
  assert.equal(res.termMonths, 120);
  assert.ok(res.totalInterest > 7500 && res.totalInterest < 7600);
});

test('calculateEarlyPayoff correctly computes interest and months accelerated', () => {
  // Extra $29/mo on $25,000 at 5.5%
  const res = calculateEarlyPayoff(25000, 5.5, 10, 29);
  assert.ok(res.interestSaved >= 1000);
  assert.equal(res.monthsAccelerated, 14);
});

test('calculateCognitiveLevel calculates level and progress percentage', () => {
  const levelInfo = calculateCognitiveLevel(1450);
  assert.equal(levelInfo.level, 5);
  assert.equal(levelInfo.title, 'Focus Master');
  assert.equal(levelInfo.xpNeeded, 550);
});

test('getBoxBreathingState handles 4 phases cleanly', () => {
  const inhale = getBoxBreathingState(1);
  assert.equal(inhale.phase, 'Inhale');

  const hold = getBoxBreathingState(5);
  assert.equal(hold.phase, 'Hold (In)');

  const exhale = getBoxBreathingState(9);
  assert.equal(exhale.phase, 'Exhale');

  const pause = getBoxBreathingState(13);
  assert.equal(pause.phase, 'Pause (Rest)');
});
