/**
 * App controller — top-level wiring.
 *
 * Responsibilities:
 *  - Mount quiz view + intro view + score + band tabs into #app
 *  - Wire Tab switching (quiz/intro)
 *  - Wire band switching (within each view)
 *  - Drive quiz.js state machine on user actions
 *  - Wire audio.playSample for play/replay
 *  - Persist progress via storage/progress.js
 */

import { BANDS } from '../data/bands.js';
import { CHARACTERS, charactersOfBand } from '../data/characters.js';
import { BAND_BY_ID } from '../data/bands.js';
import { renderQuizView, markAnswer, clearMarks, setResult } from './quiz.js';
import { renderIntroView } from './intro.js';
import { renderScore, updateScore } from './score.js';
import { renderBandTabs } from './band-tabs.js';
import { createTabs } from '../core/tabs.js';
import { t, getLocale, applyTranslations } from '../i18n/index.js';
import {
  newQuestion,
  playCurrent,
  pick,
  retry as quizRetry,
  next as quizNext,
  hintBand,
  revealAnswer,
  canPlay,
  canPick,
  canReveal,
  getState,
} from '../core/quiz.js';
import { playSample as audioPlay } from '../core/audio.js';
import {
  loadProgress,
  saveProgress,
  recordAnswer,
} from '../storage/progress.js';
import { FAIL_IMAGE } from './paths.js';

// Filter out Ave Mujica (no audio) from the band list shown to user
const PLAYABLE_BANDS = BANDS.filter(b =>
  b.members.some(id => charactersOfBand(b.id).find(c => c.id === id))
);
const PLAYABLE_BAND_IDS = PLAYABLE_BANDS.map(b => b.id);

let _mountedRoot = null;
let _tabs = null;
let _quizView = null;
let _introView = null;
let _score = null;
let _bandTabs = null;
let _currentView = null; // 'quiz' | 'intro'
let _progressState = null;

export function initApp(rootEl) {
  _mountedRoot = rootEl;
  _progressState = loadProgress();

  // Tabs (top level)
  _tabs = createTabs(['quiz', 'intro'], 'quiz', PLAYABLE_BAND_IDS, PLAYABLE_BAND_IDS[0]);
  _tabs.onChange((name) => {
    _currentView = name;
    _renderCurrent();
  });
  _tabs.onBandChange(() => _renderCurrent());

  _currentView = _tabs.active();
  _renderCurrent();

  // Re-apply translations when locale changes (button labels etc.)
  document.addEventListener('i18n:applied', () => {
    updateScore(_score, getState().score);
    if (_currentView === 'quiz' && _quizView) {
      // Re-render quiz if it exists
      _renderQuiz();
    } else if (_currentView === 'intro' && _introView) {
      _renderIntro();
    }
  });
}

export function switchTab(name) {
  if (_tabs) _tabs.setActive(name);
}

function _renderCurrent() {
  if (_currentView === 'quiz') _renderQuiz();
  else _renderIntro();
}

function _renderQuiz() {
  if (!_mountedRoot) return;
  _mountedRoot.innerHTML = '';

  // Top bar: score
  _score = renderScore();
  _mountedRoot.appendChild(_score);

  // Play button + result area
  const top = document.createElement('div');
  top.className = 'quiz-top';
  const playBtn = document.createElement('button');
  playBtn.className = 'play-btn primary';
  playBtn.setAttribute('data-role', 'play-current');
  playBtn.textContent = t('quiz.play');
  playBtn.addEventListener('click', () => {
    if (canPlay()) {
      _startNewIfNeeded();
      const p = playCurrent();
      _updatePlayButton();
      // When audio ends (or fails), phase flips back to awaitPick —
      // sync the play button DOM so the user can play again.
      if (p && typeof p.then === 'function') {
        p.then(() => _updatePlayButton(), () => _updatePlayButton());
      }
    }
  });
  top.appendChild(playBtn);
  _mountedRoot.appendChild(top);

  // Band tabs
  _bandTabs = renderBandTabs(PLAYABLE_BAND_IDS, _tabs.activeBand(), (id) => {
    _tabs.setActiveBand(id);
  });
  _mountedRoot.appendChild(_bandTabs);

  // Quiz view
  _quizView = renderQuizView({
    bandId: _tabs.activeBand(),
    onPick: (charId) => _handlePick(charId),
  });
  _mountedRoot.appendChild(_quizView);

  // Bottom buttons
  const bottom = _renderQuizBottom();
  _mountedRoot.appendChild(bottom);

  // If there's an in-flight question matching the new band, re-mark
  const s = getState();
  if (s.currentCharId && s.phase === 'answered' && _bandOfChar(s.currentCharId) === _tabs.activeBand()) {
    markAnswer(_quizView, s.pickedCharId, s.pickedCharId === s.currentCharId, s.currentCharId);
  }

  updateScore(_score, s.score);
}

