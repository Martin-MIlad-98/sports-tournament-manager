// US-05 Generate fixtures + US-08 Enter a match result (organiser view)
import { api } from './api.js';
import { el, renderHeader, setMessage, toast, emptyState } from './ui.js';

renderHeader();

const generateBtn = document.getElementById('generate-btn');
const generateMessage = document.getElementById('generate-message');
const info = document.getElementById('fixtures-info');
const roundsHost = document.getElementById('rounds');

function resultForm(match) {
  const home = el('input', { type: 'number', min: '0', step: '1', 'aria-label': `${match.homeTeam} goals`, placeholder: '0' });
  const away = el('input', { type: 'number', min: '0', step: '1', 'aria-label': `${match.awayTeam} goals`, placeholder: '0' });
  const error = el('div', { class: 'message match-error', role: 'alert' });

  const form = el(
    'form',
    {
      class: 'result-form',
      novalidate: true,
      onSubmit: async (event) => {
        event.preventDefault();
        setMessage(error, '');
        try {
          await api(`/matches/${match.id}/result`, {
            method: 'PUT',
            body: { homeGoals: home.value, awayGoals: away.value },
          });
          toast('Result saved');
          await load();
        } catch (e) {
          setMessage(error, e.message, 'error');
        }
      },
    },
    home,
    el('span', {}, '–'),
    away,
    el('button', { class: 'btn small', type: 'submit' }, 'Save'),
  );
  return { form, error };
}

function matchRow(match) {
  const played = match.status === 'played';
  const middle = played
    ? el('span', { class: 'score' }, `${match.homeGoals} – ${match.awayGoals}`)
    : el('span', { class: 'score vs' }, 'vs');
  const row = el('div', { class: 'match' }, el('span', { class: 'home' }, match.homeTeam), middle, el('span', { class: 'away' }, match.awayTeam));

  if (played) {
    row.append(el('span', { class: 'badge played action' }, 'Played'));
    return [row];
  }
  const { form, error } = resultForm(match);
  row.append(el('div', { class: 'action' }, form));
  return [row, error];
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
