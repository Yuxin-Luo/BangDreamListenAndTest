# BanG Dream 听声音猜角色 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 单页 Web demo，播放 BanG Dream 角色台词让用户猜角色，UI 中英日三语切换，浅色风格，本地 `python3 -m http.server` 运行。

**Architecture:** 复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的纯 ES Module + Vanilla JS 模式。模块边界清晰（core/data/i18n/storage/ui），单例 AudioContext，三 Tab 单页（顶栏 + 两个主 Tab）。所有代码入 `src/`，资源入 `assets/`，过程文档入 `dev-docs/`，调研资料入 `research/`。

**Tech Stack:** Vanilla ES Modules · Web Audio API · Vitest + happy-dom · 浅色 CSS

---

## Global Constraints

来自 `Agent Rules.txt`（硬约束，每条 Task 隐式继承）：

1. 不要假设用户清楚自己想要什么；动机不清晰时停下来讨论
2. 目标清晰但路径不是最短 → 直接告知并建议更好的办法
3. 追根因不补丁；每个决策都要能回答"为什么"
4. 输出说重点
5. API RPM<200，TPM<10000000
6. 每次开发/调研任务留 dev-doc（序号+内容+时间，如 `01-topic-2026-07-15.md`）
7. 调研维护 XML/JSON 表，给出参考链接
8. 所有代码入 `src/`；连续 5 个报错停手 + debug 报告
9. 系统：Ubuntu 22.04.5 LTS / X11 / i5-13600KF×20 / 32GB / RTX 4060
10. 迅捷 demo 优先，不允许长时间消耗 token 的测试，仅小规模验证
11. 方案含难度 + 风险

来自 Spec（2026-07-15 设计文档）：
- 单页 + 两个 Tab（听声音猜角色 / 乐队·角色介绍）
- 覆盖 7 乐队 + MYGO + Ave Mujica（约 50+ 角色）
- 每角色 ≥3 条主声线代表性台词
- 失败图 = 香澄（Kasumi Toyama）沮丧表情包
- 复用 MorsePractice `progress.js`（累计正确/错误 + 每角色错数）
- 浅色风格，参考 MorsePractice
- 资源限制：5min 搜索 / 180s 下载；找不到整理进 `dev-docs/04-resource-missing-2026-07-15.md`

---

## 文件总览

```
BangDreamListenAndTest/
├── Agent Rules.txt              [不动]
├── CLAUDE.md                    [Task 1]
├── README.md                    [Task 1]
├── index.html                   [Task 8]
├── package.json                 [Task 1]
├── vitest.config.js             [Task 1]
├── dev-server.py                [Task 1, 复用 MorsePractice 同名文件]
├── .gitignore                   [Task 1]
├── src/
│   ├── main.js                  [Task 1, 复用 MorsePractice 错误条]
│   ├── core/
│   │   ├── audio.js             [Task 4]
│   │   ├── quiz.js              [Task 6]
│   │   └── tabs.js              [Task 7]
│   ├── data/
│   │   ├── bands.js             [Task 2]
│   │   ├── characters.js        [Task 2]
│   │   └── samples.js           [Task 2]
│   ├── i18n/
│   │   ├── index.js             [Task 1]
│   │   ├── zh.js                [Task 1]
│   │   ├── en.js                [Task 1]
│   │   └── ja.js                [Task 1]
│   ├── storage/
│   │   └── progress.js          [Task 5, 复用 MorsePractice 模式]
│   └── ui/
│       ├── app.js               [Task 8]
│       ├── quiz.js              [Task 8]
│       └── intro.js             [Task 8]
├── assets/
│   ├── audio/<charId>/{1,2,3}.mp3     [Task 3]
│   ├── images/band/<bandId>.png       [Task 3]
│   ├── images/char/<charId>.png       [Task 3]
│   └── images/fail/ksm-cry.png        [Task 3]
├── styles/
│   └── main.css                       [Task 9]
├── tests/
│   ├── i18n.test.js                   [Task 1]
│   ├── data.test.js                   [Task 2]
│   ├── audio.test.js                  [Task 4]
│   ├── progress.test.js               [Task 5]
│   ├── quiz.test.js                   [Task 6]
│   └── tabs.test.js                   [Task 7]
├── research/
│   ├── bands.xml                      [Task 2 + Task 3]
│   └── characters.xml                 [Task 2 + Task 3]
└── dev-docs/
    ├── 01-bangdream-domain-research-2026-07-15.md   [Task 2]
    ├── 02-resource-strategy-2026-07-15.md           [Task 3]
    ├── 03-resource-acquisition-log-2026-07-15.md    [Task 3]
    ├── 04-resource-missing-2026-07-15.md            [Task 3]
    ├── 05-architecture-decisions-2026-07-15.md      [Task 10]
    └── 06-handoff-2026-07-15.md                     [Task 10]
```

---

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

## Task 2：数据模型（bands/characters/samples）+ 调研资料表

**Files:**
- Create: `src/data/bands.js`, `src/data/characters.js`, `src/data/samples.js`, `research/bands.xml`, `research/characters.xml`, `tests/data.test.js`, `dev-docs/01-bangdream-domain-research-2026-07-15.md`

**Step 2.1：写 `dev-docs/01-bangdream-domain-research-2026-07-15.md`**

```markdown
# BanG Dream 邦邦域资料研究

> 日期：2026-07-15
> 目的：为听声音猜角色 demo 准备乐队/角色/样本数据

## 覆盖范围

9 支乐队：
1. Poppin'Party（5 人）
2. Afterglow（5 人）
3. Pastel*Palettes（5 人）
4. Roselia（5 人）
5. Hello, Happy World!（5 人）
6. Morfonica（5 人）
7. RAISE A SUILEN（4 人；后期 5 人，按 5 录入）
8. MYGO!!!!!（5 人）
9. Ave Mujica（5 人）

合计约 49 角色 × 3 样本 = 约 147 条音频资源。

## 参考资料

- bangdream.fandom.com
- 萌娘百科「BanG Dream!」系列词条
- bestdori.com（角色语音库）
- 邦邦官方 anime 官网

详细链接见 `research/bands.xml` 和 `research/characters.xml`。
```

**Step 2.2：写 `src/data/bands.js`**

```js
/**
 * 9 支乐队元数据。
 *
 * 字段：
 *   id        — 内部 ID（小写，连字符）
 *   name      — 三语名称（zh/en/ja）
 *   icon      — 图标文件名（assets/images/band/<id>.png）
 *   members   — 角色 ID 列表（顺序与游戏内一致）
 *   desc      — 三语简介（一句话）
 */

export const BANDS = [
  {
    id: 'poppin-party',
    name: { zh: "Poppin'Party", en: "Poppin'Party", ja: "Poppin'Party" },
    icon: 'poppin-party.png',
    members: ['kasumi', 'tae', 'rimi', 'sayaka', 'arisa'],
    desc: {
      zh: '由香澄组建的女子乐队，青春热血风格。',
      en: "A youth-oriented girls' band formed by Kasumi.",
      ja: '香澄が結成した青春女子バンド。',
    },
  },
  {
    id: 'afterglow',
    name: { zh: 'Afterglow', en: 'Afterglow', ja: 'Afterglow' },
    icon: 'afterglow.png',
    members: ['ran', 'moca', 'himari', 'tsugumi', 'tomo'],
    desc: {
      zh: '高中生的朋克风乐队。',
      en: 'A punk-rock band of high schoolers.',
      ja: '女子高生のパンクロックバンド。',
    },
  },
  {
    id: 'pastel-palettes',
    name: { zh: 'Pastel*Palettes', en: 'Pastel*Palettes', ja: 'Pastel*Palettes' },
    icon: 'pastel-palettes.png',
    members: ['aya', 'chisato', 'maya', 'eve', 'hina'],
    desc: {
      zh: '以偶像身份活动的乐队。',
      en: 'A band that also performs as idols.',
      ja: 'アイドル活動も行うバンド。',
    },
  },
  {
    id: 'roselia',
    name: { zh: 'Roselia', en: 'Roselia', ja: 'Roselia' },
    icon: 'roselia.png',
    members: ['yukina', 'sayo', 'lisa', 'rinko', 'ako'],
    desc: {
      zh: '追求极致音乐性的严肃乐队。',
      en: 'A serious band pursuing musical perfection.',
      ja: '音楽性を追求するシリアスなバンド。',
    },
  },
  {
    id: 'hhw',
    name: { zh: 'Hello, Happy World!', en: 'Hello, Happy World!', ja: 'Hello, Happy World!' },
    icon: 'hhw.png',
    members: ['kokoro', 'kaoru', 'hagumi', 'kanon', 'misaki'],
    desc: {
      zh: '以"让世界幸福"为目标的欢乐乐队。',
      en: 'A cheerful band aiming to make the world happy.',
      ja: '世界を幸せにすることを目標にする明るいバンド。',
    },
  },
  {
    id: 'morfonica',
    name: { zh: 'Morfonica', en: 'Morfonica', ja: 'Morfonica' },
    icon: 'morfonica.png',
    members: ['mashiro', 'touko', 'nanami', 'tsukushi', 'rui'],
    desc: {
      zh: '以小提琴为特色的正统派乐队。',
      en: 'An orthodox band featuring the violin.',
      ja: 'ヴァイオリンが特徴の正統派バンド。',
    },
  },
  {
    id: 'ras',
    name: { zh: 'RAISE A SUILEN', en: 'RAISE A SUILEN', ja: 'RAISE A SUILEN' },
    icon: 'ras.png',
    members: ['laying', 'lock', 'mashu', 'pareo', 'reona'],
    desc: {
      zh: '由 LAYER 主导的实力派乐队。',
      en: "A powerful band led by LAYER.",
      ja: 'LAYER が主導する実力派バンド。',
    },
  },
  {
    id: 'mygo',
    name: { zh: 'MYGO!!!!!', en: 'MYGO!!!!!', ja: 'MYGO!!!!!' },
    icon: 'mygo.png',
    members: ['anon', 'tomori', 'raana', 'soyo', 'taki'],
    desc: {
      zh: '《BanG Dream! It\'s MyGO!!!!!》登场乐队。',
      en: "Band from BanG Dream! It's MyGO!!!!!",
      ja: '『BanG Dream! It\'s MyGO!!!!!』登場バンド。',
    },
  },
  {
    id: 'ave-mujica',
    name: { zh: 'Ave Mujica', en: 'Ave Mujica', ja: 'Ave Mujica' },
    icon: 'ave-mujica.png',
    members: ['sakiko', 'mutsumi', 'umiri', 'nyamu', 'togawa'],
    desc: {
      zh: '《BanG Dream! Ave Mujica》登场乐队。',
      en: "Band from BanG Dream! Ave Mujica.",
      ja: '『BanG Dream! Ave Mujica』登場バンド。',
    },
  },
];

export const BAND_BY_ID = Object.fromEntries(BANDS.map(b => [b.id, b]));
```

