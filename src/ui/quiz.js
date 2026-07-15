/**
 * Quiz view — renders the character grid + result area.
 *
 * The actual wiring (state machine, audio, persistence) lives in
 * src/ui/app.js; this module just renders DOM and exposes callback hooks.
 */

import { charactersOfBand } from '../data/characters.js';
import { renderCharacterCard } from './character.js';
import { t } from '../i18n/index.js';

/**
 * Render the quiz view for a given band.
 *
 * @param {object} opts
 * @param {string} opts.bandId
 * @param {(charId: string) => void} opts.onPick
 * @returns {HTMLElement} container
 */
export function renderQuizView(opts) {
  const { bandId, onPick } = opts;
  const container = document.createElement('section');
  container.className = 'quiz-view';
  container.setAttribute('data-role', 'quiz-view');
  container.setAttribute('data-band', bandId);

  const grid = document.createElement('div');
  grid.className = 'char-grid';
  grid.setAttribute('data-role', 'char-grid');

  for (const char of charactersOfBand(bandId)) {
    const card = renderCharacterCard({
      charId: char.id,
      bandId: char.bandId,
      portrait: char.portrait,
      name: char.name,
      onClick: () => onPick(char.id),
    });
    // Mark as option for tests
    card.setAttribute('data-role', 'char-option');
    grid.appendChild(card);
  }

  container.appendChild(grid);

  // Result area (filled by app.js via setResult)
  const result = document.createElement('div');
  result.className = 'result-area';
  result.setAttribute('data-role', 'result-area');
  result.hidden = true;
  container.appendChild(result);

  return container;
}

/**
 * Mark a quiz view: highlight picked, mark correct/wrong, disable all.
 */
export function markAnswer(view, pickedCharId, correct, correctCharId) {
  const grid = view.querySelector('[data-role="char-grid"]');
  if (!grid) return;
  grid.querySelectorAll('[data-role="char-option"]').forEach((btn) => {
    btn.disabled = true;
    const id = btn.getAttribute('data-char');
    if (id === pickedCharId && !correct) btn.classList.add('wrong');
    if (id === correctCharId) btn.classList.add('correct');
  });
}

/** Reset all marks and re-enable buttons. */
export function clearMarks(view) {
  const grid = view.querySelector('[data-role="char-grid"]');
  if (!grid) return;
  grid.querySelectorAll('[data-role="char-option"]').forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('wrong', 'correct');
  });
  const result = view.querySelector('[data-role="result-area"]');
  if (result) {
    result.hidden = true;
    result.innerHTML = '';
  }
}

/**
 * Set result text in the result area. kind ∈ {correct, wrong, answer, hintBand}.
 */
export function setResult(view, kind, payload = {}) {
  const result = view.querySelector('[data-role="result-area"]');
  if (!result) return;
  result.hidden = false;
  result.innerHTML = '';
  result.setAttribute('data-kind', kind);

  const line = document.createElement('div');
  line.className = 'result-line';
  if (kind === 'correct') {
    line.textContent = t('quiz.correct') + ' ' + payload.charName;
  } else if (kind === 'wrong') {
    line.textContent = t('quiz.wrong');
  } else if (kind === 'answer') {
    line.textContent = t('quiz.answer') + '：' + payload.charName;
  } else if (kind === 'hintBand') {
    line.textContent = t('quiz.hintBandPrefix') + payload.bandName;
  }
  result.appendChild(line);
}