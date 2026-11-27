// Data access for matches / fixtures (US-05). Rules live in src/logic/fixtures.js.
import { generateFixtures } from '../logic/fixtures.js';
import { nextId } from '../store/ids.js';
import { AppError } from '../errors.js';

export async function listMatches(store) {
  const db = await store.read();
  return db.matches;
}

/**
 * Generates and saves the round-robin fixtures.
 * Sprint 1 rule: if fixtures already exist we refuse (replace/confirm rules come with US-06).
 */
export async function generateAndSaveFixtures(store) {
  return store.update((db) => {
    if (db.teams.length < 2) {
      throw new AppError(400, 'At least 2 teams are required to generate fixtures.');
    }
    if (db.matches.length > 0) {
      throw new AppError(409, 'Fixtures have already been generated.');
    }
    const rounds = generateFixtures(db.teams);
    for (const { round, matches } of rounds) {
      for (const match of matches) {
        db.matches.push({
          id: nextId(db.matches),
          round,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeGoals: null,
          awayGoals: null,
          status: 'scheduled',
        });
      }
    }
    return db.matches;
  });
}