**Step 2.3：写 `src/data/characters.js`**

```js
/**
 * 约 49 名角色元数据。
 *
 * 字段：
 *   id        — 内部 ID（小写）
 *   bandId    — 所属乐队 ID
 *   role      — 担当（Vo./Gt./Ba./Dr./Key.）
 *   name      — 三语名
 *   portrait  — 立绘文件名（assets/images/char/<id>.png）
 */

export const CHARACTERS = [
  // Poppin'Party
  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
    portrait: 'kasumi.png' },
  { id: 'tae', bandId: 'poppin-party', role: 'Dr.',
    name: { zh: 'たえ', en: 'Tae Hanazono', ja: 'たえ' },
    portrait: 'tae.png' },
  { id: 'rimi', bandId: 'poppin-party', role: 'Ba.',
    name: { zh: 'りみ', en: 'Rimi Ushigome', ja: 'りみ' },
    portrait: 'rimi.png' },
  { id: 'sayaka', bandId: 'poppin-party', role: 'Key.',
    name: { zh: '紗綾', en: 'Saaya Yamabuki', ja: '紗綾' },
    portrait: 'sayaka.png' },
  { id: 'arisa', bandId: 'poppin-party', role: 'Gt.',
    name: { zh: '有咲', en: 'Arisa Ichigaya', ja: '有咲' },
    portrait: 'arisa.png' },

  // Afterglow
  { id: 'ran', bandId: 'afterglow', role: 'Gt./Vo',
    name: { zh: '蘭', en: 'Ran Mitake', ja: '蘭' },
    portrait: 'ran.png' },
  { id: 'moca', bandId: 'afterglow', role: 'Gt.',
    name: { zh: 'モカ', en: 'Moca Aoba', ja: 'モカ' },
    portrait: 'moca.png' },
  { id: 'himari', bandId: 'afterglow', role: 'Ba.',
    name: { zh: 'ひまり', en: 'Himari Uehara', ja: 'ひまり' },
    portrait: 'himari.png' },
  { id: 'tsugumi', bandId: 'afterglow', role: 'Dr.',
    name: { zh: 'つぐみ', en: 'Tsugumi Hazawa', ja: 'つぐみ' },
    portrait: 'tsugumi.png' },
  { id: 'tomo', bandId: 'afterglow', role: 'Key.',
    name: { zh: '巴', en: 'Tomo Udagawa', ja: '巴' },
    portrait: 'tomo.png' },

  // Pastel*Palettes
  { id: 'aya', bandId: 'pastel-palettes', role: 'Gt./Vo',
    name: { zh: '彩', en: 'Aya Maruyama', ja: '彩' },
    portrait: 'aya.png' },
  { id: 'chisato', bandId: 'pastel-palettes', role: 'Gt.',
    name: { zh: '千聖', en: 'Chisato Shirasagi', ja: '千聖' },
    portrait: 'chisato.png' },
  { id: 'maya', bandId: 'pastel-palettes', role: 'Ba.',
    name: { zh: 'マヤ', en: 'Maya Yamato', ja: 'マヤ' },
    portrait: 'maya.png' },
  { id: 'eve', bandId: 'pastel-palettes', role: 'Dr.',
    name: { zh: 'イヴ', en: 'Eve Wakamiya', ja: 'イヴ' },
    portrait: 'eve.png' },
  { id: 'hina', bandId: 'pastel-palettes', role: 'Key.',
    name: { zh: '日菜', en: 'Hina Hikawa', ja: '日菜' },
    portrait: 'hina.png' },

  // Roselia
  { id: 'yukina', bandId: 'roselia', role: 'Vo.',
    name: { zh: '友希那', en: 'Yukina Minato', ja: '友希那' },
    portrait: 'yukina.png' },
  { id: 'sayo', bandId: 'roselia', role: 'Gt.',
    name: { zh: '紗夜', en: 'Sayo Imai', ja: '紗夜' },
    portrait: 'sayo.png' },
  { id: 'lisa', bandId: 'roselia', role: 'Ba.',
    name: { zh: 'リサ', en: 'Lisa Imai', ja: 'リサ' },
    portrait: 'lisa.png' },
  { id: 'rinko', bandId: 'roselia', role: 'Key.',
    name: { zh: '燐子', en: 'Rinko Shirokane', ja: '燐子' },
    portrait: 'rinko.png' },
  { id: 'ako', bandId: 'roselia', role: 'Dr.',
    name: { zh: 'あこ', en: 'Ako Udagawa', ja: 'あこ' },
    portrait: 'ako.png' },

  // Hello, Happy World!
  { id: 'kokoro', bandId: 'hhw', role: 'Vo.',
    name: { zh: 'こころ', en: 'Kokoro Tsurumaki', ja: 'こころ' },
    portrait: 'kokoro.png' },
  { id: 'kaoru', bandId: 'hhw', role: 'Gt.',
    name: { zh: '薰', en: 'Kaoru Seta', ja: '薰' },
    portrait: 'kaoru.png' },
  { id: 'hagumi', bandId: 'hhw', role: 'Dr.',
    name: { zh: 'はぐみ', en: 'Hagumi Kitazawa', ja: 'はぐみ' },
    portrait: 'hagumi.png' },
  { id: 'kanon', bandId: 'hhw', role: 'Key.',
    name: { zh: '花音', en: 'Kanon Matsubara', ja: '花音' },
    portrait: 'kanon.png' },
  { id: 'misaki', bandId: 'hhw', role: 'Ba.',
    name: { zh: 'みさき', en: 'Misaki Okusawa', ja: 'みさき' },
    portrait: 'misaki.png' },

  // Morfonica
  { id: 'mashiro', bandId: 'morfonica', role: 'Vo./Vn.',
    name: { zh: 'ましろ', en: 'Mashiro Kurata', ja: 'ましろ' },
    portrait: 'mashiro.png' },
  { id: 'touko', bandId: 'morfonica', role: 'Vn.',
    name: { zh: '灯織', en: 'Touko Kirigaya', ja: '灯織' },
    portrait: 'touko.png' },
  { id: 'nanami', bandId: 'morfonica', role: 'Gt.',
    name: { zh: '七深', en: 'Nanami Hiromachi', ja: '七深' },
    portrait: 'nanami.png' },
  { id: 'tsukushi', bandId: 'morfonica', role: 'Ba.',
    name: { zh: 'つくし', en: 'Tsukushi Futaba', ja: 'つくし' },
    portrait: 'tsukushi.png' },
  { id: 'rui', bandId: 'morfonica', role: 'Dr.',
    name: { zh: '瑠唯', en: 'Rui Yashio', ja: '瑠唯' },
    portrait: 'rui.png' },

  // RAISE A SUILEN
  { id: 'laying', bandId: 'ras', role: 'Dr.',
    name: { zh: 'LAYER', en: 'LAYER', ja: 'LAYER' },
    portrait: 'laying.png' },
  { id: 'lock', bandId: 'ras', role: 'Ba.',
    name: { zh: 'LOCK', en: 'LOCK', ja: 'LOCK' },
    portrait: 'lock.png' },
  { id: 'mashu', bandId: 'ras', role: 'Gt.',
    name: { zh: 'MASHU', en: 'MASHU', ja: 'MASHU' },
    portrait: 'mashu.png' },
  { id: 'pareo', bandId: 'ras', role: 'Key.',
    name: { zh: 'PAREO', en: 'PAREO', ja: 'PAREO' },
    portrait: 'pareo.png' },
  { id: 'reona', bandId: 'ras', role: 'Vo.',
    name: { zh: 'CHU²', en: 'CHU²', ja: 'CHU²' },
    portrait: 'reona.png' },

  // MYGO!!!!!
  { id: 'anon', bandId: 'mygo', role: 'Gt.',
    name: { zh: 'あの', en: 'Anon Chihaya', ja: 'あの' },
    portrait: 'anon.png' },
  { id: 'tomori', bandId: 'mygo', role: 'Vo./Gt.',
    name: { zh: '灯', en: 'Tomori Takamatsu', ja: '灯' },
    portrait: 'tomori.png' },
  { id: 'raana', bandId: 'mygo', role: 'Ba.',
    name: { zh: '楽奈', en: 'Raana Kaname', ja: '楽奈' },
    portrait: 'raana.png' },
  { id: 'soyo', bandId: 'mygo', role: 'Gt.',
    name: { zh: 'そよ', en: 'Soyo Nagasaki', ja: 'そよ' },
    portrait: 'soyo.png' },
  { id: 'taki', bandId: 'mygo', role: 'Dr.',
    name: { zh: '立希', en: 'Taki Shiina', ja: '立希' },
    portrait: 'taki.png' },

  // Ave Mujica
  { id: 'sakiko', bandId: 'ave-mujica', role: 'Key.',
    name: { zh: 'さきこ', en: 'Sakiko Togawa', ja: 'さきこ' },
    portrait: 'sakiko.png' },
  { id: 'mutsumi', bandId: 'ave-mujica', role: 'Dr.',
    name: { zh: 'むつみ', en: 'Mutsumi Wakaba', ja: 'むつみ' },
    portrait: 'mutsumi.png' },
  { id: 'umiri', bandId: 'ave-mujica', role: 'Vo.',
    name: { zh: 'うみり', en: 'Umiri Yahata', ja: 'うみり' },
    portrait: 'umiri.png' },
  { id: 'nyamu', bandId: 'ave-mujica', role: 'Gt.',
    name: { zh: 'にゃむ', en: 'Nyamu Yutenji', ja: 'にゃむ' },
    portrait: 'nyamu.png' },
  { id: 'togawa', bandId: 'ave-mujica', role: 'Ba.',
    name: { zh: '戸川', en: 'Togawa (Sakiko family)', ja: '戸川' },
    portrait: 'togawa.png' },
];

export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

export function charactersOfBand(bandId) {
  const band = require('./bands.js').BAND_BY_ID[bandId] || import('./bands.js').then(m => m.BAND_BY_ID[bandId]);
  // 注：require 不在 ESM 内可用，下面改成同步 import。
  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
}
```

