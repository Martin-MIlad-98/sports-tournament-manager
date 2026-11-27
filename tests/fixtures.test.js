// US-05 Generate round-robin fixtures
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateFixtures, groupByRound } from '../src/logic/fixtures.js';

const makeTeams = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Team ${i + 1}` }));
const allMatches = (rounds) => rounds.flatMap((r) => r.matches);
const pairKey = (m) => [m.homeTeamId, m.awayTeamId].sort((a, b) => a - b).join('-');

for (const n of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  test(`${n} teams -> exactly N x (N-1) / 2 matches`, () => {
    assert.equal(allMatches(generateFixtures(makeTeams(n))).length, (n * (n - 1)) / 2);
  });

  test(`${n} teams -> no team plays itself and no pair meets twice`, () => {
    const matches = allMatches(generateFixtures(makeTeams(n)));
    assert.ok(matches.every((m) => m.homeTeamId !== m.awayTeamId));
    assert.equal(new Set(matches.map(pairKey)).size, matches.length);
  });

  test(`${n} teams -> every team plays every other team`, () => {
    const pairs = new Set(allMatches(generateFixtures(makeTeams(n))).map(pairKey));
    for (let a = 1; a <= n; a += 1) {
      for (let b = a + 1; b <= n; b += 1) assert.ok(pairs.has(`${a}-${b}`), `missing ${a}-${b}`);
    }
  });

  test(`${n} teams -> no team plays twice in the same round`, () => {
    for (const round of generateFixtures(makeTeams(n))) {
      const ids = round.matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]);
      assert.equal(new Set(ids).size, ids.length, `round ${round.round}`);
    }
  });
}

test('an even number of teams has N-1 rounds and nobody rests', () => {
  const rounds = generateFixtures(makeTeams(4));
  assert.equal(rounds.length, 3);
  assert.ok(rounds.every((r) => r.matches.length === 2));
});

test('an odd number of teams has N rounds and exactly one team rests each round', () => {
  const teams = makeTeams(5);
  const rounds = generateFixtures(teams);
  assert.equal(rounds.length, 5);
  for (const round of rounds) {
    const playing = new Set(round.matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]));
    assert.equal(teams.length - playing.size, 1, `round ${round.round}`);
  }
});

test('each team rests exactly once with an odd number of teams', () => {
  const teams = makeTeams(7);
  const rests = new Map(teams.map((t) => [t.id, 0]));
  for (const round of generateFixtures(teams)) {
    const playing = new Set(round.matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]));
    for (const t of teams) if (!playing.has(t.id)) rests.set(t.id, rests.get(t.id) + 1);
  }
  assert.ok([...rests.values()].every((count) => count === 1));
});

test('throws with fewer than 2 teams', () => {
  assert.throws(() => generateFixtures([]), /At least 2 teams/);
  assert.throws(() => generateFixtures(makeTeams(1)), /At least 2 teams/);
});

test('groupByRound groups stored matches and lists the resting teams', () => {
  const teams = makeTeams(3);
  const stored = [
    { id: 1, round: 1, homeTeamId: 1, awayTeamId: 2 },
    { id: 2, round: 2, homeTeamId: 3, awayTeamId: 1 },
    { id: 3, round: 3, homeTeamId: 2, awayTeamId: 3 },
  ];
  const grouped = groupByRound(stored, teams);
  assert.deepEqual(grouped.map((g) => g.round), [1, 2, 3]);
  assert.deepEqual(grouped.map((g) => g.resting), [[3], [2], [1]]);
});
