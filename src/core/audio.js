/**
 * Audio engine — plays character voice samples via HTMLAudioElement.
 *
 * Design notes:
 *  - 文件结构：assets/audio/<bandId>/<charId>/<n>.mp3
 *  - 路径通过 SAMPLES[charId][idx-1] 解析（1-based 索引对外）
 *  - 单例 _activeAudio：每次新 playSample() 都会先 stop 上一个
 *  - 不依赖 Web Audio API（mp3 由浏览器解码）
 *  - 404 通过 onerror → onNotFound 回调；UI 层决定后续动作
 *  - stop() 立刻停止播放且不抛错（幂等）
 */

import { CHARACTERS } from '../data/characters.js';
import { SAMPLES } from '../data/samples.js';

let _activeAudio = null;
let _activeHandlers = null;

/**
 * Resolve URL for a (charId, sampleIdx) pair.
 * @param {string} charId
 * @param {number} sampleIdx - 1-based
 * @returns {string|null} relative URL or null when missing
 */
export function sampleUrl(charId, sampleIdx) {
  const files = SAMPLES[charId];
  if (!files || files.length === 0) return null;
  const file = files[sampleIdx - 1];
  if (!file) return null;
  // Get bandId from CHARACTERS
  const char = CHARACTERS.find(c => c.id === charId);
  const bandId = char?.bandId;
  if (!bandId) return null;
  return `assets/audio/${bandId}/${charId}/${file}`;
}

/**
 * Whether a character has at least one playable sample.
 */
export function hasSamples(charId) {
  const files = SAMPLES[charId];
  return Array.isArray(files) && files.length > 0;
}

/**
 * Play a character's sample.
 *
 * @param {string} charId
 * @param {number} sampleIdx - 1-based; falls back to random if omitted
 * @param {object} [opts]
 * @param {() => void} [opts.onEnd] - called on natural end OR stop
 * @param {(charId: string, sampleIdx: number) => void} [opts.onNotFound]
 * @returns {Promise<void>} resolves on natural end
 */
export function playSample(charId, sampleIdx, opts = {}) {
  const { onEnd, onNotFound } = opts;

  // Resolve index: if not given, pick random
  const files = SAMPLES[charId];
  if (!files || files.length === 0) {
    if (onNotFound) onNotFound(charId, sampleIdx || 0);
    return Promise.resolve();
  }
  let idx = sampleIdx;
  if (!Number.isInteger(idx) || idx < 1 || idx > files.length) {
    idx = 1 + Math.floor(Math.random() * files.length);
  }

  const url = sampleUrl(charId, idx);
  if (!url) {
    if (onNotFound) onNotFound(charId, idx);
    return Promise.resolve();
  }

  // Abort previous (pause + drop reference + call onEnd to release state)
  _stopActive();

  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = url;
  // Force the element to start from the beginning so a cached/reused
  // element doesn't fire 'ended' immediately on the next play().
  try { audio.currentTime = 0; } catch {}

  let _settled = false;
  return new Promise((resolve) => {
    const finalize = () => {
      if (_settled) return;
      _settled = true;
      if (_activeAudio === audio) {
        _activeAudio = null;
        _activeHandlers = null;
      }
      try {
        audio.pause();
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      } catch {}
      if (onEnd) onEnd();
      resolve();
    };

    const onEnded = () => finalize();
    const onError = () => {
      if (onNotFound) onNotFound(charId, idx);
      finalize();
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    _activeAudio = audio;
    _activeHandlers = { onEnd, onNotFound };

    audio.play().catch(err => {
      // Autoplay policy or network failure.
      // NotFound errors fire onNotFound; other rejections (NotAllowedError
      // on rapid replay, etc.) just bail out cleanly without disturbing state.
      const isNotFound = err && (
        err.name === 'NotFoundError' ||
        /NotFound/i.test(err.message || '')
      );
      console.warn('[audio] play() rejected:', err);
      if (isNotFound && onNotFound) onNotFound(charId, idx);
      finalize();
    });
  });
}

/**
 * Stop current playback (if any). Idempotent.
 */
export function stop() {
  _stopActive();
}

function _stopActive() {
  if (_activeAudio) {
    const handlers = _activeHandlers;
    try {
      _activeAudio.pause();
      _activeAudio.currentTime = 0;
    } catch {}
    _activeAudio = null;
    _activeHandlers = null;
    if (handlers?.onEnd) {
      try { handlers.onEnd(); } catch {}
    }
  }
}

/** Test-only: reset internal state. */
export function _reset() {
  _activeAudio = null;
  _activeHandlers = null;
}