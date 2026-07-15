/**
 * Score display — small i18n'd counter.
 */

import { t } from '../i18n/index.js';

export function renderScore() {
  const el = document.createElement('div');
  el.className = 'score';
  el.setAttribute('data-role', 'score');
  updateScore(el, { correct: 0, wrong: 0 });
  return el;
}

export function updateScore(el, score) {
  el.textContent = t('quiz.score', { correct: score.correct, wrong: score.wrong });
}