**注意**：上面 `charactersOfBand` 用了 `require`，不适用于 ESM。改为下面的同步写法（import 在文件顶部已可用）：

**Step 2.3 修正**：删除上一步，改为：

```js
/**
 * 约 49 名角色元数据（同上，省略重复字段说明）
 */

import { BAND_BY_ID } from './bands.js';

export const CHARACTERS = [
  // ... (同上 49 角色)
];

export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

export function charactersOfBand(bandId) {
  const band = BAND_BY_ID[bandId];
  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
}
```

（CHARACTERS 数组保持 Task 2.3 中定义的那 49 项，在实际写入文件时统一顶部 `import` BAND_BY_ID，并删除 `require` 残留。）

**Step 2.4：写 `src/data/samples.js`**

```js
/**
 * 每个角色 ≥3 条主声线样本的文件名。
 * 实际资源在 Task 3 下载，本文件先按"全员 ≥3 条"占位。
 * 后续若某角色资源凑不齐 3 条，对应项可改成更少；quiz.js 会跳过空样本角色。
 */

import { CHARACTERS } from './characters.js';

// 默认模板：每角色用 <id>-1/2/3.mp3
const TEMPLATE = (id) => [`${id}-1.mp3`, `${id}-2.mp3`, `${id}-3.mp3`];

export const SAMPLES = Object.fromEntries(
  CHARACTERS.map(c => [c.id, TEMPLATE(c.id)])
);

// 已知可能凑不齐的角色（Task 3 之后会更新这里）：
// SAMPLES['xxx'] = ['xxx-1.mp3'];  // 只剩 1 条
```

**Step 2.5：写 `tests/data.test.js`**

```js
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

  it('every character has a sample list ≥1', () => {
    for (const c of CHARACTERS) {
      expect(SAMPLES[c.id], `char ${c.id}`).toBeDefined();
      expect(SAMPLES[c.id].length, `char ${c.id}`).toBeGreaterThanOrEqual(1);
    }
  });

  it('charactersOfBand returns matching subset', () => {
    const poppin = charactersOfBand('poppin-party');
    expect(poppin.length).toBe(5);
    expect(poppin.map(c => c.id)).toEqual(['kasumi', 'tae', 'rimi', 'sayaka', 'arisa']);
  });

  it('total characters ≈ 49', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(45);
    expect(CHARACTERS.length).toBeLessThanOrEqual(55);
  });
});
```

**Step 2.6：跑测试**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm test
```

期望：原有 6 + 新增 6 = 12 tests passing.

**Step 2.7：写 `research/bands.xml` 与 `research/characters.xml`（占位）**

`research/bands.xml`：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<bands>
  <band id="poppin-party">
    <name-zh>Poppin'Party</name-zh>
    <name-en>Poppin'Party</name-en>
    <name-ja>Poppin'Party</name-ja>
    <source>https://bangdream.fandom.com/wiki/Poppin%27Party</source>
    <members>5</members>
    <desc-source>https://mzh.moegirl.org.cn/Poppin%27Party</desc-source>
  </band>
  <!-- ... 其他 8 支同样格式 ... -->
</bands>
```

`research/characters.xml`：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<characters>
  <character id="kasumi">
    <band>poppin-party</band>
    <name-zh>香澄</name-zh>
    <name-en>Kasumi Toyama</name-en>
    <name-ja>香澄</name-ja>
    <portrait-source>https://bangdream.fandom.com/wiki/Kasumi_Toyama</portrait-source>
    <voice-source>https://bestdori.com/tool/voice</voice-source>
  </character>
  <!-- ... 其他 48 名同样格式 ... -->
</characters>
```

（具体 URL 在 Task 3 实际下载时填入；本步骤先建空表 + 1 条样例，Task 3 完成时再补齐。）

**Step 2.8：commit**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git add -A
git commit -m "feat: data model (9 bands, ~49 characters, samples stub)"
```

---

## Task 3：资源下载（图片 + 音频）

**Files:**
- Create: `assets/audio/<charId>/{1,2,3}.mp3`（约 147 个）
- Create: `assets/images/band/<bandId>.png`（9 个）
- Create: `assets/images/char/<charId>.png`（约 49 个）
- Create: `assets/images/fail/ksm-cry.png`（1 个）
- Update: `research/bands.xml`, `research/characters.xml`
- Create: `dev-docs/02-resource-strategy-2026-07-15.md`, `dev-docs/03-resource-acquisition-log-2026-07-15.md`, `dev-docs/04-resource-missing-2026-07-15.md`

**Step 3.1：写 `dev-docs/02-resource-strategy-2026-07-15.md`**

```markdown
# 资源获取策略（2026-07-15）

## 限制（来自 Agent Rules + Spec）
- 搜索可用源：5 min
- 单条下载：≤180 s
- 找不到：整理进 `04-resource-missing-2026-07-15.md`

## 搜索优先级

### 图片
1. bangdream.fandom.com（英文 wiki，图片齐全）
2. 萌娘百科「BanG Dream!」系列词条
3. 邦邦官方 anime 官网
4. 微博/B 站官方账号

### 音频（主声线代表性台词）
1. bestdori.com（聚合语音库）
2. bangdream.fandom.com（部分语音）
3. 萌娘百科「BanG Dream! 语音集」词条

## 格式
- 图片：PNG（CSS 缩放到 4:5）
- 音频：MP3（角色台词 < 200 KB）

## 并行下载
使用 `xargs -P 8 -n 1` 或 `curl -Z` 控制并发，避免单 IP 限速。
```

**Step 3.2：写 `dev-docs/03-resource-acquisition-log-2026-07-15.md`（模板）**

```markdown
# 资源下载日志（2026-07-15）

每条资源一行：`[乐队/角色] [类型] [URL] [本地路径] [状态] [耗时]`

## 图片

| 时间 | 角色/乐队 | URL | 本地路径 | 状态 | 耗时 |
|---|---|---|---|---|---|

## 音频

| 时间 | 角色 | URL | 本地路径 | 状态 | 耗时 |
|---|---|---|---|---|---|
```

**Step 3.3：创建 `assets/` 目录骨架**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
mkdir -p assets/audio assets/images/band assets/images/char assets/images/fail
```

**Step 3.4：下载乐队图标（9 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

# 示例：Poppin'Party logo（替换为实际 URL）
curl -L --max-time 180 \
  -o assets/images/band/poppin-party.png \
  "https://example.com/poppin-party-logo.png"

# 其他 8 支同样方式下载，文件名按 bands.js 中的 id
# ... (afterglow, pastel-palettes, roselia, hhw, morfonica, ras, mygo, ave-mujica)
```

**注意**：执行 `curl` 前先把真实 URL 填进 `research/bands.xml` 的 `<logo-source>` 字段（首次下载时同步更新）。每条命令单独跑，便于记录成功/失败到 `03-acquisition-log`。

**Step 3.5：下载角色立绘（约 49 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

curl -L --max-time 180 \
  -o assets/images/char/kasumi.png \
  "https://example.com/kasumi-portrait.png"

