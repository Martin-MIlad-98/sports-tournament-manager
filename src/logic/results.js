// US-08 Enter a match result - pure rules, no I/O.
// (US-09 will extend the validation in Sprint 2; the basic guards below keep bad data out already.)

/** Accepts a whole number >= 0 (number or digit string). Returns the number, or null if invalid. */
export function parseGoals(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value >= 0 ? value : null;
  }
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  return null;
}

/**
 * Applies a first result to a scheduled match.
 * Returns { ok: true, match } with status "played", or { ok: false, status, error }.
 */
export function applyResult(match, homeInput, awayInput) {
  if (!match) {
    return { ok: false, status: 404, error: 'Match not found.' };
  }
  if (match.status === 'played') {
    return { ok: false, status: 409, error: 'This match already has a result.' };
  }
  const homeGoals = parseGoals(homeInput);
  const awayGoals = parseGoals(awayInput);
  if (homeGoals === null || awayGoals === null) {
    return { ok: false, status: 400, error: 'Goals must be whole numbers, 0 or more.' };
  }
  return { ok: true, match: { ...match, homeGoals, awayGoals, status: 'played' } };
}
