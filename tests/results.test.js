// US-08 Enter a match result
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyResult, parseGoals } from '../src/logic/results.js';

const scheduled = { id: 1, round: 1, homeTeamId: 1, awayTeamId: 2, homeGoals: null, awayGoals: null, status: 'scheduled' };

test('a valid score marks the match as played and keeps the goals', () => {
  const result = applyResult(scheduled, 2, 1);
  assert.equal(result.ok, true);
  assert.equal(result.match.status, 'played');
  assert.equal(result.match.homeGoals, 2);
  assert.equal(result.match.awayGoals, 1);
});

test('does not change the original match object', () => {
  applyResult(scheduled, 2, 1);
  assert.equal(scheduled.status, 'scheduled');
});

test('accepts 0-0 and digit strings from a form', () => {
  assert.equal(applyResult(scheduled, 0, 0).ok, true);
  const result = applyResult(scheduled, '3', ' 2 ');
  assert.equal(result.match.homeGoals, 3);
  assert.equal(result.match.awayGoals, 2);
});

test('rejects negative, decimal, empty and non-numeric goals', () => {
  for (const bad of [-1, 1.5, '', 'abc', null, undefined, '2x']) {
    const result = applyResult(scheduled, bad, 1);
    assert.equal(result.ok, false, `value: ${String(bad)}`);
    assert.equal(result.status, 400);
  }
});

test('rejects a match that does not exist', () => {
  const result = applyResult(undefined, 1, 0);
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
});

test('rejects a second first-result for a match already played', () => {
  const played = { ...scheduled, status: 'played', homeGoals: 1, awayGoals: 0 };
  const result = applyResult(played, 3, 3);
  assert.equal(result.ok, false);
  assert.equal(result.status, 409);
});

test('parseGoals only accepts whole numbers >= 0', () => {
  assert.equal(parseGoals(4), 4);
  assert.equal(parseGoals('07'), 7);
  assert.equal(parseGoals(-3), null);
  assert.equal(parseGoals(NaN), null);
});