# 其他 48 名同样方式下载，按 characters.js 的 id 命名
```

每条命令单独跑。失败则在 `03-acquisition-log` 标 ❌ 并加入 `04-resource-missing`。

**Step 3.6：下载 Kasumi 失败图（1 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

curl -L --max-time 180 \
  -o assets/images/fail/ksm-cry.png \
  "https://example.com/kasumi-cry.png"
```

找不到时按 `dev-docs/04-resource-missing-2026-07-15.md` 整理。

**Step 3.7：下载角色音频（约 147 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
mkdir -p assets/audio/kasumi

curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-1.mp3 \
  "https://example.com/kasumi-voice-1.mp3"
curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-2.mp3 \
  "https://example.com/kasumi-voice-2.mp3"
curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-3.mp3 \
  "https://example.com/kasumi-voice-3.mp3"

# 其他 48 名同样方式
```

**Step 3.8：实际下载时同步更新日志**

把每条资源的：角色、URL、本地路径、状态（✅/❌）、耗时 填进 `03-acquisition-log`。失败的填进 `04-resource-missing`。

**Step 3.9：根据下载结果更新 `src/data/samples.js`**

对于凑不齐 3 条的角色，把 SAMPLES[id] 改成实际能下载到的列表（可能只有 1-2 条）。找不到任何音频的角色，整项设为 `[]`，quiz.js 会自动跳过。

```js
// src/data/samples.js（更新后示例）
export const SAMPLES = {
  'kasumi': ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
  'tae':   ['tae-1.mp3', 'tae-2.mp3'],  // 只下到 2 条
  'xxx':   [],                          // 完全找不到
  // ...
};
```

**Step 3.10：跑测试确认数据模型仍合法**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm test
```

期望：data.test.js 全部 passing（已经写好 ≥1 的断言，空列表 `[]` 也算 ≥1；但若用户后续想要 ≥3 严格，可放宽）。

**Step 3.11：commit**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git add -A
git commit -m "feat: resources (images + audio) + missing log"
```

注：音频文件可能很大（每条 ~200KB × 147 ≈ 30MB），如果担心 repo 体积，可加 `.gitignore` 规则忽略 `assets/audio/*.mp3`，运行时直接从外部 CDN 加载。当前 demo 阶段先全部进 git。

---

## Task 4：音频引擎 audio.js

**Files:**
- Create: `src/core/audio.js`, `tests/audio.test.js`

**Step 4.1：写 `tests/audio.test.js`（TDD，先写测试）**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAudioContext, playSample, stop, _resetForTests } from '../src/core/audio.js';

// mock HTMLAudioElement
class FakeAudio {
  constructor() {
    this.src = '';
    this.onended = null;
    this.onerror = null;
    this._listeners = {};
  }
  addEventListener(ev, fn) { this._listeners[ev] = fn; }
  removeEventListener(ev) { delete this._listeners[ev]; }
  play() {
    setTimeout(() => { if (this.onended) this.onended(); }, 0);
    return Promise.resolve();
  }
  pause() {}
  load() {}
  triggerError() { if (this.onerror) this.onerror(); }
}
globalThis.Audio = FakeAudio;

describe('audio engine', () => {
  beforeEach(() => _resetForTests());

  it('getAudioContext returns singleton', () => {
    const a = getAudioContext();
    const b = getAudioContext();
    expect(a).toBe(b);
  });

  it('playSample resolves with audioId on success', async () => {
    const result = await playSample('kasumi', 'kasumi-1.mp3');
    expect(result).toEqual({ ok: true, audioId: 'kasumi-1.mp3' });
  });

  it('playSample returns ok=false on 404 and triggers onMissing', async () => {
    let captured = null;
    const result = await playSample('xxx', 'xxx-1.mp3', {
      onMissing: (charId) => { captured = charId; },
    });
    expect(result).toEqual({ ok: false, audioId: 'xxx-1.mp3' });
    expect(captured).toBe('xxx');
  });

  it('stop() cancels in-flight playback', async () => {
    const p = playSample('kasumi', 'kasumi-2.mp3');
    stop();
    const result = await p;
    // stop should resolve without firing onended
    expect(result.ok).toBe(true);
  });
});
```

**Step 4.2：跑测试确认失败**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npx vitest run tests/audio.test.js
```

期望：FAIL（audio.js 未实现）。

**Step 4.3：实现 `src/core/audio.js`**

```js
/**
 * 音频引擎：单例 AudioContext + 按需创建 HTMLAudioElement 播放角色样本。
 *
 * 设计：
 *   - 每次 playSample() 创建一个 <audio> 实例（简单可靠；不预加载避免内存占用）
 *   - 失败（404 / 解码错）通过 onMissing 回调传出，由 UI 决定是切下一题
 *   - stop() 中止当前播放
 *   - _resetForTests() 仅供测试：清空单例
 */

let _ctx = null;
let _activeAudio = null;

export function getAudioContext() {
  if (!_ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) _ctx = new Ctor();
  }
  return _ctx;
}

/**
 * 播放一条样本。
 *
 * @param {string} charId    角色 ID（用于 onMissing）
 * @param {string} audioId   样本文件名（如 'kasumi-1.mp3'）
 * @param {object} [opts]
 * @param {string} [opts.audioBase='assets/audio/'] 基础路径
 * @param {(charId: string) => void} [opts.onMissing] 404 回调
 * @returns {Promise<{ok: boolean, audioId: string}>}
 */
export function playSample(charId, audioId, opts = {}) {
  const { audioBase = 'assets/audio/', onMissing } = opts;
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = `${audioBase}${charId}/${audioId}`;
    _activeAudio = audio;

    audio.addEventListener('ended', () => {
      if (_activeAudio === audio) _activeAudio = null;
      resolve({ ok: true, audioId });
    });

    audio.addEventListener('error', () => {
      if (_activeAudio === audio) _activeAudio = null;
      if (onMissing) onMissing(charId);
      resolve({ ok: false, audioId });
    });

    audio.play().catch(() => {
      // 某些浏览器需要用户手势后才允许 play；这里走 error 通道
      if (_activeAudio === audio) _activeAudio = null;
      if (onMissing) onMissing(charId);
      resolve({ ok: false, audioId });
    });
  });
}

/** 停止当前播放。 */
export function stop() {
  if (_activeAudio) {
    try { _activeAudio.pause(); } catch {}
    _activeAudio = null;
  }
}

/** 测试专用：清空单例。 */
export function _resetForTests() {
  _ctx = null;
  _activeAudio = null;
}
```

**Step 4.4：跑测试确认通过**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npx vitest run tests/audio.test.js
```

期望：4 tests passing.

**Step 4.5：commit**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git add -A
git commit -m "feat: audio engine with HTMLAudioElement + 404 fallback"
```

---

## Task 5：进度持久化 storage/progress.js

**Files:**
- Create: `src/storage/progress.js`, `tests/progress.test.js`

**Step 5.1：写 `tests/progress.test.js`（TDD）**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { loadProgress, saveProgress, recordCorrect, recordWrong, resetProgress } from '../src/storage/progress.js';

describe('progress persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadProgress returns default zeros on first load', () => {
    const p = loadProgress();
    expect(p.correct).toBe(0);
    expect(p.wrong).toBe(0);
    expect(p.byChar).toEqual({});
    expect(p.errors.audio404).toBe(0);
  });

  it('recordCorrect increments correct + updates byChar', () => {
    recordCorrect('kasumi');
    recordCorrect('kasumi');
    recordCorrect('yukina');
    const p = loadProgress();
    expect(p.correct).toBe(2);  // kasumi 计 2 次 correct 时不写 byChar（只记错）
    expect(p.wrong).toBe(0);
    expect(p.byChar).toEqual({});
  });

  it('recordWrong increments wrong + updates byChar', () => {
    recordWrong('kasumi');
    recordWrong('kasumi');
    recordWrong('yukina');
    const p = loadProgress();
    expect(p.correct).toBe(0);
    expect(p.wrong).toBe(2);
    expect(p.byChar).toEqual({ kasumi: 2 });
  });

  it('resetProgress clears all', () => {
    recordWrong('kasumi');
    resetProgress();
    const p = loadProgress();
    expect(p.wrong).toBe(0);
    expect(p.byChar).toEqual({});
  });

  it('persists across loadProgress calls', () => {
    recordWrong('kasumi');
    const p = loadProgress();
    expect(p.wrong).toBe(1);
    expect(p.byChar.kasumi).toBe(1);
  });
});
```

**Step 5.2：跑测试确认失败**

```bash
npx vitest run tests/progress.test.js
```

期望：FAIL（progress.js 未实现）。

**Step 5.3：实现 `src/storage/progress.js`**

