/**
 * Quiz state machine tests.
 *
 * 2026-07-15: Tests drive the public API without touching DOM or audio.
 * Uses real SAMPLES + CHARACTERS; audio.playSample is replaced via vi.mock.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CHARACTERS } from '../src/data/characters.js';
import { SAMPLES } from '../src/data/samples.js';

vi.mock('../src/core/audio.js', () => ({
  playSample: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
  hasSamples: vi.fn((id) => (SAMPLES[id] || []).length > 0),
  sampleUrl: vi.fn(() => '/fake/url.mp3'),
}));

describe('quiz — newQuestion', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('picks a char with samples and a valid sample idx', async () => {
    const { newQuestion, getState } = await import('../src/core/quiz.js');
    newQuestion();
    const s = getState();
    expect(s.currentCharId).toBeTruthy();
    expect(CHARACTERS.find(c => c.id === s.currentCharId)).toBeDefined();
    expect(s.currentSampleIdx).toBeGreaterThanOrEqual(1);
    expect(SAMPLES[s.currentCharId].length).toBeGreaterThanOrEqual(s.currentSampleIdx);
  });

  it('sets phase to awaitPick (no audio yet)', async () => {
    const { newQuestion, getState } = await import('../src/core/quiz.js');
    newQuestion();
    expect(getState().phase).toBe('awaitPick');
    expect(getState().answered).toBe(false);
    expect(getState().pickedCharId).toBeNull();
  });

  it('1000 calls never pick a no-sample char', async () => {
    const { newQuestion, getState } = await import('../src/core/quiz.js');
    for (let i = 0; i < 1000; i++) {
      newQuestion();
      expect(SAMPLES[getState().currentCharId].length).toBeGreaterThan(0);
    }
  });

  it('skips excluded charId if provided', async () => {
    const { newQuestion, getState } = await import('../src/core/quiz.js');
    // Force many picks excluding kasumi
    for (let i = 0; i < 50; i++) {
      newQuestion({ exclude: ['kasumi'] });
      expect(getState().currentCharId).not.toBe('kasumi');
    }
  });
});

describe('quiz — playCurrent', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('transitions to playing then awaits ended', async () => {
    const { newQuestion, playCurrent, getState, _simulateAudioEnded } = await import('../src/core/quiz.js');
    const audioMod = await import('../src/core/audio.js');
    newQuestion();
    playCurrent();
    expect(getState().phase).toBe('playing');
    expect(audioMod.playSample).toHaveBeenCalledOnce();
    _simulateAudioEnded();
    expect(getState().phase).toBe('awaitPick');
  });

  it('does not throw when no current question', async () => {
    const { playCurrent } = await import('../src/core/quiz.js');
    expect(() => playCurrent()).not.toThrow();
  });
});

describe('quiz — pick', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('correct pick increments correct count and sets answered', async () => {
    const { newQuestion, pick, getState } = await import('../src/core/quiz.js');
    newQuestion();
    const charId = getState().currentCharId;
    pick(charId);
    const s = getState();
    expect(s.answered).toBe(true);
    expect(s.pickedCharId).toBe(charId);
    expect(s.phase).toBe('answered');
    expect(s.score.correct).toBe(1);
    expect(s.score.wrong).toBe(0);
  });

  it('wrong pick increments wrong count and sets answered', async () => {
    const { newQuestion, pick, getState } = await import('../src/core/quiz.js');
    newQuestion();
    const target = getState().currentCharId;
    // Pick any other character
    const wrongId = CHARACTERS.find(c => c.id !== target && SAMPLES[c.id]?.length > 0).id;
    pick(wrongId);
    const s = getState();
    expect(s.answered).toBe(true);
    expect(s.pickedCharId).toBe(wrongId);
    expect(s.score.wrong).toBe(1);
    expect(s.score.correct).toBe(0);
  });

  it('canPick() returns false after answered', async () => {
    const { newQuestion, pick, canPick, getState } = await import('../src/core/quiz.js');
    newQuestion();
    expect(canPick()).toBe(true);
    pick(getState().currentCharId);
    expect(canPick()).toBe(false);
  });

  it('second pick is ignored', async () => {
    const { newQuestion, pick, getState } = await import('../src/core/quiz.js');
    newQuestion();
    const target = getState().currentCharId;
    pick(target);
    const wrong = CHARACTERS.find(c => c.id !== target && SAMPLES[c.id]?.length > 0).id;
    pick(wrong);
    const s = getState();
    expect(s.score.correct).toBe(1);
    expect(s.score.wrong).toBe(0);
  });
});

describe('quiz — retry', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('keeps currentCharId but resamples and resets answered', async () => {
    const { newQuestion, pick, retry, getState } = await import('../src/core/quiz.js');
    newQuestion();
    const charId = getState().currentCharId;
    pick(charId);
    retry();
    const s = getState();
    expect(s.currentCharId).toBe(charId);
    expect(s.answered).toBe(false);
    expect(s.revealed).toBe(false);
    expect(s.phase).toBe('awaitPick');
  });

  it('canRetry() is always true', async () => {
    const { canRetry } = await import('../src/core/quiz.js');
    expect(canRetry()).toBe(true);
  });
});

describe('quiz — next', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('picks a new char and resets answered', async () => {
    const { newQuestion, pick, next, getState } = await import('../src/core/quiz.js');
    newQuestion();
    pick(getState().currentCharId);
    next();
    const s = getState();
    expect(s.answered).toBe(false);
    expect(s.revealed).toBe(false);
    expect(s.phase).toBe('awaitPick');
  });

  it('canNext() is always true', async () => {
    const { canNext } = await import('../src/core/quiz.js');
    expect(canNext()).toBe(true);
  });
});

describe('quiz — hintBand / revealAnswer', () => {
  beforeEach(async () => {
    const mod = await import('../src/core/quiz.js');
    mod._reset();
  });

  it('revealAnswer sets revealed=true', async () => {
    const { newQuestion, revealAnswer, getState } = await import('../src/core/quiz.js');
    newQuestion();
    revealAnswer();
    expect(getState().revealed).toBe(true);
  });

  it('revealAnswer is idempotent', async () => {
    const { newQuestion, revealAnswer, getState } = await import('../src/core/quiz.js');
    newQuestion();
    revealAnswer();
    revealAnswer();
    expect(getState().revealed).toBe(true);
  });

  it('canReveal is false in playing phase', async () => {
    const { newQuestion, playCurrent, canReveal, _simulateAudioEnded } = await import('../src/core/quiz.js');
    newQuestion();
    playCurrent();
    expect(canReveal()).toBe(false);
    _simulateAudioEnded();
    expect(canReveal()).toBe(true);
  });

  it('retry/next clear revealed flag', async () => {
    const { newQuestion, revealAnswer, retry, next, getState } = await import('../src/core/quiz.js');
    newQuestion();
    revealAnswer();
    retry();
    expect(getState().revealed).toBe(false);
    revealAnswer();
    next();
    expect(getState().revealed).toBe(false);
  });
});