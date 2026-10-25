import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateLocalAiResponse } from './localAiEngine.ts';

describe('Local AI Engine', () => {
  it('correctly evaluates math arithmetic queries', () => {
    const res = generateLocalAiResponse('what is 15 * 84?');
    assert.ok(res.reply.includes('1,260'));
    assert.strictEqual(res.source, 'Offline Math Engine');
  });

  it('answers student loan questions with exact financial calculation details', () => {
    const res = generateLocalAiResponse('How much will I save paying $300 on my loan?');
    assert.strictEqual(res.hasLoanCard, true);
    assert.ok(res.loanDetails);
    assert.strictEqual(res.loanDetails?.extraPerMonth, 29);
    assert.ok(res.reply.includes('$1,142'));
  });

  it('answers computer science questions with code templates', () => {
    const res = generateLocalAiResponse('Explain how to reverse a linked list');
    assert.ok(res.reply.includes('class ListNode'));
    assert.ok(res.reply.includes('O(N) single pass'));
  });

  it('generates a substantive answer for any arbitrary query', () => {
    const res = generateLocalAiResponse('What is quantum entanglement and teleportation?');
    assert.ok(res.reply.length > 50);
    assert.ok(res.reply.includes('Quantum entanglement and teleportation'));
  });
});