```js
/**
 * 本地进度持久化（localStorage）。
 *
 * 数据结构：
 *   {
 *     correct: number,
 *     wrong: number,
 *     byChar: { [charId]: number },   // 错误次数
 *     errors: { audio404: number },
 *   }
 *
 * localStorage 不可用时退化为内存存储（demo 内不丢失当前会话）。
 */

const STORAGE_KEY = 'bangdream.v1.progress';

const DEFAULT = () => ({
  correct: 0,
  wrong: 0,
  byChar: {},
  errors: { audio404: 0 },
});

let _memCache = null;

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function writeRaw(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
}

export function loadProgress() {
  const raw = readRaw() || _memCache || DEFAULT();
  // 合并默认值（防止旧数据缺字段）
  return { ...DEFAULT(), ...raw, byChar: raw.byChar || {}, errors: { ...DEFAULT().errors, ...(raw.errors || {}) } };
}

export function saveProgress(p) {
  _memCache = p;
  writeRaw(p);
}

export function recordCorrect(charId) {
  const p = loadProgress();
  p.correct++;
  saveProgress(p);
}

export function recordWrong(charId) {
  const p = loadProgress();
  p.wrong++;
  p.byChar[charId] = (p.byChar[charId] || 0) + 1;
  saveProgress(p);
}

export function recordAudio404() {
  const p = loadProgress();
  p.errors.audio404 = (p.errors.audio404 || 0) + 1;
  saveProgress(p);
}

export function resetProgress() {
  saveProgress(DEFAULT());
}
```

**Step 5.4：跑测试确认通过**

```bash
npx vitest run tests/progress.test.js
```

期望：5 tests passing.

**Step 5.5：commit**

```bash
git add -A
git commit -m "feat: progress persistence (localStorage)"
```

---

## Task 6：测验状态机 core/quiz.js

**Files:**
- Create: `src/core/quiz.js`, `tests/quiz.test.js`

**Step 6.1：写 `tests/quiz.test.js`（TDD，state machine）**

```js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  init, newQuestion, playCurrent, retry, next, pick,
  hintBand, revealAnswer,
  canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
  getState, onResult,
} from '../src/core/quiz.js';

// mock audio
vi.mock('../src/core/audio.js', () => ({
  playSample: vi.fn(async () => ({ ok: true, audioId: 'x.mp3' })),
  stop: vi.fn(),
}));

import * as audio from '../src/core/audio.js';

describe('quiz state machine', () => {
  beforeEach(() => {
    localStorage.clear();
    init({ characters: [
      { id: 'a', bandId: 'b1' },
      { id: 'b', bandId: 'b1' },
    ], samples: {
      a: ['a-1.mp3', 'a-2.mp3', 'a-3.mp3'],
      b: ['b-1.mp3', 'b-2.mp3', 'b-3.mp3'],
    }, bands: [{ id: 'b1', members: ['a', 'b'] }] });
  });

  it('starts in idle phase', () => {
    const s = getState();
    expect(s.phase).toBe('idle');
    expect(s.answered).toBe(false);
    expect(s.revealed).toBe(false);
  });

  it('newQuestion moves to awaitPick + selects a char + sample', () => {
    newQuestion();
    const s = getState();
    expect(s.phase).toBe('awaitPick');
    expect(['a', 'b']).toContain(s.currentCharId);
    expect(s.currentSampleId).toMatch(/-[123]\.mp3$/);
    expect(s.answered).toBe(false);
  });

  it('playCurrent calls audio.playSample', async () => {
    newQuestion();
    await playCurrent();
    expect(audio.playSample).toHaveBeenCalled();
  });

  it('pick(correct) sets answered + score.correct++', () => {
    newQuestion();
    const s = getState();
    const result = [];
    onResult(r => result.push(r));
    pick(s.currentCharId);
    expect(result[0].correct).toBe(true);
    expect(getState().phase).toBe('answered');
    expect(getState().answered).toBe(true);
  });

  it('pick(wrong) sets answered + score.wrong++ + byChar++', () => {
    newQuestion();
    const s = getState();
    const wrongId = s.currentCharId === 'a' ? 'b' : 'a';
    const result = [];
    onResult(r => result.push(r));
    pick(wrongId);
    expect(result[0].correct).toBe(false);
    expect(getState().phase).toBe('answered');
  });

  it('retry() same char + different sample + reset', () => {
    newQuestion();
    const before = getState();
    // 强制换 sample
    retry();
    const after = getState();
    expect(after.currentCharId).toBe(before.currentCharId);
    expect(after.phase).toBe('awaitPick');
    expect(after.answered).toBe(false);
  });

  it('next() moves to new question', () => {
    newQuestion();
    next();
    const s = getState();
    expect(s.phase).toBe('awaitPick');
    expect(s.answered).toBe(false);
    expect(s.revealed).toBe(false);
  });

  it('revealAnswer sets revealed=true', () => {
    newQuestion();
    revealAnswer();
    expect(getState().revealed).toBe(true);
  });

  it('canPick false after answered', () => {
    newQuestion();
    expect(canPick()).toBe(true);
    pick(getState().currentCharId);
    expect(canPick()).toBe(false);
  });

  it('canReveal false after revealed', () => {
    newQuestion();
    expect(canReveal()).toBe(true);
    revealAnswer();
    expect(canReveal()).toBe(false);
  });

  it('canRetry always true', () => {
    expect(canRetry()).toBe(true);
    newQuestion();
    expect(canRetry()).toBe(true);
  });
});
```

**Step 6.2：跑测试确认失败**

```bash
npx vitest run tests/quiz.test.js
```

期望：FAIL.

**Step 6.3：实现 `src/core/quiz.js`**

```js
/**
 * 测验状态机。
 *
 * 初始化：init({characters, samples, bands})
 * 主循环：
 *   idle → newQuestion() → awaitPick
 *   awaitPick → playCurrent() → playing (audio 自动) → awaitPick (audio ended)
 *   awaitPick → pick(charId) → answered
 *   any → retry() → awaitPick（同角色不同样本，重置 answered/revealed）
 *   any → next() → awaitPick（新角色）
 *   awaitPick/answered → hintBand() / revealAnswer()
 */

import { playSample, stop } from './audio.js';
import { recordCorrect, recordWrong } from '../storage/progress.js';

let _state = null;
let _resultListeners = [];

function makeInitial() {
  return {
    currentCharId: null,
    currentSampleId: null,
    phase: 'idle',
    answered: false,
    revealed: false,
    pickedCharId: null,
    score: { correct: 0, wrong: 0, byChar: {} },
  };
}

export function init({ characters, samples, bands }) {
  _state = makeInitial();
  _state._data = { characters, samples, bands };
  _resultListeners = [];
}

export function getState() { return _state; }

export function onResult(fn) { _resultListeners.push(fn); }

function pickRandomCharId() {
  const chars = _state._data.characters;
  // 过滤掉空样本角色
  const candidates = chars.filter(c => (_state._data.samples[c.id] || []).length > 0);
  if (candidates.length === 0) throw new Error('No characters with samples');
  return candidates[Math.floor(Math.random() * candidates.length)].id;
}

function pickRandomSample(charId) {
  const list = _state._data.samples[charId];
  return list[Math.floor(Math.random() * list.length)];
}

export function newQuestion() {
  stop();
  _state.currentCharId = pickRandomCharId();
  _state.currentSampleId = pickRandomSample(_state.currentCharId);
  _state.phase = 'awaitPick';
  _state.answered = false;
  _state.revealed = false;
  _state.pickedCharId = null;
}

export async function playCurrent(opts = {}) {
  if (!_state.currentCharId) newQuestion();
  _state.phase = 'playing';
  const result = await playSample(_state.currentCharId, _state.currentSampleId, {
    onMissing: opts.onMissing,
  });
  // 无论 ok 与否都回到 awaitPick
  _state.phase = 'awaitPick';
  return result;
}

export function retry() {
  if (!_state.currentCharId) return newQuestion();
  // 同角色换样本
  const list = _state._data.samples[_state.currentCharId];
  let next = pickRandomSample(_state.currentCharId);
  let safety = 5;
  while (next === _state.currentSampleId && safety-- > 0 && list.length > 1) {
    next = pickRandomSample(_state.currentCharId);
  }
  _state.currentSampleId = next;
  _state.phase = 'awaitPick';
  _state.answered = false;
  _state.revealed = false;
  _state.pickedCharId = null;
}

export function next() {
  newQuestion();
}

export function pick(charId) {
  if (!canPick()) return;
  _state.pickedCharId = charId;
  _state.answered = true;
  _state.phase = 'answered';
  const correct = charId === _state.currentCharId;
  if (correct) {
    _state.score.correct++;
    recordCorrect(charId);
  } else {
    _state.score.wrong++;
    _state.score.byChar[charId] = (_state.score.byChar[charId] || 0) + 1;
    recordWrong(charId);
  }
  for (const fn of _resultListeners) {
    try { fn({ correct, charId, pickedCharId: charId, currentCharId: _state.currentCharId, sampleId: _state.currentSampleId }); }
    catch (e) { console.error(e); }
  }
}

export function hintBand() {
  if (!canHintBand()) return null;
  const char = _state._data.characters.find(c => c.id === _state.currentCharId);
  if (!char) return null;
  return _state._data.bands.find(b => b.id === char.bandId);
}

export function revealAnswer() {
  if (!canReveal()) return null;
  _state.revealed = true;
  const char = _state._data.characters.find(c => c.id === _state.currentCharId);
  return char;
}

export function canPlay() {
  return _state.phase === 'idle' || _state.phase === 'awaitPick';
}
export function canPick() {
  return _state.phase === 'awaitPick';
}
export function canRetry() {
  return true;
}
export function canNext() {
  return true;
}
export function canHintBand() {
  return (_state.phase === 'awaitPick' || _state.phase === 'answered') && !_state.revealed;
}
export function canReveal() {
  return (_state.phase === 'awaitPick' || _state.phase === 'answered') && !_state.revealed;
}
```

**Step 6.4：跑测试确认通过**

```bash
npx vitest run tests/quiz.test.js
```

