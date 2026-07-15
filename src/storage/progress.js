/**
 * localStorage-backed progress persistence for BanG Dream quiz.
 *
 * Schema v1:
 *   {
 *     version: 1,
 *     totals: { correct, wrong },
 *     byChar: { [charId]: { wrong } },
 *     history: [ { ts, charId, correct } ],
 *   }
 *
 * Notes:
 *  - 不存 current（quiz 是无尽模式，刷新就重抽更简单）
 *  - byChar 只记 wrong 数（让"提示乐队"按错最多优先）
 *  - history 限 100 条
 *  - localStorage 不可用时降级为内存（不影响功能）
 */

const STORAGE_KEY = 'bangdream.v1.progress';
const SCHEMA_VERSION = 1;
const HISTORY_CAP = 100;

export function defaultState() {
  return {
    version: SCHEMA_VERSION,
    totals: { correct: 0, wrong: 0 },
    byChar: {},
    history: [],
  };
}

let _memory = null;
let _useMemory = false;

function _lsAvailable() {
  try {
    const k = '__bd_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

function _init() {
  if (_memory === null && !_useMemory) {
    _useMemory = !_lsAvailable();
    if (_useMemory) {
      console.warn('[progress] localStorage unavailable; using in-memory fallback');
      _memory = defaultState();
    }
  }
}

function _read() {
  _init();
  if (_useMemory) return _memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (!data || data.version !== SCHEMA_VERSION) return defaultState();
    return data;
  } catch (e) {
    console.warn('[progress] failed to read state; resetting', e);
    return defaultState();
  }
}

function _write(state) {
  _init();
  if (_useMemory) {
    _memory = state;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[progress] failed to write state', e);
  }
}

export function loadProgress() {
  return _read();
}

export function saveProgress(state) {
  const next = { ...defaultState(), ...state, version: SCHEMA_VERSION };
  _write(next);
}

export function resetProgress() {
  _write(defaultState());
}

/**
 * Record an answer attempt.
 *
 * @param {object} state - current state
 * @param {string} charId - the correct answer's character
 * @param {boolean} correct
 * @returns {object} new state (immutable update)
 */
export function recordAnswer(state, charId, correct) {
  const next = JSON.parse(JSON.stringify(state || defaultState()));
  const ts = Date.now();

  if (correct) {
    next.totals.correct += 1;
  } else {
    next.totals.wrong += 1;
    if (!next.byChar[charId]) next.byChar[charId] = { wrong: 0 };
    next.byChar[charId].wrong += 1;
  }

  next.history.push({ ts, charId, correct });
  if (next.history.length > HISTORY_CAP) {
    next.history = next.history.slice(-HISTORY_CAP);
  }

  return next;
}

export function getCharWrongCount(state, charId) {
  return state?.byChar?.[charId]?.wrong ?? 0;
}

export function getSummary(state) {
  const total = state.totals.correct + state.totals.wrong;
  return {
    correct: state.totals.correct,
    wrong: state.totals.wrong,
    accuracy: total > 0 ? state.totals.correct / total : 0,
    uniqueCharsWrong: Object.keys(state.byChar).length,
  };
}

/** Test-only: reset internal cache. */
export function _reset() {
  _memory = null;
  _useMemory = false;
}