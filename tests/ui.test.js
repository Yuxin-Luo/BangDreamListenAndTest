/**
 * UI rendering tests — DOM manipulation helpers.
 *
 * Happy-dom provides window/document. We render via ui modules then assert.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAMPLES } from '../src/data/samples.js';

vi.mock('../src/core/audio.js', () => ({
  playSample: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
  hasSamples: vi.fn((id) => (SAMPLES[id] || []).length > 0),
  sampleUrl: vi.fn(() => '/fake/url.mp3'),
}));

describe('ui — characterCard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders portrait + name for a character', async () => {
    const { renderCharacterCard } = await import('../src/ui/character.js');
    const card = renderCharacterCard({
      charId: 'kasumi',
      bandId: 'poppin-party',
      portrait: 'kasumi.png',
      name: { zh: '香澄', en: 'Kasumi', ja: '香澄' },
      onClick: () => {},
      showPlay: false,
    });
    expect(card.tagName).toBe('BUTTON');
    expect(card.querySelector('img').getAttribute('src')).toBe('assets/images/character/Poppin\'Party/kasumi.png');
    expect(card.textContent).toContain('Kasumi');
  });

  it('renders play button when showPlay=true', async () => {
    const { renderCharacterCard } = await import('../src/ui/character.js');
    const card = renderCharacterCard({
      charId: 'kasumi',
      bandId: 'poppin-party',
      portrait: 'kasumi.png',
      name: { zh: '香澄', en: 'Kasumi', ja: '香澄' },
      onClick: () => {},
      showPlay: true,
    });
    expect(card.querySelector('[data-role="play-char"]')).toBeTruthy();
  });

  it('renders placeholder text when portrait 404s', async () => {
    const { renderCharacterCard } = await import('../src/ui/character.js');
    const card = renderCharacterCard({
      charId: 'kasumi',
      portrait: 'kasumi.png',
      name: { zh: '香澄', en: 'Kasumi', ja: '香澄' },
      onClick: () => {},
      showPlay: false,
    });
    const img = card.querySelector('img');
    img.dispatchEvent(new Event('error'));
    expect(card.classList.contains('img-failed')).toBe(true);
    expect(card.querySelector('.placeholder-text')).toBeTruthy();
  });

  it('does not throw when character has no portrait', async () => {
    const { renderCharacterCard } = await import('../src/ui/character.js');
    const card = renderCharacterCard({
      charId: 'kasumi',
      portrait: null,
      name: { zh: '香澄', en: 'Kasumi', ja: '香澄' },
      onClick: () => {},
      showPlay: false,
    });
    expect(card).toBeTruthy();
    expect(card.querySelector('.placeholder-text')).toBeTruthy();
  });
});

describe('ui — quiz view', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts 5 character buttons for the active band', async () => {
    const { renderQuizView } = await import('../src/ui/quiz.js');
    const onPick = vi.fn();
    const view = renderQuizView({ bandId: 'poppin-party', onPick });
    const buttons = view.querySelectorAll('[data-role="char-option"]');
    expect(buttons.length).toBe(5);
  });

  it('clicking a character calls onPick with charId', async () => {
    const { renderQuizView } = await import('../src/ui/quiz.js');
    const onPick = vi.fn();
    const view = renderQuizView({ bandId: 'poppin-party', onPick });
    const firstBtn = view.querySelector('[data-role="char-option"]');
    firstBtn.click();
    expect(onPick).toHaveBeenCalledWith('kasumi');
  });

  it('marks correct/wrong pick visually', async () => {
    const { renderQuizView, markAnswer } = await import('../src/ui/quiz.js');
    const view = renderQuizView({ bandId: 'poppin-party', onPick: () => {} });
    markAnswer(view, 'kasumi', true, 'kasumi');
    const kasumiBtn = view.querySelector('[data-char="kasumi"]');
    expect(kasumiBtn.classList.contains('correct')).toBe(true);
  });

  it('markAnswer highlights correct even when wrong picked', async () => {
    const { renderQuizView, markAnswer } = await import('../src/ui/quiz.js');
    const view = renderQuizView({ bandId: 'poppin-party', onPick: () => {} });
    markAnswer(view, 'arisa', false, 'kasumi');
    expect(view.querySelector('[data-char="arisa"]').classList.contains('wrong')).toBe(true);
    expect(view.querySelector('[data-char="kasumi"]').classList.contains('correct')).toBe(true);
  });
});

describe('ui — intro view', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts 5 character cards with play buttons', async () => {
    const { renderIntroView } = await import('../src/ui/intro.js');
    const view = renderIntroView({ bandId: 'poppin-party', onPlayChar: () => {} });
    expect(view.querySelectorAll('[data-role="char-card"]').length).toBe(5);
    expect(view.querySelectorAll('[data-role="play-char"]').length).toBe(5);
  });

  it('clicking play button calls onPlayChar with charId', async () => {
    const { renderIntroView } = await import('../src/ui/intro.js');
    const onPlayChar = vi.fn();
    const view = renderIntroView({ bandId: 'poppin-party', onPlayChar });
    const firstPlay = view.querySelector('[data-role="play-char"]');
    firstPlay.click();
    expect(onPlayChar).toHaveBeenCalledWith('kasumi');
  });

  it('renders band description text', async () => {
    const { renderIntroView } = await import('../src/ui/intro.js');
    const view = renderIntroView({ bandId: 'poppin-party', onPlayChar: () => {} });
    const desc = view.querySelector('[data-role="band-desc"]');
    expect(desc.textContent.length).toBeGreaterThan(5);
  });
});