## Task 1：项目脚手架 + i18n 三语

**Files:**
- Create: `package.json`, `vitest.config.js`, `dev-server.py`, `.gitignore`, `CLAUDE.md`, `README.md`, `src/main.js`, `src/i18n/index.js`, `src/i18n/zh.js`, `src/i18n/en.js`, `src/i18n/ja.js`, `tests/i18n.test.js`

**Step 1.1：git init + 写 `.gitignore`**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git init
```

写 `.gitignore`：
```gitignore
node_modules/
dist/
.DS_Store
*.log
.env
```

**Step 1.2：复制 MorsePractice 的 `dev-server.py`**

```bash
cp /home/ruo/Desktop/LYX/VibeCoding/MorsePractice/dev-server.py ./
```

（这是一个简单的 `python3 -m http.server` 包装。如不可用，直接在 README 写 `python3 -m http.server 8000` 即可。）

**Step 1.3：写 `package.json`**

```json
{
  "name": "bangdream-quiz",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "BanG Dream 听声音猜角色测试（zh/en/ja）",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "dev": "python3 -m http.server 8000"
  },
  "devDependencies": {
    "vitest": "^1.6.0",
    "happy-dom": "^14.0.0"
  }
}
```

**Step 1.4：写 `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
  },
});
```

**Step 1.5：写 `CLAUDE.md`（仅索引，不含规则）**

```markdown
# CLAUDE.md — BanG Dream 听声音猜角色 项目索引

> 本文件只做项目文档索引，不包含指令类规则。
> 全部项目事实 / 硬约束 / 当前阻塞 / 踩坑历史在：
>
> - `docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md` — 设计
> - `dev-docs/06-handoff-2026-07-15.md` — 接手指南

