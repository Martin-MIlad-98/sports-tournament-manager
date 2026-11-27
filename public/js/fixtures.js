// Spectator view of the fixtures, grouped by round (read-only).
// Sprint 2 (US-07) polishes this page; US-15 adds the Upcoming / Played filter.
import { api } from './api.js';
import { el, renderHeader, setMessage, emptyState } from './ui.js';

renderHeader();

const host = document.getElementById('rounds');
const message = document.getElementById('message');

function matchRow(match) {
  const played = match.status === 'played';
  return el(
    'div',
    { class: 'match' },
    el('span', { class: 'home' }, match.homeTeam),
    played ? el('span', { class: 'score' }, `${match.homeGoals} – ${match.awayGoals}`) : el('span', { class: 'score vs' }, 'vs'),
    el('span', { class: 'away' }, match.awayTeam),
    el('span', { class: `badge ${match.status}` }, played ? 'Played' : 'Scheduled'),
  );
}

try {
  const { generated, rounds } = await api('/fixtures');
  if (!generated) {
    host.append(el('div', { class: 'card' }, emptyState('📅', 'No fixtures yet. The organiser has not generated them.')));
  }
  for (const round of rounds) {
    host.append(
      el(
        'section',
        { class: 'card round' },
        el('h2', {}, `Round ${round.round}`, round.resting.length ? el('span', { class: 'rest' }, `Rests: ${round.resting.join(', ')}`) : null),
        round.matches.map(matchRow),
      ),
    );
  }
} catch (error) {
  setMessage(message, error.message, 'error');
}
