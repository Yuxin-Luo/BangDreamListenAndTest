/**
 * Progress persistence tests — verify schema, atomic save/load, fallback.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  defaultState,
  loadProgress,
  saveProgress,
  resetProgress,
  recordAnswer,
  getCharWrongCount,
  getSummary,
} from '../src/storage/progress.js';

describe('progress — schema', () => {
  beforeEach(() => {
    localStorage.clear();
    resetProgress();
  });

  it('default state has expected shape', () => {
    const s = defaultState();
    expect(s.version).toBe(1);
    expect(s.totals).toEqual({ correct: 0, wrong: 0 });
    expect(s.byChar).toEqual({});
    expect(s.history).toEqual([]);
  });

  it('loadProgress returns default when nothing saved', () => {
    const s = loadProgress();
    expect(s.version).toBe(1);
    expect(s.totals.correct).toBe(0);
  });
});

describe('progress — recordAnswer', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('correct answer increments totals.correct', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', true);
    expect(s.totals.correct).toBe(1);
    expect(s.totals.wrong).toBe(0);
  });

  it('wrong answer increments totals.wrong', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', false);
    expect(s.totals.wrong).toBe(1);
  });

  it('wrong answer increments byChar for the target', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', false);
    expect(s.byChar.kasumi).toEqual({ wrong: 1 });
  });

  it('correct answer does NOT increment byChar', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', true);
    expect(s.byChar.kasumi).toBeUndefined();
  });

  it('multiple wrong answers accumulate', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', false);
    s = recordAnswer(s, 'kasumi', false);
    s = recordAnswer(s, 'kasumi', false);
    expect(s.byChar.kasumi.wrong).toBe(3);
  });

  it('history is recorded with timestamp', () => {
    let s = loadProgress();
    const before = Date.now();
    s = recordAnswer(s, 'kasumi', true);
    expect(s.history.length).toBe(1);
    expect(s.history[0].charId).toBe('kasumi');
    expect(s.history[0].correct).toBe(true);
    expect(s.history[0].ts).toBeGreaterThanOrEqual(before);
  });

  it('history caps at 100 entries', () => {
    let s = loadProgress();
    for (let i = 0; i < 120; i++) {
      s = recordAnswer(s, 'kasumi', true);
    }
    expect(s.history.length).toBe(100);
  });
});

describe('progress — persistence round-trip', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('saveProgress + loadProgress round-trips', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', false);
    saveProgress(s);
    const loaded = loadProgress();
    expect(loaded.totals.wrong).toBe(1);
    expect(loaded.byChar.kasumi.wrong).toBe(1);
  });
});

describe('progress — helpers', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('getCharWrongCount returns 0 for unseen', () => {
    const s = loadProgress();
    expect(getCharWrongCount(s, 'kasumi')).toBe(0);
  });

  it('getCharWrongCount returns wrong count for seen', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', false);
    s = recordAnswer(s, 'kasumi', false);
    expect(getCharWrongCount(s, 'kasumi')).toBe(2);
  });

  it('getSummary reflects state', () => {
    let s = loadProgress();
    s = recordAnswer(s, 'kasumi', true);
    s = recordAnswer(s, 'rimi', false);
    const sum = getSummary(s);
    expect(sum.correct).toBe(1);
    expect(sum.wrong).toBe(1);
    expect(sum.accuracy).toBe(0.5);
    expect(sum.uniqueCharsWrong).toBe(1);
  });
});