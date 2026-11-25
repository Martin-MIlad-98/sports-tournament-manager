import { api } from './api.js';
import { renderHeader } from './ui.js';

renderHeader();

try {
  const [teams, fixtures] = await Promise.all([api('/teams'), api('/fixtures')]);
  const matches = fixtures.rounds.flatMap((r) => r.matches);
  document.getElementById('stat-teams').textContent = teams.length;
  document.getElementById('stat-matches').textContent = matches.length;
  document.getElementById('stat-played').textContent = matches.filter((m) => m.status === 'played').length;
} catch {
  /* the stats stay as "–" if the server is unreachable */
}
