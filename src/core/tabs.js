/**
 * Tab controller — simple state holder with listener.
 *
 * Two-level:
 *  - top-level: ['quiz', 'intro']
 *  - band-level: ['poppin-party', 'afterglow', ...] (per top-level tab)
 *
 * Usage:
 *   const tabs = createTabs(['quiz', 'intro'], 'quiz', BANDS.map(b => b.id), 'poppin-party');
 *   tabs.setActive('intro');
 *   tabs.setActiveBand('roselia');
 *   tabs.onChange(name => render(name));
 *   tabs.onBandChange(name => renderBand(name));
 */

export function createTabs(topTabs, initialTop = null, bandTabs = [], initialBand = null) {
  let _top = topTabs.includes(initialTop) ? initialTop : topTabs[0];
  let _band = bandTabs.includes(initialBand) ? initialBand : (bandTabs[0] ?? null);
  const _topListeners = new Set();
  const _bandListeners = new Set();

  function setActive(name) {
    if (!topTabs.includes(name) || name === _top) return;
    _top = name;
    _topListeners.forEach(fn => { try { fn(name); } catch (e) { console.error(e); } });
  }

  function setActiveBand(name) {
    if (!bandTabs.includes(name) || name === _band) return;
    _band = name;
    _bandListeners.forEach(fn => { try { fn(name); } catch (e) { console.error(e); } });
  }

  return {
    active: () => _top,
    activeBand: () => _band,
    tabs: () => topTabs.slice(),
    bandTabs: () => bandTabs.slice(),
    setActive,
    setActiveBand,
    onChange(fn) {
      _topListeners.add(fn);
      return () => _topListeners.delete(fn);
    },
    onBandChange(fn) {
      _bandListeners.add(fn);
      return () => _bandListeners.delete(fn);
    },
  };
}