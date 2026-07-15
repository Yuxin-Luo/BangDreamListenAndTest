/**
 * i18n runtime (zh/en/ja).
 *
 * Usage:
 *   import { t, setLocale, getLocale, initI18n, applyTranslations } from './i18n/index.js';
 *   t('band.poppin-party')         // → 'Poppin\'Party' or 'Poppin\'Party'
 *   setLocale('ja');
 *
 * Behavior:
 *   - locale persisted in localStorage key 'bangdream.v1.locale'
 *   - on first load, falls back to navigator.language (zh* → 'zh', ja* → 'ja', else 'en')
 *   - missing keys return '[missing.key]' rather than throwing
 *   - DOM helper applyTranslations() walks all [data-i18n] elements
 */

import zh from './zh.js';
import en from './en.js';
import ja from './ja.js';

const STORAGE_KEY = 'bangdream.v1.locale';
const DICTS = { zh, en, ja };

let _locale = null;
let _dict = null;

function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DICTS[saved]) return saved;
  } catch {}
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  const low = nav.toLowerCase();
  if (low.startsWith('zh')) return 'zh';
  if (low.startsWith('ja')) return 'ja';
  return 'en';
}

function loadDict(locale) {
  return DICTS[locale] || DICTS.zh;
}

export function initI18n() {
  if (_locale) return;
  _locale = detectLocale();
  _dict = loadDict(_locale);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = _locale === 'zh' ? 'zh-CN'
      : _locale === 'ja' ? 'ja-JP' : 'en';
  }
}

export function getLocale() {
  initI18n();
  return _locale;
}

export function setLocale(locale) {
  if (!DICTS[locale]) return;
  _locale = locale;
  _dict = loadDict(locale);
  try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN'
      : locale === 'ja' ? 'ja-JP' : 'en';
    applyTranslations();
  }
}

export function cycleLocale() {
  // 顺时针循环：zh → en → ja → zh
  const order = ['zh', 'en', 'ja'];
  const next = order[(order.indexOf(_locale) + 1) % order.length];
  setLocale(next);
}

export function t(key, vars) {
  initI18n();
  const parts = key.split('.');
  let cur = _dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return `[${key}]`;
    }
  }
  if (typeof cur !== 'string') return `[${key}]`;
  if (!vars) return cur;
  return cur.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
}

export function applyTranslations() {
  if (typeof document === 'undefined') return;
  initI18n();
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  const sw = document.querySelector('[data-i18n-lang-switch]');
  if (sw) sw.textContent = t('language.switchTo');
  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { locale: _locale } }));
}
