/**
 * Band tab strip — horizontal buttons for switching active band.
 */

import { BAND_BY_ID } from '../data/bands.js';
import { bandIconUrl } from './paths.js';

export function renderBandTabs(bandIds, activeBandId, onSelect) {
  const container = document.createElement('div');
  container.className = 'band-tabs';
  container.setAttribute('data-role', 'band-tabs');

  for (const id of bandIds) {
    const band = BAND_BY_ID[id];
    if (!band) continue;
    const btn = document.createElement('button');
    btn.className = 'band-tab';
    btn.setAttribute('data-role', 'band-tab');
    btn.setAttribute('data-band', id);
    if (id === activeBandId) btn.classList.add('active');
    btn.type = 'button';

    // icon
    const iconUrl = bandIconUrl(id);
    if (iconUrl) {
      const img = document.createElement('img');
      img.className = 'band-icon';
      img.alt = '';
      img.loading = 'lazy';
      img.src = iconUrl;
      btn.appendChild(img);
    }

    // name
    const name = document.createElement('span');
    name.className = 'band-tab-name';
    name.textContent = band.name.zh;
    btn.appendChild(name);

    btn.addEventListener('click', () => {
      if (onSelect) onSelect(id);
    });
    container.appendChild(btn);
  }

  return container;
}