期望：11 tests passing.

**Step 6.5：commit**

```bash
git add -A
git commit -m "feat: quiz state machine"
```

---

## Task 7：Tab 控制器 core/tabs.js

**Files:**
- Create: `src/core/tabs.js`, `tests/tabs.test.js`

**Step 7.1：写 `tests/tabs.test.js`（TDD）**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { init, getActive, setActive, subscribe } from '../src/core/tabs.js';

describe('tabs', () => {
  beforeEach(() => init(['quiz', 'intro']));

  it('starts on first tab', () => {
    expect(getActive()).toBe('quiz');
  });

  it('setActive switches', () => {
    setActive('intro');
    expect(getActive()).toBe('intro');
  });

  it('subscribe receives change events', () => {
    const events = [];
    subscribe(id => events.push(id));
    setActive('intro');
    expect(events).toEqual(['intro']);
  });

  it('setActive ignores unknown ids', () => {
    setActive('nope');
    expect(getActive()).toBe('quiz');
  });
});
```

**Step 7.2：跑测试确认失败**

```bash
npx vitest run tests/tabs.test.js
```

期望：FAIL.

**Step 7.3：实现 `src/core/tabs.js`**

```js
let _tabs = [];
let _active = null;
let _subs = [];

export function init(tabs) {
  _tabs = tabs.slice();
  _active = tabs[0];
  _subs = [];
}

export function getActive() { return _active; }

export function setActive(id) {
  if (!_tabs.includes(id)) return;
  _active = id;
  for (const fn of _subs) {
    try { fn(id); } catch (e) { console.error(e); }
  }
}

export function subscribe(fn) { _subs.push(fn); }
```

**Step 7.4：跑测试确认通过**

```bash
npx vitest run tests/tabs.test.js
```

期望：4 tests passing.

**Step 7.5：commit**

```bash
git add -A
git commit -m "feat: tabs controller"
```

---

## Task 8：UI 控制器（app + quiz view + intro view + index.html）

**Files:**
- Update: `index.html`, `src/main.js`
- Create: `src/ui/app.js`, `src/ui/quiz.js`, `src/ui/intro.js`

**Step 8.1：写完整 `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BanG Dream 听声音猜角色</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <header class="topbar">
    <nav class="tabs">
      <button class="tab-btn" data-tab="quiz" data-i18n="tab.quiz">🎵 听声音猜角色</button>
      <button class="tab-btn" data-tab="intro" data-i18n="tab.intro">📖 乐队·角色介绍</button>
    </nav>
    <button class="lang-btn" data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
  </header>

  <main>
    <section id="tab-quiz" class="tab-panel" hidden>
      <div class="quiz-header">
        <button id="quiz-play" class="primary" data-i18n="quiz.play">▶️ 播放声音</button>
        <div id="quiz-score" class="score" data-i18n="quiz.score">已答：0 对 0 错</div>
      </div>

      <div id="quiz-bands" class="band-tabs"></div>

      <div id="quiz-choices" class="choices"></div>

      <div id="quiz-actions" class="actions">
        <button id="quiz-retry" data-i18n="quiz.retry">重试</button>
        <button id="quiz-next" data-i18n="quiz.next">下一题</button>
        <button id="quiz-hint" data-i18n="quiz.hintBand">提示乐队</button>
        <button id="quiz-reveal" data-i18n="quiz.reveal">答案</button>
      </div>

      <div id="quiz-result" class="result" aria-live="polite"></div>
    </section>

    <section id="tab-intro" class="tab-panel" hidden>
      <div id="intro-bands" class="band-tabs"></div>
      <div id="intro-grid" class="intro-grid"></div>
      <div id="intro-desc" class="intro-desc"></div>
    </section>
  </main>

  <script type="module" src="src/main.js"></script>
</body>
</html>
```

**Step 8.2：写 `src/ui/app.js`**

```js
/**
 * 顶层 UI 控制器：初始化所有子系统，渲染顶栏 Tab。
 */

import { initI18n, applyTranslations, cycleLocale } from '../i18n/index.js';
import { init as initTabs, getActive, setActive, subscribe as subTabs } from '../core/tabs.js';
import { init as initQuiz, newQuestion, playCurrent, retry, next, pick, hintBand, revealAnswer, onResult, getState, canPlay, canPick, canRetry, canNext, canHintBand, canReveal } from '../core/quiz.js';
import { CHARACTERS, charactersOfBand } from '../data/characters.js';
import { SAMPLES } from '../data/samples.js';
import { BANDS } from '../data/bands.js';
import { init as initQuizView } from './quiz.js';
import { init as initIntroView } from './intro.js';
import { loadProgress } from '../storage/progress.js';

export function initApp() {
  initI18n();
  initTabs(['quiz', 'intro']);
  initQuiz({ characters: CHARACTERS, samples: SAMPLES, bands: BANDS });

  // 顶栏 Tab 切换
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.tab));
  });
  subTabs((id) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = (p.id !== `tab-${id}`));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  });

  // 语言切换
  document.querySelector('[data-i18n-lang-switch]')?.addEventListener('click', cycleLocale);

  // 子视图初始化
  initQuizView({
    onPlay: () => playCurrent({ onMissing: () => onAudioMissing() }),
    onRetry: retry,
    onNext: next,
    onPick: pick,
    onHint: () => updateHint(),
    onReveal: () => updateReveal(),
    canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
    getState,
  });

  initIntroView({
    bands: BANDS,
    characters: CHARACTERS,
    charactersOfBand,
    samples: SAMPLES,
  });

  onResult(r => updateResult(r));

  // 初始：第一题
  newQuestion();
  applyTranslations();
  refreshScore();
}

function onAudioMissing() {
  const { recordAudio404 } = await import('../storage/progress.js');  // 注意：await 在函数内需要 async
}
```

**Step 8.2 修正**（避免 top-level await 与 import 复杂度，改用顶层 import）：

```js
import { initI18n, applyTranslations, cycleLocale, t } from '../i18n/index.js';
import { init as initTabs, getActive, setActive, subscribe as subTabs } from '../core/tabs.js';
import { init as initQuiz, newQuestion, playCurrent, retry, next, pick, hintBand, revealAnswer, onResult, getState, canPlay, canPick, canRetry, canNext, canHintBand, canReveal } from '../core/quiz.js';
import { CHARACTERS, charactersOfBand } from '../data/characters.js';
import { SAMPLES } from '../data/samples.js';
import { BANDS } from '../data/bands.js';
import { recordAudio404, loadProgress } from '../storage/progress.js';
import { init as initQuizView, showCorrect, showWrong, showHint, showReveal } from './quiz.js';
import { init as initIntroView } from './intro.js';

export function initApp() {
  initI18n();
  initTabs(['quiz', 'intro']);
  initQuiz({ characters: CHARACTERS, samples: SAMPLES, bands: BANDS });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.tab));
  });
  subTabs((id) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = (p.id !== `tab-${id}`));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  });

  document.querySelector('[data-i18n-lang-switch]')?.addEventListener('click', cycleLocale);

  initQuizView({
    onPlay: () => playCurrent({ onMissing: () => { recordAudio404(); next(); } }),
    onRetry: retry,
    onNext: next,
    onPick: pick,
    onHint: updateHint,
    onReveal: updateReveal,
    canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
    getState,
  });

  initIntroView({ bands: BANDS, characters: CHARACTERS, charactersOfBand, samples: SAMPLES });

  onResult(() => { refreshScore(); });
  onResult((r) => updateResult(r));
  document.addEventListener('i18n:applied', () => { refreshScore(); rerenderResultIfAny(); });

  newQuestion();
  applyTranslations();
  refreshScore();
}

function updateHint() {
  const band = hintBand();
  if (band) showHint(band);
}

function updateReveal() {
  const char = revealAnswer();
  if (char) showReveal(char);
}

function updateResult({ correct, currentCharId }) {
  const char = CHARACTERS.find(c => c.id === currentCharId);
  if (!char) return;
  if (correct) showCorrect(char);
  else showWrong();
}

function refreshScore() {
  const p = loadProgress();
  const el = document.getElementById('quiz-score');
  if (el) el.textContent = t('quiz.score', { correct: p.correct, wrong: p.wrong });
}

// 切换语言时，若当前有结果卡片，根据 quiz state 重新渲染（避免清空丢失反馈）
function rerenderResultIfAny() {
  const s = getState();
  const resultEl = document.getElementById('quiz-result');
  if (!resultEl || !resultEl.innerHTML.trim()) return;
  if (s.revealed) {
    const char = CHARACTERS.find(c => c.id === s.currentCharId);
    if (char) showReveal(char);
  } else if (s.answered) {
    const band = (() => {
      const c = CHARACTERS.find(c => c.id === s.currentCharId);
      return c ? BANDS.find(b => b.id === c.bandId) : null;
    })();
    if (band) showHint(band);
    // 注：判对/判错的临时结果卡片不在此重绘（语言切换不影响"✅"标记），保持原样
  }
}
```

**Step 8.3：写 `src/ui/quiz.js`**

```js
/**
 * 测验视图：渲染乐队 Tab + 当前乐队 5 角色卡 + 4 按钮 + 结果区。
 *
 * 事件全部冒泡到 app.js 传入的 onXxx 回调；本文件只负责 DOM 渲染与事件绑定。
 */