function _renderIntro() {
  if (!_mountedRoot) return;
  _mountedRoot.innerHTML = '';

  // Band tabs
  _bandTabs = renderBandTabs(PLAYABLE_BAND_IDS, _tabs.activeBand(), (id) => {
    _tabs.setActiveBand(id);
  });
  _mountedRoot.appendChild(_bandTabs);

  _introView = renderIntroView({
    bandId: _tabs.activeBand(),
    onPlayChar: (charId) => audioPlay(charId),
  });
  _mountedRoot.appendChild(_introView);
}

function _renderQuizBottom() {
  const wrap = document.createElement('div');
  wrap.className = 'quiz-bottom';

  const mkBtn = (key, role, onClick, disabled = false) => {
    const b = document.createElement('button');
    b.className = 'quiz-action';
    b.setAttribute('data-role', role);
    b.textContent = t(`quiz.${key}`);
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  };

  wrap.appendChild(mkBtn('retry', 'retry', () => {
    _startNewIfNeeded();
    quizRetry();
    clearMarks(_quizView);
    setResult(_quizView, 'correct', { charName: t('common.unknown') }); // clear; will be re-set by play
    const result = _quizView.querySelector('[data-role="result-area"]');
    if (result) { result.hidden = true; result.innerHTML = ''; }
    _updatePlayButton();
  }));
  wrap.appendChild(mkBtn('next', 'next', () => {
    quizNext();
    clearMarks(_quizView);
    const result = _quizView.querySelector('[data-role="result-area"]');
    if (result) { result.hidden = true; result.innerHTML = ''; }
    _updatePlayButton();
  }));
  wrap.appendChild(mkBtn('hintBand', 'hint-band', () => {
    const bandId = hintBand();
    if (!bandId) return;
    const band = BAND_BY_ID[bandId];
    setResult(_quizView, 'hintBand', { bandName: band.name.zh });
  }));
  wrap.appendChild(mkBtn('reveal', 'reveal', () => {
    if (!canReveal()) return;
    revealAnswer();
    const s = getState();
    const char = CHARACTERS.find(c => c.id === s.currentCharId);
    if (char) {
      const locale = getLocale();
      const charName = char.name[locale] || char.name.zh || char.name.en;
      setResult(_quizView, 'answer', { charName });
      markAnswer(_quizView, s.pickedCharId, s.pickedCharId === s.currentCharId, s.currentCharId);
    }
  }));
  return wrap;
}

function _startNewIfNeeded() {
  const s = getState();
  if (!s.currentCharId) {
    newQuestion();
  }
}

function _handlePick(charId) {
  if (!canPick()) return;
  const s0 = getState();
  const correctCharId = s0.currentCharId;
  const pickedBand = _bandOfChar(charId);
  const targetBand = _bandOfChar(correctCharId);

  // If picked char is in a different band than current tab, switch tab
  if (pickedBand !== targetBand && pickedBand !== _tabs.activeBand()) {
    _tabs.setActiveBand(pickedBand);
  }

  const { correct } = pick(charId);
  markAnswer(_quizView, charId, correct, correctCharId);

  // Persist
  _progressState = recordAnswer(_progressState, correctCharId, correct);
  saveProgress(_progressState);
  updateScore(_score, getState().score);

  // Show result
  const char = CHARACTERS.find(c => c.id === correctCharId);
  const locale = getLocale();
  const charName = char?.name[locale] || char?.name.zh || char?.name.en;
  if (correct) {
    setResult(_quizView, 'correct', { charName });
  } else {
    setResult(_quizView, 'wrong', { charName });
    // Add fail image
    const result = _quizView.querySelector('[data-role="result-area"]');
    const img = document.createElement('img');
    img.className = 'fail-image';
    img.alt = '';
    img.src = FAIL_IMAGE;
    result.appendChild(img);
  }
  // Sync play button DOM — after pick, phase=answered → play button disabled.
  _updatePlayButton();
}

function _bandOfChar(charId) {
  return CHARACTERS.find(c => c.id === charId)?.bandId;
}

function _updatePlayButton() {
  const btn = _mountedRoot?.querySelector('[data-role="play-current"]');
  if (!btn) return;
  btn.disabled = !canPlay();
}