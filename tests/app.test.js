/**
 * App controller tests — verify boot, tab wiring, and integration.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAMPLES } from '../src/data/samples.js';

vi.mock('../src/core/audio.js', () => ({
  playSample: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
  hasSamples: vi.fn((id) => (SAMPLES[id] || []).length > 0),
  sampleUrl: vi.fn(() => '/fake/url.mp3'),
}));

describe('app — score display', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('updates score text after each answer', async () => {
    const { renderScore, updateScore } = await import('../src/ui/score.js');
    const score = renderScore();
    expect(score.textContent).toMatch(/0.*0/);  // initial "已答：0 对 0 错"
    updateScore(score, { correct: 3, wrong: 1 });
    expect(score.textContent).toMatch(/3.*1/);
  });
});

describe('app — band tabs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders 9 band tabs', async () => {
    const { renderBandTabs } = await import('../src/ui/band-tabs.js');
    const tabs = renderBandTabs(['poppin-party', 'afterglow'], 'poppin-party');
    expect(tabs.querySelectorAll('[data-role="band-tab"]').length).toBe(2);
  });

  it('marks active band with class', async () => {
    const { renderBandTabs } = await import('../src/ui/band-tabs.js');
    const tabs = renderBandTabs(['poppin-party', 'afterglow'], 'afterglow');
    expect(tabs.querySelector('[data-band="afterglow"]').classList.contains('active')).toBe(true);
    expect(tabs.querySelector('[data-band="poppin-party"]').classList.contains('active')).toBe(false);
  });

  it('clicking a band tab fires callback', async () => {
    const { renderBandTabs } = await import('../src/ui/band-tabs.js');
    const fn = vi.fn();
    const tabs = renderBandTabs(['poppin-party', 'afterglow'], 'poppin-party', fn);
    tabs.querySelector('[data-band="afterglow"]').click();
    expect(fn).toHaveBeenCalledWith('afterglow');
  });
});