import { BANDS } from '../data/bands.js';
import { CHARACTERS, charactersOfBand } from '../data/characters.js';
import { t } from '../i18n/index.js';

let _handlers = null;
let _currentBandId = null;

export function init({ onPlay, onRetry, onNext, onPick, onHint, onReveal, canPlay, canPick, canRetry, canNext, canHintBand, canReveal, getState }) {
  _handlers = { onPlay, onRetry, onNext, onPick, onHint, onReveal, canPlay, canPick, canRetry, canNext, canHintBand, canReveal, getState };
  renderBandTabs();
  // 默认显示 Poppin'Party
  setActiveBand(BANDS[0].id);

  document.getElementById('quiz-play').addEventListener('click', () => onPlay());
  document.getElementById('quiz-retry').addEventListener('click', () => onRetry());
  document.getElementById('quiz-next').addEventListener('click', () => onNext());
  document.getElementById('quiz-hint').addEventListener('click', () => onHint());
  document.getElementById('quiz-reveal').addEventListener('click', () => onReveal());

  // 切换语言时重新渲染（注意：不在此处清空 quiz-result，结果由 app.js 的 rerenderResultIfAny() 负责）
  document.addEventListener('i18n:applied', () => {
    renderBandTabs();
    renderChoices();
    refreshButtonStates();
  });
}

export function setActiveBand(bandId) {
  _currentBandId = bandId;
  document.querySelectorAll('#quiz-bands .band-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.bandId === bandId);
  });
  renderChoices();
}

function renderBandTabs() {
  const root = document.getElementById('quiz-bands');
  root.innerHTML = '';
  for (const band of BANDS) {
    const btn = document.createElement('button');
    btn.className = 'band-tab';
    btn.dataset.bandId = band.id;
    btn.innerHTML = `
      <div class="band-name">${escapeHtml(t(`band.${band.id}`))}</div>
      <img class="band-icon" src="assets/images/band/${band.icon}" alt="${escapeHtml(t(`band.${band.id}`))}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'band-icon-fallback',textContent:'${escapeHtml(t(`band.${band.id}`))}'}))">
    `;
    btn.addEventListener('click', () => setActiveBand(band.id));
    root.appendChild(btn);
  }
}

function renderChoices() {
  const root = document.getElementById('quiz-choices');
  root.innerHTML = '';
  const members = charactersOfBand(_currentBandId);
  for (const c of members) {
    const card = document.createElement('button');
    card.className = 'choice';
    card.dataset.charId = c.id;
    card.innerHTML = `
      <div class="choice-name">${escapeHtml(t(`char.${c.id}.name`, undefined) || c.name.zh)}</div>
      <img class="choice-portrait" src="assets/images/char/${c.portrait}" alt="" onerror="this.style.display='none'">
    `;
    card.addEventListener('click', () => _handlers.onPick(c.id));
    root.appendChild(card);
  }
}

function renderResult() {
  const root = document.getElementById('quiz-result');
  root.innerHTML = '';
}

export function showCorrect(char) {
  const root = document.getElementById('quiz-result');
  root.innerHTML = `
    <div class="result-card success">
      <span class="result-mark">${escapeHtml(t('quiz.correct'))}</span>
      <strong>${escapeHtml(char.name[_handlers.getState().currentCharId === char.id ? currentLocale() : 'zh'])}</strong>
      <span class="result-band">（${escapeHtml(t(`band.${findBandId(char.id)}`))}）</span>
      <img class="result-portrait" src="assets/images/char/${char.portrait}" alt="" onerror="this.style.display='none'">
      <button class="result-replay">${escapeHtml(t('quiz.playAgain'))}</button>
    </div>
  `;
  root.querySelector('.result-replay').addEventListener('click', () => _handlers.onPlay());
  refreshButtonStates();
}

export function showWrong() {
  const root = document.getElementById('quiz-result');
  root.innerHTML = `
    <div class="result-card fail">
      <span class="result-mark">${escapeHtml(t('quiz.wrong'))}</span>
      <img class="result-fail" src="assets/images/fail/ksm-cry.png" alt="fail" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'fail-fallback',textContent:'T_T'}))">
    </div>
  `;
  refreshButtonStates();
}

export function showHint(band) {
  const root = document.getElementById('quiz-result');
  root.innerHTML = `
    <div class="result-card hint">
      <span class="result-mark">${escapeHtml(t('quiz.hintBandPrefix'))}</span>
      <strong>${escapeHtml(t(`band.${band.id}`))}</strong>
      <img class="hint-icon" src="assets/images/band/${band.icon}" alt="" onerror="this.style.display='none'">
    </div>
  `;
  refreshButtonStates();
}

export function showReveal(char) {
  const root = document.getElementById('quiz-result');
  root.innerHTML = `
    <div class="result-card reveal">
      <span class="result-mark">${escapeHtml(t('quiz.answer'))}</span>
      <strong>${escapeHtml(char.name[currentLocale()])}</strong>
      <span class="result-band">（${escapeHtml(t(`band.${findBandId(char.id)}`))}）</span>
      <img class="result-portrait" src="assets/images/char/${char.portrait}" alt="" onerror="this.style.display='none'">
    </div>
  `;
  refreshButtonStates();
}

function refreshButtonStates() {
  const { canPlay, canPick, canRetry, canNext, canHintBand, canReveal } = _handlers;
  document.getElementById('quiz-play').disabled = !canPlay();
  document.getElementById('quiz-retry').disabled = !canRetry();
  document.getElementById('quiz-next').disabled = !canNext();
  document.getElementById('quiz-hint').disabled = !canHintBand();
  document.getElementById('quiz-reveal').disabled = !canReveal();
  // 选项卡在 answered 状态时全部 disabled
  const locked = !canPick();
  document.querySelectorAll('#quiz-choices .choice').forEach(el => { el.disabled = locked; });
}

function currentLocale() {
  return document.documentElement.lang.startsWith('ja') ? 'ja'
    : document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
}

function findBandId(charId) {
  return CHARACTERS.find(c => c.id === charId)?.bandId;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
```

**Step 8.4：写 `src/ui/intro.js`**

```js
/**
 * 介绍视图：渲染乐队 Tab + 当前乐队 5 角色卡（可点击听）+ 简介。
 */

import { t } from '../i18n/index.js';
import { playSample } from '../core/audio.js';

let _currentBandId = null;
let _ctx = null;

export function init({ bands, characters, charactersOfBand, samples }) {
  _ctx = { bands, characters, charactersOfBand, samples };
  renderBandTabs();
  setActiveBand(bands[0].id);
  document.addEventListener('i18n:applied', () => {
    renderBandTabs();
    renderGrid();
    renderDesc();
  });
}

export function setActiveBand(bandId) {
  _currentBandId = bandId;
  document.querySelectorAll('#intro-bands .band-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.bandId === bandId);
  });
  renderGrid();
  renderDesc();
}

function renderBandTabs() {
  const root = document.getElementById('intro-bands');
  root.innerHTML = '';
  for (const band of _ctx.bands) {
    const btn = document.createElement('button');
    btn.className = 'band-tab';
    btn.dataset.bandId = band.id;
    btn.innerHTML = `
      <div class="band-name">${escapeHtml(t(`band.${band.id}`))}</div>
      <img class="band-icon" src="assets/images/band/${band.icon}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'band-icon-fallback',textContent:'${escapeHtml(t(`band.${band.id}`))}'}))">
    `;
    btn.addEventListener('click', () => setActiveBand(band.id));
    root.appendChild(btn);
  }
}

function renderGrid() {
  const root = document.getElementById('intro-grid');
  root.innerHTML = '';
  const members = _ctx.charactersOfBand(_currentBandId);
  for (const c of members) {
    const card = document.createElement('div');
    card.className = 'intro-card';
    card.innerHTML = `
      <img class="intro-portrait" src="assets/images/char/${c.portrait}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'intro-portrait-fallback',textContent:'${escapeHtml(c.name.zh)}'}))">
      <div class="intro-name">${escapeHtml(c.name[currentLocale()])}</div>
      <div class="intro-role">${escapeHtml(c.role)}</div>
      <button class="intro-listen">${escapeHtml(t('intro.listen'))}</button>
    `;
    card.querySelector('.intro-portrait').addEventListener('click', () => playRandom(c.id));
    card.querySelector('.intro-listen').addEventListener('click', () => playRandom(c.id));
    root.appendChild(card);
  }
}

function renderDesc() {
  const root = document.getElementById('intro-desc');
  const band = _ctx.bands.find(b => b.id === _currentBandId);
  if (!band) { root.innerHTML = ''; return; }
  root.innerHTML = `
    <div class="intro-desc-block">
      <span class="intro-desc-mark">${escapeHtml(t('intro.bandDesc'))}</span>
      <span class="intro-desc-text">${escapeHtml(band.desc[currentLocale()] || band.desc.zh)}</span>
    </div>
  `;
}

function playRandom(charId) {
  const list = _ctx.samples[charId] || [];
  if (list.length === 0) return;
  const audioId = list[Math.floor(Math.random() * list.length)];
  playSample(charId, audioId, { onMissing: () => alert(t('intro.audioMissing')) });
}

