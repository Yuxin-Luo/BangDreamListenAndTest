/**
 * Quiz state machine — drives one question at a time.
 *
 * Phases:
 *   idle          → no question yet
 *   awaitPick     → question loaded, waiting for user (audio not yet played or already ended)
 *   playing       → audio currently playing
 *   answered      → user has picked; locked until retry/next
 *
 * Public API:
 *   newQuestion({exclude}?)    → pick new (charId, sampleIdx), phase='awaitPick'
 *   playCurrent()             → play current sample; phase flips playing→awaitPick on end
 *   pick(charId)              → judge; phase='answered'; updates score
 *   retry()                   → keep charId, resample idx, reset answered
 *   next()                    → newQuestion
 *   hintBand()                → return bandId of current char (no state change)
 *   revealAnswer()            → state.revealed=true (idempotent)
 *
 * Guards:
 *   canPlay()     → phase is idle or awaitPick
 *   canPick()     → phase is awaitPick
 *   canRetry()    → always true
 *   canNext()     → always true
 *   canHintBand() → phase in {awaitPick, answered} && !revealed
 *   canReveal()   → phase in {awaitPick, answered} && !revealed
 */

import { CHARACTERS } from '../data/characters.js';
import { SAMPLES } from '../data/samples.js';
import { playSample, stop as audioStop, hasSamples } from './audio.js';
import { recordAnswer, loadProgress } from '../storage/progress.js';

let _state = null;

function defaultState() {
  return {
    currentCharId: null,
    currentSampleIdx: null,
    phase: 'idle',           // 'idle' | 'awaitPick' | 'playing' | 'answered'
    answered: false,
    revealed: false,
    pickedCharId: null,
    score: { correct: 0, wrong: 0 },
  };
}

function _ensure() {
  if (!_state) _state = defaultState();
  return _state;
}

function _pickRandomChar(exclude = []) {
  // Build list of playable characters
  const pool = CHARACTERS.filter(c =>
    !exclude.includes(c.id) && hasSamples(c.id)
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function _pickRandomSample(charId) {
  const files = SAMPLES[charId] || [];
  if (files.length === 0) return null;
  return 1 + Math.floor(Math.random() * files.length);
}

export function newQuestion(opts = {}) {
  const s = _ensure();
  const exclude = opts.exclude || [];
  const char = _pickRandomChar(exclude);
  if (!char) {
    console.warn('[quiz] no playable characters');
    return;
  }
  s.currentCharId = char.id;
  s.currentSampleIdx = _pickRandomSample(char.id);
  s.phase = 'awaitPick';
  s.answered = false;
  s.revealed = false;
  s.pickedCharId = null;
}

export function playCurrent() {
  const s = _ensure();
  if (!s.currentCharId || !s.currentSampleIdx) return;
  if (s.phase !== 'idle' && s.phase !== 'awaitPick') return;
  s.phase = 'playing';
  playSample(s.currentCharId, s.currentSampleIdx, {
    onEnd: () => {
      if (s.phase === 'playing') {
        s.phase = 'awaitPick';
      }
    },
    onNotFound: (charId, sampleIdx) => {
      console.warn('[quiz] sample missing', charId, sampleIdx);
      // Resample this char; if still missing, move on
      const retry = _pickRandomSample(charId);
      if (retry) {
        s.currentSampleIdx = retry;
      } else {
        newQuestion();
      }
      s.phase = 'awaitPick';
    },
  });
}

export function pick(charId) {
  const s = _ensure();
  if (!canPick()) return { correct: false, charId: null };
  const correct = charId === s.currentCharId;
  s.answered = true;
  s.pickedCharId = charId;
  s.phase = 'answered';
  if (correct) s.score.correct += 1;
  else s.score.wrong += 1;
  return { correct, charId: s.currentCharId };
}

export function retry() {
  const s = _ensure();
  if (!s.currentCharId) return;
  // Pick a different sample from same character
  const cur = s.currentSampleIdx;
  let nextIdx = _pickRandomSample(s.currentCharId);
  if (nextIdx === cur && SAMPLES[s.currentCharId].length > 1) {
    // Ensure change when more than 1 sample
    while (nextIdx === cur) {
      nextIdx = _pickRandomSample(s.currentCharId);
    }
  }
  s.currentSampleIdx = nextIdx;
  s.phase = 'awaitPick';
  s.answered = false;
  s.revealed = false;
  s.pickedCharId = null;
}

export function next() {
  newQuestion();
}

export function hintBand() {
  const s = _ensure();
  const char = CHARACTERS.find(c => c.id === s.currentCharId);
  return char?.bandId ?? null;
}

export function revealAnswer() {
  const s = _ensure();
  if (canReveal()) {
    s.revealed = true;
  }
}

export function canPlay() {
  const s = _ensure();
  return s.phase === 'idle' || s.phase === 'awaitPick';
}

export function canPick() {
  const s = _ensure();
  return s.phase === 'awaitPick';
}

export function canRetry() {
  return true;
}

export function canNext() {
  return true;
}

export function canHintBand() {
  const s = _ensure();
  return (s.phase === 'awaitPick' || s.phase === 'answered') && !s.revealed;
}

export function canReveal() {
  const s = _ensure();
  return (s.phase === 'awaitPick' || s.phase === 'answered') && !s.revealed;
}

export function getState() {
  return _ensure();
}

export function stop() {
  audioStop();
  const s = _ensure();
  if (s.phase === 'playing') {
    s.phase = 'awaitPick';
  }
}

/** Test-only: simulate audio ending (no real audio). */
export function _simulateAudioEnded() {
  const s = _ensure();
  if (s.phase === 'playing') s.phase = 'awaitPick';
}

/** Test-only: reset state machine. */
export function _reset() {
  _state = defaultState();
}