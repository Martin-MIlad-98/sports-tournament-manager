// US-05 Generate fixtures (organiser view). The result form is added by US-08.
import { api } from './api.js';
import { el, renderHeader, setMessage, toast, emptyState } from './ui.js';

renderHeader();

const generateBtn = document.getElementById('generate-btn');
const generateMessage = document.getElementById('generate-message');
const info = document.getElementById('fixtures-info');
const roundsHost = document.getElementById('rounds');

function matchRow(match) {
  const played = match.status === 'played';
  const middle = played
    ? el('span', { class: 'score' }, `${match.homeGoals} – ${match.awayGoals}`)
    : el('span', { class: 'score vs' }, 'vs');
  return [
    el(
      'div',
      { class: 'match' },
      el('span', { class: 'home' }, match.homeTeam),
      middle,
      el('span', { class: 'away' }, match.awayTeam),
      el('span', { class: `badge ${match.status} action` }, played ? 'Played' : 'Scheduled'),
    ),
  ];
}

async function load() {
  const { generated, rounds } = await api('/fixtures');
  roundsHost.replaceChildren();
  generateBtn.disabled = generated;
  info.textContent = generated ? 'Fixtures are generated. Enter results below.' : 'No fixtures yet.';

  if (!generated) {
    roundsHost.append(el('div', { class: 'card' }, emptyState('📋', 'Generate the fixtures to start entering results.')));
    return;
  }
  for (const round of rounds) {
    roundsHost.append(
      el(
        'section',
        { class: 'card round' },
        el(
          'h2',
          {},
          `Round ${round.round}`,
          round.resting.length ? el('span', { class: 'rest' }, `Rests: ${round.resting.join(', ')}`) : null,
        ),
        round.matches.map(matchRow),
      ),
    );
  }
}

generateBtn.addEventListener('click', async () => {
  setMessage(generateMessage, '');
  try {
    const { matchCount } = await api('/fixtures/generate', { method: 'POST' });
    toast(`${matchCount} matches generated`);
    await load();
  } catch (error) {
    setMessage(generateMessage, error.message, 'error');
  }
});

load().catch((error) => setMessage(generateMessage, error.message, 'error'));
