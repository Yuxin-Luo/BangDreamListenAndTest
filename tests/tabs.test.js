/**
 * Tab controller tests — verify top-level (quiz/intro) and band tab switching.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTabs } from '../src/core/tabs.js';

describe('tabs — top level (quiz/intro)', () => {
  it('starts on quiz by default', () => {
    const t = createTabs(['quiz', 'intro']);
    expect(t.active()).toBe('quiz');
  });

  it('starts on specified tab', () => {
    const t = createTabs(['quiz', 'intro'], 'intro');
    expect(t.active()).toBe('intro');
  });

  it('setActive() changes active tab', () => {
    const t = createTabs(['quiz', 'intro']);
    t.setActive('intro');
    expect(t.active()).toBe('intro');
  });

  it('setActive() ignores unknown tabs', () => {
    const t = createTabs(['quiz', 'intro']);
    t.setActive('nope');
    expect(t.active()).toBe('quiz');
  });

  it('setActive() fires listener', () => {
    const t = createTabs(['quiz', 'intro']);
    const fn = vi.fn();
    t.onChange(fn);
    t.setActive('intro');
    expect(fn).toHaveBeenCalledWith('intro');
  });

  it('setActive() to same tab does not fire listener (no-op)', () => {
    const t = createTabs(['quiz', 'intro']);
    const fn = vi.fn();
    t.onChange(fn);
    t.setActive('quiz');
    expect(fn).not.toHaveBeenCalled();
  });

  it('listener can be removed', () => {
    const t = createTabs(['quiz', 'intro']);
    const fn = vi.fn();
    const off = t.onChange(fn);
    off();
    t.setActive('intro');
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('tabs — band level (per top-level tab)', () => {
  it('starts on first band', () => {
    const t = createTabs(['quiz'], null, ['poppin-party', 'afterglow', 'roselia']);
    expect(t.activeBand()).toBe('poppin-party');
  });

  it('starts on specified band', () => {
    const t = createTabs(['quiz'], null, ['poppin-party', 'afterglow', 'roselia'], 'afterglow');
    expect(t.activeBand()).toBe('afterglow');
  });

  it('setActiveBand() changes active band', () => {
    const t = createTabs(['quiz'], null, ['poppin-party', 'afterglow', 'roselia']);
    t.setActiveBand('roselia');
    expect(t.activeBand()).toBe('roselia');
  });

  it('setActiveBand() fires listener', () => {
    const t = createTabs(['quiz'], null, ['poppin-party', 'afterglow', 'roselia']);
    const fn = vi.fn();
    t.onBandChange(fn);
    t.setActiveBand('roselia');
    expect(fn).toHaveBeenCalledWith('roselia');
  });

  it('setActiveBand() ignores unknown bands', () => {
    const t = createTabs(['quiz'], null, ['poppin-party', 'afterglow']);
    t.setActiveBand('unknown');
    expect(t.activeBand()).toBe('poppin-party');
  });

  it('top-level and band-level are independent', () => {
    const t = createTabs(['quiz', 'intro'], null, ['poppin-party', 'afterglow']);
    t.setActive('intro');
    t.setActiveBand('afterglow');
    expect(t.active()).toBe('intro');
    expect(t.activeBand()).toBe('afterglow');
  });
});