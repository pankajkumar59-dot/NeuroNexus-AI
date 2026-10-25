import { test } from 'node:test';
import assert from 'node:assert';
import { generateLocalAiResponse } from './services/localAiEngine.ts';
import { calculateEarlyPayoff } from './utils/neuroMath.ts';

test('CGC Campus AI responds to room location query for Block 2 & C-204', () => {
  const res = executeQuery('Where is Lab C-204 in Block 2?');
  assert.ok(res.reply.includes('Academic Block 2'));
  assert.ok(res.reply.includes('C-204'));
  assert.strictEqual(res.source, 'CGC Smart Campus Engine');
});

test('CGC Campus AI responds to timetable query for Monday', () => {
  const res = executeQuery('What is my Monday timetable?');
  assert.ok(res.reply.includes('Database Systems'));
  assert.ok(res.reply.includes('Web Development'));
  assert.strictEqual(res.source, 'CGC Smart Campus Engine');
});

test('CGC Campus AI provides TechFest 2026 information', () => {
  const res = executeQuery('When is TechFest 2026?');
  assert.ok(res.reply.includes('TechFest 2026'));
  assert.ok(res.reply.includes('29 October 2026'));
  assert.ok(res.reply.includes('Auditorium'));
});

test('CGC Campus AI handles Lost & Found inquiries', () => {
  const res = executeQuery('Any lost and found items posted?');
  assert.ok(res.reply.includes('Lost & Found Board'));
  assert.ok(res.reply.includes('earbuds'));
});

test('Math and loan calculations remain accurate', () => {
  const mathRes = executeQuery('sqrt(144)');
  assert.ok(mathRes.reply.includes('12'));

  const arithmeticRes = executeQuery('15 * 84');
  assert.ok(arithmeticRes.reply.includes('1,260'));

  const loanPayoff = calculateEarlyPayoff(25000, 5.5, 10, 29);
  assert.ok(loanPayoff.interestSaved > 0);
  assert.ok(loanPayoff.monthsAccelerated > 0);
});


function executeQuery(q: string) {
  return generateLocalAiResponse(q);
}
