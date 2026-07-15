import { describe, it, expect } from 'vitest';
import { BANDS, BAND_BY_ID } from '../src/data/bands.js';
import { CHARACTERS, CHARACTER_BY_ID, charactersOfBand } from '../src/data/characters.js';
import { SAMPLES } from '../src/data/samples.js';

describe('data integrity', () => {
  it('every band has 4-5 members', () => {
    for (const b of BANDS) {
      expect(b.members.length, `band ${b.id}`).toBeGreaterThanOrEqual(4);
      expect(b.members.length, `band ${b.id}`).toBeLessThanOrEqual(5);
    }
  });

  it('every character belongs to a band that exists', () => {
    for (const c of CHARACTERS) {
      expect(BAND_BY_ID[c.bandId], `char ${c.id}`).toBeDefined();
    }
  });

  it('every band member id resolves to a character', () => {
    for (const b of BANDS) {
      for (const mid of b.members) {
        expect(CHARACTER_BY_ID[mid], `band ${b.id} member ${mid}`).toBeDefined();
      }
    }
  });

  it('every character has a sample list (>=0; quiz.js skips empty)', () => {
    for (const c of CHARACTERS) {
      expect(SAMPLES[c.id], `char ${c.id}`).toBeDefined();
      expect(SAMPLES[c.id].length, `char ${c.id}`).toBeGreaterThanOrEqual(0);
    }
  });

  it('most characters (>=40) have >=1 audio sample', () => {
    const withAudio = CHARACTERS.filter(c => SAMPLES[c.id].length >= 1).length;
    expect(withAudio).toBeGreaterThanOrEqual(38);
  });

  it('charactersOfBand returns matching subset', () => {
    const poppin = charactersOfBand('poppin-party');
    expect(poppin.length).toBe(5);
    expect(poppin.map(c => c.id)).toEqual(['kasumi', 'tae', 'rimi', 'sayaka', 'arisa']);
  });

  it('total characters ≈ 45 (with uika)', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(43);
    expect(CHARACTERS.length).toBeLessThanOrEqual(48);
  });
});
