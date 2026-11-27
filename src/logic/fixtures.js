// US-05 Generate round-robin fixtures - pure rules, no I/O.

/**
 * Round-robin using the "circle method".
 * @param {{id: number}[]} teams  at least 2 teams
 * @returns {{round: number, matches: {homeTeamId: number, awayTeamId: number}[]}[]}
 *   N teams -> N x (N-1) / 2 matches. With an odd N one team rests ("bye") each round.
 */
export function generateFixtures(teams) {
  if (!Array.isArray(teams) || teams.length < 2) {
    throw new Error('At least 2 teams are required to generate fixtures.');
  }

  const slots = teams.map((t) => t.id);
  if (slots.length % 2 === 1) slots.push(null); // null = the "bye" slot

  const size = slots.length;
  const rounds = [];

  for (let r = 0; r < size - 1; r += 1) {
    const matches = [];
    for (let i = 0; i < size / 2; i += 1) {
      const a = slots[i];
      const b = slots[size - 1 - i];
      if (a === null || b === null) continue; // this team rests this round
      // Swap home/away on the first pairing every other round so no team is always "home".
      const swap = i === 0 && r % 2 === 1;
      matches.push(swap ? { homeTeamId: b, awayTeamId: a } : { homeTeamId: a, awayTeamId: b });
    }
    rounds.push({ round: r + 1, matches });

    // Keep slot 0 fixed and rotate the rest by one position.
    slots.splice(1, 0, slots.pop());
  }

  return rounds;
}

/**
 * Groups stored matches by round and works out which teams rest in each round.
 * @returns {{round: number, matches: object[], resting: number[]}[]}
 */
export function groupByRound(matches, teams) {
  const byRound = new Map();
  for (const match of matches) {
    if (!byRound.has(match.round)) byRound.set(match.round, []);
    byRound.get(match.round).push(match);
  }
  return [...byRound.keys()]
    .sort((a, b) => a - b)
    .map((round) => {
      const roundMatches = byRound.get(round);
      const playing = new Set(roundMatches.flatMap((m) => [m.homeTeamId, m.awayTeamId]));
      const resting = teams.filter((t) => !playing.has(t.id)).map((t) => t.id);
      return { round, matches: roundMatches, resting };
    });
}
