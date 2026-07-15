/**
 * Audio engine tests — mock HTMLAudioElement to avoid browser dependency.
 *
 * 2026-07-15: Audio engine plays character voice samples via HTMLAudioElement.
 * Uses preloading for snappy playback.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAMPLES } from '../src/data/samples.js';

// Minimal HTMLAudioElement mock
function makeFakeAudio() {
  const a = {
    src: '',
    preload: '',
    currentTime: 0,
    paused: true,
    ended: false,
    readyState: 4, // HAVE_ENOUGH_DATA
    error: null,
    _listeners: {},
    addEventListener(ev, fn) {
      (this._listeners[ev] ||= []).push(fn);
    },
    removeEventListener(ev, fn) {
      const arr = this._listeners[ev] || [];
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    },
    fire(ev) {
      (this._listeners[ev] || []).forEach(fn => fn());
    },
    load() { this.paused = true; },
    play() {
      this.paused = false;
      return Promise.resolve();
    },
    pause() { this.paused = true; },
  };
  return a;
}

let lastAudio = null;
const audioInstances = [];

beforeEach(() => {
  audioInstances.length = 0;
  lastAudio = null;
  // Patch global Audio
  global.Audio = function FakeAudio() {
    const a = makeFakeAudio();
    audioInstances.push(a);
    lastAudio = a;
    return a;
  };
});

describe('audio engine — sample URL resolution', () => {
  it('resolves a sample URL from charId + sample index', async () => {
    const { sampleUrl } = await import('../src/core/audio.js');
    const url = sampleUrl('kasumi', 1);
    expect(url).toMatch(/kasumi[\/\\]1\.mp3$/);
  });

  it('returns null for charId without samples', async () => {
    const { sampleUrl } = await import('../src/core/audio.js');
    expect(sampleUrl('sakiko', 1)).toBeNull();
  });

  it('returns null for out-of-range sample index', async () => {
    const { sampleUrl } = await import('../src/core/audio.js');
    expect(sampleUrl('kasumi', 99)).toBeNull();
    expect(sampleUrl('kasumi', 0)).toBeNull();
  });
});

describe('audio engine — playSample', () => {
  it('creates an HTMLAudioElement with the right src', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const promise = playSample('kasumi', 1);
    expect(lastAudio.src).toMatch(/kasumi[\/\\]1\.mp3$/);
    expect(lastAudio.preload).toBe('auto');
    // Resolve the play() promise to clean up
    lastAudio.play.mock?.(() => Promise.resolve());
  });

  it('returns a Promise and resolves on natural end', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const p = playSample('kasumi', 1);
    // Simulate playback end
    lastAudio.fire('ended');
    await expect(p).resolves.toBeUndefined();
  });

  it('calls onNotFound when charId has no samples', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const onNotFound = vi.fn();
    playSample('sakiko', 1, { onNotFound });
    // No audio created; onNotFound called immediately
    expect(onNotFound).toHaveBeenCalledWith('sakiko', 1);
  });

  it('calls onNotFound when audio element fires error', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const onNotFound = vi.fn();
    playSample('kasumi', 1, { onNotFound });
    // Trigger error after audio is created
    lastAudio.fire('error');
    expect(onNotFound).toHaveBeenCalledWith('kasumi', 1);
  });

  it('calls onEnd after natural playback ends', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const onEnd = vi.fn();
    const p = playSample('kasumi', 1, { onEnd });
    lastAudio.fire('ended');
    await p;
    expect(onEnd).toHaveBeenCalledOnce();
  });
});

describe('audio engine — stop()', () => {
  it('aborts in-flight playback', async () => {
    const { playSample, stop } = await import('../src/core/audio.js');
    const onEnd = vi.fn();
    playSample('kasumi', 1, { onEnd });
    stop();
    expect(lastAudio.paused).toBe(true);
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('is safe to call when nothing is playing', async () => {
    const { stop } = await import('../src/core/audio.js');
    expect(() => stop()).not.toThrow();
    expect(() => stop()).not.toThrow();
  });

  it('second playSample aborts the first', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const onEnd1 = vi.fn();
    const onEnd2 = vi.fn();
    playSample('kasumi', 1, { onEnd: onEnd1 });
    playSample('rimi', 1, { onEnd: onEnd2 });
    expect(onEnd1).toHaveBeenCalledOnce();
    expect(lastAudio.src).toMatch(/rimi[\/\\]1\.mp3$/);
  });

  it('survives 5 sequential play→ended cycles on the same char', async () => {
    const { playSample } = await import('../src/core/audio.js');
    const onEnd = vi.fn();
    for (let i = 0; i < 5; i++) {
      const p = playSample('kasumi', 1, { onEnd });
      // Always fires clean 'ended'
      lastAudio.fire('ended');
      await p;
    }
    expect(onEnd).toHaveBeenCalledTimes(5);
  });

  it('play→ended→stop→play does not lose audio reference', async () => {
    const { playSample, stop } = await import('../src/core/audio.js');
    const onEnd = vi.fn();
    // Cycle 1: play, ended
    let p = playSample('kasumi', 1, { onEnd });
    lastAudio.fire('ended');
    await p;
    // Cycle 2: play, stop (user clicks a different action)
    playSample('kasumi', 1, { onEnd });
    stop();
    // Cycle 3: play again — should still create a fresh audio
    const before = audioInstances.length;
    p = playSample('kasumi', 1, { onEnd });
    expect(audioInstances.length).toBe(before + 1);
    expect(lastAudio.paused).toBe(false);
    lastAudio.fire('ended');
    await p;
  });
});

describe('audio engine — hasSamples()', () => {
  it('returns true for characters with samples', async () => {
    const { hasSamples } = await import('../src/core/audio.js');
    expect(hasSamples('kasumi')).toBe(true);
  });

  it('returns false for empty-sample characters', async () => {
    const { hasSamples } = await import('../src/core/audio.js');
    expect(hasSamples('sakiko')).toBe(false);
  });

  it('returns false for unknown characters', async () => {
    const { hasSamples } = await import('../src/core/audio.js');
    expect(hasSamples('nobody')).toBe(false);
  });
});