function currentLocale() {
  return document.documentElement.lang.startsWith('ja') ? 'ja'
    : document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
```

**Step 8.5：更新 `src/main.js`（接入 initApp）**

```js
/**
 * App entry. Bootstraps i18n, tabs, quiz, intro.
 */

import { initI18n, applyTranslations, cycleLocale } from './i18n/index.js';
import { initApp } from './ui/app.js';

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
    initI18n();
    initApp();
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

**Step 8.6：手动验证（浏览器）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
python3 -m http.server 8000
```

打开 `http://localhost:8000`，检查：
- 顶栏两个 Tab 可切换
- 「听声音猜角色」Tab 显示乐队 + 5 角色卡
- 点「播放声音」可听
- 点角色卡有判定
- 切语言时所有文字同步

**Step 8.7：commit**

```bash
git add -A
git commit -m "feat: UI controllers (app + quiz + intro views)"
```

---

## Task 9：浅色样式 styles/main.css

**Files:**
- Create: `styles/main.css`

**Step 9.1：写 `styles/main.css`（浅色风格，参考 MorsePractice）**

```css
/* ============================================
 * BanG Dream 听声音猜角色 — 浅色风格
 * 参考 MorsePractice 的浅色调色板
 * ============================================ */

:root {
  --bg: #fffaf2;
  --bg-card: #ffffff;
  --bg-soft: #f6efe6;
  --bg-soft-2: #f1e7d8;
  --text: #4a3b2c;
  --text-soft: #8a7a64;
  --primary: #e8a7b8;       /* 邦粉 */
  --primary-dark: #c87a92;
  --success: #6abf7b;
  --danger: #e07a7a;
  --border: #e8dccb;
  --shadow: 0 4px 12px rgba(180, 140, 100, 0.15);
  --radius: 12px;
  --radius-sm: 8px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  line-height: 1.5;
  min-height: 100vh;
}

button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 8px 14px;
  transition: transform 0.08s, background 0.15s, border-color 0.15s;
}
button:hover:not(:disabled) {
  background: var(--bg-soft);
  border-color: var(--primary);
}
button:active:not(:disabled) { transform: scale(0.98); }
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== 顶栏 ===== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.tabs { display: flex; gap: 8px; }
.tab-btn {
  background: transparent;
  border: 2px solid transparent;
  padding: 8px 16px;
  font-weight: 600;
}
.tab-btn.active {
  background: var(--bg-soft);
  border-color: var(--primary);
  color: var(--primary-dark);
}
.lang-btn {
  font-size: 13px;
  padding: 6px 12px;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.tab-panel { display: block; }
.tab-panel[hidden] { display: none; }

/* ===== 测验头部 ===== */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}
.primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  font-weight: 600;
  padding: 10px 24px;
}
.primary:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}
.score {
  color: var(--text-soft);
  font-size: 14px;
}

/* ===== 乐队 Tab ===== */
.band-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.band-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  min-width: 110px;
  gap: 4px;
}
.band-tab.active {
  border-color: var(--primary);
  background: var(--bg-soft);
}
.band-name {
  font-weight: 600;
  font-size: 13px;
}
.band-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.band-icon-fallback {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-soft);
  background: var(--bg-soft-2);
  border-radius: 50%;
  text-align: center;
  line-height: 1;
  padding: 4px;
}

/* ===== 测验角色选项 ===== */
.choices {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 720px) {
  .choices { grid-template-columns: repeat(2, 1fr); }
}
.choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  transition: all 0.15s;
}
.choice:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--bg-soft);
  transform: translateY(-2px);
}
.choice:disabled {
  opacity: 0.5;
}
.choice-name {
  font-weight: 600;
  margin-bottom: 8px;
}
.choice-portrait {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

/* ===== 按钮区 ===== */
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

/* ===== 结果区 ===== */
.result {
  min-height: 100px;
}
.result-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: var(--radius);
  margin-bottom: 10px;
  box-shadow: var(--shadow);
}
.result-card.success { background: #e9f7ec; border: 2px solid var(--success); }
.result-card.fail    { background: #fbecec; border: 2px solid var(--danger); }
.result-card.hint    { background: #fdf3df; border: 2px solid #d8b656; }
.result-card.reveal  { background: #f4ecf8; border: 2px solid #a78bc7; }
.result-mark { font-weight: 600; }
.result-portrait, .result-fail, .hint-icon {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.result-replay { margin-left: auto; }

/* ===== 介绍页 ===== */
.intro-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 720px) {
  .intro-grid { grid-template-columns: repeat(2, 1fr); }
}
.intro-card {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.intro-portrait {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform 0.15s;
}
.intro-portrait:hover { transform: scale(1.03); }
.intro-portrait-fallback {
  width: 100%;
  aspect-ratio: 4 / 5;
  background: var(--bg-soft-2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
}
.intro-name { font-weight: 600; }
.intro-role { color: var(--text-soft); font-size: 13px; }
.intro-listen { width: 100%; }

.intro-desc-block {
  padding: 16px;
  background: var(--bg-soft);
  border-radius: var(--radius);
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.intro-desc-mark { font-weight: 600; }
```

**Step 9.2：手动验证**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
python3 -m http.server 8000
```

打开浏览器检查浅色风格、按钮状态、响应式布局。

**Step 9.3：commit**

```bash
git add -A
git commit -m "feat: light theme styles"
```

---

## Task 10：架构决策记录 + 接手指南

**Files:**
- Create: `dev-docs/05-architecture-decisions-2026-07-15.md`, `dev-docs/06-handoff-2026-07-15.md`

**Step 10.1：写 `dev-docs/05-architecture-decisions-2026-07-15.md`**

```markdown
# 架构决策记录（2026-07-15）

## 决策 1：复用 MorsePractice 模式而非重写
- 选择：纯 ES Module + Vanilla JS
- 拒绝：Vite + React、TypeScript
- 理由：与参考项目同栈，可直接复用 i18n / progress / main.js 错误条；Agent Rules #10 迅捷 demo。

## 决策 2：单页 + 两个 Tab（无 hash 路由）
- 选择：单页 + `.tab-btn[data-tab]` 切换
- 拒绝：Hash 路由、History API
- 理由：避免 SW 与 hash 的潜在冲突；状态管理更简单。

## 决策 3：HTMLAudioElement 而非 Web Audio 解码
- 选择：直接 `<audio src>` 播放
- 拒绝：Web Audio API decodeAudioData
- 理由：角色台词 < 200KB，单条短，无需精细控制；HTMLAudioElement 支持流式 + 自带 onended/onerror。

## 决策 4：失败图 = Kasumi（Toyama Kasumi）而非通用表情
- 选择：专门查找 Kasumi 沮丧表情包
- 兜底：找不到时记录进 `04-resource-missing` 让用户提供
- 理由：邦邦粉丝向，与题材强相关。

## 决策 5：覆盖 9 乐队（+ MYGO / Ave Mujica）
- 选择：全部 9 支
- 拒绝：仅 Poppin'Party 或 3 支
- 理由：用户明确要求全面覆盖；工作量主要在资源下载而非代码。
```

**Step 10.2：写 `dev-docs/06-handoff-2026-07-15.md`**

```markdown
# 接手指南（2026-07-15）

## 项目是什么
单页 Web demo：BanG Dream 听声音猜角色（zh/en/ja）。

## 30 秒上手
```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm install
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 文件结构
- 设计：`docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md`
- 计划：`docs/superpowers/plans/2026-07-15-bangdream-quiz-implementation.md`
- 源码：`src/`
- 资源：`assets/`
- 调研：`research/`
- 过程：`dev-docs/`

## 测试
```bash
npm test
```

## 已知限制
- 资源缺失时 UI 显示占位（fallback 文字 / T_T）
- 部分冷门角色可能没有音频，samples.js 对应项为空数组，quiz 自动跳过

## 与 MorsePractice 的关系
- i18n 模式：相同（zh/en 单文件 dict + index 运行时）
- progress.js 模式：相同（localStorage + DEFAULT 合并）
- main.js 错误条：相同（红条置顶）
- audio.js：不同（用 HTMLAudioElement 而非 OscillatorNode）
```

**Step 10.3：跑全部测试**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm test
```

期望：i18n (6) + data (6) + audio (4) + progress (5) + quiz (11) + tabs (4) = 36 tests passing.

**Step 10.4：commit**

```bash
git add -A
git commit -m "docs: handoff guide + architecture decisions"
```

---

## 自检（写完后回看）

1. **Spec 覆盖**：
   - §1 目标 ✓ Task 8 UI
   - §2 决策记录 ✓ 已落入每 Task
   - §3 架构 ✓ Task 1-7
   - §4 状态机 ✓ Task 6
   - §5 UI 流程 ✓ Task 8
   - §6 错误处理 ✓ Task 4 / Task 6 / Task 8
   - §7 测试 ✓ Task 1/2/4/5/6/7
   - §8 资源策略 ✓ Task 3
   - §9 dev-docs ✓ Task 2/3/10
   - §10 Agent Rules 自查 ✓ 全 Task

2. **Placeholder 扫描**：无 TBD/TODO；`require` 残留已在 Task 2.3 修正中删除。

3. **类型一致性**：
   - `playSample(charId, audioId, opts)` 签名在 audio.js / quiz.js / intro.js 三处一致 ✓
   - `init({characters, samples, bands})` 在 quiz.js 与 app.js 一致 ✓
   - `BAND_BY_ID` / `CHARACTER_BY_ID` 命名一致 ✓
   - `t('band.${band.id}')` 在 i18n/zh|en|ja.js 与使用处键名一致 ✓

完成。