/**
 * Intro view — band description + 5 character cards with play buttons.
 */

import { charactersOfBand } from '../data/characters.js';
import { BAND_BY_ID } from '../data/bands.js';
import { renderCharacterCard } from './character.js';
import { t, getLocale } from '../i18n/index.js';

/**
 * Render intro view for a band.
 *
 * @param {object} opts
 * @param {string} opts.bandId
 * @param {(charId: string) => void} opts.onPlayChar
 * @returns {HTMLElement}
 */
export function renderIntroView(opts) {
  const { bandId, onPlayChar } = opts;
  const band = BAND_BY_ID[bandId];

  const container = document.createElement('section');
  container.className = 'intro-view';
  container.setAttribute('data-role', 'intro-view');
  container.setAttribute('data-band', bandId);

  // Title
  const title = document.createElement('h2');
  title.className = 'intro-title';
  const loc = getLocale();
  title.textContent = band.name[loc] || band.name.zh || band.name.en;
  container.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.className = 'band-desc';
  desc.setAttribute('data-role', 'band-desc');
  desc.textContent = band.desc[loc] || band.desc.zh || band.desc.en;
  container.appendChild(desc);

  // Character cards
  const grid = document.createElement('div');
  grid.className = 'char-grid';
  for (const char of charactersOfBand(bandId)) {
    const card = renderCharacterCard({
      charId: char.id,
      bandId: char.bandId,
      portrait: char.portrait,
      name: char.name,
      onClick: () => {},  // intro: click does nothing (use play)
      showPlay: true,
      onPlay: () => onPlayChar(char.id),
    });
    grid.appendChild(card);
  }
  container.appendChild(grid);

  return container;
}