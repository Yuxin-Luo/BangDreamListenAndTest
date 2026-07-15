/**
 * Character card — a clickable tile with portrait + name + optional play button.
 *
 * Used by both quiz view (5 cards in current band) and intro view.
 */

import { portraitUrlFor } from './paths.js';
import { BAND_BY_ID } from '../data/bands.js';
import { t, getLocale } from '../i18n/index.js';

/**
 * Render a character card as a <button>.
 *
 * @param {object} opts
 * @param {string} opts.charId
 * @param {string} opts.portrait - filename relative to band's character dir
 * @param {{zh:string,en:string,ja:string}} opts.name
 * @param {string} opts.bandId
 * @param {() => void} opts.onClick
 * @param {boolean} [opts.showPlay]
 * @param {() => void} [opts.onPlay]
 * @param {boolean} [opts.disabled]
 * @returns {HTMLButtonElement}
 */
export function renderCharacterCard(opts) {
  const {
    charId,
    bandId,
    portrait,
    name,
    onClick,
    showPlay = false,
    onPlay,
    disabled = false,
  } = opts;

  const btn = document.createElement('button');
  btn.className = 'char-card';
  btn.setAttribute('data-role', 'char-card');
  btn.setAttribute('data-char', charId);
  btn.disabled = disabled;

  // Portrait
  const portraitWrap = document.createElement('div');
  portraitWrap.className = 'portrait-wrap';
  if (portrait) {
    const img = document.createElement('img');
    img.className = 'portrait';
    img.alt = '';
    img.loading = 'lazy';
    const band = BAND_BY_ID[bandId];
    if (band) {
      img.src = portraitUrlFor(charId, bandId);
    }
    img.addEventListener('error', () => {
      btn.classList.add('img-failed');
      img.remove();
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-text';
      placeholder.textContent = t('common.unknown');
      portraitWrap.appendChild(placeholder);
    });
    portraitWrap.appendChild(img);
  } else {
    btn.classList.add('img-failed');
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-text';
    placeholder.textContent = t('common.unknown');
    portraitWrap.appendChild(placeholder);
  }
  btn.appendChild(portraitWrap);

  // Name
  const nameEl = document.createElement('div');
  nameEl.className = 'char-name';
  nameEl.textContent = name[getLocale()] || name.zh || name.en || charId;
  btn.appendChild(nameEl);

  // Play button (intro view only)
  if (showPlay) {
    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.setAttribute('data-role', 'play-char');
    playBtn.type = 'button';
    playBtn.textContent = t('intro.listen');
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onPlay) onPlay();
    });
    btn.appendChild(playBtn);
  }

  btn.addEventListener('click', () => {
    if (!btn.disabled && onClick) onClick();
  });

  return btn;
}