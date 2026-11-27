// Data access for match results (US-08). Rules live in src/logic/results.js.
import { applyResult } from '../logic/results.js';
import { AppError } from '../errors.js';

/** Saves a first result for a match and marks it "played". */
export async function saveResult(store, matchId, homeGoals, awayGoals) {
  return store.update((db) => {
    const index = db.matches.findIndex((m) => m.id === matchId);
    const outcome = applyResult(db.matches[index], homeGoals, awayGoals);
    if (!outcome.ok) {
      throw new AppError(outcome.status, outcome.error);
    }
    db.matches[index] = outcome.match;
    return outcome.match;
  });
}