外部参考：复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的架构模式。
```

**Step 1.6：写 `src/i18n/index.js`（基于 MorsePractice 改造，支持 ja）**

完整代码（参考 MorsePractice `src/i18n/index.js`，把 zh/en 改为 zh/en/ja）：

```js
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
```

**Step 1.7：写 `src/i18n/zh.js`**

```js
export default {
  'language.switchTo': '切到英语',
  'language.label': '中',
  'tab.quiz': '🎵 听声音猜角色',
  'tab.intro': '📖 乐队·角色介绍',
  'quiz.play': '▶️ 播放声音',
  'quiz.score': '已答：{correct} 对 {wrong} 错',
  'quiz.retry': '重试',
  'quiz.next': '下一题',
  'quiz.hintBand': '提示乐队',
  'quiz.reveal': '答案',
  'quiz.correct': '✅ 正确！',
  'quiz.wrong': '❌ 失败',
  'quiz.answer': '📖 答案',
  'quiz.hintBandPrefix': '💡 提示乐队：',
  'quiz.playAgain': '▶️ 再听一次',
  'quiz.audioMissing': '该角色样本暂缺，已自动切到下一题',
  'intro.bandDesc': '▼ 简介',
  'intro.listen': '▶️ 听',
  'intro.audioMissing': '该角色样本暂缺',
  'common.unknown': '未知',
  'band.poppin-party': "Poppin'Party",
  'band.afterglow': 'Afterglow',
  'band.pastel-palettes': 'Pastel*Palettes',
  'band.roselia': 'Roselia',
  'band.hhw': 'Hello, Happy World!',
  'band.morfonica': 'Morfonica',
  'band.ras': 'RAISE A SUILEN',
  'band.mygo': 'MYGO!!!!!',
  'band.ave-mujica': 'Ave Mujica',
};
```

**Step 1.8：写 `src/i18n/en.js`**

```js
export default {
  'language.switchTo': 'Switch to English',
  'language.label': 'EN',
  'tab.quiz': '🎵 Listen & Guess',
  'tab.intro': '📖 Bands & Characters',
  'quiz.play': '▶️ Play Voice',
  'quiz.score': 'Score: {correct} correct / {wrong} wrong',
  'quiz.retry': 'Retry',
  'quiz.next': 'Next',
  'quiz.hintBand': 'Hint Band',
  'quiz.reveal': 'Answer',
  'quiz.correct': '✅ Correct! ',
  'quiz.wrong': '❌ Wrong',
  'quiz.answer': '📖 Answer: ',
  'quiz.hintBandPrefix': '💡 Band: ',
  'quiz.playAgain': '▶️ Play Again',
  'quiz.audioMissing': 'Voice sample missing. Skipped to next question.',
  'intro.bandDesc': '▼ About',
  'intro.listen': '▶️ Listen',
  'intro.audioMissing': 'Voice sample missing',
  'common.unknown': 'Unknown',
  'band.poppin-party': "Poppin'Party",
  'band.afterglow': 'Afterglow',
  'band.pastel-palettes': 'Pastel*Palettes',
  'band.roselia': 'Roselia',
  'band.hhw': 'Hello, Happy World!',
  'band.morfonica': 'Morfonica',
  'band.ras': 'RAISE A SUILEN',
  'band.mygo': 'MYGO!!!!!',
  'band.ave-mujica': 'Ave Mujica',
};
```

**Step 1.9：写 `src/i18n/ja.js`**

```js
export default {
  'language.switchTo': '日本語に切替',
  'language.label': '日',
  'tab.quiz': '🎵 声で当てよう',
  'tab.intro': '📖 バンド・キャラ紹介',
  'quiz.play': '▶️ 再生',
  'quiz.score': 'スコア：{correct} 正解 / {wrong} 不正解',
  'quiz.retry': 'リトライ',
  'quiz.next': '次の問題',
  'quiz.hintBand': 'バンドをヒント',
  'quiz.reveal': '答え',
  'quiz.correct': '✅ 正解！',
  'quiz.wrong': '❌ 不正解',
  'quiz.answer': '📖 答え：',
  'quiz.hintBandPrefix': '💡 バンド：',
  'quiz.playAgain': '▶️ もう一度聴く',
  'quiz.audioMissing': '音声サンプルなし。次の問題へ。',
  'intro.bandDesc': '▼ 紹介',
  'intro.listen': '▶️ 聴く',
  'intro.audioMissing': '音声サンプルなし',
  'common.unknown': '不明',
  'band.poppin-party': "Poppin'Party",
  'band.afterglow': 'Afterglow',
  'band.pastel-palettes': 'Pastel*Palettes',
  'band.roselia': 'Roselia',
  'band.hhw': 'Hello, Happy World!',
  'band.morfonica': 'Morfonica',
  'band.ras': 'RAISE A SUILEN',
  'band.mygo': 'MYGO!!!!!',
  'band.ave-mujica': 'Ave Mujica',
};
```

**Step 1.10：写 `tests/i18n.test.js`**

```js
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
```

**Step 1.11：装依赖 + 跑测试**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm install
npm test
```

期望：6 tests passing.

**Step 1.12：写 `src/main.js`（启动入口 + 错误条，参考 MorsePractice）**

```js
/**
 * App entry. Imports initApp from ui/app.js (Task 8 stub for now).
 */

function showBootError(err) {
  console.error('[boot] fatal error:', err);
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0;
    background: #f87171; color: #7f1d1d;
    padding: 12px 20px; font-family: monospace; font-size: 13px;
    border-bottom: 2px solid #b91c1c; z-index: 9999;
    white-space: pre-wrap; word-break: break-word;
  `;
  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
  document.body.prepend(banner);
}

function boot() {
  try {
    // ui/app.js 的 initApp() 在 Task 8 接入。当前 Task 1 只做 i18n 初始化 + DOM 占位。
    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
    initI18n();
    applyTranslations();
    const sw = document.querySelector('[data-i18n-lang-switch]');
    if (sw) sw.addEventListener('click', cycleLocale);
  } catch (err) {
    showBootError(err);
  }
  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

**Step 1.13：写最小 `index.html` 占位（Task 8 会扩展）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>BanG Dream 听声音猜角色</title>
</head>
<body>
  <button data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

**Step 1.14：手动启动 + 验证**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/ | head -5
kill %1
```

期望：HTML 内容回显。

**Step 1.15：commit**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git add -A
git commit -m "feat: scaffold + i18n (zh/en/ja)"
```

---

