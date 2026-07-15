import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n, setLocale, t, applyTranslations } from '../src/i18n/index.js';

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear();
    initI18n();
  });

  it('detects zh from navigator.language', () => {
    setLocale('zh');
    expect(t('language.label')).toBe('中');
  });

  it('detects ja from navigator.language', () => {
    setLocale('ja');
    expect(t('language.label')).toBe('日');
  });

  it('detects en from navigator.language', () => {
    setLocale('en');
    expect(t('language.label')).toBe('EN');
  });

  it('falls back to [missing.key] for unknown key', () => {
    expect(t('foo.bar.baz')).toBe('[foo.bar.baz]');
  });

  it('interpolates {vars}', () => {
    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('3');
    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('1');
  });

  it('applyTranslations updates [data-i18n] elements', () => {
    document.body.innerHTML = '<div data-i18n="quiz.retry"></div>';
    setLocale('zh');
    applyTranslations();
    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('重试');
    setLocale('en');
    applyTranslations();
    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('Retry');
    setLocale('ja');
    applyTranslations();
    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('リトライ');
  });
});
