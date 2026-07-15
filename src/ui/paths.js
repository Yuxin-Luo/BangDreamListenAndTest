/**
 * Image path resolution — maps bandId/charId to actual filesystem paths.
 *
 * Filesystem layout (decided by user):
 *   assets/images/character/<bandDisplayName>/<charId>.png
 *   assets/images/band/icon/<bandDisplayName> 100.webp
 *   assets/images/band/groupPic/<bandDisplayName>.<ext>
 *   assets/images/fail/<failFile>
 *
 * Why this helper: filesystem uses display names with spaces/apostrophes,
 * but code uses kebab-case IDs. Centralize the mapping here.
 */

import { BANDS } from '../data/bands.js';

/** bandId → band.displayName (the on-disk directory name). */
export const BAND_DIR = Object.fromEntries(
  BANDS.map(b => [b.id, b.name.en])
);

/** bandId → band icon URL. */
export function bandIconUrl(bandId) {
  const name = BAND_DIR[bandId];
  if (!name) return null;
  return `assets/images/band/icon/${name} 100.webp`;
}

/** bandId → band group picture URL. */
export function bandGroupPicUrl(bandId) {
  const name = BAND_DIR[bandId];
  if (!name) return null;
  // Try .jpg first (most bands), fallback to .png in srcset
  return `assets/images/band/groupPic/${name}.jpg`;
}

/**
 * Build portrait URL for a character.
 *
 * @param {string} charId  - kebab-case id (filename basename)
 * @param {string} bandId  - band kebab-case id; only used to look up display dir
 * @returns {string|null}  - relative URL or null when bandId unknown
 */
export function portraitUrlFor(charId, bandId) {
  const name = BAND_DIR[bandId];
  if (!name) return null;
  return `assets/images/character/${name}/${charId}.png`;
}

/** Fail image URL (Kasumi crying). */
export const FAIL_IMAGE = 'assets/images/fail/crying.jpg';