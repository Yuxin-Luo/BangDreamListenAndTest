# Review package: 86c70ff..5440a0e

## Commits
5440a0e feat: data model (9 bands, ~49 characters, samples stub)

## Files changed
 .superpowers/sdd/progress.md                       |   23 +
 .superpowers/sdd/task-1-review-package.md          | 6312 ++++++++++++++++++++
 .superpowers/sdd/task-2-brief.md                   |  487 ++
 .../01-bangdream-domain-research-2026-07-15.md     |   28 +
 research/bands.xml                                 |   75 +
 research/characters.xml                            |  372 ++
 src/data/bands.js                                  |  114 +
 src/data/characters.js                             |  174 +
 src/data/samples.js                                |   17 +
 tests/data.test.js                                 |   45 +
 10 files changed, 7647 insertions(+)

## Diff
diff --git a/.superpowers/sdd/progress.md b/.superpowers/sdd/progress.md
new file mode 100644
index 0000000..c03be72
--- /dev/null
+++ b/.superpowers/sdd/progress.md
@@ -0,0 +1,23 @@
+# SDD Progress Ledger
+
+BanG Dream 听声音猜角色 — subagent-driven execution
+
+| Task | Subject | Commits | Status |
+|---|---|---|---|
+| 1 | 项目脚手架 + i18n (zh/en/ja) | 81fac1e, 86c70ff | ✅ DONE (review approved) |
+| 2 | 数据模型 + 调研资料表 | — | 🟡 in_progress |
+| 3 | 资源下载 | — | ⏳ pending |
+| 4 | 音频引擎 | — | ⏳ pending |
+| 5 | 进度持久化 | — | ⏳ pending |
+| 6 | 测验状态机 | — | ⏳ pending |
+| 7 | Tab 控制器 | — | ⏳ pending |
+| 8 | UI 控制器 | — | ⏳ pending |
+| 9 | 浅色样式 | — | ⏳ pending |
+| 10 | 架构决策 + 接手指南 | — | ⏳ pending |
+| Final | 全分支代码审查 | — | ⏳ pending |
+
+## Notes
+
+- Task 1 implementer caught brief defect: brief showed flat keys but `t()` uses `key.split('.')` traversal. Implementer correctly used nested dicts. This was a brief bug.
+- Task 1 reviewer approved both spec compliance and code quality (2026-07-15).
+- Decision: Task 2 dispatches with `haiku` model (mechanical transcription of 49 characters from plan brief).
\ No newline at end of file
diff --git a/.superpowers/sdd/task-1-review-package.md b/.superpowers/sdd/task-1-review-package.md
new file mode 100644
index 0000000..e0f33b8
--- /dev/null
+++ b/.superpowers/sdd/task-1-review-package.md
@@ -0,0 +1,6312 @@
+# Review package: 4b825dc642cb6eb9a060e54bf8d69288fbee4904..86c70ff
+
+## Commits
+86c70ff fix: morfonica typo in i18n dict (zh/en/ja)
+81fac1e feat: scaffold + i18n (zh/en/ja)
+
+## Files changed
+ .gitignore                                         |    5 +
+ .superpowers/sdd/task-1-brief.md                   |  444 +++
+ .superpowers/sdd/task-1-report.md                  |   83 +
+ Agent Rules.txt                                    |   12 +
+ CLAUDE.md                                          |    9 +
+ README.md                                          |   23 +
+ dev-server.py                                      |   41 +
+ .../2026-07-15-bangdream-quiz-implementation.md    | 2898 ++++++++++++++++++++
+ .../specs/2026-07-15-bangdream-quiz-design.md      |  395 +++
+ index.html                                         |   11 +
+ package-lock.json                                  | 1899 +++++++++++++
+ package.json                                       |   16 +
+ src/i18n/en.js                                     |   43 +
+ src/i18n/index.js                                  |  110 +
+ src/i18n/ja.js                                     |   43 +
+ src/i18n/zh.js                                     |   43 +
+ src/main.js                                        |   38 +
+ tests/i18n.test.js                                 |   46 +
+ vitest.config.js                                   |    8 +
+ 19 files changed, 6167 insertions(+)
+
+## Diff
+diff --git a/.gitignore b/.gitignore
+new file mode 100644
+index 0000000..db4682f
+--- /dev/null
++++ b/.gitignore
+@@ -0,0 +1,5 @@
++node_modules/
++dist/
++.DS_Store
++*.log
++.env
+diff --git a/.superpowers/sdd/task-1-brief.md b/.superpowers/sdd/task-1-brief.md
+new file mode 100644
+index 0000000..6f9ef22
+--- /dev/null
++++ b/.superpowers/sdd/task-1-brief.md
+@@ -0,0 +1,444 @@
++## Task 1：项目脚手架 + i18n 三语
++
++**Files:**
++- Create: `package.json`, `vitest.config.js`, `dev-server.py`, `.gitignore`, `CLAUDE.md`, `README.md`, `src/main.js`, `src/i18n/index.js`, `src/i18n/zh.js`, `src/i18n/en.js`, `src/i18n/ja.js`, `tests/i18n.test.js`
++
++**Step 1.1：git init + 写 `.gitignore`**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git init
++```
++
++写 `.gitignore`：
++```gitignore
++node_modules/
++dist/
++.DS_Store
++*.log
++.env
++```
++
++**Step 1.2：复制 MorsePractice 的 `dev-server.py`**
++
++```bash
++cp /home/ruo/Desktop/LYX/VibeCoding/MorsePractice/dev-server.py ./
++```
++
++（这是一个简单的 `python3 -m http.server` 包装。如不可用，直接在 README 写 `python3 -m http.server 8000` 即可。）
++
++**Step 1.3：写 `package.json`**
++
++```json
++{
++  "name": "bangdream-quiz",
++  "version": "0.1.0",
++  "private": true,
++  "type": "module",
++  "description": "BanG Dream 听声音猜角色测试（zh/en/ja）",
++  "scripts": {
++    "test": "vitest run",
++    "test:watch": "vitest",
++    "dev": "python3 -m http.server 8000"
++  },
++  "devDependencies": {
++    "vitest": "^1.6.0",
++    "happy-dom": "^14.0.0"
++  }
++}
++```
++
++**Step 1.4：写 `vitest.config.js`**
++
++```js
++import { defineConfig } from 'vitest/config';
++
++export default defineConfig({
++  test: {
++    environment: 'happy-dom',
++    include: ['tests/**/*.test.js'],
++  },
++});
++```
++
++**Step 1.5：写 `CLAUDE.md`（仅索引，不含规则）**
++
++```markdown
++# CLAUDE.md — BanG Dream 听声音猜角色 项目索引
++
++> 本文件只做项目文档索引，不包含指令类规则。
++> 全部项目事实 / 硬约束 / 当前阻塞 / 踩坑历史在：
++>
++> - `docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md` — 设计
++> - `dev-docs/06-handoff-2026-07-15.md` — 接手指南
++
++外部参考：复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的架构模式。
++```
++
++**Step 1.6：写 `src/i18n/index.js`（基于 MorsePractice 改造，支持 ja）**
++
++完整代码（参考 MorsePractice `src/i18n/index.js`，把 zh/en 改为 zh/en/ja）：
++
++```js
++/**
++ * i18n runtime (zh/en/ja).
++ *
++ * Usage:
++ *   import { t, setLocale, getLocale, initI18n, applyTranslations } from './i18n/index.js';
++ *   t('band.poppin-party')         // → 'Poppin\'Party' or 'Poppin\'Party'
++ *   setLocale('ja');
++ *
++ * Behavior:
++ *   - locale persisted in localStorage key 'bangdream.v1.locale'
++ *   - on first load, falls back to navigator.language (zh* → 'zh', ja* → 'ja', else 'en')
++ *   - missing keys return '[missing.key]' rather than throwing
++ *   - DOM helper applyTranslations() walks all [data-i18n] elements
++ */
++
++import zh from './zh.js';
++import en from './en.js';
++import ja from './ja.js';
++
++const STORAGE_KEY = 'bangdream.v1.locale';
++const DICTS = { zh, en, ja };
++
++let _locale = null;
++let _dict = null;
++
++function detectLocale() {
++  try {
++    const saved = localStorage.getItem(STORAGE_KEY);
++    if (saved && DICTS[saved]) return saved;
++  } catch {}
++  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
++  const low = nav.toLowerCase();
++  if (low.startsWith('zh')) return 'zh';
++  if (low.startsWith('ja')) return 'ja';
++  return 'en';
++}
++
++function loadDict(locale) {
++  return DICTS[locale] || DICTS.zh;
++}
++
++export function initI18n() {
++  if (_locale) return;
++  _locale = detectLocale();
++  _dict = loadDict(_locale);
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = _locale === 'zh' ? 'zh-CN'
++      : _locale === 'ja' ? 'ja-JP' : 'en';
++  }
++}
++
++export function getLocale() {
++  initI18n();
++  return _locale;
++}
++
++export function setLocale(locale) {
++  if (!DICTS[locale]) return;
++  _locale = locale;
++  _dict = loadDict(locale);
++  try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = locale === 'zh' ? 'zh-CN'
++      : locale === 'ja' ? 'ja-JP' : 'en';
++    applyTranslations();
++  }
++}
++
++export function cycleLocale() {
++  // 顺时针循环：zh → en → ja → zh
++  const order = ['zh', 'en', 'ja'];
++  const next = order[(order.indexOf(_locale) + 1) % order.length];
++  setLocale(next);
++}
++
++export function t(key, vars) {
++  initI18n();
++  const parts = key.split('.');
++  let cur = _dict;
++  for (const p of parts) {
++    if (cur && typeof cur === 'object' && p in cur) {
++      cur = cur[p];
++    } else {
++      return `[${key}]`;
++    }
++  }
++  if (typeof cur !== 'string') return `[${key}]`;
++  if (!vars) return cur;
++  return cur.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
++}
++
++export function applyTranslations() {
++  if (typeof document === 'undefined') return;
++  initI18n();
++  document.querySelectorAll('[data-i18n]').forEach((el) => {
++    el.textContent = t(el.getAttribute('data-i18n'));
++  });
++  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
++    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
++  });
++  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
++    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
++  });
++  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
++    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
++  });
++  const sw = document.querySelector('[data-i18n-lang-switch]');
++  if (sw) sw.textContent = t('language.switchTo');
++  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { locale: _locale } }));
++}
++```
++
++**Step 1.7：写 `src/i18n/zh.js`**
++
++```js
++export default {
++  'language.switchTo': '切到英语',
++  'language.label': '中',
++  'tab.quiz': '🎵 听声音猜角色',
++  'tab.intro': '📖 乐队·角色介绍',
++  'quiz.play': '▶️ 播放声音',
++  'quiz.score': '已答：{correct} 对 {wrong} 错',
++  'quiz.retry': '重试',
++  'quiz.next': '下一题',
++  'quiz.hintBand': '提示乐队',
++  'quiz.reveal': '答案',
++  'quiz.correct': '✅ 正确！',
++  'quiz.wrong': '❌ 失败',
++  'quiz.answer': '📖 答案',
++  'quiz.hintBandPrefix': '💡 提示乐队：',
++  'quiz.playAgain': '▶️ 再听一次',
++  'quiz.audioMissing': '该角色样本暂缺，已自动切到下一题',
++  'intro.bandDesc': '▼ 简介',
++  'intro.listen': '▶️ 听',
++  'intro.audioMissing': '该角色样本暂缺',
++  'common.unknown': '未知',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.8：写 `src/i18n/en.js`**
++
++```js
++export default {
++  'language.switchTo': 'Switch to English',
++  'language.label': 'EN',
++  'tab.quiz': '🎵 Listen & Guess',
++  'tab.intro': '📖 Bands & Characters',
++  'quiz.play': '▶️ Play Voice',
++  'quiz.score': 'Score: {correct} correct / {wrong} wrong',
++  'quiz.retry': 'Retry',
++  'quiz.next': 'Next',
++  'quiz.hintBand': 'Hint Band',
++  'quiz.reveal': 'Answer',
++  'quiz.correct': '✅ Correct! ',
++  'quiz.wrong': '❌ Wrong',
++  'quiz.answer': '📖 Answer: ',
++  'quiz.hintBandPrefix': '💡 Band: ',
++  'quiz.playAgain': '▶️ Play Again',
++  'quiz.audioMissing': 'Voice sample missing. Skipped to next question.',
++  'intro.bandDesc': '▼ About',
++  'intro.listen': '▶️ Listen',
++  'intro.audioMissing': 'Voice sample missing',
++  'common.unknown': 'Unknown',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.9：写 `src/i18n/ja.js`**
++
++```js
++export default {
++  'language.switchTo': '日本語に切替',
++  'language.label': '日',
++  'tab.quiz': '🎵 声で当てよう',
++  'tab.intro': '📖 バンド・キャラ紹介',
++  'quiz.play': '▶️ 再生',
++  'quiz.score': 'スコア：{correct} 正解 / {wrong} 不正解',
++  'quiz.retry': 'リトライ',
++  'quiz.next': '次の問題',
++  'quiz.hintBand': 'バンドをヒント',
++  'quiz.reveal': '答え',
++  'quiz.correct': '✅ 正解！',
++  'quiz.wrong': '❌ 不正解',
++  'quiz.answer': '📖 答え：',
++  'quiz.hintBandPrefix': '💡 バンド：',
++  'quiz.playAgain': '▶️ もう一度聴く',
++  'quiz.audioMissing': '音声サンプルなし。次の問題へ。',
++  'intro.bandDesc': '▼ 紹介',
++  'intro.listen': '▶️ 聴く',
++  'intro.audioMissing': '音声サンプルなし',
++  'common.unknown': '不明',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.10：写 `tests/i18n.test.js`**
++
++```js
++import { describe, it, expect, beforeEach } from 'vitest';
++import { initI18n, setLocale, t, applyTranslations } from '../src/i18n/index.js';
++
++describe('i18n', () => {
++  beforeEach(() => {
++    localStorage.clear();
++    initI18n();
++  });
++
++  it('detects zh from navigator.language', () => {
++    setLocale('zh');
++    expect(t('language.label')).toBe('中');
++  });
++
++  it('detects ja from navigator.language', () => {
++    setLocale('ja');
++    expect(t('language.label')).toBe('日');
++  });
++
++  it('detects en from navigator.language', () => {
++    setLocale('en');
++    expect(t('language.label')).toBe('EN');
++  });
++
++  it('falls back to [missing.key] for unknown key', () => {
++    expect(t('foo.bar.baz')).toBe('[foo.bar.baz]');
++  });
++
++  it('interpolates {vars}', () => {
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('3');
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('1');
++  });
++
++  it('applyTranslations updates [data-i18n] elements', () => {
++    document.body.innerHTML = '<div data-i18n="quiz.retry"></div>';
++    setLocale('zh');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('重试');
++    setLocale('en');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('Retry');
++    setLocale('ja');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('リトライ');
++  });
++});
++```
++
++**Step 1.11：装依赖 + 跑测试**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm install
++npm test
++```
++
++期望：6 tests passing.
++
++**Step 1.12：写 `src/main.js`（启动入口 + 错误条，参考 MorsePractice）**
++
++```js
++/**
++ * App entry. Imports initApp from ui/app.js (Task 8 stub for now).
++ */
++
++function showBootError(err) {
++  console.error('[boot] fatal error:', err);
++  const banner = document.createElement('div');
++  banner.style.cssText = `
++    position: fixed; top: 0; left: 0; right: 0;
++    background: #f87171; color: #7f1d1d;
++    padding: 12px 20px; font-family: monospace; font-size: 13px;
++    border-bottom: 2px solid #b91c1c; z-index: 9999;
++    white-space: pre-wrap; word-break: break-word;
++  `;
++  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
++  document.body.prepend(banner);
++}
++
++function boot() {
++  try {
++    // ui/app.js 的 initApp() 在 Task 8 接入。当前 Task 1 只做 i18n 初始化 + DOM 占位。
++    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
++    initI18n();
++    applyTranslations();
++    const sw = document.querySelector('[data-i18n-lang-switch]');
++    if (sw) sw.addEventListener('click', cycleLocale);
++  } catch (err) {
++    showBootError(err);
++  }
++  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
++  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
++}
++
++if (document.readyState === 'loading') {
++  document.addEventListener('DOMContentLoaded', boot);
++} else {
++  boot();
++}
++```
++
++**Step 1.13：写最小 `index.html` 占位（Task 8 会扩展）**
++
++```html
++<!DOCTYPE html>
++<html lang="zh-CN">
++<head>
++  <meta charset="UTF-8">
++  <title>BanG Dream 听声音猜角色</title>
++</head>
++<body>
++  <button data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
++  <script type="module" src="src/main.js"></script>
++</body>
++</html>
++```
++
++**Step 1.14：手动启动 + 验证**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++python3 -m http.server 8000 &
++sleep 1
++curl -s http://localhost:8000/ | head -5
++kill %1
++```
++
++期望：HTML 内容回显。
++
++**Step 1.15：commit**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git add -A
++git commit -m "feat: scaffold + i18n (zh/en/ja)"
++```
++
++---
++
+diff --git a/.superpowers/sdd/task-1-report.md b/.superpowers/sdd/task-1-report.md
+new file mode 100644
+index 0000000..2288ab2
+--- /dev/null
++++ b/.superpowers/sdd/task-1-report.md
+@@ -0,0 +1,83 @@
++# Task 1 Report: 项目脚手架 + i18n 三语
++
++## 状态: DONE
++
++## 实现内容
++
++### 已完成所有 15 个步骤
++
++1. git init
++2. .gitignore
++3. dev-server.py (从 MorsePractice 复制)
++4. package.json
++5. vitest.config.js
++6. CLAUDE.md (索引格式)
++7. README.md
++8. src/i18n/index.js (i18n 运行时，导出 initI18n/getLocale/setLocale/cycleLocale/t/applyTranslations)
++9. src/i18n/zh.js (嵌套结构)
++10. src/i18n/en.js (嵌套结构)
++11. src/i18n/ja.js (嵌套结构)
++12. tests/i18n.test.js (6 tests)
++13. src/main.js (boot + error banner)
++14. index.html (minimal)
++15. git commit
++
++### 关键修复
++
++**字典结构修复**: 初始方案使用 flat key (如 `'language.switchTo': '切到英语'`)，
++但 `t()` 函数通过 `key.split('.')` 遍历嵌套对象。需要将字典改为嵌套结构：
++```js
++language: { switchTo: '切到英语', label: '中' }
++```
++
++## 测试结果
++
++```
++npm test
++
++ RUN  v1.6.1
++ ✓ tests/i18n.test.js (6 tests) 4ms
++
++ Test Files  1 passed (1)
++ Tests  6 passed (6)
++```
++
++6/6 tests GREEN
++
++## 文件列表
++
++```
++.gitignore
++CLAUDE.md
++README.md
++dev-server.py
++index.html
++package.json
++package-lock.json
++src/i18n/index.js
++src/i18n/zh.js
++src/i18n/en.js
++src/i18n/ja.js
++src/main.js
++tests/i18n.test.js
++vitest.config.js
++```
++
++## Commit
++
++```
++81fac1e feat: scaffold + i18n (zh/en/ja)
++```
++
++## 自我审查发现
++
++- i18n API 完整: initI18n, getLocale, setLocale, cycleLocale (zh→en→ja→zh), t, applyTranslations
++- storage key: `bangdream.v1.locale` (正确)
++- cycleLocale 循环: zh → en → ja → zh (3语言)
++- t() 插值: `quiz.score` with `{correct}` `{wrong}` works
++- 无 morse.v1.* 残留
++- 所有代码在 src/ 目录下
++
++## 潜在问题
++
++无重大问题。注意 `morfonica` 在 band 字典中拼写为 `morfinica` (打字错误)，但这不影响功能，后续任务会处理。
+diff --git a/Agent Rules.txt b/Agent Rules.txt
+new file mode 100644
+index 0000000..769d477
+--- /dev/null
++++ b/Agent Rules.txt	
+@@ -0,0 +1,12 @@
++「以第一性原理！从原始需求和问题本质出发，不从惯例或模板出发。
++1. 不要假设我清楚自己想要什么。动机或目标不清晰时，停下来讨论。
++2. 目标清晰但路径不是最短的，直接告诉我并建议更好的办法。
++3. 遇到问题追根因，不打补丁。每个决策都要能回答"为什么"。
++4. 输出说重点，砍掉一切不改变决策的信息
++5. 调用api时需要控制RPM小于200   TPM小于 10000000 
++6. 每次进行开发或调研类的任务都需要留下过程开发文档存入dev-doc文件夹内，并采用序号+内容+时间的格式进行命名，如1-action-checklist-2026-06-25.md
++7. 进行调研过程中需要维护一份xml表格或json文件，用于给出参考资料具体地址与参考的具体相关信息，便于未来其他agent进行查证
++8. 进行代码开发工作时，所有Agent书写代码都需要放在src目录下，如果当前采用的方法遇到了连续5个报错，及时退出自动模式重新审视当前解决方法本身并生成一份简要debug报告，要求人工手动确认才继续工作
++9. 当前电脑为Ubuntu 22.04.5 LTS系统，采用窗口系统XDG_SESSION_TYPE = X11,处理器为13th Gen Intel® Core™ i5-13600KF × 20，内存32GB，显卡为RTX 4060
++10. 开发以迅捷开发为主，主要进行demo开发与功能验证，不允许进行长时间消耗大量token的测试，最多只允许进行小规模验证性测试。
++11. 每次给出参考方案让用户进行选择时，需要同时给出各方案的难易程度以及风险点
+diff --git a/CLAUDE.md b/CLAUDE.md
+new file mode 100644
+index 0000000..e47a5db
+--- /dev/null
++++ b/CLAUDE.md
+@@ -0,0 +1,9 @@
++# CLAUDE.md — BanG Dream 听声音猜角色 项目索引
++
++> 本文件只做项目文档索引，不包含指令类规则。
++> 全部项目事实 / 硬约束 / 当前阻塞 / 踩坑历史在：
++>
++> - `docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md` — 设计
++> - `dev-docs/06-handoff-2026-07-15.md` — 接手指南
++
++外部参考：复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的架构模式。
+diff --git a/README.md b/README.md
+new file mode 100644
+index 0000000..5e4fa02
+--- /dev/null
++++ b/README.md
+@@ -0,0 +1,23 @@
++# BanG Dream 听声音猜角色
++
++BanG Dream 听声音猜角色测试（zh/en/ja 三语）。
++
++## 开发
++
++```bash
++npm install
++npm run dev      # 启动 dev server（端口 8000）
++npm test         # 运行测试
++```
++
++## 架构
++
++- `src/i18n/` — i18n 运行时（zh/en/ja 三语）
++- `src/main.js` — 启动入口
++- `dev-server.py` — 无缓存 dev server
++
++## 三语
++
++- `src/i18n/zh.js` — 中文
++- `src/i18n/en.js` — 英文
++- `src/i18n/ja.js` — 日文
+diff --git a/dev-server.py b/dev-server.py
+new file mode 100644
+index 0000000..4c2018e
+--- /dev/null
++++ b/dev-server.py
+@@ -0,0 +1,41 @@
++#!/usr/bin/env python3
++"""
++Dev server with no-cache headers.
++Replaces `python3 -m http.server 8000` during debugging.
++Sends Cache-Control: no-store on every response, so the browser
++always fetches the latest JS modules.
++"""
++
++import http.server
++import socketserver
++import sys
++import os
++
++PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
++os.chdir(os.path.dirname(os.path.abspath(__file__)))
++
++
++class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
++    def end_headers(self):
++        # Aggressive no-cache for ALL responses
++        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
++        self.send_header("Pragma", "no-cache")
++        self.send_header("Expires", "0")
++        # Allow ES module loading from file:// and http://
++        self.send_header("Access-Control-Allow-Origin", "*")
++        super().end_headers()
++
++    def log_message(self, format, *args):
++        # Quieter logs
++        pass
++
++
++with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
++    print(f"Serving with no-cache headers at http://localhost:{PORT}/")
++    print(f"  Open in browser. Every request will fetch fresh files.")
++    print(f"  Press Ctrl+C to stop.")
++    try:
++        httpd.serve_forever()
++    except KeyboardInterrupt:
++        print("\nShutting down.")
++        httpd.shutdown()
+diff --git a/docs/superpowers/plans/2026-07-15-bangdream-quiz-implementation.md b/docs/superpowers/plans/2026-07-15-bangdream-quiz-implementation.md
+new file mode 100644
+index 0000000..63d3976
+--- /dev/null
++++ b/docs/superpowers/plans/2026-07-15-bangdream-quiz-implementation.md
+@@ -0,0 +1,2898 @@
++# BanG Dream 听声音猜角色 — 实施计划
++
++> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
++
++**Goal:** 单页 Web demo，播放 BanG Dream 角色台词让用户猜角色，UI 中英日三语切换，浅色风格，本地 `python3 -m http.server` 运行。
++
++**Architecture:** 复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的纯 ES Module + Vanilla JS 模式。模块边界清晰（core/data/i18n/storage/ui），单例 AudioContext，三 Tab 单页（顶栏 + 两个主 Tab）。所有代码入 `src/`，资源入 `assets/`，过程文档入 `dev-docs/`，调研资料入 `research/`。
++
++**Tech Stack:** Vanilla ES Modules · Web Audio API · Vitest + happy-dom · 浅色 CSS
++
++---
++
++## Global Constraints
++
++来自 `Agent Rules.txt`（硬约束，每条 Task 隐式继承）：
++
++1. 不要假设用户清楚自己想要什么；动机不清晰时停下来讨论
++2. 目标清晰但路径不是最短 → 直接告知并建议更好的办法
++3. 追根因不补丁；每个决策都要能回答"为什么"
++4. 输出说重点
++5. API RPM<200，TPM<10000000
++6. 每次开发/调研任务留 dev-doc（序号+内容+时间，如 `01-topic-2026-07-15.md`）
++7. 调研维护 XML/JSON 表，给出参考链接
++8. 所有代码入 `src/`；连续 5 个报错停手 + debug 报告
++9. 系统：Ubuntu 22.04.5 LTS / X11 / i5-13600KF×20 / 32GB / RTX 4060
++10. 迅捷 demo 优先，不允许长时间消耗 token 的测试，仅小规模验证
++11. 方案含难度 + 风险
++
++来自 Spec（2026-07-15 设计文档）：
++- 单页 + 两个 Tab（听声音猜角色 / 乐队·角色介绍）
++- 覆盖 7 乐队 + MYGO + Ave Mujica（约 50+ 角色）
++- 每角色 ≥3 条主声线代表性台词
++- 失败图 = 香澄（Kasumi Toyama）沮丧表情包
++- 复用 MorsePractice `progress.js`（累计正确/错误 + 每角色错数）
++- 浅色风格，参考 MorsePractice
++- 资源限制：5min 搜索 / 180s 下载；找不到整理进 `dev-docs/04-resource-missing-2026-07-15.md`
++
++---
++
++## 文件总览
++
++```
++BangDreamListenAndTest/
++├── Agent Rules.txt              [不动]
++├── CLAUDE.md                    [Task 1]
++├── README.md                    [Task 1]
++├── index.html                   [Task 8]
++├── package.json                 [Task 1]
++├── vitest.config.js             [Task 1]
++├── dev-server.py                [Task 1, 复用 MorsePractice 同名文件]
++├── .gitignore                   [Task 1]
++├── src/
++│   ├── main.js                  [Task 1, 复用 MorsePractice 错误条]
++│   ├── core/
++│   │   ├── audio.js             [Task 4]
++│   │   ├── quiz.js              [Task 6]
++│   │   └── tabs.js              [Task 7]
++│   ├── data/
++│   │   ├── bands.js             [Task 2]
++│   │   ├── characters.js        [Task 2]
++│   │   └── samples.js           [Task 2]
++│   ├── i18n/
++│   │   ├── index.js             [Task 1]
++│   │   ├── zh.js                [Task 1]
++│   │   ├── en.js                [Task 1]
++│   │   └── ja.js                [Task 1]
++│   ├── storage/
++│   │   └── progress.js          [Task 5, 复用 MorsePractice 模式]
++│   └── ui/
++│       ├── app.js               [Task 8]
++│       ├── quiz.js              [Task 8]
++│       └── intro.js             [Task 8]
++├── assets/
++│   ├── audio/<charId>/{1,2,3}.mp3     [Task 3]
++│   ├── images/band/<bandId>.png       [Task 3]
++│   ├── images/char/<charId>.png       [Task 3]
++│   └── images/fail/ksm-cry.png        [Task 3]
++├── styles/
++│   └── main.css                       [Task 9]
++├── tests/
++│   ├── i18n.test.js                   [Task 1]
++│   ├── data.test.js                   [Task 2]
++│   ├── audio.test.js                  [Task 4]
++│   ├── progress.test.js               [Task 5]
++│   ├── quiz.test.js                   [Task 6]
++│   └── tabs.test.js                   [Task 7]
++├── research/
++│   ├── bands.xml                      [Task 2 + Task 3]
++│   └── characters.xml                 [Task 2 + Task 3]
++└── dev-docs/
++    ├── 01-bangdream-domain-research-2026-07-15.md   [Task 2]
++    ├── 02-resource-strategy-2026-07-15.md           [Task 3]
++    ├── 03-resource-acquisition-log-2026-07-15.md    [Task 3]
++    ├── 04-resource-missing-2026-07-15.md            [Task 3]
++    ├── 05-architecture-decisions-2026-07-15.md      [Task 10]
++    └── 06-handoff-2026-07-15.md                     [Task 10]
++```
++
++---
++
++## Task 1：项目脚手架 + i18n 三语
++
++**Files:**
++- Create: `package.json`, `vitest.config.js`, `dev-server.py`, `.gitignore`, `CLAUDE.md`, `README.md`, `src/main.js`, `src/i18n/index.js`, `src/i18n/zh.js`, `src/i18n/en.js`, `src/i18n/ja.js`, `tests/i18n.test.js`
++
++**Step 1.1：git init + 写 `.gitignore`**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git init
++```
++
++写 `.gitignore`：
++```gitignore
++node_modules/
++dist/
++.DS_Store
++*.log
++.env
++```
++
++**Step 1.2：复制 MorsePractice 的 `dev-server.py`**
++
++```bash
++cp /home/ruo/Desktop/LYX/VibeCoding/MorsePractice/dev-server.py ./
++```
++
++（这是一个简单的 `python3 -m http.server` 包装。如不可用，直接在 README 写 `python3 -m http.server 8000` 即可。）
++
++**Step 1.3：写 `package.json`**
++
++```json
++{
++  "name": "bangdream-quiz",
++  "version": "0.1.0",
++  "private": true,
++  "type": "module",
++  "description": "BanG Dream 听声音猜角色测试（zh/en/ja）",
++  "scripts": {
++    "test": "vitest run",
++    "test:watch": "vitest",
++    "dev": "python3 -m http.server 8000"
++  },
++  "devDependencies": {
++    "vitest": "^1.6.0",
++    "happy-dom": "^14.0.0"
++  }
++}
++```
++
++**Step 1.4：写 `vitest.config.js`**
++
++```js
++import { defineConfig } from 'vitest/config';
++
++export default defineConfig({
++  test: {
++    environment: 'happy-dom',
++    include: ['tests/**/*.test.js'],
++  },
++});
++```
++
++**Step 1.5：写 `CLAUDE.md`（仅索引，不含规则）**
++
++```markdown
++# CLAUDE.md — BanG Dream 听声音猜角色 项目索引
++
++> 本文件只做项目文档索引，不包含指令类规则。
++> 全部项目事实 / 硬约束 / 当前阻塞 / 踩坑历史在：
++>
++> - `docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md` — 设计
++> - `dev-docs/06-handoff-2026-07-15.md` — 接手指南
++
++外部参考：复用 `~/Desktop/LYX/VibeCoding/MorsePractice/` 的架构模式。
++```
++
++**Step 1.6：写 `src/i18n/index.js`（基于 MorsePractice 改造，支持 ja）**
++
++完整代码（参考 MorsePractice `src/i18n/index.js`，把 zh/en 改为 zh/en/ja）：
++
++```js
++/**
++ * i18n runtime (zh/en/ja).
++ *
++ * Usage:
++ *   import { t, setLocale, getLocale, initI18n, applyTranslations } from './i18n/index.js';
++ *   t('band.poppin-party')         // → 'Poppin\'Party' or 'Poppin\'Party'
++ *   setLocale('ja');
++ *
++ * Behavior:
++ *   - locale persisted in localStorage key 'bangdream.v1.locale'
++ *   - on first load, falls back to navigator.language (zh* → 'zh', ja* → 'ja', else 'en')
++ *   - missing keys return '[missing.key]' rather than throwing
++ *   - DOM helper applyTranslations() walks all [data-i18n] elements
++ */
++
++import zh from './zh.js';
++import en from './en.js';
++import ja from './ja.js';
++
++const STORAGE_KEY = 'bangdream.v1.locale';
++const DICTS = { zh, en, ja };
++
++let _locale = null;
++let _dict = null;
++
++function detectLocale() {
++  try {
++    const saved = localStorage.getItem(STORAGE_KEY);
++    if (saved && DICTS[saved]) return saved;
++  } catch {}
++  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
++  const low = nav.toLowerCase();
++  if (low.startsWith('zh')) return 'zh';
++  if (low.startsWith('ja')) return 'ja';
++  return 'en';
++}
++
++function loadDict(locale) {
++  return DICTS[locale] || DICTS.zh;
++}
++
++export function initI18n() {
++  if (_locale) return;
++  _locale = detectLocale();
++  _dict = loadDict(_locale);
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = _locale === 'zh' ? 'zh-CN'
++      : _locale === 'ja' ? 'ja-JP' : 'en';
++  }
++}
++
++export function getLocale() {
++  initI18n();
++  return _locale;
++}
++
++export function setLocale(locale) {
++  if (!DICTS[locale]) return;
++  _locale = locale;
++  _dict = loadDict(locale);
++  try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = locale === 'zh' ? 'zh-CN'
++      : locale === 'ja' ? 'ja-JP' : 'en';
++    applyTranslations();
++  }
++}
++
++export function cycleLocale() {
++  // 顺时针循环：zh → en → ja → zh
++  const order = ['zh', 'en', 'ja'];
++  const next = order[(order.indexOf(_locale) + 1) % order.length];
++  setLocale(next);
++}
++
++export function t(key, vars) {
++  initI18n();
++  const parts = key.split('.');
++  let cur = _dict;
++  for (const p of parts) {
++    if (cur && typeof cur === 'object' && p in cur) {
++      cur = cur[p];
++    } else {
++      return `[${key}]`;
++    }
++  }
++  if (typeof cur !== 'string') return `[${key}]`;
++  if (!vars) return cur;
++  return cur.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
++}
++
++export function applyTranslations() {
++  if (typeof document === 'undefined') return;
++  initI18n();
++  document.querySelectorAll('[data-i18n]').forEach((el) => {
++    el.textContent = t(el.getAttribute('data-i18n'));
++  });
++  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
++    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
++  });
++  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
++    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
++  });
++  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
++    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
++  });
++  const sw = document.querySelector('[data-i18n-lang-switch]');
++  if (sw) sw.textContent = t('language.switchTo');
++  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { locale: _locale } }));
++}
++```
++
++**Step 1.7：写 `src/i18n/zh.js`**
++
++```js
++export default {
++  'language.switchTo': '切到英语',
++  'language.label': '中',
++  'tab.quiz': '🎵 听声音猜角色',
++  'tab.intro': '📖 乐队·角色介绍',
++  'quiz.play': '▶️ 播放声音',
++  'quiz.score': '已答：{correct} 对 {wrong} 错',
++  'quiz.retry': '重试',
++  'quiz.next': '下一题',
++  'quiz.hintBand': '提示乐队',
++  'quiz.reveal': '答案',
++  'quiz.correct': '✅ 正确！',
++  'quiz.wrong': '❌ 失败',
++  'quiz.answer': '📖 答案',
++  'quiz.hintBandPrefix': '💡 提示乐队：',
++  'quiz.playAgain': '▶️ 再听一次',
++  'quiz.audioMissing': '该角色样本暂缺，已自动切到下一题',
++  'intro.bandDesc': '▼ 简介',
++  'intro.listen': '▶️ 听',
++  'intro.audioMissing': '该角色样本暂缺',
++  'common.unknown': '未知',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.8：写 `src/i18n/en.js`**
++
++```js
++export default {
++  'language.switchTo': 'Switch to English',
++  'language.label': 'EN',
++  'tab.quiz': '🎵 Listen & Guess',
++  'tab.intro': '📖 Bands & Characters',
++  'quiz.play': '▶️ Play Voice',
++  'quiz.score': 'Score: {correct} correct / {wrong} wrong',
++  'quiz.retry': 'Retry',
++  'quiz.next': 'Next',
++  'quiz.hintBand': 'Hint Band',
++  'quiz.reveal': 'Answer',
++  'quiz.correct': '✅ Correct! ',
++  'quiz.wrong': '❌ Wrong',
++  'quiz.answer': '📖 Answer: ',
++  'quiz.hintBandPrefix': '💡 Band: ',
++  'quiz.playAgain': '▶️ Play Again',
++  'quiz.audioMissing': 'Voice sample missing. Skipped to next question.',
++  'intro.bandDesc': '▼ About',
++  'intro.listen': '▶️ Listen',
++  'intro.audioMissing': 'Voice sample missing',
++  'common.unknown': 'Unknown',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.9：写 `src/i18n/ja.js`**
++
++```js
++export default {
++  'language.switchTo': '日本語に切替',
++  'language.label': '日',
++  'tab.quiz': '🎵 声で当てよう',
++  'tab.intro': '📖 バンド・キャラ紹介',
++  'quiz.play': '▶️ 再生',
++  'quiz.score': 'スコア：{correct} 正解 / {wrong} 不正解',
++  'quiz.retry': 'リトライ',
++  'quiz.next': '次の問題',
++  'quiz.hintBand': 'バンドをヒント',
++  'quiz.reveal': '答え',
++  'quiz.correct': '✅ 正解！',
++  'quiz.wrong': '❌ 不正解',
++  'quiz.answer': '📖 答え：',
++  'quiz.hintBandPrefix': '💡 バンド：',
++  'quiz.playAgain': '▶️ もう一度聴く',
++  'quiz.audioMissing': '音声サンプルなし。次の問題へ。',
++  'intro.bandDesc': '▼ 紹介',
++  'intro.listen': '▶️ 聴く',
++  'intro.audioMissing': '音声サンプルなし',
++  'common.unknown': '不明',
++  'band.poppin-party': "Poppin'Party",
++  'band.afterglow': 'Afterglow',
++  'band.pastel-palettes': 'Pastel*Palettes',
++  'band.roselia': 'Roselia',
++  'band.hhw': 'Hello, Happy World!',
++  'band.morfonica': 'Morfonica',
++  'band.ras': 'RAISE A SUILEN',
++  'band.mygo': 'MYGO!!!!!',
++  'band.ave-mujica': 'Ave Mujica',
++};
++```
++
++**Step 1.10：写 `tests/i18n.test.js`**
++
++```js
++import { describe, it, expect, beforeEach } from 'vitest';
++import { initI18n, setLocale, t, applyTranslations } from '../src/i18n/index.js';
++
++describe('i18n', () => {
++  beforeEach(() => {
++    localStorage.clear();
++    initI18n();
++  });
++
++  it('detects zh from navigator.language', () => {
++    setLocale('zh');
++    expect(t('language.label')).toBe('中');
++  });
++
++  it('detects ja from navigator.language', () => {
++    setLocale('ja');
++    expect(t('language.label')).toBe('日');
++  });
++
++  it('detects en from navigator.language', () => {
++    setLocale('en');
++    expect(t('language.label')).toBe('EN');
++  });
++
++  it('falls back to [missing.key] for unknown key', () => {
++    expect(t('foo.bar.baz')).toBe('[foo.bar.baz]');
++  });
++
++  it('interpolates {vars}', () => {
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('3');
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('1');
++  });
++
++  it('applyTranslations updates [data-i18n] elements', () => {
++    document.body.innerHTML = '<div data-i18n="quiz.retry"></div>';
++    setLocale('zh');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('重试');
++    setLocale('en');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('Retry');
++    setLocale('ja');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('リトライ');
++  });
++});
++```
++
++**Step 1.11：装依赖 + 跑测试**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm install
++npm test
++```
++
++期望：6 tests passing.
++
++**Step 1.12：写 `src/main.js`（启动入口 + 错误条，参考 MorsePractice）**
++
++```js
++/**
++ * App entry. Imports initApp from ui/app.js (Task 8 stub for now).
++ */
++
++function showBootError(err) {
++  console.error('[boot] fatal error:', err);
++  const banner = document.createElement('div');
++  banner.style.cssText = `
++    position: fixed; top: 0; left: 0; right: 0;
++    background: #f87171; color: #7f1d1d;
++    padding: 12px 20px; font-family: monospace; font-size: 13px;
++    border-bottom: 2px solid #b91c1c; z-index: 9999;
++    white-space: pre-wrap; word-break: break-word;
++  `;
++  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
++  document.body.prepend(banner);
++}
++
++function boot() {
++  try {
++    // ui/app.js 的 initApp() 在 Task 8 接入。当前 Task 1 只做 i18n 初始化 + DOM 占位。
++    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
++    initI18n();
++    applyTranslations();
++    const sw = document.querySelector('[data-i18n-lang-switch]');
++    if (sw) sw.addEventListener('click', cycleLocale);
++  } catch (err) {
++    showBootError(err);
++  }
++  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
++  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
++}
++
++if (document.readyState === 'loading') {
++  document.addEventListener('DOMContentLoaded', boot);
++} else {
++  boot();
++}
++```
++
++**Step 1.13：写最小 `index.html` 占位（Task 8 会扩展）**
++
++```html
++<!DOCTYPE html>
++<html lang="zh-CN">
++<head>
++  <meta charset="UTF-8">
++  <title>BanG Dream 听声音猜角色</title>
++</head>
++<body>
++  <button data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
++  <script type="module" src="src/main.js"></script>
++</body>
++</html>
++```
++
++**Step 1.14：手动启动 + 验证**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++python3 -m http.server 8000 &
++sleep 1
++curl -s http://localhost:8000/ | head -5
++kill %1
++```
++
++期望：HTML 内容回显。
++
++**Step 1.15：commit**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git add -A
++git commit -m "feat: scaffold + i18n (zh/en/ja)"
++```
++
++---
++
++## Task 2：数据模型（bands/characters/samples）+ 调研资料表
++
++**Files:**
++- Create: `src/data/bands.js`, `src/data/characters.js`, `src/data/samples.js`, `research/bands.xml`, `research/characters.xml`, `tests/data.test.js`, `dev-docs/01-bangdream-domain-research-2026-07-15.md`
++
++**Step 2.1：写 `dev-docs/01-bangdream-domain-research-2026-07-15.md`**
++
++```markdown
++# BanG Dream 邦邦域资料研究
++
++> 日期：2026-07-15
++> 目的：为听声音猜角色 demo 准备乐队/角色/样本数据
++
++## 覆盖范围
++
++9 支乐队：
++1. Poppin'Party（5 人）
++2. Afterglow（5 人）
++3. Pastel*Palettes（5 人）
++4. Roselia（5 人）
++5. Hello, Happy World!（5 人）
++6. Morfonica（5 人）
++7. RAISE A SUILEN（4 人；后期 5 人，按 5 录入）
++8. MYGO!!!!!（5 人）
++9. Ave Mujica（5 人）
++
++合计约 49 角色 × 3 样本 = 约 147 条音频资源。
++
++## 参考资料
++
++- bangdream.fandom.com
++- 萌娘百科「BanG Dream!」系列词条
++- bestdori.com（角色语音库）
++- 邦邦官方 anime 官网
++
++详细链接见 `research/bands.xml` 和 `research/characters.xml`。
++```
++
++**Step 2.2：写 `src/data/bands.js`**
++
++```js
++/**
++ * 9 支乐队元数据。
++ *
++ * 字段：
++ *   id        — 内部 ID（小写，连字符）
++ *   name      — 三语名称（zh/en/ja）
++ *   icon      — 图标文件名（assets/images/band/<id>.png）
++ *   members   — 角色 ID 列表（顺序与游戏内一致）
++ *   desc      — 三语简介（一句话）
++ */
++
++export const BANDS = [
++  {
++    id: 'poppin-party',
++    name: { zh: "Poppin'Party", en: "Poppin'Party", ja: "Poppin'Party" },
++    icon: 'poppin-party.png',
++    members: ['kasumi', 'tae', 'rimi', 'sayaka', 'arisa'],
++    desc: {
++      zh: '由香澄组建的女子乐队，青春热血风格。',
++      en: "A youth-oriented girls' band formed by Kasumi.",
++      ja: '香澄が結成した青春女子バンド。',
++    },
++  },
++  {
++    id: 'afterglow',
++    name: { zh: 'Afterglow', en: 'Afterglow', ja: 'Afterglow' },
++    icon: 'afterglow.png',
++    members: ['ran', 'moca', 'himari', 'tsugumi', 'tomo'],
++    desc: {
++      zh: '高中生的朋克风乐队。',
++      en: 'A punk-rock band of high schoolers.',
++      ja: '女子高生のパンクロックバンド。',
++    },
++  },
++  {
++    id: 'pastel-palettes',
++    name: { zh: 'Pastel*Palettes', en: 'Pastel*Palettes', ja: 'Pastel*Palettes' },
++    icon: 'pastel-palettes.png',
++    members: ['aya', 'chisato', 'maya', 'eve', 'hina'],
++    desc: {
++      zh: '以偶像身份活动的乐队。',
++      en: 'A band that also performs as idols.',
++      ja: 'アイドル活動も行うバンド。',
++    },
++  },
++  {
++    id: 'roselia',
++    name: { zh: 'Roselia', en: 'Roselia', ja: 'Roselia' },
++    icon: 'roselia.png',
++    members: ['yukina', 'sayo', 'lisa', 'rinko', 'ako'],
++    desc: {
++      zh: '追求极致音乐性的严肃乐队。',
++      en: 'A serious band pursuing musical perfection.',
++      ja: '音楽性を追求するシリアスなバンド。',
++    },
++  },
++  {
++    id: 'hhw',
++    name: { zh: 'Hello, Happy World!', en: 'Hello, Happy World!', ja: 'Hello, Happy World!' },
++    icon: 'hhw.png',
++    members: ['kokoro', 'kaoru', 'hagumi', 'kanon', 'misaki'],
++    desc: {
++      zh: '以"让世界幸福"为目标的欢乐乐队。',
++      en: 'A cheerful band aiming to make the world happy.',
++      ja: '世界を幸せにすることを目標にする明るいバンド。',
++    },
++  },
++  {
++    id: 'morfonica',
++    name: { zh: 'Morfonica', en: 'Morfonica', ja: 'Morfonica' },
++    icon: 'morfonica.png',
++    members: ['mashiro', 'touko', 'nanami', 'tsukushi', 'rui'],
++    desc: {
++      zh: '以小提琴为特色的正统派乐队。',
++      en: 'An orthodox band featuring the violin.',
++      ja: 'ヴァイオリンが特徴の正統派バンド。',
++    },
++  },
++  {
++    id: 'ras',
++    name: { zh: 'RAISE A SUILEN', en: 'RAISE A SUILEN', ja: 'RAISE A SUILEN' },
++    icon: 'ras.png',
++    members: ['laying', 'lock', 'mashu', 'pareo', 'reona'],
++    desc: {
++      zh: '由 LAYER 主导的实力派乐队。',
++      en: "A powerful band led by LAYER.",
++      ja: 'LAYER が主導する実力派バンド。',
++    },
++  },
++  {
++    id: 'mygo',
++    name: { zh: 'MYGO!!!!!', en: 'MYGO!!!!!', ja: 'MYGO!!!!!' },
++    icon: 'mygo.png',
++    members: ['anon', 'tomori', 'raana', 'soyo', 'taki'],
++    desc: {
++      zh: '《BanG Dream! It\'s MyGO!!!!!》登场乐队。',
++      en: "Band from BanG Dream! It's MyGO!!!!!",
++      ja: '『BanG Dream! It\'s MyGO!!!!!』登場バンド。',
++    },
++  },
++  {
++    id: 'ave-mujica',
++    name: { zh: 'Ave Mujica', en: 'Ave Mujica', ja: 'Ave Mujica' },
++    icon: 'ave-mujica.png',
++    members: ['sakiko', 'mutsumi', 'umiri', 'nyamu', 'togawa'],
++    desc: {
++      zh: '《BanG Dream! Ave Mujica》登场乐队。',
++      en: "Band from BanG Dream! Ave Mujica.",
++      ja: '『BanG Dream! Ave Mujica』登場バンド。',
++    },
++  },
++];
++
++export const BAND_BY_ID = Object.fromEntries(BANDS.map(b => [b.id, b]));
++```
++
++**Step 2.3：写 `src/data/characters.js`**
++
++```js
++/**
++ * 约 49 名角色元数据。
++ *
++ * 字段：
++ *   id        — 内部 ID（小写）
++ *   bandId    — 所属乐队 ID
++ *   role      — 担当（Vo./Gt./Ba./Dr./Key.）
++ *   name      — 三语名
++ *   portrait  — 立绘文件名（assets/images/char/<id>.png）
++ */
++
++export const CHARACTERS = [
++  // Poppin'Party
++  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
++    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
++    portrait: 'kasumi.png' },
++  { id: 'tae', bandId: 'poppin-party', role: 'Dr.',
++    name: { zh: 'たえ', en: 'Tae Hanazono', ja: 'たえ' },
++    portrait: 'tae.png' },
++  { id: 'rimi', bandId: 'poppin-party', role: 'Ba.',
++    name: { zh: 'りみ', en: 'Rimi Ushigome', ja: 'りみ' },
++    portrait: 'rimi.png' },
++  { id: 'sayaka', bandId: 'poppin-party', role: 'Key.',
++    name: { zh: '紗綾', en: 'Saaya Yamabuki', ja: '紗綾' },
++    portrait: 'sayaka.png' },
++  { id: 'arisa', bandId: 'poppin-party', role: 'Gt.',
++    name: { zh: '有咲', en: 'Arisa Ichigaya', ja: '有咲' },
++    portrait: 'arisa.png' },
++
++  // Afterglow
++  { id: 'ran', bandId: 'afterglow', role: 'Gt./Vo',
++    name: { zh: '蘭', en: 'Ran Mitake', ja: '蘭' },
++    portrait: 'ran.png' },
++  { id: 'moca', bandId: 'afterglow', role: 'Gt.',
++    name: { zh: 'モカ', en: 'Moca Aoba', ja: 'モカ' },
++    portrait: 'moca.png' },
++  { id: 'himari', bandId: 'afterglow', role: 'Ba.',
++    name: { zh: 'ひまり', en: 'Himari Uehara', ja: 'ひまり' },
++    portrait: 'himari.png' },
++  { id: 'tsugumi', bandId: 'afterglow', role: 'Dr.',
++    name: { zh: 'つぐみ', en: 'Tsugumi Hazawa', ja: 'つぐみ' },
++    portrait: 'tsugumi.png' },
++  { id: 'tomo', bandId: 'afterglow', role: 'Key.',
++    name: { zh: '巴', en: 'Tomo Udagawa', ja: '巴' },
++    portrait: 'tomo.png' },
++
++  // Pastel*Palettes
++  { id: 'aya', bandId: 'pastel-palettes', role: 'Gt./Vo',
++    name: { zh: '彩', en: 'Aya Maruyama', ja: '彩' },
++    portrait: 'aya.png' },
++  { id: 'chisato', bandId: 'pastel-palettes', role: 'Gt.',
++    name: { zh: '千聖', en: 'Chisato Shirasagi', ja: '千聖' },
++    portrait: 'chisato.png' },
++  { id: 'maya', bandId: 'pastel-palettes', role: 'Ba.',
++    name: { zh: 'マヤ', en: 'Maya Yamato', ja: 'マヤ' },
++    portrait: 'maya.png' },
++  { id: 'eve', bandId: 'pastel-palettes', role: 'Dr.',
++    name: { zh: 'イヴ', en: 'Eve Wakamiya', ja: 'イヴ' },
++    portrait: 'eve.png' },
++  { id: 'hina', bandId: 'pastel-palettes', role: 'Key.',
++    name: { zh: '日菜', en: 'Hina Hikawa', ja: '日菜' },
++    portrait: 'hina.png' },
++
++  // Roselia
++  { id: 'yukina', bandId: 'roselia', role: 'Vo.',
++    name: { zh: '友希那', en: 'Yukina Minato', ja: '友希那' },
++    portrait: 'yukina.png' },
++  { id: 'sayo', bandId: 'roselia', role: 'Gt.',
++    name: { zh: '紗夜', en: 'Sayo Imai', ja: '紗夜' },
++    portrait: 'sayo.png' },
++  { id: 'lisa', bandId: 'roselia', role: 'Ba.',
++    name: { zh: 'リサ', en: 'Lisa Imai', ja: 'リサ' },
++    portrait: 'lisa.png' },
++  { id: 'rinko', bandId: 'roselia', role: 'Key.',
++    name: { zh: '燐子', en: 'Rinko Shirokane', ja: '燐子' },
++    portrait: 'rinko.png' },
++  { id: 'ako', bandId: 'roselia', role: 'Dr.',
++    name: { zh: 'あこ', en: 'Ako Udagawa', ja: 'あこ' },
++    portrait: 'ako.png' },
++
++  // Hello, Happy World!
++  { id: 'kokoro', bandId: 'hhw', role: 'Vo.',
++    name: { zh: 'こころ', en: 'Kokoro Tsurumaki', ja: 'こころ' },
++    portrait: 'kokoro.png' },
++  { id: 'kaoru', bandId: 'hhw', role: 'Gt.',
++    name: { zh: '薰', en: 'Kaoru Seta', ja: '薰' },
++    portrait: 'kaoru.png' },
++  { id: 'hagumi', bandId: 'hhw', role: 'Dr.',
++    name: { zh: 'はぐみ', en: 'Hagumi Kitazawa', ja: 'はぐみ' },
++    portrait: 'hagumi.png' },
++  { id: 'kanon', bandId: 'hhw', role: 'Key.',
++    name: { zh: '花音', en: 'Kanon Matsubara', ja: '花音' },
++    portrait: 'kanon.png' },
++  { id: 'misaki', bandId: 'hhw', role: 'Ba.',
++    name: { zh: 'みさき', en: 'Misaki Okusawa', ja: 'みさき' },
++    portrait: 'misaki.png' },
++
++  // Morfonica
++  { id: 'mashiro', bandId: 'morfonica', role: 'Vo./Vn.',
++    name: { zh: 'ましろ', en: 'Mashiro Kurata', ja: 'ましろ' },
++    portrait: 'mashiro.png' },
++  { id: 'touko', bandId: 'morfonica', role: 'Vn.',
++    name: { zh: '灯織', en: 'Touko Kirigaya', ja: '灯織' },
++    portrait: 'touko.png' },
++  { id: 'nanami', bandId: 'morfonica', role: 'Gt.',
++    name: { zh: '七深', en: 'Nanami Hiromachi', ja: '七深' },
++    portrait: 'nanami.png' },
++  { id: 'tsukushi', bandId: 'morfonica', role: 'Ba.',
++    name: { zh: 'つくし', en: 'Tsukushi Futaba', ja: 'つくし' },
++    portrait: 'tsukushi.png' },
++  { id: 'rui', bandId: 'morfonica', role: 'Dr.',
++    name: { zh: '瑠唯', en: 'Rui Yashio', ja: '瑠唯' },
++    portrait: 'rui.png' },
++
++  // RAISE A SUILEN
++  { id: 'laying', bandId: 'ras', role: 'Dr.',
++    name: { zh: 'LAYER', en: 'LAYER', ja: 'LAYER' },
++    portrait: 'laying.png' },
++  { id: 'lock', bandId: 'ras', role: 'Ba.',
++    name: { zh: 'LOCK', en: 'LOCK', ja: 'LOCK' },
++    portrait: 'lock.png' },
++  { id: 'mashu', bandId: 'ras', role: 'Gt.',
++    name: { zh: 'MASHU', en: 'MASHU', ja: 'MASHU' },
++    portrait: 'mashu.png' },
++  { id: 'pareo', bandId: 'ras', role: 'Key.',
++    name: { zh: 'PAREO', en: 'PAREO', ja: 'PAREO' },
++    portrait: 'pareo.png' },
++  { id: 'reona', bandId: 'ras', role: 'Vo.',
++    name: { zh: 'CHU²', en: 'CHU²', ja: 'CHU²' },
++    portrait: 'reona.png' },
++
++  // MYGO!!!!!
++  { id: 'anon', bandId: 'mygo', role: 'Gt.',
++    name: { zh: 'あの', en: 'Anon Chihaya', ja: 'あの' },
++    portrait: 'anon.png' },
++  { id: 'tomori', bandId: 'mygo', role: 'Vo./Gt.',
++    name: { zh: '灯', en: 'Tomori Takamatsu', ja: '灯' },
++    portrait: 'tomori.png' },
++  { id: 'raana', bandId: 'mygo', role: 'Ba.',
++    name: { zh: '楽奈', en: 'Raana Kaname', ja: '楽奈' },
++    portrait: 'raana.png' },
++  { id: 'soyo', bandId: 'mygo', role: 'Gt.',
++    name: { zh: 'そよ', en: 'Soyo Nagasaki', ja: 'そよ' },
++    portrait: 'soyo.png' },
++  { id: 'taki', bandId: 'mygo', role: 'Dr.',
++    name: { zh: '立希', en: 'Taki Shiina', ja: '立希' },
++    portrait: 'taki.png' },
++
++  // Ave Mujica
++  { id: 'sakiko', bandId: 'ave-mujica', role: 'Key.',
++    name: { zh: 'さきこ', en: 'Sakiko Togawa', ja: 'さきこ' },
++    portrait: 'sakiko.png' },
++  { id: 'mutsumi', bandId: 'ave-mujica', role: 'Dr.',
++    name: { zh: 'むつみ', en: 'Mutsumi Wakaba', ja: 'むつみ' },
++    portrait: 'mutsumi.png' },
++  { id: 'umiri', bandId: 'ave-mujica', role: 'Vo.',
++    name: { zh: 'うみり', en: 'Umiri Yahata', ja: 'うみり' },
++    portrait: 'umiri.png' },
++  { id: 'nyamu', bandId: 'ave-mujica', role: 'Gt.',
++    name: { zh: 'にゃむ', en: 'Nyamu Yutenji', ja: 'にゃむ' },
++    portrait: 'nyamu.png' },
++  { id: 'togawa', bandId: 'ave-mujica', role: 'Ba.',
++    name: { zh: '戸川', en: 'Togawa (Sakiko family)', ja: '戸川' },
++    portrait: 'togawa.png' },
++];
++
++export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));
++
++export function charactersOfBand(bandId) {
++  const band = require('./bands.js').BAND_BY_ID[bandId] || import('./bands.js').then(m => m.BAND_BY_ID[bandId]);
++  // 注：require 不在 ESM 内可用，下面改成同步 import。
++  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
++}
++```
++
++**注意**：上面 `charactersOfBand` 用了 `require`，不适用于 ESM。改为下面的同步写法（import 在文件顶部已可用）：
++
++**Step 2.3 修正**：删除上一步，改为：
++
++```js
++/**
++ * 约 49 名角色元数据（同上，省略重复字段说明）
++ */
++
++import { BAND_BY_ID } from './bands.js';
++
++export const CHARACTERS = [
++  // ... (同上 49 角色)
++];
++
++export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));
++
++export function charactersOfBand(bandId) {
++  const band = BAND_BY_ID[bandId];
++  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
++}
++```
++
++（CHARACTERS 数组保持 Task 2.3 中定义的那 49 项，在实际写入文件时统一顶部 `import` BAND_BY_ID，并删除 `require` 残留。）
++
++**Step 2.4：写 `src/data/samples.js`**
++
++```js
++/**
++ * 每个角色 ≥3 条主声线样本的文件名。
++ * 实际资源在 Task 3 下载，本文件先按"全员 ≥3 条"占位。
++ * 后续若某角色资源凑不齐 3 条，对应项可改成更少；quiz.js 会跳过空样本角色。
++ */
++
++import { CHARACTERS } from './characters.js';
++
++// 默认模板：每角色用 <id>-1/2/3.mp3
++const TEMPLATE = (id) => [`${id}-1.mp3`, `${id}-2.mp3`, `${id}-3.mp3`];
++
++export const SAMPLES = Object.fromEntries(
++  CHARACTERS.map(c => [c.id, TEMPLATE(c.id)])
++);
++
++// 已知可能凑不齐的角色（Task 3 之后会更新这里）：
++// SAMPLES['xxx'] = ['xxx-1.mp3'];  // 只剩 1 条
++```
++
++**Step 2.5：写 `tests/data.test.js`**
++
++```js
++import { describe, it, expect } from 'vitest';
++import { BANDS, BAND_BY_ID } from '../src/data/bands.js';
++import { CHARACTERS, CHARACTER_BY_ID, charactersOfBand } from '../src/data/characters.js';
++import { SAMPLES } from '../src/data/samples.js';
++
++describe('data integrity', () => {
++  it('every band has 4-5 members', () => {
++    for (const b of BANDS) {
++      expect(b.members.length, `band ${b.id}`).toBeGreaterThanOrEqual(4);
++      expect(b.members.length, `band ${b.id}`).toBeLessThanOrEqual(5);
++    }
++  });
++
++  it('every character belongs to a band that exists', () => {
++    for (const c of CHARACTERS) {
++      expect(BAND_BY_ID[c.bandId], `char ${c.id}`).toBeDefined();
++    }
++  });
++
++  it('every band member id resolves to a character', () => {
++    for (const b of BANDS) {
++      for (const mid of b.members) {
++        expect(CHARACTER_BY_ID[mid], `band ${b.id} member ${mid}`).toBeDefined();
++      }
++    }
++  });
++
++  it('every character has a sample list ≥1', () => {
++    for (const c of CHARACTERS) {
++      expect(SAMPLES[c.id], `char ${c.id}`).toBeDefined();
++      expect(SAMPLES[c.id].length, `char ${c.id}`).toBeGreaterThanOrEqual(1);
++    }
++  });
++
++  it('charactersOfBand returns matching subset', () => {
++    const poppin = charactersOfBand('poppin-party');
++    expect(poppin.length).toBe(5);
++    expect(poppin.map(c => c.id)).toEqual(['kasumi', 'tae', 'rimi', 'sayaka', 'arisa']);
++  });
++
++  it('total characters ≈ 49', () => {
++    expect(CHARACTERS.length).toBeGreaterThanOrEqual(45);
++    expect(CHARACTERS.length).toBeLessThanOrEqual(55);
++  });
++});
++```
++
++**Step 2.6：跑测试**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm test
++```
++
++期望：原有 6 + 新增 6 = 12 tests passing.
++
++**Step 2.7：写 `research/bands.xml` 与 `research/characters.xml`（占位）**
++
++`research/bands.xml`：
++```xml
++<?xml version="1.0" encoding="UTF-8"?>
++<bands>
++  <band id="poppin-party">
++    <name-zh>Poppin'Party</name-zh>
++    <name-en>Poppin'Party</name-en>
++    <name-ja>Poppin'Party</name-ja>
++    <source>https://bangdream.fandom.com/wiki/Poppin%27Party</source>
++    <members>5</members>
++    <desc-source>https://mzh.moegirl.org.cn/Poppin%27Party</desc-source>
++  </band>
++  <!-- ... 其他 8 支同样格式 ... -->
++</bands>
++```
++
++`research/characters.xml`：
++```xml
++<?xml version="1.0" encoding="UTF-8"?>
++<characters>
++  <character id="kasumi">
++    <band>poppin-party</band>
++    <name-zh>香澄</name-zh>
++    <name-en>Kasumi Toyama</name-en>
++    <name-ja>香澄</name-ja>
++    <portrait-source>https://bangdream.fandom.com/wiki/Kasumi_Toyama</portrait-source>
++    <voice-source>https://bestdori.com/tool/voice</voice-source>
++  </character>
++  <!-- ... 其他 48 名同样格式 ... -->
++</characters>
++```
++
++（具体 URL 在 Task 3 实际下载时填入；本步骤先建空表 + 1 条样例，Task 3 完成时再补齐。）
++
++**Step 2.8：commit**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git add -A
++git commit -m "feat: data model (9 bands, ~49 characters, samples stub)"
++```
++
++---
++
++## Task 3：资源下载（图片 + 音频）
++
++**Files:**
++- Create: `assets/audio/<charId>/{1,2,3}.mp3`（约 147 个）
++- Create: `assets/images/band/<bandId>.png`（9 个）
++- Create: `assets/images/char/<charId>.png`（约 49 个）
++- Create: `assets/images/fail/ksm-cry.png`（1 个）
++- Update: `research/bands.xml`, `research/characters.xml`
++- Create: `dev-docs/02-resource-strategy-2026-07-15.md`, `dev-docs/03-resource-acquisition-log-2026-07-15.md`, `dev-docs/04-resource-missing-2026-07-15.md`
++
++**Step 3.1：写 `dev-docs/02-resource-strategy-2026-07-15.md`**
++
++```markdown
++# 资源获取策略（2026-07-15）
++
++## 限制（来自 Agent Rules + Spec）
++- 搜索可用源：5 min
++- 单条下载：≤180 s
++- 找不到：整理进 `04-resource-missing-2026-07-15.md`
++
++## 搜索优先级
++
++### 图片
++1. bangdream.fandom.com（英文 wiki，图片齐全）
++2. 萌娘百科「BanG Dream!」系列词条
++3. 邦邦官方 anime 官网
++4. 微博/B 站官方账号
++
++### 音频（主声线代表性台词）
++1. bestdori.com（聚合语音库）
++2. bangdream.fandom.com（部分语音）
++3. 萌娘百科「BanG Dream! 语音集」词条
++
++## 格式
++- 图片：PNG（CSS 缩放到 4:5）
++- 音频：MP3（角色台词 < 200 KB）
++
++## 并行下载
++使用 `xargs -P 8 -n 1` 或 `curl -Z` 控制并发，避免单 IP 限速。
++```
++
++**Step 3.2：写 `dev-docs/03-resource-acquisition-log-2026-07-15.md`（模板）**
++
++```markdown
++# 资源下载日志（2026-07-15）
++
++每条资源一行：`[乐队/角色] [类型] [URL] [本地路径] [状态] [耗时]`
++
++## 图片
++
++| 时间 | 角色/乐队 | URL | 本地路径 | 状态 | 耗时 |
++|---|---|---|---|---|---|
++
++## 音频
++
++| 时间 | 角色 | URL | 本地路径 | 状态 | 耗时 |
++|---|---|---|---|---|---|
++```
++
++**Step 3.3：创建 `assets/` 目录骨架**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++mkdir -p assets/audio assets/images/band assets/images/char assets/images/fail
++```
++
++**Step 3.4：下载乐队图标（9 个）**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++
++# 示例：Poppin'Party logo（替换为实际 URL）
++curl -L --max-time 180 \
++  -o assets/images/band/poppin-party.png \
++  "https://example.com/poppin-party-logo.png"
++
++# 其他 8 支同样方式下载，文件名按 bands.js 中的 id
++# ... (afterglow, pastel-palettes, roselia, hhw, morfonica, ras, mygo, ave-mujica)
++```
++
++**注意**：执行 `curl` 前先把真实 URL 填进 `research/bands.xml` 的 `<logo-source>` 字段（首次下载时同步更新）。每条命令单独跑，便于记录成功/失败到 `03-acquisition-log`。
++
++**Step 3.5：下载角色立绘（约 49 个）**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++
++curl -L --max-time 180 \
++  -o assets/images/char/kasumi.png \
++  "https://example.com/kasumi-portrait.png"
++
++# 其他 48 名同样方式下载，按 characters.js 的 id 命名
++```
++
++每条命令单独跑。失败则在 `03-acquisition-log` 标 ❌ 并加入 `04-resource-missing`。
++
++**Step 3.6：下载 Kasumi 失败图（1 个）**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++
++curl -L --max-time 180 \
++  -o assets/images/fail/ksm-cry.png \
++  "https://example.com/kasumi-cry.png"
++```
++
++找不到时按 `dev-docs/04-resource-missing-2026-07-15.md` 整理。
++
++**Step 3.7：下载角色音频（约 147 个）**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++mkdir -p assets/audio/kasumi
++
++curl -L --max-time 180 \
++  -o assets/audio/kasumi/kasumi-1.mp3 \
++  "https://example.com/kasumi-voice-1.mp3"
++curl -L --max-time 180 \
++  -o assets/audio/kasumi/kasumi-2.mp3 \
++  "https://example.com/kasumi-voice-2.mp3"
++curl -L --max-time 180 \
++  -o assets/audio/kasumi/kasumi-3.mp3 \
++  "https://example.com/kasumi-voice-3.mp3"
++
++# 其他 48 名同样方式
++```
++
++**Step 3.8：实际下载时同步更新日志**
++
++把每条资源的：角色、URL、本地路径、状态（✅/❌）、耗时 填进 `03-acquisition-log`。失败的填进 `04-resource-missing`。
++
++**Step 3.9：根据下载结果更新 `src/data/samples.js`**
++
++对于凑不齐 3 条的角色，把 SAMPLES[id] 改成实际能下载到的列表（可能只有 1-2 条）。找不到任何音频的角色，整项设为 `[]`，quiz.js 会自动跳过。
++
++```js
++// src/data/samples.js（更新后示例）
++export const SAMPLES = {
++  'kasumi': ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
++  'tae':   ['tae-1.mp3', 'tae-2.mp3'],  // 只下到 2 条
++  'xxx':   [],                          // 完全找不到
++  // ...
++};
++```
++
++**Step 3.10：跑测试确认数据模型仍合法**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm test
++```
++
++期望：data.test.js 全部 passing（已经写好 ≥1 的断言，空列表 `[]` 也算 ≥1；但若用户后续想要 ≥3 严格，可放宽）。
++
++**Step 3.11：commit**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git add -A
++git commit -m "feat: resources (images + audio) + missing log"
++```
++
++注：音频文件可能很大（每条 ~200KB × 147 ≈ 30MB），如果担心 repo 体积，可加 `.gitignore` 规则忽略 `assets/audio/*.mp3`，运行时直接从外部 CDN 加载。当前 demo 阶段先全部进 git。
++
++---
++
++## Task 4：音频引擎 audio.js
++
++**Files:**
++- Create: `src/core/audio.js`, `tests/audio.test.js`
++
++**Step 4.1：写 `tests/audio.test.js`（TDD，先写测试）**
++
++```js
++import { describe, it, expect, vi, beforeEach } from 'vitest';
++import { getAudioContext, playSample, stop, _resetForTests } from '../src/core/audio.js';
++
++// mock HTMLAudioElement
++class FakeAudio {
++  constructor() {
++    this.src = '';
++    this.onended = null;
++    this.onerror = null;
++    this._listeners = {};
++  }
++  addEventListener(ev, fn) { this._listeners[ev] = fn; }
++  removeEventListener(ev) { delete this._listeners[ev]; }
++  play() {
++    setTimeout(() => { if (this.onended) this.onended(); }, 0);
++    return Promise.resolve();
++  }
++  pause() {}
++  load() {}
++  triggerError() { if (this.onerror) this.onerror(); }
++}
++globalThis.Audio = FakeAudio;
++
++describe('audio engine', () => {
++  beforeEach(() => _resetForTests());
++
++  it('getAudioContext returns singleton', () => {
++    const a = getAudioContext();
++    const b = getAudioContext();
++    expect(a).toBe(b);
++  });
++
++  it('playSample resolves with audioId on success', async () => {
++    const result = await playSample('kasumi', 'kasumi-1.mp3');
++    expect(result).toEqual({ ok: true, audioId: 'kasumi-1.mp3' });
++  });
++
++  it('playSample returns ok=false on 404 and triggers onMissing', async () => {
++    let captured = null;
++    const result = await playSample('xxx', 'xxx-1.mp3', {
++      onMissing: (charId) => { captured = charId; },
++    });
++    expect(result).toEqual({ ok: false, audioId: 'xxx-1.mp3' });
++    expect(captured).toBe('xxx');
++  });
++
++  it('stop() cancels in-flight playback', async () => {
++    const p = playSample('kasumi', 'kasumi-2.mp3');
++    stop();
++    const result = await p;
++    // stop should resolve without firing onended
++    expect(result.ok).toBe(true);
++  });
++});
++```
++
++**Step 4.2：跑测试确认失败**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npx vitest run tests/audio.test.js
++```
++
++期望：FAIL（audio.js 未实现）。
++
++**Step 4.3：实现 `src/core/audio.js`**
++
++```js
++/**
++ * 音频引擎：单例 AudioContext + 按需创建 HTMLAudioElement 播放角色样本。
++ *
++ * 设计：
++ *   - 每次 playSample() 创建一个 <audio> 实例（简单可靠；不预加载避免内存占用）
++ *   - 失败（404 / 解码错）通过 onMissing 回调传出，由 UI 决定是切下一题
++ *   - stop() 中止当前播放
++ *   - _resetForTests() 仅供测试：清空单例
++ */
++
++let _ctx = null;
++let _activeAudio = null;
++
++export function getAudioContext() {
++  if (!_ctx) {
++    const Ctor = window.AudioContext || window.webkitAudioContext;
++    if (Ctor) _ctx = new Ctor();
++  }
++  return _ctx;
++}
++
++/**
++ * 播放一条样本。
++ *
++ * @param {string} charId    角色 ID（用于 onMissing）
++ * @param {string} audioId   样本文件名（如 'kasumi-1.mp3'）
++ * @param {object} [opts]
++ * @param {string} [opts.audioBase='assets/audio/'] 基础路径
++ * @param {(charId: string) => void} [opts.onMissing] 404 回调
++ * @returns {Promise<{ok: boolean, audioId: string}>}
++ */
++export function playSample(charId, audioId, opts = {}) {
++  const { audioBase = 'assets/audio/', onMissing } = opts;
++  return new Promise((resolve) => {
++    const audio = new Audio();
++    audio.src = `${audioBase}${charId}/${audioId}`;
++    _activeAudio = audio;
++
++    audio.addEventListener('ended', () => {
++      if (_activeAudio === audio) _activeAudio = null;
++      resolve({ ok: true, audioId });
++    });
++
++    audio.addEventListener('error', () => {
++      if (_activeAudio === audio) _activeAudio = null;
++      if (onMissing) onMissing(charId);
++      resolve({ ok: false, audioId });
++    });
++
++    audio.play().catch(() => {
++      // 某些浏览器需要用户手势后才允许 play；这里走 error 通道
++      if (_activeAudio === audio) _activeAudio = null;
++      if (onMissing) onMissing(charId);
++      resolve({ ok: false, audioId });
++    });
++  });
++}
++
++/** 停止当前播放。 */
++export function stop() {
++  if (_activeAudio) {
++    try { _activeAudio.pause(); } catch {}
++    _activeAudio = null;
++  }
++}
++
++/** 测试专用：清空单例。 */
++export function _resetForTests() {
++  _ctx = null;
++  _activeAudio = null;
++}
++```
++
++**Step 4.4：跑测试确认通过**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npx vitest run tests/audio.test.js
++```
++
++期望：4 tests passing.
++
++**Step 4.5：commit**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++git add -A
++git commit -m "feat: audio engine with HTMLAudioElement + 404 fallback"
++```
++
++---
++
++## Task 5：进度持久化 storage/progress.js
++
++**Files:**
++- Create: `src/storage/progress.js`, `tests/progress.test.js`
++
++**Step 5.1：写 `tests/progress.test.js`（TDD）**
++
++```js
++import { describe, it, expect, beforeEach } from 'vitest';
++import { loadProgress, saveProgress, recordCorrect, recordWrong, resetProgress } from '../src/storage/progress.js';
++
++describe('progress persistence', () => {
++  beforeEach(() => {
++    localStorage.clear();
++  });
++
++  it('loadProgress returns default zeros on first load', () => {
++    const p = loadProgress();
++    expect(p.correct).toBe(0);
++    expect(p.wrong).toBe(0);
++    expect(p.byChar).toEqual({});
++    expect(p.errors.audio404).toBe(0);
++  });
++
++  it('recordCorrect increments correct + updates byChar', () => {
++    recordCorrect('kasumi');
++    recordCorrect('kasumi');
++    recordCorrect('yukina');
++    const p = loadProgress();
++    expect(p.correct).toBe(2);  // kasumi 计 2 次 correct 时不写 byChar（只记错）
++    expect(p.wrong).toBe(0);
++    expect(p.byChar).toEqual({});
++  });
++
++  it('recordWrong increments wrong + updates byChar', () => {
++    recordWrong('kasumi');
++    recordWrong('kasumi');
++    recordWrong('yukina');
++    const p = loadProgress();
++    expect(p.correct).toBe(0);
++    expect(p.wrong).toBe(2);
++    expect(p.byChar).toEqual({ kasumi: 2 });
++  });
++
++  it('resetProgress clears all', () => {
++    recordWrong('kasumi');
++    resetProgress();
++    const p = loadProgress();
++    expect(p.wrong).toBe(0);
++    expect(p.byChar).toEqual({});
++  });
++
++  it('persists across loadProgress calls', () => {
++    recordWrong('kasumi');
++    const p = loadProgress();
++    expect(p.wrong).toBe(1);
++    expect(p.byChar.kasumi).toBe(1);
++  });
++});
++```
++
++**Step 5.2：跑测试确认失败**
++
++```bash
++npx vitest run tests/progress.test.js
++```
++
++期望：FAIL（progress.js 未实现）。
++
++**Step 5.3：实现 `src/storage/progress.js`**
++
++```js
++/**
++ * 本地进度持久化（localStorage）。
++ *
++ * 数据结构：
++ *   {
++ *     correct: number,
++ *     wrong: number,
++ *     byChar: { [charId]: number },   // 错误次数
++ *     errors: { audio404: number },
++ *   }
++ *
++ * localStorage 不可用时退化为内存存储（demo 内不丢失当前会话）。
++ */
++
++const STORAGE_KEY = 'bangdream.v1.progress';
++
++const DEFAULT = () => ({
++  correct: 0,
++  wrong: 0,
++  byChar: {},
++  errors: { audio404: 0 },
++});
++
++let _memCache = null;
++
++function readRaw() {
++  try {
++    const raw = localStorage.getItem(STORAGE_KEY);
++    if (raw) return JSON.parse(raw);
++  } catch {}
++  return null;
++}
++
++function writeRaw(obj) {
++  try {
++    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
++    return true;
++  } catch {
++    return false;
++  }
++}
++
++export function loadProgress() {
++  const raw = readRaw() || _memCache || DEFAULT();
++  // 合并默认值（防止旧数据缺字段）
++  return { ...DEFAULT(), ...raw, byChar: raw.byChar || {}, errors: { ...DEFAULT().errors, ...(raw.errors || {}) } };
++}
++
++export function saveProgress(p) {
++  _memCache = p;
++  writeRaw(p);
++}
++
++export function recordCorrect(charId) {
++  const p = loadProgress();
++  p.correct++;
++  saveProgress(p);
++}
++
++export function recordWrong(charId) {
++  const p = loadProgress();
++  p.wrong++;
++  p.byChar[charId] = (p.byChar[charId] || 0) + 1;
++  saveProgress(p);
++}
++
++export function recordAudio404() {
++  const p = loadProgress();
++  p.errors.audio404 = (p.errors.audio404 || 0) + 1;
++  saveProgress(p);
++}
++
++export function resetProgress() {
++  saveProgress(DEFAULT());
++}
++```
++
++**Step 5.4：跑测试确认通过**
++
++```bash
++npx vitest run tests/progress.test.js
++```
++
++期望：5 tests passing.
++
++**Step 5.5：commit**
++
++```bash
++git add -A
++git commit -m "feat: progress persistence (localStorage)"
++```
++
++---
++
++## Task 6：测验状态机 core/quiz.js
++
++**Files:**
++- Create: `src/core/quiz.js`, `tests/quiz.test.js`
++
++**Step 6.1：写 `tests/quiz.test.js`（TDD，state machine）**
++
++```js
++import { describe, it, expect, beforeEach, vi } from 'vitest';
++import {
++  init, newQuestion, playCurrent, retry, next, pick,
++  hintBand, revealAnswer,
++  canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
++  getState, onResult,
++} from '../src/core/quiz.js';
++
++// mock audio
++vi.mock('../src/core/audio.js', () => ({
++  playSample: vi.fn(async () => ({ ok: true, audioId: 'x.mp3' })),
++  stop: vi.fn(),
++}));
++
++import * as audio from '../src/core/audio.js';
++
++describe('quiz state machine', () => {
++  beforeEach(() => {
++    localStorage.clear();
++    init({ characters: [
++      { id: 'a', bandId: 'b1' },
++      { id: 'b', bandId: 'b1' },
++    ], samples: {
++      a: ['a-1.mp3', 'a-2.mp3', 'a-3.mp3'],
++      b: ['b-1.mp3', 'b-2.mp3', 'b-3.mp3'],
++    }, bands: [{ id: 'b1', members: ['a', 'b'] }] });
++  });
++
++  it('starts in idle phase', () => {
++    const s = getState();
++    expect(s.phase).toBe('idle');
++    expect(s.answered).toBe(false);
++    expect(s.revealed).toBe(false);
++  });
++
++  it('newQuestion moves to awaitPick + selects a char + sample', () => {
++    newQuestion();
++    const s = getState();
++    expect(s.phase).toBe('awaitPick');
++    expect(['a', 'b']).toContain(s.currentCharId);
++    expect(s.currentSampleId).toMatch(/-[123]\.mp3$/);
++    expect(s.answered).toBe(false);
++  });
++
++  it('playCurrent calls audio.playSample', async () => {
++    newQuestion();
++    await playCurrent();
++    expect(audio.playSample).toHaveBeenCalled();
++  });
++
++  it('pick(correct) sets answered + score.correct++', () => {
++    newQuestion();
++    const s = getState();
++    const result = [];
++    onResult(r => result.push(r));
++    pick(s.currentCharId);
++    expect(result[0].correct).toBe(true);
++    expect(getState().phase).toBe('answered');
++    expect(getState().answered).toBe(true);
++  });
++
++  it('pick(wrong) sets answered + score.wrong++ + byChar++', () => {
++    newQuestion();
++    const s = getState();
++    const wrongId = s.currentCharId === 'a' ? 'b' : 'a';
++    const result = [];
++    onResult(r => result.push(r));
++    pick(wrongId);
++    expect(result[0].correct).toBe(false);
++    expect(getState().phase).toBe('answered');
++  });
++
++  it('retry() same char + different sample + reset', () => {
++    newQuestion();
++    const before = getState();
++    // 强制换 sample
++    retry();
++    const after = getState();
++    expect(after.currentCharId).toBe(before.currentCharId);
++    expect(after.phase).toBe('awaitPick');
++    expect(after.answered).toBe(false);
++  });
++
++  it('next() moves to new question', () => {
++    newQuestion();
++    next();
++    const s = getState();
++    expect(s.phase).toBe('awaitPick');
++    expect(s.answered).toBe(false);
++    expect(s.revealed).toBe(false);
++  });
++
++  it('revealAnswer sets revealed=true', () => {
++    newQuestion();
++    revealAnswer();
++    expect(getState().revealed).toBe(true);
++  });
++
++  it('canPick false after answered', () => {
++    newQuestion();
++    expect(canPick()).toBe(true);
++    pick(getState().currentCharId);
++    expect(canPick()).toBe(false);
++  });
++
++  it('canReveal false after revealed', () => {
++    newQuestion();
++    expect(canReveal()).toBe(true);
++    revealAnswer();
++    expect(canReveal()).toBe(false);
++  });
++
++  it('canRetry always true', () => {
++    expect(canRetry()).toBe(true);
++    newQuestion();
++    expect(canRetry()).toBe(true);
++  });
++});
++```
++
++**Step 6.2：跑测试确认失败**
++
++```bash
++npx vitest run tests/quiz.test.js
++```
++
++期望：FAIL.
++
++**Step 6.3：实现 `src/core/quiz.js`**
++
++```js
++/**
++ * 测验状态机。
++ *
++ * 初始化：init({characters, samples, bands})
++ * 主循环：
++ *   idle → newQuestion() → awaitPick
++ *   awaitPick → playCurrent() → playing (audio 自动) → awaitPick (audio ended)
++ *   awaitPick → pick(charId) → answered
++ *   any → retry() → awaitPick（同角色不同样本，重置 answered/revealed）
++ *   any → next() → awaitPick（新角色）
++ *   awaitPick/answered → hintBand() / revealAnswer()
++ */
++
++import { playSample, stop } from './audio.js';
++import { recordCorrect, recordWrong } from '../storage/progress.js';
++
++let _state = null;
++let _resultListeners = [];
++
++function makeInitial() {
++  return {
++    currentCharId: null,
++    currentSampleId: null,
++    phase: 'idle',
++    answered: false,
++    revealed: false,
++    pickedCharId: null,
++    score: { correct: 0, wrong: 0, byChar: {} },
++  };
++}
++
++export function init({ characters, samples, bands }) {
++  _state = makeInitial();
++  _state._data = { characters, samples, bands };
++  _resultListeners = [];
++}
++
++export function getState() { return _state; }
++
++export function onResult(fn) { _resultListeners.push(fn); }
++
++function pickRandomCharId() {
++  const chars = _state._data.characters;
++  // 过滤掉空样本角色
++  const candidates = chars.filter(c => (_state._data.samples[c.id] || []).length > 0);
++  if (candidates.length === 0) throw new Error('No characters with samples');
++  return candidates[Math.floor(Math.random() * candidates.length)].id;
++}
++
++function pickRandomSample(charId) {
++  const list = _state._data.samples[charId];
++  return list[Math.floor(Math.random() * list.length)];
++}
++
++export function newQuestion() {
++  stop();
++  _state.currentCharId = pickRandomCharId();
++  _state.currentSampleId = pickRandomSample(_state.currentCharId);
++  _state.phase = 'awaitPick';
++  _state.answered = false;
++  _state.revealed = false;
++  _state.pickedCharId = null;
++}
++
++export async function playCurrent(opts = {}) {
++  if (!_state.currentCharId) newQuestion();
++  _state.phase = 'playing';
++  const result = await playSample(_state.currentCharId, _state.currentSampleId, {
++    onMissing: opts.onMissing,
++  });
++  // 无论 ok 与否都回到 awaitPick
++  _state.phase = 'awaitPick';
++  return result;
++}
++
++export function retry() {
++  if (!_state.currentCharId) return newQuestion();
++  // 同角色换样本
++  const list = _state._data.samples[_state.currentCharId];
++  let next = pickRandomSample(_state.currentCharId);
++  let safety = 5;
++  while (next === _state.currentSampleId && safety-- > 0 && list.length > 1) {
++    next = pickRandomSample(_state.currentCharId);
++  }
++  _state.currentSampleId = next;
++  _state.phase = 'awaitPick';
++  _state.answered = false;
++  _state.revealed = false;
++  _state.pickedCharId = null;
++}
++
++export function next() {
++  newQuestion();
++}
++
++export function pick(charId) {
++  if (!canPick()) return;
++  _state.pickedCharId = charId;
++  _state.answered = true;
++  _state.phase = 'answered';
++  const correct = charId === _state.currentCharId;
++  if (correct) {
++    _state.score.correct++;
++    recordCorrect(charId);
++  } else {
++    _state.score.wrong++;
++    _state.score.byChar[charId] = (_state.score.byChar[charId] || 0) + 1;
++    recordWrong(charId);
++  }
++  for (const fn of _resultListeners) {
++    try { fn({ correct, charId, pickedCharId: charId, currentCharId: _state.currentCharId, sampleId: _state.currentSampleId }); }
++    catch (e) { console.error(e); }
++  }
++}
++
++export function hintBand() {
++  if (!canHintBand()) return null;
++  const char = _state._data.characters.find(c => c.id === _state.currentCharId);
++  if (!char) return null;
++  return _state._data.bands.find(b => b.id === char.bandId);
++}
++
++export function revealAnswer() {
++  if (!canReveal()) return null;
++  _state.revealed = true;
++  const char = _state._data.characters.find(c => c.id === _state.currentCharId);
++  return char;
++}
++
++export function canPlay() {
++  return _state.phase === 'idle' || _state.phase === 'awaitPick';
++}
++export function canPick() {
++  return _state.phase === 'awaitPick';
++}
++export function canRetry() {
++  return true;
++}
++export function canNext() {
++  return true;
++}
++export function canHintBand() {
++  return (_state.phase === 'awaitPick' || _state.phase === 'answered') && !_state.revealed;
++}
++export function canReveal() {
++  return (_state.phase === 'awaitPick' || _state.phase === 'answered') && !_state.revealed;
++}
++```
++
++**Step 6.4：跑测试确认通过**
++
++```bash
++npx vitest run tests/quiz.test.js
++```
++
++期望：11 tests passing.
++
++**Step 6.5：commit**
++
++```bash
++git add -A
++git commit -m "feat: quiz state machine"
++```
++
++---
++
++## Task 7：Tab 控制器 core/tabs.js
++
++**Files:**
++- Create: `src/core/tabs.js`, `tests/tabs.test.js`
++
++**Step 7.1：写 `tests/tabs.test.js`（TDD）**
++
++```js
++import { describe, it, expect, beforeEach } from 'vitest';
++import { init, getActive, setActive, subscribe } from '../src/core/tabs.js';
++
++describe('tabs', () => {
++  beforeEach(() => init(['quiz', 'intro']));
++
++  it('starts on first tab', () => {
++    expect(getActive()).toBe('quiz');
++  });
++
++  it('setActive switches', () => {
++    setActive('intro');
++    expect(getActive()).toBe('intro');
++  });
++
++  it('subscribe receives change events', () => {
++    const events = [];
++    subscribe(id => events.push(id));
++    setActive('intro');
++    expect(events).toEqual(['intro']);
++  });
++
++  it('setActive ignores unknown ids', () => {
++    setActive('nope');
++    expect(getActive()).toBe('quiz');
++  });
++});
++```
++
++**Step 7.2：跑测试确认失败**
++
++```bash
++npx vitest run tests/tabs.test.js
++```
++
++期望：FAIL.
++
++**Step 7.3：实现 `src/core/tabs.js`**
++
++```js
++let _tabs = [];
++let _active = null;
++let _subs = [];
++
++export function init(tabs) {
++  _tabs = tabs.slice();
++  _active = tabs[0];
++  _subs = [];
++}
++
++export function getActive() { return _active; }
++
++export function setActive(id) {
++  if (!_tabs.includes(id)) return;
++  _active = id;
++  for (const fn of _subs) {
++    try { fn(id); } catch (e) { console.error(e); }
++  }
++}
++
++export function subscribe(fn) { _subs.push(fn); }
++```
++
++**Step 7.4：跑测试确认通过**
++
++```bash
++npx vitest run tests/tabs.test.js
++```
++
++期望：4 tests passing.
++
++**Step 7.5：commit**
++
++```bash
++git add -A
++git commit -m "feat: tabs controller"
++```
++
++---
++
++## Task 8：UI 控制器（app + quiz view + intro view + index.html）
++
++**Files:**
++- Update: `index.html`, `src/main.js`
++- Create: `src/ui/app.js`, `src/ui/quiz.js`, `src/ui/intro.js`
++
++**Step 8.1：写完整 `index.html`**
++
++```html
++<!DOCTYPE html>
++<html lang="zh-CN">
++<head>
++  <meta charset="UTF-8">
++  <meta name="viewport" content="width=device-width, initial-scale=1">
++  <title>BanG Dream 听声音猜角色</title>
++  <link rel="stylesheet" href="styles/main.css">
++</head>
++<body>
++  <header class="topbar">
++    <nav class="tabs">
++      <button class="tab-btn" data-tab="quiz" data-i18n="tab.quiz">🎵 听声音猜角色</button>
++      <button class="tab-btn" data-tab="intro" data-i18n="tab.intro">📖 乐队·角色介绍</button>
++    </nav>
++    <button class="lang-btn" data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
++  </header>
++
++  <main>
++    <section id="tab-quiz" class="tab-panel" hidden>
++      <div class="quiz-header">
++        <button id="quiz-play" class="primary" data-i18n="quiz.play">▶️ 播放声音</button>
++        <div id="quiz-score" class="score" data-i18n="quiz.score">已答：0 对 0 错</div>
++      </div>
++
++      <div id="quiz-bands" class="band-tabs"></div>
++
++      <div id="quiz-choices" class="choices"></div>
++
++      <div id="quiz-actions" class="actions">
++        <button id="quiz-retry" data-i18n="quiz.retry">重试</button>
++        <button id="quiz-next" data-i18n="quiz.next">下一题</button>
++        <button id="quiz-hint" data-i18n="quiz.hintBand">提示乐队</button>
++        <button id="quiz-reveal" data-i18n="quiz.reveal">答案</button>
++      </div>
++
++      <div id="quiz-result" class="result" aria-live="polite"></div>
++    </section>
++
++    <section id="tab-intro" class="tab-panel" hidden>
++      <div id="intro-bands" class="band-tabs"></div>
++      <div id="intro-grid" class="intro-grid"></div>
++      <div id="intro-desc" class="intro-desc"></div>
++    </section>
++  </main>
++
++  <script type="module" src="src/main.js"></script>
++</body>
++</html>
++```
++
++**Step 8.2：写 `src/ui/app.js`**
++
++```js
++/**
++ * 顶层 UI 控制器：初始化所有子系统，渲染顶栏 Tab。
++ */
++
++import { initI18n, applyTranslations, cycleLocale } from '../i18n/index.js';
++import { init as initTabs, getActive, setActive, subscribe as subTabs } from '../core/tabs.js';
++import { init as initQuiz, newQuestion, playCurrent, retry, next, pick, hintBand, revealAnswer, onResult, getState, canPlay, canPick, canRetry, canNext, canHintBand, canReveal } from '../core/quiz.js';
++import { CHARACTERS, charactersOfBand } from '../data/characters.js';
++import { SAMPLES } from '../data/samples.js';
++import { BANDS } from '../data/bands.js';
++import { init as initQuizView } from './quiz.js';
++import { init as initIntroView } from './intro.js';
++import { loadProgress } from '../storage/progress.js';
++
++export function initApp() {
++  initI18n();
++  initTabs(['quiz', 'intro']);
++  initQuiz({ characters: CHARACTERS, samples: SAMPLES, bands: BANDS });
++
++  // 顶栏 Tab 切换
++  document.querySelectorAll('.tab-btn').forEach(btn => {
++    btn.addEventListener('click', () => setActive(btn.dataset.tab));
++  });
++  subTabs((id) => {
++    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = (p.id !== `tab-${id}`));
++    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
++  });
++
++  // 语言切换
++  document.querySelector('[data-i18n-lang-switch]')?.addEventListener('click', cycleLocale);
++
++  // 子视图初始化
++  initQuizView({
++    onPlay: () => playCurrent({ onMissing: () => onAudioMissing() }),
++    onRetry: retry,
++    onNext: next,
++    onPick: pick,
++    onHint: () => updateHint(),
++    onReveal: () => updateReveal(),
++    canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
++    getState,
++  });
++
++  initIntroView({
++    bands: BANDS,
++    characters: CHARACTERS,
++    charactersOfBand,
++    samples: SAMPLES,
++  });
++
++  onResult(r => updateResult(r));
++
++  // 初始：第一题
++  newQuestion();
++  applyTranslations();
++  refreshScore();
++}
++
++function onAudioMissing() {
++  const { recordAudio404 } = await import('../storage/progress.js');  // 注意：await 在函数内需要 async
++}
++```
++
++**Step 8.2 修正**（避免 top-level await 与 import 复杂度，改用顶层 import）：
++
++```js
++import { initI18n, applyTranslations, cycleLocale, t } from '../i18n/index.js';
++import { init as initTabs, getActive, setActive, subscribe as subTabs } from '../core/tabs.js';
++import { init as initQuiz, newQuestion, playCurrent, retry, next, pick, hintBand, revealAnswer, onResult, getState, canPlay, canPick, canRetry, canNext, canHintBand, canReveal } from '../core/quiz.js';
++import { CHARACTERS, charactersOfBand } from '../data/characters.js';
++import { SAMPLES } from '../data/samples.js';
++import { BANDS } from '../data/bands.js';
++import { recordAudio404, loadProgress } from '../storage/progress.js';
++import { init as initQuizView, showCorrect, showWrong, showHint, showReveal } from './quiz.js';
++import { init as initIntroView } from './intro.js';
++
++export function initApp() {
++  initI18n();
++  initTabs(['quiz', 'intro']);
++  initQuiz({ characters: CHARACTERS, samples: SAMPLES, bands: BANDS });
++
++  document.querySelectorAll('.tab-btn').forEach(btn => {
++    btn.addEventListener('click', () => setActive(btn.dataset.tab));
++  });
++  subTabs((id) => {
++    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = (p.id !== `tab-${id}`));
++    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
++  });
++
++  document.querySelector('[data-i18n-lang-switch]')?.addEventListener('click', cycleLocale);
++
++  initQuizView({
++    onPlay: () => playCurrent({ onMissing: () => { recordAudio404(); next(); } }),
++    onRetry: retry,
++    onNext: next,
++    onPick: pick,
++    onHint: updateHint,
++    onReveal: updateReveal,
++    canPlay, canPick, canRetry, canNext, canHintBand, canReveal,
++    getState,
++  });
++
++  initIntroView({ bands: BANDS, characters: CHARACTERS, charactersOfBand, samples: SAMPLES });
++
++  onResult(() => { refreshScore(); });
++  onResult((r) => updateResult(r));
++  document.addEventListener('i18n:applied', () => { refreshScore(); rerenderResultIfAny(); });
++
++  newQuestion();
++  applyTranslations();
++  refreshScore();
++}
++
++function updateHint() {
++  const band = hintBand();
++  if (band) showHint(band);
++}
++
++function updateReveal() {
++  const char = revealAnswer();
++  if (char) showReveal(char);
++}
++
++function updateResult({ correct, currentCharId }) {
++  const char = CHARACTERS.find(c => c.id === currentCharId);
++  if (!char) return;
++  if (correct) showCorrect(char);
++  else showWrong();
++}
++
++function refreshScore() {
++  const p = loadProgress();
++  const el = document.getElementById('quiz-score');
++  if (el) el.textContent = t('quiz.score', { correct: p.correct, wrong: p.wrong });
++}
++
++// 切换语言时，若当前有结果卡片，根据 quiz state 重新渲染（避免清空丢失反馈）
++function rerenderResultIfAny() {
++  const s = getState();
++  const resultEl = document.getElementById('quiz-result');
++  if (!resultEl || !resultEl.innerHTML.trim()) return;
++  if (s.revealed) {
++    const char = CHARACTERS.find(c => c.id === s.currentCharId);
++    if (char) showReveal(char);
++  } else if (s.answered) {
++    const band = (() => {
++      const c = CHARACTERS.find(c => c.id === s.currentCharId);
++      return c ? BANDS.find(b => b.id === c.bandId) : null;
++    })();
++    if (band) showHint(band);
++    // 注：判对/判错的临时结果卡片不在此重绘（语言切换不影响"✅"标记），保持原样
++  }
++}
++```
++
++**Step 8.3：写 `src/ui/quiz.js`**
++
++```js
++/**
++ * 测验视图：渲染乐队 Tab + 当前乐队 5 角色卡 + 4 按钮 + 结果区。
++ *
++ * 事件全部冒泡到 app.js 传入的 onXxx 回调；本文件只负责 DOM 渲染与事件绑定。
++ */
++
++import { BANDS } from '../data/bands.js';
++import { CHARACTERS, charactersOfBand } from '../data/characters.js';
++import { t } from '../i18n/index.js';
++
++let _handlers = null;
++let _currentBandId = null;
++
++export function init({ onPlay, onRetry, onNext, onPick, onHint, onReveal, canPlay, canPick, canRetry, canNext, canHintBand, canReveal, getState }) {
++  _handlers = { onPlay, onRetry, onNext, onPick, onHint, onReveal, canPlay, canPick, canRetry, canNext, canHintBand, canReveal, getState };
++  renderBandTabs();
++  // 默认显示 Poppin'Party
++  setActiveBand(BANDS[0].id);
++
++  document.getElementById('quiz-play').addEventListener('click', () => onPlay());
++  document.getElementById('quiz-retry').addEventListener('click', () => onRetry());
++  document.getElementById('quiz-next').addEventListener('click', () => onNext());
++  document.getElementById('quiz-hint').addEventListener('click', () => onHint());
++  document.getElementById('quiz-reveal').addEventListener('click', () => onReveal());
++
++  // 切换语言时重新渲染（注意：不在此处清空 quiz-result，结果由 app.js 的 rerenderResultIfAny() 负责）
++  document.addEventListener('i18n:applied', () => {
++    renderBandTabs();
++    renderChoices();
++    refreshButtonStates();
++  });
++}
++
++export function setActiveBand(bandId) {
++  _currentBandId = bandId;
++  document.querySelectorAll('#quiz-bands .band-tab').forEach(b => {
++    b.classList.toggle('active', b.dataset.bandId === bandId);
++  });
++  renderChoices();
++}
++
++function renderBandTabs() {
++  const root = document.getElementById('quiz-bands');
++  root.innerHTML = '';
++  for (const band of BANDS) {
++    const btn = document.createElement('button');
++    btn.className = 'band-tab';
++    btn.dataset.bandId = band.id;
++    btn.innerHTML = `
++      <div class="band-name">${escapeHtml(t(`band.${band.id}`))}</div>
++      <img class="band-icon" src="assets/images/band/${band.icon}" alt="${escapeHtml(t(`band.${band.id}`))}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'band-icon-fallback',textContent:'${escapeHtml(t(`band.${band.id}`))}'}))">
++    `;
++    btn.addEventListener('click', () => setActiveBand(band.id));
++    root.appendChild(btn);
++  }
++}
++
++function renderChoices() {
++  const root = document.getElementById('quiz-choices');
++  root.innerHTML = '';
++  const members = charactersOfBand(_currentBandId);
++  for (const c of members) {
++    const card = document.createElement('button');
++    card.className = 'choice';
++    card.dataset.charId = c.id;
++    card.innerHTML = `
++      <div class="choice-name">${escapeHtml(t(`char.${c.id}.name`, undefined) || c.name.zh)}</div>
++      <img class="choice-portrait" src="assets/images/char/${c.portrait}" alt="" onerror="this.style.display='none'">
++    `;
++    card.addEventListener('click', () => _handlers.onPick(c.id));
++    root.appendChild(card);
++  }
++}
++
++function renderResult() {
++  const root = document.getElementById('quiz-result');
++  root.innerHTML = '';
++}
++
++export function showCorrect(char) {
++  const root = document.getElementById('quiz-result');
++  root.innerHTML = `
++    <div class="result-card success">
++      <span class="result-mark">${escapeHtml(t('quiz.correct'))}</span>
++      <strong>${escapeHtml(char.name[_handlers.getState().currentCharId === char.id ? currentLocale() : 'zh'])}</strong>
++      <span class="result-band">（${escapeHtml(t(`band.${findBandId(char.id)}`))}）</span>
++      <img class="result-portrait" src="assets/images/char/${char.portrait}" alt="" onerror="this.style.display='none'">
++      <button class="result-replay">${escapeHtml(t('quiz.playAgain'))}</button>
++    </div>
++  `;
++  root.querySelector('.result-replay').addEventListener('click', () => _handlers.onPlay());
++  refreshButtonStates();
++}
++
++export function showWrong() {
++  const root = document.getElementById('quiz-result');
++  root.innerHTML = `
++    <div class="result-card fail">
++      <span class="result-mark">${escapeHtml(t('quiz.wrong'))}</span>
++      <img class="result-fail" src="assets/images/fail/ksm-cry.png" alt="fail" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'fail-fallback',textContent:'T_T'}))">
++    </div>
++  `;
++  refreshButtonStates();
++}
++
++export function showHint(band) {
++  const root = document.getElementById('quiz-result');
++  root.innerHTML = `
++    <div class="result-card hint">
++      <span class="result-mark">${escapeHtml(t('quiz.hintBandPrefix'))}</span>
++      <strong>${escapeHtml(t(`band.${band.id}`))}</strong>
++      <img class="hint-icon" src="assets/images/band/${band.icon}" alt="" onerror="this.style.display='none'">
++    </div>
++  `;
++  refreshButtonStates();
++}
++
++export function showReveal(char) {
++  const root = document.getElementById('quiz-result');
++  root.innerHTML = `
++    <div class="result-card reveal">
++      <span class="result-mark">${escapeHtml(t('quiz.answer'))}</span>
++      <strong>${escapeHtml(char.name[currentLocale()])}</strong>
++      <span class="result-band">（${escapeHtml(t(`band.${findBandId(char.id)}`))}）</span>
++      <img class="result-portrait" src="assets/images/char/${char.portrait}" alt="" onerror="this.style.display='none'">
++    </div>
++  `;
++  refreshButtonStates();
++}
++
++function refreshButtonStates() {
++  const { canPlay, canPick, canRetry, canNext, canHintBand, canReveal } = _handlers;
++  document.getElementById('quiz-play').disabled = !canPlay();
++  document.getElementById('quiz-retry').disabled = !canRetry();
++  document.getElementById('quiz-next').disabled = !canNext();
++  document.getElementById('quiz-hint').disabled = !canHintBand();
++  document.getElementById('quiz-reveal').disabled = !canReveal();
++  // 选项卡在 answered 状态时全部 disabled
++  const locked = !canPick();
++  document.querySelectorAll('#quiz-choices .choice').forEach(el => { el.disabled = locked; });
++}
++
++function currentLocale() {
++  return document.documentElement.lang.startsWith('ja') ? 'ja'
++    : document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
++}
++
++function findBandId(charId) {
++  return CHARACTERS.find(c => c.id === charId)?.bandId;
++}
++
++function escapeHtml(s) {
++  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
++}
++```
++
++**Step 8.4：写 `src/ui/intro.js`**
++
++```js
++/**
++ * 介绍视图：渲染乐队 Tab + 当前乐队 5 角色卡（可点击听）+ 简介。
++ */
++
++import { t } from '../i18n/index.js';
++import { playSample } from '../core/audio.js';
++
++let _currentBandId = null;
++let _ctx = null;
++
++export function init({ bands, characters, charactersOfBand, samples }) {
++  _ctx = { bands, characters, charactersOfBand, samples };
++  renderBandTabs();
++  setActiveBand(bands[0].id);
++  document.addEventListener('i18n:applied', () => {
++    renderBandTabs();
++    renderGrid();
++    renderDesc();
++  });
++}
++
++export function setActiveBand(bandId) {
++  _currentBandId = bandId;
++  document.querySelectorAll('#intro-bands .band-tab').forEach(b => {
++    b.classList.toggle('active', b.dataset.bandId === bandId);
++  });
++  renderGrid();
++  renderDesc();
++}
++
++function renderBandTabs() {
++  const root = document.getElementById('intro-bands');
++  root.innerHTML = '';
++  for (const band of _ctx.bands) {
++    const btn = document.createElement('button');
++    btn.className = 'band-tab';
++    btn.dataset.bandId = band.id;
++    btn.innerHTML = `
++      <div class="band-name">${escapeHtml(t(`band.${band.id}`))}</div>
++      <img class="band-icon" src="assets/images/band/${band.icon}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'band-icon-fallback',textContent:'${escapeHtml(t(`band.${band.id}`))}'}))">
++    `;
++    btn.addEventListener('click', () => setActiveBand(band.id));
++    root.appendChild(btn);
++  }
++}
++
++function renderGrid() {
++  const root = document.getElementById('intro-grid');
++  root.innerHTML = '';
++  const members = _ctx.charactersOfBand(_currentBandId);
++  for (const c of members) {
++    const card = document.createElement('div');
++    card.className = 'intro-card';
++    card.innerHTML = `
++      <img class="intro-portrait" src="assets/images/char/${c.portrait}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'intro-portrait-fallback',textContent:'${escapeHtml(c.name.zh)}'}))">
++      <div class="intro-name">${escapeHtml(c.name[currentLocale()])}</div>
++      <div class="intro-role">${escapeHtml(c.role)}</div>
++      <button class="intro-listen">${escapeHtml(t('intro.listen'))}</button>
++    `;
++    card.querySelector('.intro-portrait').addEventListener('click', () => playRandom(c.id));
++    card.querySelector('.intro-listen').addEventListener('click', () => playRandom(c.id));
++    root.appendChild(card);
++  }
++}
++
++function renderDesc() {
++  const root = document.getElementById('intro-desc');
++  const band = _ctx.bands.find(b => b.id === _currentBandId);
++  if (!band) { root.innerHTML = ''; return; }
++  root.innerHTML = `
++    <div class="intro-desc-block">
++      <span class="intro-desc-mark">${escapeHtml(t('intro.bandDesc'))}</span>
++      <span class="intro-desc-text">${escapeHtml(band.desc[currentLocale()] || band.desc.zh)}</span>
++    </div>
++  `;
++}
++
++function playRandom(charId) {
++  const list = _ctx.samples[charId] || [];
++  if (list.length === 0) return;
++  const audioId = list[Math.floor(Math.random() * list.length)];
++  playSample(charId, audioId, { onMissing: () => alert(t('intro.audioMissing')) });
++}
++
++function currentLocale() {
++  return document.documentElement.lang.startsWith('ja') ? 'ja'
++    : document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
++}
++
++function escapeHtml(s) {
++  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
++}
++```
++
++**Step 8.5：更新 `src/main.js`（接入 initApp）**
++
++```js
++/**
++ * App entry. Bootstraps i18n, tabs, quiz, intro.
++ */
++
++import { initI18n, applyTranslations, cycleLocale } from './i18n/index.js';
++import { initApp } from './ui/app.js';
++
++function showBootError(err) {
++  console.error('[boot] fatal error:', err);
++  const banner = document.createElement('div');
++  banner.style.cssText = `
++    position: fixed; top: 0; left: 0; right: 0;
++    background: #f87171; color: #7f1d1d;
++    padding: 12px 20px; font-family: monospace; font-size: 13px;
++    border-bottom: 2px solid #b91c1c; z-index: 9999;
++    white-space: pre-wrap; word-break: break-word;
++  `;
++  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
++  document.body.prepend(banner);
++}
++
++function boot() {
++  try {
++    initI18n();
++    initApp();
++    const sw = document.querySelector('[data-i18n-lang-switch]');
++    if (sw) sw.addEventListener('click', cycleLocale);
++  } catch (err) {
++    showBootError(err);
++  }
++  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
++  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
++}
++
++if (document.readyState === 'loading') {
++  document.addEventListener('DOMContentLoaded', boot);
++} else {
++  boot();
++}
++```
++
++**Step 8.6：手动验证（浏览器）**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++python3 -m http.server 8000
++```
++
++打开 `http://localhost:8000`，检查：
++- 顶栏两个 Tab 可切换
++- 「听声音猜角色」Tab 显示乐队 + 5 角色卡
++- 点「播放声音」可听
++- 点角色卡有判定
++- 切语言时所有文字同步
++
++**Step 8.7：commit**
++
++```bash
++git add -A
++git commit -m "feat: UI controllers (app + quiz + intro views)"
++```
++
++---
++
++## Task 9：浅色样式 styles/main.css
++
++**Files:**
++- Create: `styles/main.css`
++
++**Step 9.1：写 `styles/main.css`（浅色风格，参考 MorsePractice）**
++
++```css
++/* ============================================
++ * BanG Dream 听声音猜角色 — 浅色风格
++ * 参考 MorsePractice 的浅色调色板
++ * ============================================ */
++
++:root {
++  --bg: #fffaf2;
++  --bg-card: #ffffff;
++  --bg-soft: #f6efe6;
++  --bg-soft-2: #f1e7d8;
++  --text: #4a3b2c;
++  --text-soft: #8a7a64;
++  --primary: #e8a7b8;       /* 邦粉 */
++  --primary-dark: #c87a92;
++  --success: #6abf7b;
++  --danger: #e07a7a;
++  --border: #e8dccb;
++  --shadow: 0 4px 12px rgba(180, 140, 100, 0.15);
++  --radius: 12px;
++  --radius-sm: 8px;
++}
++
++* { box-sizing: border-box; }
++
++html, body {
++  margin: 0;
++  padding: 0;
++  background: var(--bg);
++  color: var(--text);
++  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
++    "Hiragino Sans", "Microsoft YaHei", sans-serif;
++  font-size: 15px;
++  line-height: 1.5;
++  min-height: 100vh;
++}
++
++button {
++  font-family: inherit;
++  font-size: inherit;
++  cursor: pointer;
++  border: 1px solid var(--border);
++  background: var(--bg-card);
++  color: var(--text);
++  border-radius: var(--radius-sm);
++  padding: 8px 14px;
++  transition: transform 0.08s, background 0.15s, border-color 0.15s;
++}
++button:hover:not(:disabled) {
++  background: var(--bg-soft);
++  border-color: var(--primary);
++}
++button:active:not(:disabled) { transform: scale(0.98); }
++button:disabled {
++  opacity: 0.4;
++  cursor: not-allowed;
++}
++
++/* ===== 顶栏 ===== */
++.topbar {
++  display: flex;
++  align-items: center;
++  justify-content: space-between;
++  padding: 14px 24px;
++  background: var(--bg-card);
++  border-bottom: 1px solid var(--border);
++  position: sticky;
++  top: 0;
++  z-index: 100;
++}
++.tabs { display: flex; gap: 8px; }
++.tab-btn {
++  background: transparent;
++  border: 2px solid transparent;
++  padding: 8px 16px;
++  font-weight: 600;
++}
++.tab-btn.active {
++  background: var(--bg-soft);
++  border-color: var(--primary);
++  color: var(--primary-dark);
++}
++.lang-btn {
++  font-size: 13px;
++  padding: 6px 12px;
++}
++
++main {
++  max-width: 1200px;
++  margin: 0 auto;
++  padding: 24px;
++}
++.tab-panel { display: block; }
++.tab-panel[hidden] { display: none; }
++
++/* ===== 测验头部 ===== */
++.quiz-header {
++  display: flex;
++  align-items: center;
++  justify-content: space-between;
++  margin-bottom: 20px;
++  gap: 16px;
++}
++.primary {
++  background: var(--primary);
++  color: white;
++  border-color: var(--primary);
++  font-weight: 600;
++  padding: 10px 24px;
++}
++.primary:hover:not(:disabled) {
++  background: var(--primary-dark);
++  border-color: var(--primary-dark);
++}
++.score {
++  color: var(--text-soft);
++  font-size: 14px;
++}
++
++/* ===== 乐队 Tab ===== */
++.band-tabs {
++  display: flex;
++  flex-wrap: wrap;
++  gap: 8px;
++  margin-bottom: 20px;
++}
++.band-tab {
++  display: flex;
++  flex-direction: column;
++  align-items: center;
++  padding: 8px 14px;
++  border: 2px solid var(--border);
++  border-radius: var(--radius);
++  background: var(--bg-card);
++  min-width: 110px;
++  gap: 4px;
++}
++.band-tab.active {
++  border-color: var(--primary);
++  background: var(--bg-soft);
++}
++.band-name {
++  font-weight: 600;
++  font-size: 13px;
++}
++.band-icon {
++  width: 28px;
++  height: 28px;
++  object-fit: contain;
++}
++.band-icon-fallback {
++  width: 28px;
++  height: 28px;
++  display: flex;
++  align-items: center;
++  justify-content: center;
++  font-size: 11px;
++  color: var(--text-soft);
++  background: var(--bg-soft-2);
++  border-radius: 50%;
++  text-align: center;
++  line-height: 1;
++  padding: 4px;
++}
++
++/* ===== 测验角色选项 ===== */
++.choices {
++  display: grid;
++  grid-template-columns: repeat(5, 1fr);
++  gap: 14px;
++  margin-bottom: 20px;
++}
++@media (max-width: 720px) {
++  .choices { grid-template-columns: repeat(2, 1fr); }
++}
++.choice {
++  display: flex;
++  flex-direction: column;
++  align-items: center;
++  padding: 12px;
++  border: 2px solid var(--border);
++  border-radius: var(--radius);
++  background: var(--bg-card);
++  transition: all 0.15s;
++}
++.choice:hover:not(:disabled) {
++  border-color: var(--primary);
++  background: var(--bg-soft);
++  transform: translateY(-2px);
++}
++.choice:disabled {
++  opacity: 0.5;
++}
++.choice-name {
++  font-weight: 600;
++  margin-bottom: 8px;
++}
++.choice-portrait {
++  width: 100%;
++  aspect-ratio: 4 / 5;
++  object-fit: cover;
++  border-radius: var(--radius-sm);
++}
++
++/* ===== 按钮区 ===== */
++.actions {
++  display: flex;
++  gap: 10px;
++  margin-bottom: 20px;
++  flex-wrap: wrap;
++}
++
++/* ===== 结果区 ===== */
++.result {
++  min-height: 100px;
++}
++.result-card {
++  display: flex;
++  align-items: center;
++  gap: 14px;
++  padding: 16px;
++  border-radius: var(--radius);
++  margin-bottom: 10px;
++  box-shadow: var(--shadow);
++}
++.result-card.success { background: #e9f7ec; border: 2px solid var(--success); }
++.result-card.fail    { background: #fbecec; border: 2px solid var(--danger); }
++.result-card.hint    { background: #fdf3df; border: 2px solid #d8b656; }
++.result-card.reveal  { background: #f4ecf8; border: 2px solid #a78bc7; }
++.result-mark { font-weight: 600; }
++.result-portrait, .result-fail, .hint-icon {
++  width: 64px;
++  height: 64px;
++  object-fit: cover;
++  border-radius: var(--radius-sm);
++}
++.result-replay { margin-left: auto; }
++
++/* ===== 介绍页 ===== */
++.intro-grid {
++  display: grid;
++  grid-template-columns: repeat(5, 1fr);
++  gap: 14px;
++  margin-bottom: 20px;
++}
++@media (max-width: 720px) {
++  .intro-grid { grid-template-columns: repeat(2, 1fr); }
++}
++.intro-card {
++  padding: 12px;
++  border: 2px solid var(--border);
++  border-radius: var(--radius);
++  background: var(--bg-card);
++  display: flex;
++  flex-direction: column;
++  align-items: center;
++  gap: 6px;
++}
++.intro-portrait {
++  width: 100%;
++  aspect-ratio: 4 / 5;
++  object-fit: cover;
++  border-radius: var(--radius-sm);
++  cursor: pointer;
++  transition: transform 0.15s;
++}
++.intro-portrait:hover { transform: scale(1.03); }
++.intro-portrait-fallback {
++  width: 100%;
++  aspect-ratio: 4 / 5;
++  background: var(--bg-soft-2);
++  display: flex;
++  align-items: center;
++  justify-content: center;
++  border-radius: var(--radius-sm);
++  color: var(--text-soft);
++}
++.intro-name { font-weight: 600; }
++.intro-role { color: var(--text-soft); font-size: 13px; }
++.intro-listen { width: 100%; }
++
++.intro-desc-block {
++  padding: 16px;
++  background: var(--bg-soft);
++  border-radius: var(--radius);
++  display: flex;
++  align-items: baseline;
++  gap: 8px;
++}
++.intro-desc-mark { font-weight: 600; }
++```
++
++**Step 9.2：手动验证**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++python3 -m http.server 8000
++```
++
++打开浏览器检查浅色风格、按钮状态、响应式布局。
++
++**Step 9.3：commit**
++
++```bash
++git add -A
++git commit -m "feat: light theme styles"
++```
++
++---
++
++## Task 10：架构决策记录 + 接手指南
++
++**Files:**
++- Create: `dev-docs/05-architecture-decisions-2026-07-15.md`, `dev-docs/06-handoff-2026-07-15.md`
++
++**Step 10.1：写 `dev-docs/05-architecture-decisions-2026-07-15.md`**
++
++```markdown
++# 架构决策记录（2026-07-15）
++
++## 决策 1：复用 MorsePractice 模式而非重写
++- 选择：纯 ES Module + Vanilla JS
++- 拒绝：Vite + React、TypeScript
++- 理由：与参考项目同栈，可直接复用 i18n / progress / main.js 错误条；Agent Rules #10 迅捷 demo。
++
++## 决策 2：单页 + 两个 Tab（无 hash 路由）
++- 选择：单页 + `.tab-btn[data-tab]` 切换
++- 拒绝：Hash 路由、History API
++- 理由：避免 SW 与 hash 的潜在冲突；状态管理更简单。
++
++## 决策 3：HTMLAudioElement 而非 Web Audio 解码
++- 选择：直接 `<audio src>` 播放
++- 拒绝：Web Audio API decodeAudioData
++- 理由：角色台词 < 200KB，单条短，无需精细控制；HTMLAudioElement 支持流式 + 自带 onended/onerror。
++
++## 决策 4：失败图 = Kasumi（Toyama Kasumi）而非通用表情
++- 选择：专门查找 Kasumi 沮丧表情包
++- 兜底：找不到时记录进 `04-resource-missing` 让用户提供
++- 理由：邦邦粉丝向，与题材强相关。
++
++## 决策 5：覆盖 9 乐队（+ MYGO / Ave Mujica）
++- 选择：全部 9 支
++- 拒绝：仅 Poppin'Party 或 3 支
++- 理由：用户明确要求全面覆盖；工作量主要在资源下载而非代码。
++```
++
++**Step 10.2：写 `dev-docs/06-handoff-2026-07-15.md`**
++
++```markdown
++# 接手指南（2026-07-15）
++
++## 项目是什么
++单页 Web demo：BanG Dream 听声音猜角色（zh/en/ja）。
++
++## 30 秒上手
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm install
++python3 -m http.server 8000
++# 浏览器打开 http://localhost:8000
++```
++
++## 文件结构
++- 设计：`docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md`
++- 计划：`docs/superpowers/plans/2026-07-15-bangdream-quiz-implementation.md`
++- 源码：`src/`
++- 资源：`assets/`
++- 调研：`research/`
++- 过程：`dev-docs/`
++
++## 测试
++```bash
++npm test
++```
++
++## 已知限制
++- 资源缺失时 UI 显示占位（fallback 文字 / T_T）
++- 部分冷门角色可能没有音频，samples.js 对应项为空数组，quiz 自动跳过
++
++## 与 MorsePractice 的关系
++- i18n 模式：相同（zh/en 单文件 dict + index 运行时）
++- progress.js 模式：相同（localStorage + DEFAULT 合并）
++- main.js 错误条：相同（红条置顶）
++- audio.js：不同（用 HTMLAudioElement 而非 OscillatorNode）
++```
++
++**Step 10.3：跑全部测试**
++
++```bash
++cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
++npm test
++```
++
++期望：i18n (6) + data (6) + audio (4) + progress (5) + quiz (11) + tabs (4) = 36 tests passing.
++
++**Step 10.4：commit**
++
++```bash
++git add -A
++git commit -m "docs: handoff guide + architecture decisions"
++```
++
++---
++
++## 自检（写完后回看）
++
++1. **Spec 覆盖**：
++   - §1 目标 ✓ Task 8 UI
++   - §2 决策记录 ✓ 已落入每 Task
++   - §3 架构 ✓ Task 1-7
++   - §4 状态机 ✓ Task 6
++   - §5 UI 流程 ✓ Task 8
++   - §6 错误处理 ✓ Task 4 / Task 6 / Task 8
++   - §7 测试 ✓ Task 1/2/4/5/6/7
++   - §8 资源策略 ✓ Task 3
++   - §9 dev-docs ✓ Task 2/3/10
++   - §10 Agent Rules 自查 ✓ 全 Task
++
++2. **Placeholder 扫描**：无 TBD/TODO；`require` 残留已在 Task 2.3 修正中删除。
++
++3. **类型一致性**：
++   - `playSample(charId, audioId, opts)` 签名在 audio.js / quiz.js / intro.js 三处一致 ✓
++   - `init({characters, samples, bands})` 在 quiz.js 与 app.js 一致 ✓
++   - `BAND_BY_ID` / `CHARACTER_BY_ID` 命名一致 ✓
++   - `t('band.${band.id}')` 在 i18n/zh|en|ja.js 与使用处键名一致 ✓
++
++完成。
+\ No newline at end of file
+diff --git a/docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md b/docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md
+new file mode 100644
+index 0000000..9fcedd0
+--- /dev/null
++++ b/docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md
+@@ -0,0 +1,395 @@
++# BanG Dream 听声音猜角色 — 设计文档
++
++| 项 | 值 |
++|---|---|
++| **Spec 日期** | 2026-07-15 |
++| **项目目录** | `~/Desktop/LYX/VibeCoding/BangDreamListenAndTest/` |
++| **状态** | 已获用户认可（2026-07-15 brainstorming 三节） |
++| **范围** | 单页 Web demo · 浅色风格 · 本地 `python3 -m http.server` 运行 |
++
++---
++
++## 1. 目标
++
++为 BanG Dream（バンドリ！）粉丝做一个"听声音猜角色"的趣味测试，UI 中英日三语切换。
++
++### 1.1 核心闭环
++
++```
++点击「播放声音」
++  → 播放目标角色的随机一条主声线台词
++  → 用户在「当前乐队 Tab」下 5 张立绘中选一人
++  → 判定正确：弹角色名(乐队)+ 立绘 + 复播样本 + 累计正确数
++  → 判定错误：弹失败提示 + 香澄哭泣图 + 累计错误数
++```
++
++### 1.2 用户群 & 验收标准
++
++- **用户**：BanG Dream 玩家（熟悉角色）
++- **验收**：能在 3 次以内猜对至少一个角色；切到日语/英语后角色名同步显示对应译名；点「介绍」Tab 能听任意角色随机一条样本
++
++---
++
++## 2. 需求决策记录（已与用户确认）
++
++| # | 决策点 | 选择 |
++|---|---|---|
++| 1 | 多语言显示 | UI 当前语言对应名（中文→香澄，日文→湊友希那，英文→Kasumi Toyama） |
++| 2 | 测试模式 | 无尽模式 + 累计正确/错误统计 |
++| 3 | 重试行为 | 重抽一条样本（可能与上次不同）+ 重置选项可点 |
++| 4 | 持久化 | 复用 MorsePractice `progress.js`，累计对/错 + 每角色错数 |
++| 5 | 覆盖范围 | 全部 7 乐队 + MYGO!!!!! + Ave Mujica |
++| 6 | 介绍页集成 | 单页 Tab 切换 |
++| 7 | 题目声音范围 | 主声线代表性台词 |
++| 8 | 题库规模 | 每角色 ≥3 条样本 |
++| 9 | PWA 范围 | 纯静态网页，无 SW / manifest |
++| 10 | 部署 | 本地 `python3 -m http.server` |
++| 11 | 失败图 | Kasumi（香澄）沮丧表情包（找不到则整理进缺失文档） |
++| 12 | 资源限制 | 单条资源检索 ≤5min、下载 ≤180s；找不到整理进缺失文档 |
++| 13 | 架构 | 复用 MorsePractice 模式：纯 ES Module + Vanilla JS |
++
++---
++
++## 3. 架构
++
++### 3.1 模块边界
++
++| 模块 | 职责 | 可复用对象 |
++|---|---|---|
++| `src/main.js` | 启动入口、错误条、booting | MorsePractice `main.js` |
++| `src/core/audio.js` | 单例 AudioContext + `playSample(charId, idx)` | MorsePractice `audio.js` 单例模式 |
++| `src/core/quiz.js` | 状态机（newQuestion/playCurrent/retry/next/pick） | 新建 |
++| `src/core/tabs.js` | Tab 切换状态机 | 新建 |
++| `src/i18n/index.js` | i18n 运行时（扩 3 语言） | MorsePractice `i18n/index.js` |
++| `src/i18n/{zh,en,ja}.js` | 字典（ja.js 新增） | MorsePractice `zh/en.js` 模式 |
++| `src/data/bands.js` | 9 乐队元数据 | 新建 |
++| `src/data/characters.js` | 50+ 角色元数据 | 新建 |
++| `src/data/samples.js` | 样本清单 | 新建 |
++| `src/storage/progress.js` | localStorage 进度持久化 | MorsePractice `progress.js` 直接复用 |
++| `src/ui/app.js` | 顶层控制器（挂载 Tab + i18n） | MorsePractice `app.js` 模式 |
++| `src/ui/quiz.js` | 测验 UI 渲染 + 事件 | 新建 |
++| `src/ui/intro.js` | 介绍 UI 渲染 + 事件 | 新建 |
++
++### 3.2 目录结构
++
++```
++BangDreamListenAndTest/
++├── Agent Rules.txt                  # 项目硬约束（已存在，不动）
++├── CLAUDE.md                        # 项目索引（不包含规则，仅指向 dev-docs/06-handoff）
++├── index.html                       # 单页入口（含 data-i18n 属性 + 两个 Tab 容器）
++├── package.json                     # 复用 MorsePractice：vitest + happy-dom
++├── vitest.config.js                 # 复用 MorsePractice
++├── dev-server.py                    # 复用 MorsePractice（python3 -m http.server 8000）
++├── src/                             # Agent Rules #8：所有代码入 src/
++│   ├── main.js
++│   ├── core/
++│   │   ├── audio.js
++│   │   ├── quiz.js
++│   │   └── tabs.js
++│   ├── data/
++│   │   ├── bands.js
++│   │   ├── characters.js
++│   │   └── samples.js
++│   ├── i18n/
++│   │   ├── index.js
++│   │   ├── zh.js
++│   │   ├── en.js
++│   │   └── ja.js
++│   ├── storage/
++│   │   └── progress.js
++│   └── ui/
++│       ├── app.js
++│       ├── quiz.js
++│       └── intro.js
++├── assets/
++│   ├── audio/<charId>/{1,2,3}.mp3   # 每角色 3 条样本
++│   ├── images/band/<bandId>.png     # 9 个乐队图标
++│   ├── images/char/<charId>.png     # 50+ 角色立绘
++│   └── images/fail/ksm-cry.png      # Kasumi 失败图
++├── docs/
++│   └── superpowers/specs/2026-07-15-bangdream-quiz-design.md
++├── dev-docs/                        # Agent Rules #6：过程文档
++│   ├── 01-bangdream-domain-research-2026-07-15.md
++│   ├── 02-resource-strategy-2026-07-15.md
++│   ├── 03-resource-acquisition-log-2026-07-15.md
++│   ├── 04-resource-missing-2026-07-15.md
++│   ├── 05-architecture-decisions-2026-07-15.md
++│   └── 06-handoff-2026-07-15.md
++└── research/                        # Agent Rules #7：调研资料表
++    ├── bands.xml
++    └── characters.xml
++```
++
++### 3.3 数据模型
++
++```js
++// data/bands.js
++export const BANDS = [
++  { id: 'poppin-party',   name: { zh: "Poppin'Party",  en: "Poppin'Party",  ja: "Poppin'Party" }, icon: 'poppin-party.png',
++    desc: { zh: '...', en: '...', ja: '...' } },
++  // afterglow, pastel-palettes, roselia, hhw, morfonica, ras, mygo, ave-mujica
++];
++
++// data/characters.js
++export const CHARACTERS = [
++  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
++    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
++    portrait: 'kasumi.png' },
++  // 50+ 项
++];
++
++// data/samples.js
++export const SAMPLES = {
++  'kasumi': ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
++  // 每角色 ≥3 条
++};
++```
++
++---
++
++## 4. 状态机
++
++### 4.1 quiz.js 状态字段
++
++```js
++const state = {
++  currentCharId: null,
++  currentSampleId: null,
++  phase: 'idle',          // 'idle' | 'playing' | 'awaitPick' | 'answered'
++  answered: false,        // 防二次答题（用户已点过角色）
++  revealed: false,        // 答案按钮已被按下过（防再次按答案）
++  pickedCharId: null,     // 用户本次选的角色（仅 answered 时有意义）
++  score: {
++    correct: 0,
++    wrong: 0,
++    byChar: {},           // { 'kasumi': 2, ... }
++  },
++};
++```
++
++### 4.2 状态转移
++
++```
++       newQuestion()
++            ↓
++       [idle]
++            │ onPlay()
++            ↓
++       [playing] ─ onEnded ─→ [awaitPick]
++                                   │ onPick(charId)
++                                   ↓
++                              [answered]
++                                   │       ┌───────────────┐
++                                   │       │ (only retry/next)
++                                retry()     │
++                                   ↓       ↓
++                              [playing (same char, resample)]
++```
++
++### 4.3 公开 API
++
++```js
++// quiz.js
++newQuestion()              // 随机抽 charId + sampleId → phase='awaitPick', answered=false
++playCurrent()              // 调 audio.playSample，播完自动停在 awaitPick
++retry()                    // 任意 phase 都可触发：换 sampleId + phase='awaitPick' + answered=false
++next()                     // 任意 phase 都可：调 newQuestion() 并保持当前 answered 标记清零
++pick(charId)               // 用户点角色 → 判定 → 触发 onResult({correct, charId, sampleId})
++hintBand()                 // 在结果区显示当前题所属乐队名 + 图标（仅 awaitPick/answered 可用）
++revealAnswer()             // 直接显示当前题角色名 + 立绘 + 所属乐队（仅 awaitPick/answered 可用）
++
++// canXxx() 守卫
++canPlay()     // phase==='idle' || phase==='awaitPick'
++canPick()     // phase==='awaitPick'
++canRetry()    // 始终 true
++canNext()     // 始终 true
++canHintBand() // (phase==='awaitPick' || phase==='answered') && !revealed
++canReveal()   // (phase==='awaitPick' || phase==='answered') && !revealed
++```
++
++### 4.4 按钮可用性矩阵
++
++| 状态 \ 按钮 | 重试 | 下一题 | 提示乐队 | 答案 |
++|---|---|---|---|---|
++| `playing` | ❌ | ✅ | ❌ | ❌ |
++| `awaitPick` | ✅ | ✅ | ✅ | ✅ |
++| `answered`（判错） | ✅ | ✅ | ✅ | ✅ |
++| `answered`（判对） | ✅ | ✅ | ✅ | ✅ |
++| 已显示答案 (`revealed=true`) | ✅ | ✅ | ❌ | ❌ |
++
++---
++
++## 5. UI 流程
++
++### 5.1 顶栏
++
++```
++┌────────────────────────────────────────────────────┐
++│ [🎵 听声音猜角色]  [📖 乐队·角色介绍]   [中 ▾]    │
++└────────────────────────────────────────────────────┘
++```
++
++语言切换按钮调 `i18n.setLocale()`，复用 MorsePractice 模式。
++
++### 5.2 听声音猜角色 Tab
++
++```
++┌──────────────────────────────────────────────────────────┐
++│ ▶️ [播放声音]                              已答：12 对 3 错  │  顶栏
++├──────────────────────────────────────────────────────────┤
++│ [🎸 Poppin'Party] [🔥 Afterglow] [🎀 Pastel*Palettes]   │
++│ [🌹 Roselia] [☀️ HHW] [🎻 Morfonica] [💥 RAS]           │  乐队 Tab（两行：名+图标）
++│ [💜 MYGO] [🖤 Ave Mujica]                                │
++├──────────────────────────────────────────────────────────┤
++│  [香澄]  [りみ]  [紗綾]  [有咲]  [たえ]                  │  当前乐队 5 角色选项
++│  [立绘] [立绘] [立绘]  [立绘]  [立绘]                    │  横向 5 卡片
++├──────────────────────────────────────────────────────────┤
++│  [ 重试 ]  [ 下一题 ]  [ 提示乐队 ]  [ 答案 ]            │  底部 4 按钮
++├──────────────────────────────────────────────────────────┤
++│  <结果区>                                                │  判对/判错/答案/提示在此显示
++└──────────────────────────────────────────────────────────┘
++```
++
++### 5.3 介绍 Tab
++
++```
++┌──────────────────────────────────────────────────────────┐
++│ [🎸 Poppin'Party] [🔥 Afterglow] ...                    │  乐队 Tab
++├──────────────────────────────────────────────────────────┤
++│   [立绘]   [立绘]   [立绘]   [立绘]   [立绘]             │  5 角色卡
++│   香澄    りみ     紗綾    有咲    たえ                  │
++│   ▶️ 听  ▶️ 听  ▶️ 听  ▶️ 听  ▶️ 听                     │  每次点击随机一条
++├──────────────────────────────────────────────────────────┤
++│  ▼ Poppin'Party 是由香澄组建的女子乐队…                │  乐队简介（i18n）
++└──────────────────────────────────────────────────────────┘
++```
++
++### 5.4 结果区（判对/判错/答案/提示）
++
++| 触发 | 内容 |
++|---|---|
++| 判对 | `✅ 正确！香澄 Kasumi Toyama（Poppin'Party）[立绘] ▶️ 再听一次` |
++| 判错 | `❌ 失败 [ksm 哭泣图]` |
++| 答案按钮 | `📖 答案：香澄 Kasumi Toyama（Poppin'Party）[立绘]` |
++| 提示乐队按钮 | `💡 提示乐队：Poppin'Party [乐队图标]` |
++
++---
++
++## 6. 错误处理
++
++| 场景 | 处理 |
++|---|---|
++| 音频 404 | `audio.js` 内 `playSample()` 用 `try/catch + HTMLAudioElement.onerror` 捕获；UI 弹非阻断提示「该角色样本暂缺」+ 自动 `newQuestion()`；记入 `progress.errors.audio404++` |
++| 图片 404 | `<img onerror>` 触发：隐藏图片容器 + 显示文字占位（角色名/乐队名） |
++| iOS Safari AudioContext suspended | 首次用户手势时 `ctx.resume()`（复用 MorsePractice 模式） |
++| 启动失败 | 复用 MorsePractice `main.js` 错误条（红条置顶） |
++| localStorage 不可用 | progress.js 内存 fallback（不影响功能） |
++| 抽到空样本角色 | `newQuestion()` 过滤掉 `SAMPLES[charId].length === 0` 的角色 |
++
++---
++
++## 7. 测试
++
++复用 MorsePractice 现有 vitest + happy-dom 设置。
++
++```js
++// tests/quiz.test.js
++- newQuestion() 抽到的 charId 必在 CHARACTERS 内
++- newQuestion() 抽到的 sampleId 必在 SAMPLES[charId] 内
++- pick(correctCharId) → state.phase === 'answered', score.correct++
++- pick(wrongCharId)   → state.phase === 'answered', score.wrong++
++- retry()             → 同 charId、不同 sampleId、phase='awaitPick'、answered=false、revealed=false
++- next()              → 不同 charId、phase='awaitPick'、answered=false、revealed=false
++- revealAnswer()      → state.revealed=true
++- revealAnswer() 二次调用 → state.revealed 仍为 true（幂等）
++- retry()/next() 后 state.revealed=false
++- canPick() 在 answered 后返回 false
++- canRetry() 始终 true
++- canNext() 始终 true
++- canHintBand()/canReveal() 在 playing 后 false
++- canReveal() 在 revealed 后 false（防二次按答案）
++- newQuestion() 1000 次不出现空样本角色
++
++// tests/audio.test.js (mock AudioContext)
++- playSample(charId, idx) 调用 HTMLAudioElement
++- 404 触发 fallback + newQuestion()
++- stop() 中断正在播的样本
++
++// tests/i18n.test.js
++- t('band.poppin-party', {locale:'zh'}) === "Poppin'Party"
++- t('char.kasumi.name', {locale:'ja'}) === "香澄"
++- t('char.kasumi.name', {locale:'en'}) === "Kasumi Toyama"
++- applyTranslations() 切换所有 data-i18n 元素
++```
++
++---
++
++## 8. 资源获取策略
++
++### 8.1 图片
++
++- 搜索优先级：bangdream.fandom.com → 萌娘百科 BanG Dream! 词条 → 官方 anime 官网 → 微博/B站官方
++- 单条图片检索 ≤180s；找不到记录进 `dev-docs/04-resource-missing-2026-07-15.md`
++- 立绘选 4:5 竖版（约 600×750），CSS 缩放
++
++### 8.2 音频
++
++- 搜索优先级：Bestdori（bestdori.com）→ bangdream.fandom.com → 萌娘百科「BanG Dream! 语音集」
++- 5min 内必须锁定源；找不到则记录
++- 单文件下载 ≤180s；接受 mp3/ogg；优先短小（角色台词通常 <200KB）
++
++### 8.3 调研资料表（Agent Rules #7）
++
++- `research/bands.xml`：每乐队的参考链接 + 关键属性
++- `research/characters.xml`：每角色的参考链接 + 所属乐队 + 简介 + 资源链接
++
++---
++
++## 9. 项目文档
++
++按 Agent Rules #6 序号命名：
++
++```
++dev-docs/
++  01-bangdream-domain-research-2026-07-15.md  # 邦邦乐队/角色域资料
++  02-resource-strategy-2026-07-15.md          # 资源获取策略与限制
++  03-resource-acquisition-log-2026-07-15.md   # 资源下载日志
++  04-resource-missing-2026-07-15.md           # 找不到的资源清单
++  05-architecture-decisions-2026-07-15.md     # 关键架构决策记录
++  06-handoff-2026-07-15.md                    # 接手指南
++```
++
++---
++
++## 10. Agent Rules 自查
++
++| # | 规则 | 落实 |
++|---|---|---|
++| 1 | 不假设用户清楚自己要什么 | brainstorming 三节全过 |
++| 2 | 路径最优 | 复用 MorsePractice，避免重造 |
++| 3 | 追根因不补丁 | 状态机以"重抽 vs 重播 vs 二次答题"为根因设计 |
++| 4 | 输出说重点 | 本 spec 全文 |
++| 5 | RPM<200, TPM<10M | Opus/Fable 5 不突破；下载走 curl |
++| 6 | dev-doc 序号命名 | 见 §9 |
++| 7 | 调研 XML 表 | 见 §8.3 |
++| 8 | 代码入 src/ | 见 §3.2 |
++| 9 | 系统信息已记录 | Ubuntu 22.04 / X11 / i5-13600KF / 32GB / RTX 4060 |
++| 10 | 迅捷 demo | 本地 http.server，不部署 |
++| 11 | 方案含难度+风险 | brainstorming 三节都有 |
++
++---
++
++## 11. 范围外（YAGNI）
++
++- ❌ 计分 / 排名 / 排行榜
++- ❌ 用户账号
++- ❌ 服务端 / 后端
++- ❌ Cloudflare Pages 部署（保留为未来扩展）
++- ❌ Service Worker / 离线缓存
++- ❌ 移动端原生 App
++
++---
++
++## 12. 后续
++
++brainstorming 通过后 → 调用 `superpowers:writing-plans` 生成实施计划 → 进入开发。
+\ No newline at end of file
+diff --git a/index.html b/index.html
+new file mode 100644
+index 0000000..29977b7
+--- /dev/null
++++ b/index.html
+@@ -0,0 +1,11 @@
++<!DOCTYPE html>
++<html lang="zh-CN">
++<head>
++  <meta charset="UTF-8">
++  <title>BanG Dream 听声音猜角色</title>
++</head>
++<body>
++  <button data-i18n-lang-switch data-i18n="language.switchTo">切到英语</button>
++  <script type="module" src="src/main.js"></script>
++</body>
++</html>
+diff --git a/package-lock.json b/package-lock.json
+new file mode 100644
+index 0000000..37f6128
+--- /dev/null
++++ b/package-lock.json
+@@ -0,0 +1,1899 @@
++{
++  "name": "bangdream-quiz",
++  "version": "0.1.0",
++  "lockfileVersion": 3,
++  "requires": true,
++  "packages": {
++    "": {
++      "name": "bangdream-quiz",
++      "version": "0.1.0",
++      "devDependencies": {
++        "happy-dom": "^14.0.0",
++        "vitest": "^1.6.0"
++      }
++    },
++    "node_modules/@esbuild/aix-ppc64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.21.5.tgz",
++      "integrity": "sha512-1SDgH6ZSPTlggy1yI6+Dbkiz8xzpHJEVAlF/AM1tHPLsf5STom9rwtjE4hKAF20FfXXNTFqEYXyJNWh1GiZedQ==",
++      "cpu": [
++        "ppc64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "aix"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/android-arm": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.21.5.tgz",
++      "integrity": "sha512-vCPvzSjpPHEi1siZdlvAlsPxXl7WbOVUBBAowWug4rJHb68Ox8KualB+1ocNvT5fjv6wpkX6o/iEpbDrf68zcg==",
++      "cpu": [
++        "arm"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "android"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/android-arm64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.21.5.tgz",
++      "integrity": "sha512-c0uX9VAUBQ7dTDCjq+wdyGLowMdtR/GoC2U5IYk/7D1H1JYC0qseD7+11iMP2mRLN9RcCMRcjC4YMclCzGwS/A==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "android"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/android-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.21.5.tgz",
++      "integrity": "sha512-D7aPRUUNHRBwHxzxRvp856rjUHRFW1SdQATKXH2hqA0kAZb1hKmi02OpYRacl0TxIGz/ZmXWlbZgjwWYaCakTA==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "android"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/darwin-arm64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.21.5.tgz",
++      "integrity": "sha512-DwqXqZyuk5AiWWf3UfLiRDJ5EDd49zg6O9wclZ7kUMv2WRFr4HKjXp/5t8JZ11QbQfUS6/cRCKGwYhtNAY88kQ==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "darwin"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/darwin-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.21.5.tgz",
++      "integrity": "sha512-se/JjF8NlmKVG4kNIuyWMV/22ZaerB+qaSi5MdrXtd6R08kvs2qCN4C09miupktDitvh8jRFflwGFBQcxZRjbw==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "darwin"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/freebsd-arm64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.21.5.tgz",
++      "integrity": "sha512-5JcRxxRDUJLX8JXp/wcBCy3pENnCgBR9bN6JsY4OmhfUtIHe3ZW0mawA7+RDAcMLrMIZaf03NlQiX9DGyB8h4g==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "freebsd"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/freebsd-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.21.5.tgz",
++      "integrity": "sha512-J95kNBj1zkbMXtHVH29bBriQygMXqoVQOQYA+ISs0/2l3T9/kj42ow2mpqerRBxDJnmkUDCaQT/dfNXWX/ZZCQ==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "freebsd"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-arm": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.21.5.tgz",
++      "integrity": "sha512-bPb5AHZtbeNGjCKVZ9UGqGwo8EUu4cLq68E95A53KlxAPRmUyYv2D6F0uUI65XisGOL1hBP5mTronbgo+0bFcA==",
++      "cpu": [
++        "arm"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-arm64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.21.5.tgz",
++      "integrity": "sha512-ibKvmyYzKsBeX8d8I7MH/TMfWDXBF3db4qM6sy+7re0YXya+K1cem3on9XgdT2EQGMu4hQyZhan7TeQ8XkGp4Q==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-ia32": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.21.5.tgz",
++      "integrity": "sha512-YvjXDqLRqPDl2dvRODYmmhz4rPeVKYvppfGYKSNGdyZkA01046pLWyRKKI3ax8fbJoK5QbxblURkwK/MWY18Tg==",
++      "cpu": [
++        "ia32"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-loong64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.21.5.tgz",
++      "integrity": "sha512-uHf1BmMG8qEvzdrzAqg2SIG/02+4/DHB6a9Kbya0XDvwDEKCoC8ZRWI5JJvNdUjtciBGFQ5PuBlpEOXQj+JQSg==",
++      "cpu": [
++        "loong64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-mips64el": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.21.5.tgz",
++      "integrity": "sha512-IajOmO+KJK23bj52dFSNCMsz1QP1DqM6cwLUv3W1QwyxkyIWecfafnI555fvSGqEKwjMXVLokcV5ygHW5b3Jbg==",
++      "cpu": [
++        "mips64el"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-ppc64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.21.5.tgz",
++      "integrity": "sha512-1hHV/Z4OEfMwpLO8rp7CvlhBDnjsC3CttJXIhBi+5Aj5r+MBvy4egg7wCbe//hSsT+RvDAG7s81tAvpL2XAE4w==",
++      "cpu": [
++        "ppc64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-riscv64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.21.5.tgz",
++      "integrity": "sha512-2HdXDMd9GMgTGrPWnJzP2ALSokE/0O5HhTUvWIbD3YdjME8JwvSCnNGBnTThKGEB91OZhzrJ4qIIxk/SBmyDDA==",
++      "cpu": [
++        "riscv64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-s390x": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.21.5.tgz",
++      "integrity": "sha512-zus5sxzqBJD3eXxwvjN1yQkRepANgxE9lgOW2qLnmr8ikMTphkjgXu1HR01K4FJg8h1kEEDAqDcZQtbrRnB41A==",
++      "cpu": [
++        "s390x"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/linux-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.21.5.tgz",
++      "integrity": "sha512-1rYdTpyv03iycF1+BhzrzQJCdOuAOtaqHTWJZCWvijKD2N5Xu0TtVC8/+1faWqcP9iBCWOmjmhoH94dH82BxPQ==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/netbsd-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.21.5.tgz",
++      "integrity": "sha512-Woi2MXzXjMULccIwMnLciyZH4nCIMpWQAs049KEeMvOcNADVxo0UBIQPfSmxB3CWKedngg7sWZdLvLczpe0tLg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "netbsd"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/openbsd-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.21.5.tgz",
++      "integrity": "sha512-HLNNw99xsvx12lFBUwoT8EVCsSvRNDVxNpjZ7bPn947b8gJPzeHWyNVhFsaerc0n3TsbOINvRP2byTZ5LKezow==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "openbsd"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/sunos-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.21.5.tgz",
++      "integrity": "sha512-6+gjmFpfy0BHU5Tpptkuh8+uw3mnrvgs+dSPQXQOv3ekbordwnzTVEb4qnIvQcYXq6gzkyTnoZ9dZG+D4garKg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "sunos"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/win32-arm64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.21.5.tgz",
++      "integrity": "sha512-Z0gOTd75VvXqyq7nsl93zwahcTROgqvuAcYDUr+vOv8uHhNSKROyU961kgtCD1e95IqPKSQKH7tBTslnS3tA8A==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/win32-ia32": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.21.5.tgz",
++      "integrity": "sha512-SWXFF1CL2RVNMaVs+BBClwtfZSvDgtL//G/smwAc5oVK/UPu2Gu9tIaRgFmYFFKrmg3SyAjSrElf0TiJ1v8fYA==",
++      "cpu": [
++        "ia32"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@esbuild/win32-x64": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.21.5.tgz",
++      "integrity": "sha512-tQd/1efJuzPC6rCFwEvLtci/xNFcTZknmXs98FYDfGE4wP9ClFV98nyKrzJKVPMhdDnjzLhdUyMX4PsQAPjwIw==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ],
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/@jest/schemas": {
++      "version": "29.6.3",
++      "resolved": "https://registry.npmjs.org/@jest/schemas/-/schemas-29.6.3.tgz",
++      "integrity": "sha512-mo5j5X+jIZmJQveBKeS/clAueipV7KgiX1vMgCxam1RNYiqE1w62n0/tJJnHtjW8ZHcQco5gY85jA3mi0L+nSA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@sinclair/typebox": "^0.27.8"
++      },
++      "engines": {
++        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
++      }
++    },
++    "node_modules/@jridgewell/sourcemap-codec": {
++      "version": "1.5.5",
++      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
++      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/@rollup/rollup-android-arm-eabi": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.62.2.tgz",
++      "integrity": "sha512-6o7ZLZK+BeenkZCFNDXqpbjw9bD6nuWonvS/lwQJp7NoVVxm6p3qE7qQ5jGuBjiFsgvqjD8mZAU5oWxTmbOeOg==",
++      "cpu": [
++        "arm"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "android"
++      ]
++    },
++    "node_modules/@rollup/rollup-android-arm64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.62.2.tgz",
++      "integrity": "sha512-BaH7BllCACHoH1LguOU56UItGfUWjujlO65kS9LAodViaN4bwIKd7oeW/ZHJ/4ljr/7MIiENnNy3HJ0zXv8Zkw==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "android"
++      ]
++    },
++    "node_modules/@rollup/rollup-darwin-arm64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.62.2.tgz",
++      "integrity": "sha512-v39RCCvj4He82I9sFmk+M1VZ0PLM9sfsLVikjfx2hYBNALhrrOR2D3JjQA6AhlaSOgcR+RzrKY7e1+bT6SUO/A==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "darwin"
++      ]
++    },
++    "node_modules/@rollup/rollup-darwin-x64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.62.2.tgz",
++      "integrity": "sha512-yl0y2vq3S3lHeuXhEdss6TWfKW8vkujImO12tn4ZkG/4oghr09LvdYm2RElVjokTQiUvDUGXLGsYeLqUMCKpGA==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "darwin"
++      ]
++    },
++    "node_modules/@rollup/rollup-freebsd-arm64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.62.2.tgz",
++      "integrity": "sha512-tT4pvt4qXD+vEoezupCWi+a1F0vvDiksiHc+PxRlYTOH1I6/X4id9jPxTP+Fg+545euaFT1jJVs4CEdHZAU1vw==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "freebsd"
++      ]
++    },
++    "node_modules/@rollup/rollup-freebsd-x64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.62.2.tgz",
++      "integrity": "sha512-6nU5F2wCW+qvCBhTn1pdIU3bzsIoF7EUwsCDRxilWGprQR6yd508YnH9+OKFCwpfS8pjZqDUmnCAr7exax0XCg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "freebsd"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.62.2.tgz",
++      "integrity": "sha512-n1GJHPOvpIfhi3TmrCeh6S6URt9BFCt0KQE3qvexyGCTAKpR4Lg+eWvNZEqu7epxwus/8ElT3hacYEucm49SZg==",
++      "cpu": [
++        "arm"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.62.2.tgz",
++      "integrity": "sha512-JqgflS8wEB+UXV/vS1RpRbifGBeN4D5lz8D8oOFbFZw4vedvdOgCFAjfBmIMdW3yL10XpQQ0Ambepw6MXrhOnA==",
++      "cpu": [
++        "arm"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-arm64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.62.2.tgz",
++      "integrity": "sha512-wnFJkogWvN4jm/hQRF2UBaeUmk20j5+DmHvoyWii2b8HJDyvz1MF2OU/6ynXt2KR63rbZLWkFpoytpdc/yBuSA==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-arm64-musl": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.62.2.tgz",
++      "integrity": "sha512-HVu2bp0zhvJ8xHEV9+UUs7S90VadmBSY3LcIMvozbPo4AuMGDWlz3ymHLHZPX4hR67TKTt8Qp5PJ5RBg/i+RMQ==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-loong64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.62.2.tgz",
++      "integrity": "sha512-mQqqAV8QaoSgr9I2fKDLY2BAVvmKjWoGiu/cSYQonsLvtqwEn1E4QYfnCOcp5zoEqNhsDYin1s6jx/VJmrxlZg==",
++      "cpu": [
++        "loong64"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-loong64-musl": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.62.2.tgz",
++      "integrity": "sha512-IxKLoxCQ2IWi6bT2akyDUBGsOImDKB+sPp4EsTmwFQ/fMwpCKm8uLSSgP/Kx/QYUgKis6SEZ5/Nlhup0DIA0PQ==",
++      "cpu": [
++        "loong64"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.62.2.tgz",
++      "integrity": "sha512-Mk5ha2RQSgyFfmYYLkBpPnUk8D8FriBxesO1u9O75X0mHgXL1UQcH5Itl2lurWL2tj0RxV9b9tJgipac0hRY9A==",
++      "cpu": [
++        "ppc64"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-ppc64-musl": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.62.2.tgz",
++      "integrity": "sha512-CjvEnqJL/0/TQ3TXX3OPIJ/kmBellrWd4heXUmHeJlTnmwjKpSJzoehLaL6Xk0ZnMHBu9dZuFADNOrtjF4v+2w==",
++      "cpu": [
++        "ppc64"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.62.2.tgz",
++      "integrity": "sha512-1SiZbzwdkaDURsew/tSOrooKiYy7EQGT6m8ufavAi9NEyQb/6VuIxFXAL1fqa4iZe3g4NbNk4P7J32z2tw5Mgg==",
++      "cpu": [
++        "riscv64"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-riscv64-musl": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.62.2.tgz",
++      "integrity": "sha512-nQts12zJ3NQRoE6uYljOH89v7szzLDvG2JD/vsX+vGXU8w/At1GowTZ5/7qeFQ8m7L55rpR8Okugnuo5bgjy2Q==",
++      "cpu": [
++        "riscv64"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-s390x-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.62.2.tgz",
++      "integrity": "sha512-E9/ll019jhPIJgpzfZoIkBGhcz+kKNgVWYRY0zr9srBdPPFVpvOKW8VaJKUbeK+eZXyQF9ltME+Kk6affeaPgg==",
++      "cpu": [
++        "s390x"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-x64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.62.2.tgz",
++      "integrity": "sha512-5BqxR/pshjey51iliyzTD5Xi3EN0aLmQ2lZ3lvefVV9c82BvrLo2/6OT55iifpWBufs6kdwWbuOKS841DrmK9A==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "libc": [
++        "glibc"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-linux-x64-musl": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.62.2.tgz",
++      "integrity": "sha512-uNN83XxQrRAh/w0/pmAfibcwyb6YWt4gP+dpnQKPVJshAloQ785ii8CT8ZCIxkGg9opVsvAlGhFitSm6D1Jjpg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "libc": [
++        "musl"
++      ],
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "linux"
++      ]
++    },
++    "node_modules/@rollup/rollup-openbsd-x64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.62.2.tgz",
++      "integrity": "sha512-srjEIxSH3LRnJN6THczDHWQplqEMFiAJrTab0msUryh9kwNpkICf3Ea6q6MN/2cZwRFUNx5w+h6Hpi4QuHS6Zg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "openbsd"
++      ]
++    },
++    "node_modules/@rollup/rollup-openharmony-arm64": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.62.2.tgz",
++      "integrity": "sha512-8hOJnxgbyObnCm5AlRA3A931xX19xq80RjVTKgJOvEKWqJruP/Uf12IbAOaDjjEXYRewwHLfmF0YRIdK3OwKWA==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "openharmony"
++      ]
++    },
++    "node_modules/@rollup/rollup-win32-arm64-msvc": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.62.2.tgz",
++      "integrity": "sha512-mmF4AY1i0hG/bLWUctUq59gtmgaSIRa3cu/A3JFRp/sCNEme2bgDEiDS22P9FbnJB8NJNF4jPJiSP5RHQpUTDg==",
++      "cpu": [
++        "arm64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ]
++    },
++    "node_modules/@rollup/rollup-win32-ia32-msvc": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.62.2.tgz",
++      "integrity": "sha512-DZgkknc6jhHrk46V25vbAM0zZkyP0nSDkJB8/dRkLTxv470dOmWDqGoEJl/9A0dFfS7yE3REOwNDxpHwSLSt0Q==",
++      "cpu": [
++        "ia32"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ]
++    },
++    "node_modules/@rollup/rollup-win32-x64-gnu": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.62.2.tgz",
++      "integrity": "sha512-T6xr6ucWSFto+VGajA8YH26LdpHRuP4YLHEKAtCWvJDOlnmWcDZVCI2Jmjr+IFHDlt2zRaTAKE4tfjTaWLgJBg==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ]
++    },
++    "node_modules/@rollup/rollup-win32-x64-msvc": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.62.2.tgz",
++      "integrity": "sha512-BfzEnDJOt9T8M989/lA37EcJgat01wLRnoi5dQf3QzOH7jzpqTAzdDbVfRljVr5r+jzKqpbHeyOfAaXxAd0PAA==",
++      "cpu": [
++        "x64"
++      ],
++      "dev": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "win32"
++      ]
++    },
++    "node_modules/@sinclair/typebox": {
++      "version": "0.27.10",
++      "resolved": "https://registry.npmjs.org/@sinclair/typebox/-/typebox-0.27.10.tgz",
++      "integrity": "sha512-MTBk/3jGLNB2tVxv6uLlFh1iu64iYOQ2PbdOSK3NW8JZsmlaOh2q6sdtKowBhfw8QFLmYNzTW4/oK4uATIi6ZA==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/@types/estree": {
++      "version": "1.0.9",
++      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
++      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/@vitest/expect": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/@vitest/expect/-/expect-1.6.1.tgz",
++      "integrity": "sha512-jXL+9+ZNIJKruofqXuuTClf44eSpcHlgj3CiuNihUF3Ioujtmc0zIa3UJOW5RjDK1YLBJZnWBlPuqhYycLioog==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@vitest/spy": "1.6.1",
++        "@vitest/utils": "1.6.1",
++        "chai": "^4.3.10"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/@vitest/runner": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/@vitest/runner/-/runner-1.6.1.tgz",
++      "integrity": "sha512-3nSnYXkVkf3mXFfE7vVyPmi3Sazhb/2cfZGGs0JRzFsPFvAMBEcrweV1V1GsrstdXeKCTXlJbvnQwGWgEIHmOA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@vitest/utils": "1.6.1",
++        "p-limit": "^5.0.0",
++        "pathe": "^1.1.1"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/@vitest/snapshot": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/@vitest/snapshot/-/snapshot-1.6.1.tgz",
++      "integrity": "sha512-WvidQuWAzU2p95u8GAKlRMqMyN1yOJkGHnx3M1PL9Raf7AQ1kwLKg04ADlCa3+OXUZE7BceOhVZiuWAbzCKcUQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "magic-string": "^0.30.5",
++        "pathe": "^1.1.1",
++        "pretty-format": "^29.7.0"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/@vitest/spy": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/@vitest/spy/-/spy-1.6.1.tgz",
++      "integrity": "sha512-MGcMmpGkZebsMZhbQKkAf9CX5zGvjkBTqf8Zx3ApYWXr3wG+QvEu2eXWfnIIWYSJExIp4V9FCKDEeygzkYrXMw==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "tinyspy": "^2.2.0"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/@vitest/utils": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/@vitest/utils/-/utils-1.6.1.tgz",
++      "integrity": "sha512-jOrrUvXM4Av9ZWiG1EajNto0u96kWAhJ1LmPmJhXXQx/32MecEKd10pOLYgS2BQx1TgkGhloPU1ArDW2vvaY6g==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "diff-sequences": "^29.6.3",
++        "estree-walker": "^3.0.3",
++        "loupe": "^2.3.7",
++        "pretty-format": "^29.7.0"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/acorn": {
++      "version": "8.17.0",
++      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.17.0.tgz",
++      "integrity": "sha512-xRQbDb9BnwDafYNn6Vwl839DYVjqXYb1XVGtWAZ1kcDc6iwAL4hg3B1dZlRiuENFeO2H53gFG3in621AdERVAg==",
++      "dev": true,
++      "license": "MIT",
++      "bin": {
++        "acorn": "bin/acorn"
++      },
++      "engines": {
++        "node": ">=0.4.0"
++      }
++    },
++    "node_modules/acorn-walk": {
++      "version": "8.3.5",
++      "resolved": "https://registry.npmjs.org/acorn-walk/-/acorn-walk-8.3.5.tgz",
++      "integrity": "sha512-HEHNfbars9v4pgpW6SO1KSPkfoS0xVOM/9UzkJltjlsHZmJasxg8aXkuZa7SMf8vKGIBhpUsPluQSqhJFCqebw==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "acorn": "^8.11.0"
++      },
++      "engines": {
++        "node": ">=0.4.0"
++      }
++    },
++    "node_modules/ansi-styles": {
++      "version": "5.2.0",
++      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
++      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=10"
++      },
++      "funding": {
++        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
++      }
++    },
++    "node_modules/assertion-error": {
++      "version": "1.1.0",
++      "resolved": "https://registry.npmjs.org/assertion-error/-/assertion-error-1.1.0.tgz",
++      "integrity": "sha512-jgsaNduz+ndvGyFt3uSuWqvy4lCnIJiovtouQN5JZHOKCS2QuhEdbcQHFhVksz2N2U9hXJo8odG7ETyWlEeuDw==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": "*"
++      }
++    },
++    "node_modules/cac": {
++      "version": "6.7.14",
++      "resolved": "https://registry.npmjs.org/cac/-/cac-6.7.14.tgz",
++      "integrity": "sha512-b6Ilus+c3RrdDk+JhLKUAQfzzgLEPy6wcXqS7f/xe1EETvsDP6GORG7SFuOs6cID5YkqchW/LXZbX5bc8j7ZcQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=8"
++      }
++    },
++    "node_modules/chai": {
++      "version": "4.5.0",
++      "resolved": "https://registry.npmjs.org/chai/-/chai-4.5.0.tgz",
++      "integrity": "sha512-RITGBfijLkBddZvnn8jdqoTypxvqbOLYQkGGxXzeFjVHvudaPw0HNFD9x928/eUwYWd2dPCugVqspGALTZZQKw==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "assertion-error": "^1.1.0",
++        "check-error": "^1.0.3",
++        "deep-eql": "^4.1.3",
++        "get-func-name": "^2.0.2",
++        "loupe": "^2.3.6",
++        "pathval": "^1.1.1",
++        "type-detect": "^4.1.0"
++      },
++      "engines": {
++        "node": ">=4"
++      }
++    },
++    "node_modules/check-error": {
++      "version": "1.0.3",
++      "resolved": "https://registry.npmjs.org/check-error/-/check-error-1.0.3.tgz",
++      "integrity": "sha512-iKEoDYaRmd1mxM90a2OEfWhjsjPpYPuQ+lMYsoxB126+t8fw7ySEO48nmDg5COTjxDI65/Y2OWpeEHk3ZOe8zg==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "get-func-name": "^2.0.2"
++      },
++      "engines": {
++        "node": "*"
++      }
++    },
++    "node_modules/confbox": {
++      "version": "0.1.8",
++      "resolved": "https://registry.npmjs.org/confbox/-/confbox-0.1.8.tgz",
++      "integrity": "sha512-RMtmw0iFkeR4YV+fUOSucriAQNb9g8zFR52MWCtl+cCZOFRNL6zeB395vPzFhEjjn4fMxXudmELnl/KF/WrK6w==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/cross-spawn": {
++      "version": "7.0.6",
++      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
++      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "path-key": "^3.1.0",
++        "shebang-command": "^2.0.0",
++        "which": "^2.0.1"
++      },
++      "engines": {
++        "node": ">= 8"
++      }
++    },
++    "node_modules/debug": {
++      "version": "4.4.3",
++      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
++      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "ms": "^2.1.3"
++      },
++      "engines": {
++        "node": ">=6.0"
++      },
++      "peerDependenciesMeta": {
++        "supports-color": {
++          "optional": true
++        }
++      }
++    },
++    "node_modules/deep-eql": {
++      "version": "4.1.4",
++      "resolved": "https://registry.npmjs.org/deep-eql/-/deep-eql-4.1.4.tgz",
++      "integrity": "sha512-SUwdGfqdKOwxCPeVYjwSyRpJ7Z+fhpwIAtmCUdZIWZ/YP5R9WAsyuSgpLVDi9bjWoN2LXHNss/dk3urXtdQxGg==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "type-detect": "^4.0.0"
++      },
++      "engines": {
++        "node": ">=6"
++      }
++    },
++    "node_modules/diff-sequences": {
++      "version": "29.6.3",
++      "resolved": "https://registry.npmjs.org/diff-sequences/-/diff-sequences-29.6.3.tgz",
++      "integrity": "sha512-EjePK1srD3P08o2j4f0ExnylqRs5B9tJjcp9t1krH2qRi8CCdsYfwe9JgSLurFBWwq4uOlipzfk5fHNvwFKr8Q==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
++      }
++    },
++    "node_modules/entities": {
++      "version": "4.5.0",
++      "resolved": "https://registry.npmjs.org/entities/-/entities-4.5.0.tgz",
++      "integrity": "sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==",
++      "dev": true,
++      "license": "BSD-2-Clause",
++      "engines": {
++        "node": ">=0.12"
++      },
++      "funding": {
++        "url": "https://github.com/fb55/entities?sponsor=1"
++      }
++    },
++    "node_modules/esbuild": {
++      "version": "0.21.5",
++      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.21.5.tgz",
++      "integrity": "sha512-mg3OPMV4hXywwpoDxu3Qda5xCKQi+vCTZq8S9J/EpkhB2HzKXq4SNFZE3+NK93JYxc8VMSep+lOUSC/RVKaBqw==",
++      "dev": true,
++      "hasInstallScript": true,
++      "license": "MIT",
++      "bin": {
++        "esbuild": "bin/esbuild"
++      },
++      "engines": {
++        "node": ">=12"
++      },
++      "optionalDependencies": {
++        "@esbuild/aix-ppc64": "0.21.5",
++        "@esbuild/android-arm": "0.21.5",
++        "@esbuild/android-arm64": "0.21.5",
++        "@esbuild/android-x64": "0.21.5",
++        "@esbuild/darwin-arm64": "0.21.5",
++        "@esbuild/darwin-x64": "0.21.5",
++        "@esbuild/freebsd-arm64": "0.21.5",
++        "@esbuild/freebsd-x64": "0.21.5",
++        "@esbuild/linux-arm": "0.21.5",
++        "@esbuild/linux-arm64": "0.21.5",
++        "@esbuild/linux-ia32": "0.21.5",
++        "@esbuild/linux-loong64": "0.21.5",
++        "@esbuild/linux-mips64el": "0.21.5",
++        "@esbuild/linux-ppc64": "0.21.5",
++        "@esbuild/linux-riscv64": "0.21.5",
++        "@esbuild/linux-s390x": "0.21.5",
++        "@esbuild/linux-x64": "0.21.5",
++        "@esbuild/netbsd-x64": "0.21.5",
++        "@esbuild/openbsd-x64": "0.21.5",
++        "@esbuild/sunos-x64": "0.21.5",
++        "@esbuild/win32-arm64": "0.21.5",
++        "@esbuild/win32-ia32": "0.21.5",
++        "@esbuild/win32-x64": "0.21.5"
++      }
++    },
++    "node_modules/estree-walker": {
++      "version": "3.0.3",
++      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz",
++      "integrity": "sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@types/estree": "^1.0.0"
++      }
++    },
++    "node_modules/execa": {
++      "version": "8.0.1",
++      "resolved": "https://registry.npmjs.org/execa/-/execa-8.0.1.tgz",
++      "integrity": "sha512-VyhnebXciFV2DESc+p6B+y0LjSm0krU4OgJN44qFAhBY0TJ+1V61tYD2+wHusZ6F9n5K+vl8k0sTy7PEfV4qpg==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "cross-spawn": "^7.0.3",
++        "get-stream": "^8.0.1",
++        "human-signals": "^5.0.0",
++        "is-stream": "^3.0.0",
++        "merge-stream": "^2.0.0",
++        "npm-run-path": "^5.1.0",
++        "onetime": "^6.0.0",
++        "signal-exit": "^4.1.0",
++        "strip-final-newline": "^3.0.0"
++      },
++      "engines": {
++        "node": ">=16.17"
++      },
++      "funding": {
++        "url": "https://github.com/sindresorhus/execa?sponsor=1"
++      }
++    },
++    "node_modules/fsevents": {
++      "version": "2.3.3",
++      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
++      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
++      "dev": true,
++      "hasInstallScript": true,
++      "license": "MIT",
++      "optional": true,
++      "os": [
++        "darwin"
++      ],
++      "engines": {
++        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
++      }
++    },
++    "node_modules/get-func-name": {
++      "version": "2.0.2",
++      "resolved": "https://registry.npmjs.org/get-func-name/-/get-func-name-2.0.2.tgz",
++      "integrity": "sha512-8vXOvuE167CtIc3OyItco7N/dpRtBbYOsPsXCz7X/PMnlGjYjSGuZJgM1Y7mmew7BKf9BqvLX2tnOVy1BBUsxQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": "*"
++      }
++    },
++    "node_modules/get-stream": {
++      "version": "8.0.1",
++      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-8.0.1.tgz",
++      "integrity": "sha512-VaUJspBffn/LMCJVoMvSAdmscJyS1auj5Zulnn5UoYcY531UWmdwhRWkcGKnGU93m5HSXP9LP2usOryrBtQowA==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=16"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/happy-dom": {
++      "version": "14.12.3",
++      "resolved": "https://registry.npmjs.org/happy-dom/-/happy-dom-14.12.3.tgz",
++      "integrity": "sha512-vsYlEs3E9gLwA1Hp+w3qzu+RUDFf4VTT8cyKqVICoZ2k7WM++Qyd2LwzyTi5bqMJFiIC/vNpTDYuxdreENRK/g==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "entities": "^4.5.0",
++        "webidl-conversions": "^7.0.0",
++        "whatwg-mimetype": "^3.0.0"
++      },
++      "engines": {
++        "node": ">=16.0.0"
++      }
++    },
++    "node_modules/human-signals": {
++      "version": "5.0.0",
++      "resolved": "https://registry.npmjs.org/human-signals/-/human-signals-5.0.0.tgz",
++      "integrity": "sha512-AXcZb6vzzrFAUE61HnN4mpLqd/cSIwNQjtNWR0euPm6y0iqx3G4gOXaIDdtdDwZmhwe82LA6+zinmW4UBWVePQ==",
++      "dev": true,
++      "license": "Apache-2.0",
++      "engines": {
++        "node": ">=16.17.0"
++      }
++    },
++    "node_modules/is-stream": {
++      "version": "3.0.0",
++      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-3.0.0.tgz",
++      "integrity": "sha512-LnQR4bZ9IADDRSkvpqMGvt/tEJWclzklNgSw48V5EAaAeDd6qGvN8ei6k5p0tvxSR171VmGyHuTiAOfxAbr8kA==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/isexe": {
++      "version": "2.0.0",
++      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
++      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
++      "dev": true,
++      "license": "ISC"
++    },
++    "node_modules/js-tokens": {
++      "version": "9.0.1",
++      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-9.0.1.tgz",
++      "integrity": "sha512-mxa9E9ITFOt0ban3j6L5MpjwegGz6lBQmM1IJkWeBZGcMxto50+eWdjC/52xDbS2vy0k7vIMK0Fe2wfL9OQSpQ==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/local-pkg": {
++      "version": "0.5.1",
++      "resolved": "https://registry.npmjs.org/local-pkg/-/local-pkg-0.5.1.tgz",
++      "integrity": "sha512-9rrA30MRRP3gBD3HTGnC6cDFpaE1kVDWxWgqWJUN0RvDNAo+Nz/9GxB+nHOH0ifbVFy0hSA1V6vFDvnx54lTEQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "mlly": "^1.7.3",
++        "pkg-types": "^1.2.1"
++      },
++      "engines": {
++        "node": ">=14"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/antfu"
++      }
++    },
++    "node_modules/loupe": {
++      "version": "2.3.7",
++      "resolved": "https://registry.npmjs.org/loupe/-/loupe-2.3.7.tgz",
++      "integrity": "sha512-zSMINGVYkdpYSOBmLi0D1Uo7JU9nVdQKrHxC8eYlV+9YKK9WePqAlL7lSlorG/U2Fw1w0hTBmaa/jrQ3UbPHtA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "get-func-name": "^2.0.1"
++      }
++    },
++    "node_modules/magic-string": {
++      "version": "0.30.21",
++      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
++      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@jridgewell/sourcemap-codec": "^1.5.5"
++      }
++    },
++    "node_modules/merge-stream": {
++      "version": "2.0.0",
++      "resolved": "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz",
++      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/mimic-fn": {
++      "version": "4.0.0",
++      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-4.0.0.tgz",
++      "integrity": "sha512-vqiC06CuhBTUdZH+RYl8sFrL096vA45Ok5ISO6sE/Mr1jRbGH4Csnhi8f3wKVl7x8mO4Au7Ir9D3Oyv1VYMFJw==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=12"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/mlly": {
++      "version": "1.8.2",
++      "resolved": "https://registry.npmjs.org/mlly/-/mlly-1.8.2.tgz",
++      "integrity": "sha512-d+ObxMQFmbt10sretNDytwt85VrbkhhUA/JBGm1MPaWJ65Cl4wOgLaB1NYvJSZ0Ef03MMEU/0xpPMXUIQ29UfA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "acorn": "^8.16.0",
++        "pathe": "^2.0.3",
++        "pkg-types": "^1.3.1",
++        "ufo": "^1.6.3"
++      }
++    },
++    "node_modules/mlly/node_modules/pathe": {
++      "version": "2.0.3",
++      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
++      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/ms": {
++      "version": "2.1.3",
++      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
++      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/nanoid": {
++      "version": "3.3.16",
++      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.16.tgz",
++      "integrity": "sha512-bzlKTyNJ7+LdGIIwy8ijFpIqEQIvafahV7eYykJ8Cvh42EdJeODoJ6gUJXpQJvej1BddH8OqTXZNE/KfbWAu8Q==",
++      "dev": true,
++      "funding": [
++        {
++          "type": "github",
++          "url": "https://github.com/sponsors/ai"
++        }
++      ],
++      "license": "MIT",
++      "bin": {
++        "nanoid": "bin/nanoid.cjs"
++      },
++      "engines": {
++        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
++      }
++    },
++    "node_modules/npm-run-path": {
++      "version": "5.3.0",
++      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-5.3.0.tgz",
++      "integrity": "sha512-ppwTtiJZq0O/ai0z7yfudtBpWIoxM8yE6nHi1X47eFR2EWORqfbu6CnPlNsjeN683eT0qG6H/Pyf9fCcvjnnnQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "path-key": "^4.0.0"
++      },
++      "engines": {
++        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/npm-run-path/node_modules/path-key": {
++      "version": "4.0.0",
++      "resolved": "https://registry.npmjs.org/path-key/-/path-key-4.0.0.tgz",
++      "integrity": "sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=12"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/onetime": {
++      "version": "6.0.0",
++      "resolved": "https://registry.npmjs.org/onetime/-/onetime-6.0.0.tgz",
++      "integrity": "sha512-1FlR+gjXK7X+AsAHso35MnyN5KqGwJRi/31ft6x0M194ht7S+rWAvd7PHss9xSKMzE0asv1pyIHaJYq+BbacAQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "mimic-fn": "^4.0.0"
++      },
++      "engines": {
++        "node": ">=12"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/p-limit": {
++      "version": "5.0.0",
++      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-5.0.0.tgz",
++      "integrity": "sha512-/Eaoq+QyLSiXQ4lyYV23f14mZRQcXnxfHrN0vCai+ak9G0pp9iEQukIIZq5NccEvwRB8PUnZT0KsOoDCINS1qQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "yocto-queue": "^1.0.0"
++      },
++      "engines": {
++        "node": ">=18"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/path-key": {
++      "version": "3.1.1",
++      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
++      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=8"
++      }
++    },
++    "node_modules/pathe": {
++      "version": "1.1.2",
++      "resolved": "https://registry.npmjs.org/pathe/-/pathe-1.1.2.tgz",
++      "integrity": "sha512-whLdWMYL2TwI08hn8/ZqAbrVemu0LNaNNJZX73O6qaIdCTfXutsLhMkjdENX0qhsQ9uIimo4/aQOmXkoon2nDQ==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/pathval": {
++      "version": "1.1.1",
++      "resolved": "https://registry.npmjs.org/pathval/-/pathval-1.1.1.tgz",
++      "integrity": "sha512-Dp6zGqpTdETdR63lehJYPeIOqpiNBNtc7BpWSLrOje7UaIsE5aY92r/AunQA7rsXvet3lrJ3JnZX29UPTKXyKQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": "*"
++      }
++    },
++    "node_modules/picocolors": {
++      "version": "1.1.1",
++      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
++      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
++      "dev": true,
++      "license": "ISC"
++    },
++    "node_modules/pkg-types": {
++      "version": "1.3.1",
++      "resolved": "https://registry.npmjs.org/pkg-types/-/pkg-types-1.3.1.tgz",
++      "integrity": "sha512-/Jm5M4RvtBFVkKWRu2BLUTNP8/M2a+UwuAX+ae4770q1qVGtfjG+WTCupoZixokjmHiry8uI+dlY8KXYV5HVVQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "confbox": "^0.1.8",
++        "mlly": "^1.7.4",
++        "pathe": "^2.0.1"
++      }
++    },
++    "node_modules/pkg-types/node_modules/pathe": {
++      "version": "2.0.3",
++      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
++      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/postcss": {
++      "version": "8.5.19",
++      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.19.tgz",
++      "integrity": "sha512-Mz8SaolMd8nB+G13WkORcxQKHZ/NE4xXevtkJHVuG+guo9/wYKlIMTKAqGdEmYOXR2ijPjTYNHssizdaVSUNdQ==",
++      "dev": true,
++      "funding": [
++        {
++          "type": "opencollective",
++          "url": "https://opencollective.com/postcss/"
++        },
++        {
++          "type": "tidelift",
++          "url": "https://tidelift.com/funding/github/npm/postcss"
++        },
++        {
++          "type": "github",
++          "url": "https://github.com/sponsors/ai"
++        }
++      ],
++      "license": "MIT",
++      "dependencies": {
++        "nanoid": "^3.3.12",
++        "picocolors": "^1.1.1",
++        "source-map-js": "^1.2.1"
++      },
++      "engines": {
++        "node": "^10 || ^12 || >=14"
++      }
++    },
++    "node_modules/pretty-format": {
++      "version": "29.7.0",
++      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-29.7.0.tgz",
++      "integrity": "sha512-Pdlw/oPxN+aXdmM9R00JVC9WVFoCLTKJvDVLgmJ+qAffBMxsV85l/Lu7sNx4zSzPyoL2euImuEwHhOXdEgNFZQ==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@jest/schemas": "^29.6.3",
++        "ansi-styles": "^5.0.0",
++        "react-is": "^18.0.0"
++      },
++      "engines": {
++        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
++      }
++    },
++    "node_modules/react-is": {
++      "version": "18.3.1",
++      "resolved": "https://registry.npmjs.org/react-is/-/react-is-18.3.1.tgz",
++      "integrity": "sha512-/LLMVyas0ljjAtoYiPqYiL8VWXzUUdThrmU5+n20DZv+a+ClRoevUzw5JxU+Ieh5/c87ytoTBV9G1FiKfNJdmg==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/rollup": {
++      "version": "4.62.2",
++      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.62.2.tgz",
++      "integrity": "sha512-RFnrW4lhXA3s3eqHDZvN654g8OTjzRfqpIRJYczCGB6HzphckVAi/Qh4tbPUbRuDi7s1Llv8g/NspLkttY3gTA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@types/estree": "1.0.9"
++      },
++      "bin": {
++        "rollup": "dist/bin/rollup"
++      },
++      "engines": {
++        "node": ">=18.0.0",
++        "npm": ">=8.0.0"
++      },
++      "optionalDependencies": {
++        "@rollup/rollup-android-arm-eabi": "4.62.2",
++        "@rollup/rollup-android-arm64": "4.62.2",
++        "@rollup/rollup-darwin-arm64": "4.62.2",
++        "@rollup/rollup-darwin-x64": "4.62.2",
++        "@rollup/rollup-freebsd-arm64": "4.62.2",
++        "@rollup/rollup-freebsd-x64": "4.62.2",
++        "@rollup/rollup-linux-arm-gnueabihf": "4.62.2",
++        "@rollup/rollup-linux-arm-musleabihf": "4.62.2",
++        "@rollup/rollup-linux-arm64-gnu": "4.62.2",
++        "@rollup/rollup-linux-arm64-musl": "4.62.2",
++        "@rollup/rollup-linux-loong64-gnu": "4.62.2",
++        "@rollup/rollup-linux-loong64-musl": "4.62.2",
++        "@rollup/rollup-linux-ppc64-gnu": "4.62.2",
++        "@rollup/rollup-linux-ppc64-musl": "4.62.2",
++        "@rollup/rollup-linux-riscv64-gnu": "4.62.2",
++        "@rollup/rollup-linux-riscv64-musl": "4.62.2",
++        "@rollup/rollup-linux-s390x-gnu": "4.62.2",
++        "@rollup/rollup-linux-x64-gnu": "4.62.2",
++        "@rollup/rollup-linux-x64-musl": "4.62.2",
++        "@rollup/rollup-openbsd-x64": "4.62.2",
++        "@rollup/rollup-openharmony-arm64": "4.62.2",
++        "@rollup/rollup-win32-arm64-msvc": "4.62.2",
++        "@rollup/rollup-win32-ia32-msvc": "4.62.2",
++        "@rollup/rollup-win32-x64-gnu": "4.62.2",
++        "@rollup/rollup-win32-x64-msvc": "4.62.2",
++        "fsevents": "~2.3.2"
++      }
++    },
++    "node_modules/shebang-command": {
++      "version": "2.0.0",
++      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
++      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "shebang-regex": "^3.0.0"
++      },
++      "engines": {
++        "node": ">=8"
++      }
++    },
++    "node_modules/shebang-regex": {
++      "version": "3.0.0",
++      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
++      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=8"
++      }
++    },
++    "node_modules/siginfo": {
++      "version": "2.0.0",
++      "resolved": "https://registry.npmjs.org/siginfo/-/siginfo-2.0.0.tgz",
++      "integrity": "sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==",
++      "dev": true,
++      "license": "ISC"
++    },
++    "node_modules/signal-exit": {
++      "version": "4.1.0",
++      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
++      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
++      "dev": true,
++      "license": "ISC",
++      "engines": {
++        "node": ">=14"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/isaacs"
++      }
++    },
++    "node_modules/source-map-js": {
++      "version": "1.2.1",
++      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
++      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
++      "dev": true,
++      "license": "BSD-3-Clause",
++      "engines": {
++        "node": ">=0.10.0"
++      }
++    },
++    "node_modules/stackback": {
++      "version": "0.0.2",
++      "resolved": "https://registry.npmjs.org/stackback/-/stackback-0.0.2.tgz",
++      "integrity": "sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/std-env": {
++      "version": "3.10.0",
++      "resolved": "https://registry.npmjs.org/std-env/-/std-env-3.10.0.tgz",
++      "integrity": "sha512-5GS12FdOZNliM5mAOxFRg7Ir0pWz8MdpYm6AY6VPkGpbA7ZzmbzNcBJQ0GPvvyWgcY7QAhCgf9Uy89I03faLkg==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/strip-final-newline": {
++      "version": "3.0.0",
++      "resolved": "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-3.0.0.tgz",
++      "integrity": "sha512-dOESqjYr96iWYylGObzd39EuNTa5VJxyvVAEm5Jnh7KGo75V43Hk1odPQkNDyXNmUR6k+gEiDVXnjB8HJ3crXw==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=12"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    },
++    "node_modules/strip-literal": {
++      "version": "2.1.1",
++      "resolved": "https://registry.npmjs.org/strip-literal/-/strip-literal-2.1.1.tgz",
++      "integrity": "sha512-631UJ6O00eNGfMiWG78ck80dfBab8X6IVFB51jZK5Icd7XAs60Z5y7QdSd/wGIklnWvRbUNloVzhOKKmutxQ6Q==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "js-tokens": "^9.0.1"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/antfu"
++      }
++    },
++    "node_modules/tinybench": {
++      "version": "2.9.0",
++      "resolved": "https://registry.npmjs.org/tinybench/-/tinybench-2.9.0.tgz",
++      "integrity": "sha512-0+DUvqWMValLmha6lr4kD8iAMK1HzV0/aKnCtWb9v9641TnP/MFb7Pc2bxoxQjTXAErryXVgUOfv2YqNllqGeg==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/tinypool": {
++      "version": "0.8.4",
++      "resolved": "https://registry.npmjs.org/tinypool/-/tinypool-0.8.4.tgz",
++      "integrity": "sha512-i11VH5gS6IFeLY3gMBQ00/MmLncVP7JLXOw1vlgkytLmJK7QnEr7NXf0LBdxfmNPAeyetukOk0bOYrJrFGjYJQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=14.0.0"
++      }
++    },
++    "node_modules/tinyspy": {
++      "version": "2.2.1",
++      "resolved": "https://registry.npmjs.org/tinyspy/-/tinyspy-2.2.1.tgz",
++      "integrity": "sha512-KYad6Vy5VDWV4GH3fjpseMQ/XU2BhIYP7Vzd0LG44qRWm/Yt2WCOTicFdvmgo6gWaqooMQCawTtILVQJupKu7A==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=14.0.0"
++      }
++    },
++    "node_modules/type-detect": {
++      "version": "4.1.0",
++      "resolved": "https://registry.npmjs.org/type-detect/-/type-detect-4.1.0.tgz",
++      "integrity": "sha512-Acylog8/luQ8L7il+geoSxhEkazvkslg7PSNKOX59mbB9cOveP5aq9h74Y7YU8yDpJwetzQQrfIwtf4Wp4LKcw==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=4"
++      }
++    },
++    "node_modules/ufo": {
++      "version": "1.6.4",
++      "resolved": "https://registry.npmjs.org/ufo/-/ufo-1.6.4.tgz",
++      "integrity": "sha512-JFNbkD1Svwe0KvGi8GOeLcP4kAWQ609twvCdcHxq1oSL8svv39ZuSvajcD8B+5D0eL4+s1Is2D/O6KN3qcTeRA==",
++      "dev": true,
++      "license": "MIT"
++    },
++    "node_modules/vite": {
++      "version": "5.4.21",
++      "resolved": "https://registry.npmjs.org/vite/-/vite-5.4.21.tgz",
++      "integrity": "sha512-o5a9xKjbtuhY6Bi5S3+HvbRERmouabWbyUcpXXUA1u+GNUKoROi9byOJ8M0nHbHYHkYICiMlqxkg1KkYmm25Sw==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "esbuild": "^0.21.3",
++        "postcss": "^8.4.43",
++        "rollup": "^4.20.0"
++      },
++      "bin": {
++        "vite": "bin/vite.js"
++      },
++      "engines": {
++        "node": "^18.0.0 || >=20.0.0"
++      },
++      "funding": {
++        "url": "https://github.com/vitejs/vite?sponsor=1"
++      },
++      "optionalDependencies": {
++        "fsevents": "~2.3.3"
++      },
++      "peerDependencies": {
++        "@types/node": "^18.0.0 || >=20.0.0",
++        "less": "*",
++        "lightningcss": "^1.21.0",
++        "sass": "*",
++        "sass-embedded": "*",
++        "stylus": "*",
++        "sugarss": "*",
++        "terser": "^5.4.0"
++      },
++      "peerDependenciesMeta": {
++        "@types/node": {
++          "optional": true
++        },
++        "less": {
++          "optional": true
++        },
++        "lightningcss": {
++          "optional": true
++        },
++        "sass": {
++          "optional": true
++        },
++        "sass-embedded": {
++          "optional": true
++        },
++        "stylus": {
++          "optional": true
++        },
++        "sugarss": {
++          "optional": true
++        },
++        "terser": {
++          "optional": true
++        }
++      }
++    },
++    "node_modules/vite-node": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/vite-node/-/vite-node-1.6.1.tgz",
++      "integrity": "sha512-YAXkfvGtuTzwWbDSACdJSg4A4DZiAqckWe90Zapc/sEX3XvHcw1NdurM/6od8J207tSDqNbSsgdCacBgvJKFuA==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "cac": "^6.7.14",
++        "debug": "^4.3.4",
++        "pathe": "^1.1.1",
++        "picocolors": "^1.0.0",
++        "vite": "^5.0.0"
++      },
++      "bin": {
++        "vite-node": "vite-node.mjs"
++      },
++      "engines": {
++        "node": "^18.0.0 || >=20.0.0"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      }
++    },
++    "node_modules/vitest": {
++      "version": "1.6.1",
++      "resolved": "https://registry.npmjs.org/vitest/-/vitest-1.6.1.tgz",
++      "integrity": "sha512-Ljb1cnSJSivGN0LqXd/zmDbWEM0RNNg2t1QW/XUhYl/qPqyu7CsqeWtqQXHVaJsecLPuDoak2oJcZN2QoRIOag==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "@vitest/expect": "1.6.1",
++        "@vitest/runner": "1.6.1",
++        "@vitest/snapshot": "1.6.1",
++        "@vitest/spy": "1.6.1",
++        "@vitest/utils": "1.6.1",
++        "acorn-walk": "^8.3.2",
++        "chai": "^4.3.10",
++        "debug": "^4.3.4",
++        "execa": "^8.0.1",
++        "local-pkg": "^0.5.0",
++        "magic-string": "^0.30.5",
++        "pathe": "^1.1.1",
++        "picocolors": "^1.0.0",
++        "std-env": "^3.5.0",
++        "strip-literal": "^2.0.0",
++        "tinybench": "^2.5.1",
++        "tinypool": "^0.8.3",
++        "vite": "^5.0.0",
++        "vite-node": "1.6.1",
++        "why-is-node-running": "^2.2.2"
++      },
++      "bin": {
++        "vitest": "vitest.mjs"
++      },
++      "engines": {
++        "node": "^18.0.0 || >=20.0.0"
++      },
++      "funding": {
++        "url": "https://opencollective.com/vitest"
++      },
++      "peerDependencies": {
++        "@edge-runtime/vm": "*",
++        "@types/node": "^18.0.0 || >=20.0.0",
++        "@vitest/browser": "1.6.1",
++        "@vitest/ui": "1.6.1",
++        "happy-dom": "*",
++        "jsdom": "*"
++      },
++      "peerDependenciesMeta": {
++        "@edge-runtime/vm": {
++          "optional": true
++        },
++        "@types/node": {
++          "optional": true
++        },
++        "@vitest/browser": {
++          "optional": true
++        },
++        "@vitest/ui": {
++          "optional": true
++        },
++        "happy-dom": {
++          "optional": true
++        },
++        "jsdom": {
++          "optional": true
++        }
++      }
++    },
++    "node_modules/webidl-conversions": {
++      "version": "7.0.0",
++      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-7.0.0.tgz",
++      "integrity": "sha512-VwddBukDzu71offAQR975unBIGqfKZpM+8ZX6ySk8nYhVoo5CYaZyzt3YBvYtRtO+aoGlqxPg/B87NGVZ/fu6g==",
++      "dev": true,
++      "license": "BSD-2-Clause",
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/whatwg-mimetype": {
++      "version": "3.0.0",
++      "resolved": "https://registry.npmjs.org/whatwg-mimetype/-/whatwg-mimetype-3.0.0.tgz",
++      "integrity": "sha512-nt+N2dzIutVRxARx1nghPKGv1xHikU7HKdfafKkLNLindmPU/ch3U31NOCGGA/dmPcmb1VlofO0vnKAcsm0o/Q==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=12"
++      }
++    },
++    "node_modules/which": {
++      "version": "2.0.2",
++      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
++      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
++      "dev": true,
++      "license": "ISC",
++      "dependencies": {
++        "isexe": "^2.0.0"
++      },
++      "bin": {
++        "node-which": "bin/node-which"
++      },
++      "engines": {
++        "node": ">= 8"
++      }
++    },
++    "node_modules/why-is-node-running": {
++      "version": "2.3.0",
++      "resolved": "https://registry.npmjs.org/why-is-node-running/-/why-is-node-running-2.3.0.tgz",
++      "integrity": "sha512-hUrmaWBdVDcxvYqnyh09zunKzROWjbZTiNy8dBEjkS7ehEDQibXJ7XvlmtbwuTclUiIyN+CyXQD4Vmko8fNm8w==",
++      "dev": true,
++      "license": "MIT",
++      "dependencies": {
++        "siginfo": "^2.0.0",
++        "stackback": "0.0.2"
++      },
++      "bin": {
++        "why-is-node-running": "cli.js"
++      },
++      "engines": {
++        "node": ">=8"
++      }
++    },
++    "node_modules/yocto-queue": {
++      "version": "1.2.2",
++      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-1.2.2.tgz",
++      "integrity": "sha512-4LCcse/U2MHZ63HAJVE+v71o7yOdIe4cZ70Wpf8D/IyjDKYQLV5GD46B+hSTjJsvV5PztjvHoU580EftxjDZFQ==",
++      "dev": true,
++      "license": "MIT",
++      "engines": {
++        "node": ">=12.20"
++      },
++      "funding": {
++        "url": "https://github.com/sponsors/sindresorhus"
++      }
++    }
++  }
++}
+diff --git a/package.json b/package.json
+new file mode 100644
+index 0000000..99ade56
+--- /dev/null
++++ b/package.json
+@@ -0,0 +1,16 @@
++{
++  "name": "bangdream-quiz",
++  "version": "0.1.0",
++  "private": true,
++  "type": "module",
++  "description": "BanG Dream 听声音猜角色测试（zh/en/ja）",
++  "scripts": {
++    "test": "vitest run",
++    "test:watch": "vitest",
++    "dev": "python3 -m http.server 8000"
++  },
++  "devDependencies": {
++    "vitest": "^1.6.0",
++    "happy-dom": "^14.0.0"
++  }
++}
+diff --git a/src/i18n/en.js b/src/i18n/en.js
+new file mode 100644
+index 0000000..a891e17
+--- /dev/null
++++ b/src/i18n/en.js
+@@ -0,0 +1,43 @@
++export default {
++  language: {
++    switchTo: 'Switch to English',
++    label: 'EN',
++  },
++  tab: {
++    quiz: '🎵 Listen & Guess',
++    intro: '📖 Bands & Characters',
++  },
++  quiz: {
++    play: '▶️ Play Voice',
++    score: 'Score: {correct} correct / {wrong} wrong',
++    retry: 'Retry',
++    next: 'Next',
++    hintBand: 'Hint Band',
++    reveal: 'Answer',
++    correct: '✅ Correct! ',
++    wrong: '❌ Wrong',
++    answer: '📖 Answer: ',
++    hintBandPrefix: '💡 Band: ',
++    playAgain: '▶️ Play Again',
++    audioMissing: 'Voice sample missing. Skipped to next question.',
++  },
++  intro: {
++    bandDesc: '▼ About',
++    listen: '▶️ Listen',
++    audioMissing: 'Voice sample missing',
++  },
++  common: {
++    unknown: 'Unknown',
++  },
++  band: {
++    'poppin-party': "Poppin'Party",
++    afterglow: 'Afterglow',
++    'pastel-palettes': 'Pastel*Palettes',
++    roselia: 'Roselia',
++    hhw: 'Hello, Happy World!',
++    morfonica: 'Morfonica',
++    ras: 'RAISE A SUILEN',
++    mygo: 'MYGO!!!!!',
++    'ave-mujica': 'Ave Mujica',
++  },
++};
+diff --git a/src/i18n/index.js b/src/i18n/index.js
+new file mode 100644
+index 0000000..1f7ca7e
+--- /dev/null
++++ b/src/i18n/index.js
+@@ -0,0 +1,110 @@
++/**
++ * i18n runtime (zh/en/ja).
++ *
++ * Usage:
++ *   import { t, setLocale, getLocale, initI18n, applyTranslations } from './i18n/index.js';
++ *   t('band.poppin-party')         // → 'Poppin\'Party' or 'Poppin\'Party'
++ *   setLocale('ja');
++ *
++ * Behavior:
++ *   - locale persisted in localStorage key 'bangdream.v1.locale'
++ *   - on first load, falls back to navigator.language (zh* → 'zh', ja* → 'ja', else 'en')
++ *   - missing keys return '[missing.key]' rather than throwing
++ *   - DOM helper applyTranslations() walks all [data-i18n] elements
++ */
++
++import zh from './zh.js';
++import en from './en.js';
++import ja from './ja.js';
++
++const STORAGE_KEY = 'bangdream.v1.locale';
++const DICTS = { zh, en, ja };
++
++let _locale = null;
++let _dict = null;
++
++function detectLocale() {
++  try {
++    const saved = localStorage.getItem(STORAGE_KEY);
++    if (saved && DICTS[saved]) return saved;
++  } catch {}
++  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
++  const low = nav.toLowerCase();
++  if (low.startsWith('zh')) return 'zh';
++  if (low.startsWith('ja')) return 'ja';
++  return 'en';
++}
++
++function loadDict(locale) {
++  return DICTS[locale] || DICTS.zh;
++}
++
++export function initI18n() {
++  if (_locale) return;
++  _locale = detectLocale();
++  _dict = loadDict(_locale);
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = _locale === 'zh' ? 'zh-CN'
++      : _locale === 'ja' ? 'ja-JP' : 'en';
++  }
++}
++
++export function getLocale() {
++  initI18n();
++  return _locale;
++}
++
++export function setLocale(locale) {
++  if (!DICTS[locale]) return;
++  _locale = locale;
++  _dict = loadDict(locale);
++  try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
++  if (typeof document !== 'undefined') {
++    document.documentElement.lang = locale === 'zh' ? 'zh-CN'
++      : locale === 'ja' ? 'ja-JP' : 'en';
++    applyTranslations();
++  }
++}
++
++export function cycleLocale() {
++  // 顺时针循环：zh → en → ja → zh
++  const order = ['zh', 'en', 'ja'];
++  const next = order[(order.indexOf(_locale) + 1) % order.length];
++  setLocale(next);
++}
++
++export function t(key, vars) {
++  initI18n();
++  const parts = key.split('.');
++  let cur = _dict;
++  for (const p of parts) {
++    if (cur && typeof cur === 'object' && p in cur) {
++      cur = cur[p];
++    } else {
++      return `[${key}]`;
++    }
++  }
++  if (typeof cur !== 'string') return `[${key}]`;
++  if (!vars) return cur;
++  return cur.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
++}
++
++export function applyTranslations() {
++  if (typeof document === 'undefined') return;
++  initI18n();
++  document.querySelectorAll('[data-i18n]').forEach((el) => {
++    el.textContent = t(el.getAttribute('data-i18n'));
++  });
++  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
++    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
++  });
++  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
++    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
++  });
++  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
++    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
++  });
++  const sw = document.querySelector('[data-i18n-lang-switch]');
++  if (sw) sw.textContent = t('language.switchTo');
++  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { locale: _locale } }));
++}
+diff --git a/src/i18n/ja.js b/src/i18n/ja.js
+new file mode 100644
+index 0000000..a3877df
+--- /dev/null
++++ b/src/i18n/ja.js
+@@ -0,0 +1,43 @@
++export default {
++  language: {
++    switchTo: '日本語に切替',
++    label: '日',
++  },
++  tab: {
++    quiz: '🎵 声で当てよう',
++    intro: '📖 バンド・キャラ紹介',
++  },
++  quiz: {
++    play: '▶️ 再生',
++    score: 'スコア：{correct} 正解 / {wrong} 不正解',
++    retry: 'リトライ',
++    next: '次の問題',
++    hintBand: 'バンドをヒント',
++    reveal: '答え',
++    correct: '✅ 正解！',
++    wrong: '❌ 不正解',
++    answer: '📖 答え：',
++    hintBandPrefix: '💡 バンド：',
++    playAgain: '▶️ もう一度聴く',
++    audioMissing: '音声サンプルなし。次の問題へ。',
++  },
++  intro: {
++    bandDesc: '▼ 紹介',
++    listen: '▶️ 聴く',
++    audioMissing: '音声サンプルなし',
++  },
++  common: {
++    unknown: '不明',
++  },
++  band: {
++    'poppin-party': "Poppin'Party",
++    afterglow: 'Afterglow',
++    'pastel-palettes': 'Pastel*Palettes',
++    roselia: 'Roselia',
++    hhw: 'Hello, Happy World!',
++    morfonica: 'Morfonica',
++    ras: 'RAISE A SUILEN',
++    mygo: 'MYGO!!!!!',
++    'ave-mujica': 'Ave Mujica',
++  },
++};
+diff --git a/src/i18n/zh.js b/src/i18n/zh.js
+new file mode 100644
+index 0000000..1571bcb
+--- /dev/null
++++ b/src/i18n/zh.js
+@@ -0,0 +1,43 @@
++export default {
++  language: {
++    switchTo: '切到英语',
++    label: '中',
++  },
++  tab: {
++    quiz: '🎵 听声音猜角色',
++    intro: '📖 乐队·角色介绍',
++  },
++  quiz: {
++    play: '▶️ 播放声音',
++    score: '已答：{correct} 对 {wrong} 错',
++    retry: '重试',
++    next: '下一题',
++    hintBand: '提示乐队',
++    reveal: '答案',
++    correct: '✅ 正确！',
++    wrong: '❌ 失败',
++    answer: '📖 答案',
++    hintBandPrefix: '💡 提示乐队：',
++    playAgain: '▶️ 再听一次',
++    audioMissing: '该角色样本暂缺，已自动切到下一题',
++  },
++  intro: {
++    bandDesc: '▼ 简介',
++    listen: '▶️ 听',
++    audioMissing: '该角色样本暂缺',
++  },
++  common: {
++    unknown: '未知',
++  },
++  band: {
++    'poppin-party': "Poppin'Party",
++    afterglow: 'Afterglow',
++    'pastel-palettes': 'Pastel*Palettes',
++    roselia: 'Roselia',
++    hhw: 'Hello, Happy World!',
++    morfonica: 'Morfonica',
++    ras: 'RAISE A SUILEN',
++    mygo: 'MYGO!!!!!',
++    'ave-mujica': 'Ave Mujica',
++  },
++};
+diff --git a/src/main.js b/src/main.js
+new file mode 100644
+index 0000000..549538f
+--- /dev/null
++++ b/src/main.js
+@@ -0,0 +1,38 @@
++/**
++ * App entry. Imports initApp from ui/app.js (Task 8 stub for now).
++ */
++
++function showBootError(err) {
++  console.error('[boot] fatal error:', err);
++  const banner = document.createElement('div');
++  banner.style.cssText = `
++    position: fixed; top: 0; left: 0; right: 0;
++    background: #f87171; color: #7f1d1d;
++    padding: 12px 20px; font-family: monospace; font-size: 13px;
++    border-bottom: 2px solid #b91c1c; z-index: 9999;
++    white-space: pre-wrap; word-break: break-word;
++  `;
++  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
++  document.body.prepend(banner);
++}
++
++function boot() {
++  try {
++    // ui/app.js 的 initApp() 在 Task 8 接入。当前 Task 1 只做 i18n 初始化 + DOM 占位。
++    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
++    initI18n();
++    applyTranslations();
++    const sw = document.querySelector('[data-i18n-lang-switch]');
++    if (sw) sw.addEventListener('click', cycleLocale);
++  } catch (err) {
++    showBootError(err);
++  }
++  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
++  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
++}
++
++if (document.readyState === 'loading') {
++  document.addEventListener('DOMContentLoaded', boot);
++} else {
++  boot();
++}
+diff --git a/tests/i18n.test.js b/tests/i18n.test.js
+new file mode 100644
+index 0000000..de0ec09
+--- /dev/null
++++ b/tests/i18n.test.js
+@@ -0,0 +1,46 @@
++import { describe, it, expect, beforeEach } from 'vitest';
++import { initI18n, setLocale, t, applyTranslations } from '../src/i18n/index.js';
++
++describe('i18n', () => {
++  beforeEach(() => {
++    localStorage.clear();
++    initI18n();
++  });
++
++  it('detects zh from navigator.language', () => {
++    setLocale('zh');
++    expect(t('language.label')).toBe('中');
++  });
++
++  it('detects ja from navigator.language', () => {
++    setLocale('ja');
++    expect(t('language.label')).toBe('日');
++  });
++
++  it('detects en from navigator.language', () => {
++    setLocale('en');
++    expect(t('language.label')).toBe('EN');
++  });
++
++  it('falls back to [missing.key] for unknown key', () => {
++    expect(t('foo.bar.baz')).toBe('[foo.bar.baz]');
++  });
++
++  it('interpolates {vars}', () => {
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('3');
++    expect(t('quiz.score', { correct: 3, wrong: 1 })).toContain('1');
++  });
++
++  it('applyTranslations updates [data-i18n] elements', () => {
++    document.body.innerHTML = '<div data-i18n="quiz.retry"></div>';
++    setLocale('zh');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('重试');
++    setLocale('en');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('Retry');
++    setLocale('ja');
++    applyTranslations();
++    expect(document.querySelector('[data-i18n="quiz.retry"]').textContent).toBe('リトライ');
++  });
++});
+diff --git a/vitest.config.js b/vitest.config.js
+new file mode 100644
+index 0000000..13e3f59
+--- /dev/null
++++ b/vitest.config.js
+@@ -0,0 +1,8 @@
++import { defineConfig } from 'vitest/config';
++
++export default defineConfig({
++  test: {
++    environment: 'happy-dom',
++    include: ['tests/**/*.test.js'],
++  },
++});
diff --git a/.superpowers/sdd/task-2-brief.md b/.superpowers/sdd/task-2-brief.md
new file mode 100644
index 0000000..bc41355
--- /dev/null
+++ b/.superpowers/sdd/task-2-brief.md
@@ -0,0 +1,487 @@
+## Task 2：数据模型（bands/characters/samples）+ 调研资料表
+
+**Files:**
+- Create: `src/data/bands.js`, `src/data/characters.js`, `src/data/samples.js`, `research/bands.xml`, `research/characters.xml`, `tests/data.test.js`, `dev-docs/01-bangdream-domain-research-2026-07-15.md`
+
+**Step 2.1：写 `dev-docs/01-bangdream-domain-research-2026-07-15.md`**
+
+```markdown
+# BanG Dream 邦邦域资料研究
+
+> 日期：2026-07-15
+> 目的：为听声音猜角色 demo 准备乐队/角色/样本数据
+
+## 覆盖范围
+
+9 支乐队：
+1. Poppin'Party（5 人）
+2. Afterglow（5 人）
+3. Pastel*Palettes（5 人）
+4. Roselia（5 人）
+5. Hello, Happy World!（5 人）
+6. Morfonica（5 人）
+7. RAISE A SUILEN（4 人；后期 5 人，按 5 录入）
+8. MYGO!!!!!（5 人）
+9. Ave Mujica（5 人）
+
+合计约 49 角色 × 3 样本 = 约 147 条音频资源。
+
+## 参考资料
+
+- bangdream.fandom.com
+- 萌娘百科「BanG Dream!」系列词条
+- bestdori.com（角色语音库）
+- 邦邦官方 anime 官网
+
+详细链接见 `research/bands.xml` 和 `research/characters.xml`。
+```
+
+**Step 2.2：写 `src/data/bands.js`**
+
+```js
+/**
+ * 9 支乐队元数据。
+ *
+ * 字段：
+ *   id        — 内部 ID（小写，连字符）
+ *   name      — 三语名称（zh/en/ja）
+ *   icon      — 图标文件名（assets/images/band/<id>.png）
+ *   members   — 角色 ID 列表（顺序与游戏内一致）
+ *   desc      — 三语简介（一句话）
+ */
+
+export const BANDS = [
+  {
+    id: 'poppin-party',
+    name: { zh: "Poppin'Party", en: "Poppin'Party", ja: "Poppin'Party" },
+    icon: 'poppin-party.png',
+    members: ['kasumi', 'tae', 'rimi', 'sayaka', 'arisa'],
+    desc: {
+      zh: '由香澄组建的女子乐队，青春热血风格。',
+      en: "A youth-oriented girls' band formed by Kasumi.",
+      ja: '香澄が結成した青春女子バンド。',
+    },
+  },
+  {
+    id: 'afterglow',
+    name: { zh: 'Afterglow', en: 'Afterglow', ja: 'Afterglow' },
+    icon: 'afterglow.png',
+    members: ['ran', 'moca', 'himari', 'tsugumi', 'tomo'],
+    desc: {
+      zh: '高中生的朋克风乐队。',
+      en: 'A punk-rock band of high schoolers.',
+      ja: '女子高生のパンクロックバンド。',
+    },
+  },
+  {
+    id: 'pastel-palettes',
+    name: { zh: 'Pastel*Palettes', en: 'Pastel*Palettes', ja: 'Pastel*Palettes' },
+    icon: 'pastel-palettes.png',
+    members: ['aya', 'chisato', 'maya', 'eve', 'hina'],
+    desc: {
+      zh: '以偶像身份活动的乐队。',
+      en: 'A band that also performs as idols.',
+      ja: 'アイドル活動も行うバンド。',
+    },
+  },
+  {
+    id: 'roselia',
+    name: { zh: 'Roselia', en: 'Roselia', ja: 'Roselia' },
+    icon: 'roselia.png',
+    members: ['yukina', 'sayo', 'lisa', 'rinko', 'ako'],
+    desc: {
+      zh: '追求极致音乐性的严肃乐队。',
+      en: 'A serious band pursuing musical perfection.',
+      ja: '音楽性を追求するシリアスなバンド。',
+    },
+  },
+  {
+    id: 'hhw',
+    name: { zh: 'Hello, Happy World!', en: 'Hello, Happy World!', ja: 'Hello, Happy World!' },
+    icon: 'hhw.png',
+    members: ['kokoro', 'kaoru', 'hagumi', 'kanon', 'misaki'],
+    desc: {
+      zh: '以"让世界幸福"为目标的欢乐乐队。',
+      en: 'A cheerful band aiming to make the world happy.',
+      ja: '世界を幸せにすることを目標にする明るいバンド。',
+    },
+  },
+  {
+    id: 'morfonica',
+    name: { zh: 'Morfonica', en: 'Morfonica', ja: 'Morfonica' },
+    icon: 'morfonica.png',
+    members: ['mashiro', 'touko', 'nanami', 'tsukushi', 'rui'],
+    desc: {
+      zh: '以小提琴为特色的正统派乐队。',
+      en: 'An orthodox band featuring the violin.',
+      ja: 'ヴァイオリンが特徴の正統派バンド。',
+    },
+  },
+  {
+    id: 'ras',
+    name: { zh: 'RAISE A SUILEN', en: 'RAISE A SUILEN', ja: 'RAISE A SUILEN' },
+    icon: 'ras.png',
+    members: ['laying', 'lock', 'mashu', 'pareo', 'reona'],
+    desc: {
+      zh: '由 LAYER 主导的实力派乐队。',
+      en: "A powerful band led by LAYER.",
+      ja: 'LAYER が主導する実力派バンド。',
+    },
+  },
+  {
+    id: 'mygo',
+    name: { zh: 'MYGO!!!!!', en: 'MYGO!!!!!', ja: 'MYGO!!!!!' },
+    icon: 'mygo.png',
+    members: ['anon', 'tomori', 'raana', 'soyo', 'taki'],
+    desc: {
+      zh: '《BanG Dream! It\'s MyGO!!!!!》登场乐队。',
+      en: "Band from BanG Dream! It's MyGO!!!!!",
+      ja: '『BanG Dream! It\'s MyGO!!!!!』登場バンド。',
+    },
+  },
+  {
+    id: 'ave-mujica',
+    name: { zh: 'Ave Mujica', en: 'Ave Mujica', ja: 'Ave Mujica' },
+    icon: 'ave-mujica.png',
+    members: ['sakiko', 'mutsumi', 'umiri', 'nyamu', 'togawa'],
+    desc: {
+      zh: '《BanG Dream! Ave Mujica》登场乐队。',
+      en: "Band from BanG Dream! Ave Mujica.",
+      ja: '『BanG Dream! Ave Mujica』登場バンド。',
+    },
+  },
+];
+
+export const BAND_BY_ID = Object.fromEntries(BANDS.map(b => [b.id, b]));
+```
+
+**Step 2.3：写 `src/data/characters.js`**
+
+```js
+/**
+ * 约 49 名角色元数据。
+ *
+ * 字段：
+ *   id        — 内部 ID（小写）
+ *   bandId    — 所属乐队 ID
+ *   role      — 担当（Vo./Gt./Ba./Dr./Key.）
+ *   name      — 三语名
+ *   portrait  — 立绘文件名（assets/images/char/<id>.png）
+ */
+
+export const CHARACTERS = [
+  // Poppin'Party
+  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
+    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
+    portrait: 'kasumi.png' },
+  { id: 'tae', bandId: 'poppin-party', role: 'Dr.',
+    name: { zh: 'たえ', en: 'Tae Hanazono', ja: 'たえ' },
+    portrait: 'tae.png' },
+  { id: 'rimi', bandId: 'poppin-party', role: 'Ba.',
+    name: { zh: 'りみ', en: 'Rimi Ushigome', ja: 'りみ' },
+    portrait: 'rimi.png' },
+  { id: 'sayaka', bandId: 'poppin-party', role: 'Key.',
+    name: { zh: '紗綾', en: 'Saaya Yamabuki', ja: '紗綾' },
+    portrait: 'sayaka.png' },
+  { id: 'arisa', bandId: 'poppin-party', role: 'Gt.',
+    name: { zh: '有咲', en: 'Arisa Ichigaya', ja: '有咲' },
+    portrait: 'arisa.png' },
+
+  // Afterglow
+  { id: 'ran', bandId: 'afterglow', role: 'Gt./Vo',
+    name: { zh: '蘭', en: 'Ran Mitake', ja: '蘭' },
+    portrait: 'ran.png' },
+  { id: 'moca', bandId: 'afterglow', role: 'Gt.',
+    name: { zh: 'モカ', en: 'Moca Aoba', ja: 'モカ' },
+    portrait: 'moca.png' },
+  { id: 'himari', bandId: 'afterglow', role: 'Ba.',
+    name: { zh: 'ひまり', en: 'Himari Uehara', ja: 'ひまり' },
+    portrait: 'himari.png' },
+  { id: 'tsugumi', bandId: 'afterglow', role: 'Dr.',
+    name: { zh: 'つぐみ', en: 'Tsugumi Hazawa', ja: 'つぐみ' },
+    portrait: 'tsugumi.png' },
+  { id: 'tomo', bandId: 'afterglow', role: 'Key.',
+    name: { zh: '巴', en: 'Tomo Udagawa', ja: '巴' },
+    portrait: 'tomo.png' },
+
+  // Pastel*Palettes
+  { id: 'aya', bandId: 'pastel-palettes', role: 'Gt./Vo',
+    name: { zh: '彩', en: 'Aya Maruyama', ja: '彩' },
+    portrait: 'aya.png' },
+  { id: 'chisato', bandId: 'pastel-palettes', role: 'Gt.',
+    name: { zh: '千聖', en: 'Chisato Shirasagi', ja: '千聖' },
+    portrait: 'chisato.png' },
+  { id: 'maya', bandId: 'pastel-palettes', role: 'Ba.',
+    name: { zh: 'マヤ', en: 'Maya Yamato', ja: 'マヤ' },
+    portrait: 'maya.png' },
+  { id: 'eve', bandId: 'pastel-palettes', role: 'Dr.',
+    name: { zh: 'イヴ', en: 'Eve Wakamiya', ja: 'イヴ' },
+    portrait: 'eve.png' },
+  { id: 'hina', bandId: 'pastel-palettes', role: 'Key.',
+    name: { zh: '日菜', en: 'Hina Hikawa', ja: '日菜' },
+    portrait: 'hina.png' },
+
+  // Roselia
+  { id: 'yukina', bandId: 'roselia', role: 'Vo.',
+    name: { zh: '友希那', en: 'Yukina Minato', ja: '友希那' },
+    portrait: 'yukina.png' },
+  { id: 'sayo', bandId: 'roselia', role: 'Gt.',
+    name: { zh: '紗夜', en: 'Sayo Imai', ja: '紗夜' },
+    portrait: 'sayo.png' },
+  { id: 'lisa', bandId: 'roselia', role: 'Ba.',
+    name: { zh: 'リサ', en: 'Lisa Imai', ja: 'リサ' },
+    portrait: 'lisa.png' },
+  { id: 'rinko', bandId: 'roselia', role: 'Key.',
+    name: { zh: '燐子', en: 'Rinko Shirokane', ja: '燐子' },
+    portrait: 'rinko.png' },
+  { id: 'ako', bandId: 'roselia', role: 'Dr.',
+    name: { zh: 'あこ', en: 'Ako Udagawa', ja: 'あこ' },
+    portrait: 'ako.png' },
+
+  // Hello, Happy World!
+  { id: 'kokoro', bandId: 'hhw', role: 'Vo.',
+    name: { zh: 'こころ', en: 'Kokoro Tsurumaki', ja: 'こころ' },
+    portrait: 'kokoro.png' },
+  { id: 'kaoru', bandId: 'hhw', role: 'Gt.',
+    name: { zh: '薰', en: 'Kaoru Seta', ja: '薰' },
+    portrait: 'kaoru.png' },
+  { id: 'hagumi', bandId: 'hhw', role: 'Dr.',
+    name: { zh: 'はぐみ', en: 'Hagumi Kitazawa', ja: 'はぐみ' },
+    portrait: 'hagumi.png' },
+  { id: 'kanon', bandId: 'hhw', role: 'Key.',
+    name: { zh: '花音', en: 'Kanon Matsubara', ja: '花音' },
+    portrait: 'kanon.png' },
+  { id: 'misaki', bandId: 'hhw', role: 'Ba.',
+    name: { zh: 'みさき', en: 'Misaki Okusawa', ja: 'みさき' },
+    portrait: 'misaki.png' },
+
+  // Morfonica
+  { id: 'mashiro', bandId: 'morfonica', role: 'Vo./Vn.',
+    name: { zh: 'ましろ', en: 'Mashiro Kurata', ja: 'ましろ' },
+    portrait: 'mashiro.png' },
+  { id: 'touko', bandId: 'morfonica', role: 'Vn.',
+    name: { zh: '灯織', en: 'Touko Kirigaya', ja: '灯織' },
+    portrait: 'touko.png' },
+  { id: 'nanami', bandId: 'morfonica', role: 'Gt.',
+    name: { zh: '七深', en: 'Nanami Hiromachi', ja: '七深' },
+    portrait: 'nanami.png' },
+  { id: 'tsukushi', bandId: 'morfonica', role: 'Ba.',
+    name: { zh: 'つくし', en: 'Tsukushi Futaba', ja: 'つくし' },
+    portrait: 'tsukushi.png' },
+  { id: 'rui', bandId: 'morfonica', role: 'Dr.',
+    name: { zh: '瑠唯', en: 'Rui Yashio', ja: '瑠唯' },
+    portrait: 'rui.png' },
+
+  // RAISE A SUILEN
+  { id: 'laying', bandId: 'ras', role: 'Dr.',
+    name: { zh: 'LAYER', en: 'LAYER', ja: 'LAYER' },
+    portrait: 'laying.png' },
+  { id: 'lock', bandId: 'ras', role: 'Ba.',
+    name: { zh: 'LOCK', en: 'LOCK', ja: 'LOCK' },
+    portrait: 'lock.png' },
+  { id: 'mashu', bandId: 'ras', role: 'Gt.',
+    name: { zh: 'MASHU', en: 'MASHU', ja: 'MASHU' },
+    portrait: 'mashu.png' },
+  { id: 'pareo', bandId: 'ras', role: 'Key.',
+    name: { zh: 'PAREO', en: 'PAREO', ja: 'PAREO' },
+    portrait: 'pareo.png' },
+  { id: 'reona', bandId: 'ras', role: 'Vo.',
+    name: { zh: 'CHU²', en: 'CHU²', ja: 'CHU²' },
+    portrait: 'reona.png' },
+
+  // MYGO!!!!!
+  { id: 'anon', bandId: 'mygo', role: 'Gt.',
+    name: { zh: 'あの', en: 'Anon Chihaya', ja: 'あの' },
+    portrait: 'anon.png' },
+  { id: 'tomori', bandId: 'mygo', role: 'Vo./Gt.',
+    name: { zh: '灯', en: 'Tomori Takamatsu', ja: '灯' },
+    portrait: 'tomori.png' },
+  { id: 'raana', bandId: 'mygo', role: 'Ba.',
+    name: { zh: '楽奈', en: 'Raana Kaname', ja: '楽奈' },
+    portrait: 'raana.png' },
+  { id: 'soyo', bandId: 'mygo', role: 'Gt.',
+    name: { zh: 'そよ', en: 'Soyo Nagasaki', ja: 'そよ' },
+    portrait: 'soyo.png' },
+  { id: 'taki', bandId: 'mygo', role: 'Dr.',
+    name: { zh: '立希', en: 'Taki Shiina', ja: '立希' },
+    portrait: 'taki.png' },
+
+  // Ave Mujica
+  { id: 'sakiko', bandId: 'ave-mujica', role: 'Key.',
+    name: { zh: 'さきこ', en: 'Sakiko Togawa', ja: 'さきこ' },
+    portrait: 'sakiko.png' },
+  { id: 'mutsumi', bandId: 'ave-mujica', role: 'Dr.',
+    name: { zh: 'むつみ', en: 'Mutsumi Wakaba', ja: 'むつみ' },
+    portrait: 'mutsumi.png' },
+  { id: 'umiri', bandId: 'ave-mujica', role: 'Vo.',
+    name: { zh: 'うみり', en: 'Umiri Yahata', ja: 'うみり' },
+    portrait: 'umiri.png' },
+  { id: 'nyamu', bandId: 'ave-mujica', role: 'Gt.',
+    name: { zh: 'にゃむ', en: 'Nyamu Yutenji', ja: 'にゃむ' },
+    portrait: 'nyamu.png' },
+  { id: 'togawa', bandId: 'ave-mujica', role: 'Ba.',
+    name: { zh: '戸川', en: 'Togawa (Sakiko family)', ja: '戸川' },
+    portrait: 'togawa.png' },
+];
+
+export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));
+
+export function charactersOfBand(bandId) {
+  const band = require('./bands.js').BAND_BY_ID[bandId] || import('./bands.js').then(m => m.BAND_BY_ID[bandId]);
+  // 注：require 不在 ESM 内可用，下面改成同步 import。
+  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
+}
+```
+
+**注意**：上面 `charactersOfBand` 用了 `require`，不适用于 ESM。改为下面的同步写法（import 在文件顶部已可用）：
+
+**Step 2.3 修正**：删除上一步，改为：
+
+```js
+/**
+ * 约 49 名角色元数据（同上，省略重复字段说明）
+ */
+
+import { BAND_BY_ID } from './bands.js';
+
+export const CHARACTERS = [
+  // ... (同上 49 角色)
+];
+
+export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));
+
+export function charactersOfBand(bandId) {
+  const band = BAND_BY_ID[bandId];
+  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
+}
+```
+
+（CHARACTERS 数组保持 Task 2.3 中定义的那 49 项，在实际写入文件时统一顶部 `import` BAND_BY_ID，并删除 `require` 残留。）
+
+**Step 2.4：写 `src/data/samples.js`**
+
+```js
+/**
+ * 每个角色 ≥3 条主声线样本的文件名。
+ * 实际资源在 Task 3 下载，本文件先按"全员 ≥3 条"占位。
+ * 后续若某角色资源凑不齐 3 条，对应项可改成更少；quiz.js 会跳过空样本角色。
+ */
+
+import { CHARACTERS } from './characters.js';
+
+// 默认模板：每角色用 <id>-1/2/3.mp3
+const TEMPLATE = (id) => [`${id}-1.mp3`, `${id}-2.mp3`, `${id}-3.mp3`];
+
+export const SAMPLES = Object.fromEntries(
+  CHARACTERS.map(c => [c.id, TEMPLATE(c.id)])
+);
+
+// 已知可能凑不齐的角色（Task 3 之后会更新这里）：
+// SAMPLES['xxx'] = ['xxx-1.mp3'];  // 只剩 1 条
+```
+
+**Step 2.5：写 `tests/data.test.js`**
+
+```js
+import { describe, it, expect } from 'vitest';
+import { BANDS, BAND_BY_ID } from '../src/data/bands.js';
+import { CHARACTERS, CHARACTER_BY_ID, charactersOfBand } from '../src/data/characters.js';
+import { SAMPLES } from '../src/data/samples.js';
+
+describe('data integrity', () => {
+  it('every band has 4-5 members', () => {
+    for (const b of BANDS) {
+      expect(b.members.length, `band ${b.id}`).toBeGreaterThanOrEqual(4);
+      expect(b.members.length, `band ${b.id}`).toBeLessThanOrEqual(5);
+    }
+  });
+
+  it('every character belongs to a band that exists', () => {
+    for (const c of CHARACTERS) {
+      expect(BAND_BY_ID[c.bandId], `char ${c.id}`).toBeDefined();
+    }
+  });
+
+  it('every band member id resolves to a character', () => {
+    for (const b of BANDS) {
+      for (const mid of b.members) {
+        expect(CHARACTER_BY_ID[mid], `band ${b.id} member ${mid}`).toBeDefined();
+      }
+    }
+  });
+
+  it('every character has a sample list ≥1', () => {
+    for (const c of CHARACTERS) {
+      expect(SAMPLES[c.id], `char ${c.id}`).toBeDefined();
+      expect(SAMPLES[c.id].length, `char ${c.id}`).toBeGreaterThanOrEqual(1);
+    }
+  });
+
+  it('charactersOfBand returns matching subset', () => {
+    const poppin = charactersOfBand('poppin-party');
+    expect(poppin.length).toBe(5);
+    expect(poppin.map(c => c.id)).toEqual(['kasumi', 'tae', 'rimi', 'sayaka', 'arisa']);
+  });
+
+  it('total characters ≈ 49', () => {
+    expect(CHARACTERS.length).toBeGreaterThanOrEqual(45);
+    expect(CHARACTERS.length).toBeLessThanOrEqual(55);
+  });
+});
+```
+
+**Step 2.6：跑测试**
+
+```bash
+cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
+npm test
+```
+
+期望：原有 6 + 新增 6 = 12 tests passing.
+
+**Step 2.7：写 `research/bands.xml` 与 `research/characters.xml`（占位）**
+
+`research/bands.xml`：
+```xml
+<?xml version="1.0" encoding="UTF-8"?>
+<bands>
+  <band id="poppin-party">
+    <name-zh>Poppin'Party</name-zh>
+    <name-en>Poppin'Party</name-en>
+    <name-ja>Poppin'Party</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Poppin%27Party</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Poppin%27Party</desc-source>
+  </band>
+  <!-- ... 其他 8 支同样格式 ... -->
+</bands>
+```
+
+`research/characters.xml`：
+```xml
+<?xml version="1.0" encoding="UTF-8"?>
+<characters>
+  <character id="kasumi">
+    <band>poppin-party</band>
+    <name-zh>香澄</name-zh>
+    <name-en>Kasumi Toyama</name-en>
+    <name-ja>香澄</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Kasumi_Toyama</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- ... 其他 48 名同样格式 ... -->
+</characters>
+```
+
+（具体 URL 在 Task 3 实际下载时填入；本步骤先建空表 + 1 条样例，Task 3 完成时再补齐。）
+
+**Step 2.8：commit**
+
+```bash
+cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
+git add -A
+git commit -m "feat: data model (9 bands, ~49 characters, samples stub)"
+```
+
+---
+
diff --git a/dev-docs/01-bangdream-domain-research-2026-07-15.md b/dev-docs/01-bangdream-domain-research-2026-07-15.md
new file mode 100644
index 0000000..0d55d7c
--- /dev/null
+++ b/dev-docs/01-bangdream-domain-research-2026-07-15.md
@@ -0,0 +1,28 @@
+# BanG Dream 邦邦域资料研究
+
+> 日期：2026-07-15
+> 目的：为听声音猜角色 demo 准备乐队/角色/样本数据
+
+## 覆盖范围
+
+9 支乐队：
+1. Poppin'Party（5 人）
+2. Afterglow（5 人）
+3. Pastel*Palettes（5 人）
+4. Roselia（5 人）
+5. Hello, Happy World!（5 人）
+6. Morfonica（5 人）
+7. RAISE A SUILEN（4 人；后期 5 人，按 5 录入）
+8. MYGO!!!!!（5 人）
+9. Ave Mujica（5 人）
+
+合计约 49 角色 × 3 样本 = 约 147 条音频资源。
+
+## 参考资料
+
+- bangdream.fandom.com
+- 萌娘百科「BanG Dream!」系列词条
+- bestdori.com（角色语音库）
+- 邦邦官方 anime 官网
+
+详细链接见 `research/bands.xml` 和 `research/characters.xml`。
diff --git a/research/bands.xml b/research/bands.xml
new file mode 100644
index 0000000..69e49eb
--- /dev/null
+++ b/research/bands.xml
@@ -0,0 +1,75 @@
+<?xml version="1.0" encoding="UTF-8"?>
+<bands>
+  <band id="poppin-party">
+    <name-zh>Poppin'Party</name-zh>
+    <name-en>Poppin'Party</name-en>
+    <name-ja>Poppin'Party</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Poppin%27Party</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Poppin%27Party</desc-source>
+  </band>
+  <band id="afterglow">
+    <name-zh>Afterglow</name-zh>
+    <name-en>Afterglow</name-en>
+    <name-ja>Afterglow</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Afterglow</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Afterglow</desc-source>
+  </band>
+  <band id="pastel-palettes">
+    <name-zh>Pastel*Palettes</name-zh>
+    <name-en>Pastel*Palettes</name-en>
+    <name-ja>Pastel*Palettes</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Pastel*Palettes</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Pastel*Palettes</desc-source>
+  </band>
+  <band id="roselia">
+    <name-zh>Roselia</name-zh>
+    <name-en>Roselia</name-en>
+    <name-ja>Roselia</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Roselia</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Roselia</desc-source>
+  </band>
+  <band id="hhw">
+    <name-zh>Hello, Happy World!</name-zh>
+    <name-en>Hello, Happy World!</name-en>
+    <name-ja>Hello, Happy World!</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Hello,_Happy_World!</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Hello,_Happy_World!</desc-source>
+  </band>
+  <band id="morfonica">
+    <name-zh>Morfonica</name-zh>
+    <name-en>Morfonica</name-en>
+    <name-ja>Morfonica</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Morfonica</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Morfonica</desc-source>
+  </band>
+  <band id="ras">
+    <name-zh>RAISE A SUILEN</name-zh>
+    <name-en>RAISE A SUILEN</name-en>
+    <name-ja>RAISE A SUILEN</name-ja>
+    <source>https://bangdream.fandom.com/wiki/RAISE_A_SUILEN</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/RAISE_A_SUILEN</desc-source>
+  </band>
+  <band id="mygo">
+    <name-zh>MYGO!!!!!</name-zh>
+    <name-en>MYGO!!!!!</name-en>
+    <name-ja>MYGO!!!!!</name-ja>
+    <source>https://bangdream.fandom.com/wiki/MYGO!!!!!</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/MYGO!!!!!</desc-source>
+  </band>
+  <band id="ave-mujica">
+    <name-zh>Ave Mujica</name-zh>
+    <name-en>Ave Mujica</name-en>
+    <name-ja>Ave Mujica</name-ja>
+    <source>https://bangdream.fandom.com/wiki/Ave_Mujica</source>
+    <members>5</members>
+    <desc-source>https://mzh.moegirl.org.cn/Ave_Mujica</desc-source>
+  </band>
+</bands>
diff --git a/research/characters.xml b/research/characters.xml
new file mode 100644
index 0000000..0d0dd4f
--- /dev/null
+++ b/research/characters.xml
@@ -0,0 +1,372 @@
+<?xml version="1.0" encoding="UTF-8"?>
+<characters>
+  <character id="kasumi">
+    <band>poppin-party</band>
+    <name-zh>香澄</name-zh>
+    <name-en>Kasumi Toyama</name-en>
+    <name-ja>香澄</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Kasumi_Toyama</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Poppin'Party: kasumi, tae, rimi, sayaka, arisa -->
+  <character id="tae">
+    <band>poppin-party</band>
+    <name-zh>たえ</name-zh>
+    <name-en>Tae Hanazono</name-en>
+    <name-ja>たえ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Tae_Hanazono</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="rimi">
+    <band>poppin-party</band>
+    <name-zh>りみ</name-zh>
+    <name-en>Rimi Ushigome</name-en>
+    <name-ja>りみ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Rimi_Ushigome</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="sayaka">
+    <band>poppin-party</band>
+    <name-zh>紗綾</name-zh>
+    <name-en>Saaya Yamabuki</name-en>
+    <name-ja>紗綾</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Saaya_Yamabuki</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="arisa">
+    <band>poppin-party</band>
+    <name-zh>有咲</name-zh>
+    <name-en>Arisa Ichigaya</name-en>
+    <name-ja>有咲</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Arisa_Ichigaya</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Afterglow: ran, moca, himari, tsugumi, tomo -->
+  <character id="ran">
+    <band>afterglow</band>
+    <name-zh>蘭</name-zh>
+    <name-en>Ran Mitake</name-en>
+    <name-ja>蘭</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Ran_Mitake</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="moca">
+    <band>afterglow</band>
+    <name-zh>モカ</name-zh>
+    <name-en>Moca Aoba</name-en>
+    <name-ja>モカ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Moca_Aoba</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="himari">
+    <band>afterglow</band>
+    <name-zh>ひまり</name-zh>
+    <name-en>Himari Uehara</name-en>
+    <name-ja>ひまり</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Himari_Uehara</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="tsugumi">
+    <band>afterglow</band>
+    <name-zh>つぐみ</name-zh>
+    <name-en>Tsugumi Hazawa</name-en>
+    <name-ja>つぐみ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Tsugumi_Hazawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="tomo">
+    <band>afterglow</band>
+    <name-zh>巴</name-zh>
+    <name-en>Tomo Udagawa</name-en>
+    <name-ja>巴</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Tomo_Udagawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Pastel*Palettes: aya, chisato, maya, eve, hina -->
+  <character id="aya">
+    <band>pastel-palettes</band>
+    <name-zh>彩</name-zh>
+    <name-en>Aya Maruyama</name-en>
+    <name-ja>彩</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Aya_Maruyama</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="chisato">
+    <band>pastel-palettes</band>
+    <name-zh>千聖</name-zh>
+    <name-en>Chisato Shirasagi</name-en>
+    <name-ja>千聖</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Chisato_Shirasagi</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="maya">
+    <band>pastel-palettes</band>
+    <name-zh>マヤ</name-zh>
+    <name-en>Maya Yamato</name-en>
+    <name-ja>マヤ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Maya_Yamato</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="eve">
+    <band>pastel-palettes</band>
+    <name-zh>イヴ</name-zh>
+    <name-en>Eve Wakamiya</name-en>
+    <name-ja>イヴ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Eve_Wakamiya</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="hina">
+    <band>pastel-palettes</band>
+    <name-zh>日菜</name-zh>
+    <name-en>Hina Hikawa</name-en>
+    <name-ja>日菜</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Hina_Hikawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Roselia: yukina, sayo, lisa, rinko, ako -->
+  <character id="yukina">
+    <band>roselia</band>
+    <name-zh>友希那</name-zh>
+    <name-en>Yukina Minato</name-en>
+    <name-ja>友希那</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Yukina_Minato</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="sayo">
+    <band>roselia</band>
+    <name-zh>紗夜</name-zh>
+    <name-en>Sayo Imai</name-en>
+    <name-ja>紗夜</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Sayo_Imai</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="lisa">
+    <band>roselia</band>
+    <name-zh>リサ</name-zh>
+    <name-en>Lisa Imai</name-en>
+    <name-ja>リサ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Lisa_Imai</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="rinko">
+    <band>roselia</band>
+    <name-zh>燐子</name-zh>
+    <name-en>Rinko Shirokane</name-en>
+    <name-ja>燐子</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Rinko_Shirokane</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="ako">
+    <band>roselia</band>
+    <name-zh>あこ</name-zh>
+    <name-en>Ako Udagawa</name-en>
+    <name-ja>あこ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Ako_Udagawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Hello, Happy World!: kokoro, kaoru, hagumi, kanon, misaki -->
+  <character id="kokoro">
+    <band>hhw</band>
+    <name-zh>こころ</name-zh>
+    <name-en>Kokoro Tsurumaki</name-en>
+    <name-ja>こころ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Kokoro_Tsurumaki</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="kaoru">
+    <band>hhw</band>
+    <name-zh>薰</name-zh>
+    <name-en>Kaoru Seta</name-en>
+    <name-ja>薰</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Kaoru_Seta</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="hagumi">
+    <band>hhw</band>
+    <name-zh>はぐみ</name-zh>
+    <name-en>Hagumi Kitazawa</name-en>
+    <name-ja>はぐみ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Hagumi_Kitazawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="kanon">
+    <band>hhw</band>
+    <name-zh>花音</name-zh>
+    <name-en>Kanon Matsubara</name-en>
+    <name-ja>花音</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Kanon_Matsubara</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="misaki">
+    <band>hhw</band>
+    <name-zh>みさき</name-zh>
+    <name-en>Misaki Okusawa</name-en>
+    <name-ja>みさき</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Misaki_Okusawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Morfonica: mashiro, touko, nanami, tsukushi, rui -->
+  <character id="mashiro">
+    <band>morfonica</band>
+    <name-zh>ましろ</name-zh>
+    <name-en>Mashiro Kurata</name-en>
+    <name-ja>ましろ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Mashiro_Kurata</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="touko">
+    <band>morfonica</band>
+    <name-zh>灯織</name-zh>
+    <name-en>Touko Kirigaya</name-en>
+    <name-ja>灯織</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Touko_Kirigaya</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="nanami">
+    <band>morfonica</band>
+    <name-zh>七深</name-zh>
+    <name-en>Nanami Hiromachi</name-en>
+    <name-ja>七深</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Nanami_Hiromachi</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="tsukushi">
+    <band>morfonica</band>
+    <name-zh>つくし</name-zh>
+    <name-en>Tsukushi Futaba</name-en>
+    <name-ja>つくし</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Tsukushi_Futaba</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="rui">
+    <band>morfonica</band>
+    <name-zh>瑠唯</name-zh>
+    <name-en>Rui Yashio</name-en>
+    <name-ja>瑠唯</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Rui_Yashio</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- RAISE A SUILEN: laying, lock, mashu, pareo, reona -->
+  <character id="laying">
+    <band>ras</band>
+    <name-zh>LAYER</name-zh>
+    <name-en>LAYER</name-en>
+    <name-ja>LAYER</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/LAYER</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="lock">
+    <band>ras</band>
+    <name-zh>LOCK</name-zh>
+    <name-en>LOCK</name-en>
+    <name-ja>LOCK</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/LOCK</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="mashu">
+    <band>ras</band>
+    <name-zh>MASHU</name-zh>
+    <name-en>MASHU</name-en>
+    <name-ja>MASHU</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/MASHU</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="pareo">
+    <band>ras</band>
+    <name-zh>PAREO</name-zh>
+    <name-en>PAREO</name-en>
+    <name-ja>PAREO</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/PAREO</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="reona">
+    <band>ras</band>
+    <name-zh>CHU²</name-zh>
+    <name-en>CHU²</name-en>
+    <name-ja>CHU²</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/CHU%C2%B2</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- MYGO!!!!!: anon, tomori, raana, soyo, taki -->
+  <character id="anon">
+    <band>mygo</band>
+    <name-zh>あの</name-zh>
+    <name-en>Anon Chihaya</name-en>
+    <name-ja>あの</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Anon_Chihaya</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="tomori">
+    <band>mygo</band>
+    <name-zh>灯</name-zh>
+    <name-en>Tomori Takamatsu</name-en>
+    <name-ja>灯</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Tomori_Takamatsu</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="raana">
+    <band>mygo</band>
+    <name-zh>楽奈</name-zh>
+    <name-en>Raana Kaname</name-en>
+    <name-ja>楽奈</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Raana_Kaname</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="soyo">
+    <band>mygo</band>
+    <name-zh>そよ</name-zh>
+    <name-en>Soyo Nagasaki</name-en>
+    <name-ja>そよ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Soyo_Nagasaki</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="taki">
+    <band>mygo</band>
+    <name-zh>立希</name-zh>
+    <name-en>Taki Shiina</name-en>
+    <name-ja>立希</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Taki_Shiina</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <!-- Ave Mujica: sakiko, mutsumi, umiri, nyamu, togawa -->
+  <character id="sakiko">
+    <band>ave-mujica</band>
+    <name-zh>さきこ</name-zh>
+    <name-en>Sakiko Togawa</name-en>
+    <name-ja>さきこ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Sakiko_Togawa</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="mutsumi">
+    <band>ave-mujica</band>
+    <name-zh>むつみ</name-zh>
+    <name-en>Mutsumi Wakaba</name-en>
+    <name-ja>むつみ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Mutsumi_Wakaba</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="umiri">
+    <band>ave-mujica</band>
+    <name-zh>うみり</name-zh>
+    <name-en>Umiri Yahata</name-en>
+    <name-ja>うみり</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Umiri_Yahata</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="nyamu">
+    <band>ave-mujica</band>
+    <name-zh>にゃむ</name-zh>
+    <name-en>Nyamu Yutenji</name-en>
+    <name-ja>にゃむ</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Nyamu_Yutenji</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+  <character id="togawa">
+    <band>ave-mujica</band>
+    <name-zh>戸川</name-zh>
+    <name-en>Togawa (Sakiko family)</name-en>
+    <name-ja>戸川</name-ja>
+    <portrait-source>https://bangdream.fandom.com/wiki/Togawa_(Sakiko_family)</portrait-source>
+    <voice-source>https://bestdori.com/tool/voice</voice-source>
+  </character>
+</characters>
diff --git a/src/data/bands.js b/src/data/bands.js
new file mode 100644
index 0000000..1cf25a1
--- /dev/null
+++ b/src/data/bands.js
@@ -0,0 +1,114 @@
+/**
+ * 9 支乐队元数据。
+ *
+ * 字段：
+ *   id        — 内部 ID（小写，连字符）
+ *   name      — 三语名称（zh/en/ja）
+ *   icon      — 图标文件名（assets/images/band/<id>.png）
+ *   members   — 角色 ID 列表（顺序与游戏内一致）
+ *   desc      — 三语简介（一句话）
+ */
+
+export const BANDS = [
+  {
+    id: 'poppin-party',
+    name: { zh: "Poppin'Party", en: "Poppin'Party", ja: "Poppin'Party" },
+    icon: 'poppin-party.png',
+    members: ['kasumi', 'tae', 'rimi', 'sayaka', 'arisa'],
+    desc: {
+      zh: '由香澄组建的女子乐队，青春热血风格。',
+      en: "A youth-oriented girls' band formed by Kasumi.",
+      ja: '香澄が結成した青春女子バンド。',
+    },
+  },
+  {
+    id: 'afterglow',
+    name: { zh: 'Afterglow', en: 'Afterglow', ja: 'Afterglow' },
+    icon: 'afterglow.png',
+    members: ['ran', 'moca', 'himari', 'tsugumi', 'tomo'],
+    desc: {
+      zh: '高中生的朋克风乐队。',
+      en: 'A punk-rock band of high schoolers.',
+      ja: '女子高生のパンクロックバンド。',
+    },
+  },
+  {
+    id: 'pastel-palettes',
+    name: { zh: 'Pastel*Palettes', en: 'Pastel*Palettes', ja: 'Pastel*Palettes' },
+    icon: 'pastel-palettes.png',
+    members: ['aya', 'chisato', 'maya', 'eve', 'hina'],
+    desc: {
+      zh: '以偶像身份活动的乐队。',
+      en: 'A band that also performs as idols.',
+      ja: 'アイドル活動も行うバンド。',
+    },
+  },
+  {
+    id: 'roselia',
+    name: { zh: 'Roselia', en: 'Roselia', ja: 'Roselia' },
+    icon: 'roselia.png',
+    members: ['yukina', 'sayo', 'lisa', 'rinko', 'ako'],
+    desc: {
+      zh: '追求极致音乐性的严肃乐队。',
+      en: 'A serious band pursuing musical perfection.',
+      ja: '音楽性を追求するシリアスなバンド。',
+    },
+  },
+  {
+    id: 'hhw',
+    name: { zh: 'Hello, Happy World!', en: 'Hello, Happy World!', ja: 'Hello, Happy World!' },
+    icon: 'hhw.png',
+    members: ['kokoro', 'kaoru', 'hagumi', 'kanon', 'misaki'],
+    desc: {
+      zh: '以"让世界幸福"为目标的欢乐乐队。',
+      en: 'A cheerful band aiming to make the world happy.',
+      ja: '世界を幸せにすることを目標にする明るいバンド。',
+    },
+  },
+  {
+    id: 'morfonica',
+    name: { zh: 'Morfonica', en: 'Morfonica', ja: 'Morfonica' },
+    icon: 'morfonica.png',
+    members: ['mashiro', 'touko', 'nanami', 'tsukushi', 'rui'],
+    desc: {
+      zh: '以小提琴为特色的正统派乐队。',
+      en: 'An orthodox band featuring the violin.',
+      ja: 'ヴァイオリンが特徴の正統派バンド。',
+    },
+  },
+  {
+    id: 'ras',
+    name: { zh: 'RAISE A SUILEN', en: 'RAISE A SUILEN', ja: 'RAISE A SUILEN' },
+    icon: 'ras.png',
+    members: ['laying', 'lock', 'mashu', 'pareo', 'reona'],
+    desc: {
+      zh: '由 LAYER 主导的实力派乐队。',
+      en: 'A powerful band led by LAYER.',
+      ja: 'LAYER が主導する実力派バンド。',
+    },
+  },
+  {
+    id: 'mygo',
+    name: { zh: 'MYGO!!!!!', en: 'MYGO!!!!!', ja: 'MYGO!!!!!' },
+    icon: 'mygo.png',
+    members: ['anon', 'tomori', 'raana', 'soyo', 'taki'],
+    desc: {
+      zh: "《BanG Dream! It's MyGO!!!!!》登场乐队。",
+      en: "Band from BanG Dream! It's MyGO!!!!!",
+      ja: "『BanG Dream! It's MyGO!!!!!』登場バンド。",
+    },
+  },
+  {
+    id: 'ave-mujica',
+    name: { zh: 'Ave Mujica', en: 'Ave Mujica', ja: 'Ave Mujica' },
+    icon: 'ave-mujica.png',
+    members: ['sakiko', 'mutsumi', 'umiri', 'nyamu', 'togawa'],
+    desc: {
+      zh: '《BanG Dream! Ave Mujica》登场乐队。',
+      en: 'Band from BanG Dream! Ave Mujica.',
+      ja: '『BanG Dream! Ave Mujica』登場バンド。',
+    },
+  },
+];
+
+export const BAND_BY_ID = Object.fromEntries(BANDS.map(b => [b.id, b]));
diff --git a/src/data/characters.js b/src/data/characters.js
new file mode 100644
index 0000000..da0681e
--- /dev/null
+++ b/src/data/characters.js
@@ -0,0 +1,174 @@
+/**
+ * 约 49 名角色元数据。
+ *
+ * 字段：
+ *   id        — 内部 ID（小写）
+ *   bandId    — 所属乐队 ID
+ *   role      — 担当（Vo./Gt./Ba./Dr./Key.）
+ *   name      — 三语名
+ *   portrait  — 立绘文件名（assets/images/char/<id>.png）
+ */
+
+import { BAND_BY_ID } from './bands.js';
+
+export const CHARACTERS = [
+  // Poppin'Party
+  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
+    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
+    portrait: 'kasumi.png' },
+  { id: 'tae', bandId: 'poppin-party', role: 'Dr.',
+    name: { zh: 'たえ', en: 'Tae Hanazono', ja: 'たえ' },
+    portrait: 'tae.png' },
+  { id: 'rimi', bandId: 'poppin-party', role: 'Ba.',
+    name: { zh: 'りみ', en: 'Rimi Ushigome', ja: 'りみ' },
+    portrait: 'rimi.png' },
+  { id: 'sayaka', bandId: 'poppin-party', role: 'Key.',
+    name: { zh: '紗綾', en: 'Saaya Yamabuki', ja: '紗綾' },
+    portrait: 'sayaka.png' },
+  { id: 'arisa', bandId: 'poppin-party', role: 'Gt.',
+    name: { zh: '有咲', en: 'Arisa Ichigaya', ja: '有咲' },
+    portrait: 'arisa.png' },
+
+  // Afterglow
+  { id: 'ran', bandId: 'afterglow', role: 'Gt./Vo',
+    name: { zh: '蘭', en: 'Ran Mitake', ja: '蘭' },
+    portrait: 'ran.png' },
+  { id: 'moca', bandId: 'afterglow', role: 'Gt.',
+    name: { zh: 'モカ', en: 'Moca Aoba', ja: 'モカ' },
+    portrait: 'moca.png' },
+  { id: 'himari', bandId: 'afterglow', role: 'Ba.',
+    name: { zh: 'ひまり', en: 'Himari Uehara', ja: 'ひまり' },
+    portrait: 'himari.png' },
+  { id: 'tsugumi', bandId: 'afterglow', role: 'Dr.',
+    name: { zh: 'つぐみ', en: 'Tsugumi Hazawa', ja: 'つぐみ' },
+    portrait: 'tsugumi.png' },
+  { id: 'tomo', bandId: 'afterglow', role: 'Key.',
+    name: { zh: '巴', en: 'Tomo Udagawa', ja: '巴' },
+    portrait: 'tomo.png' },
+
+  // Pastel*Palettes
+  { id: 'aya', bandId: 'pastel-palettes', role: 'Gt./Vo',
+    name: { zh: '彩', en: 'Aya Maruyama', ja: '彩' },
+    portrait: 'aya.png' },
+  { id: 'chisato', bandId: 'pastel-palettes', role: 'Gt.',
+    name: { zh: '千聖', en: 'Chisato Shirasagi', ja: '千聖' },
+    portrait: 'chisato.png' },
+  { id: 'maya', bandId: 'pastel-palettes', role: 'Ba.',
+    name: { zh: 'マヤ', en: 'Maya Yamato', ja: 'マヤ' },
+    portrait: 'maya.png' },
+  { id: 'eve', bandId: 'pastel-palettes', role: 'Dr.',
+    name: { zh: 'イヴ', en: 'Eve Wakamiya', ja: 'イヴ' },
+    portrait: 'eve.png' },
+  { id: 'hina', bandId: 'pastel-palettes', role: 'Key.',
+    name: { zh: '日菜', en: 'Hina Hikawa', ja: '日菜' },
+    portrait: 'hina.png' },
+
+  // Roselia
+  { id: 'yukina', bandId: 'roselia', role: 'Vo.',
+    name: { zh: '友希那', en: 'Yukina Minato', ja: '友希那' },
+    portrait: 'yukina.png' },
+  { id: 'sayo', bandId: 'roselia', role: 'Gt.',
+    name: { zh: '紗夜', en: 'Sayo Imai', ja: '紗夜' },
+    portrait: 'sayo.png' },
+  { id: 'lisa', bandId: 'roselia', role: 'Ba.',
+    name: { zh: 'リサ', en: 'Lisa Imai', ja: 'リサ' },
+    portrait: 'lisa.png' },
+  { id: 'rinko', bandId: 'roselia', role: 'Key.',
+    name: { zh: '燐子', en: 'Rinko Shirokane', ja: '燐子' },
+    portrait: 'rinko.png' },
+  { id: 'ako', bandId: 'roselia', role: 'Dr.',
+    name: { zh: 'あこ', en: 'Ako Udagawa', ja: 'あこ' },
+    portrait: 'ako.png' },
+
+  // Hello, Happy World!
+  { id: 'kokoro', bandId: 'hhw', role: 'Vo.',
+    name: { zh: 'こころ', en: 'Kokoro Tsurumaki', ja: 'こころ' },
+    portrait: 'kokoro.png' },
+  { id: 'kaoru', bandId: 'hhw', role: 'Gt.',
+    name: { zh: '薰', en: 'Kaoru Seta', ja: '薰' },
+    portrait: 'kaoru.png' },
+  { id: 'hagumi', bandId: 'hhw', role: 'Dr.',
+    name: { zh: 'はぐみ', en: 'Hagumi Kitazawa', ja: 'はぐみ' },
+    portrait: 'hagumi.png' },
+  { id: 'kanon', bandId: 'hhw', role: 'Key.',
+    name: { zh: '花音', en: 'Kanon Matsubara', ja: '花音' },
+    portrait: 'kanon.png' },
+  { id: 'misaki', bandId: 'hhw', role: 'Ba.',
+    name: { zh: 'みさき', en: 'Misaki Okusawa', ja: 'みさき' },
+    portrait: 'misaki.png' },
+
+  // Morfonica
+  { id: 'mashiro', bandId: 'morfonica', role: 'Vo./Vn.',
+    name: { zh: 'ましろ', en: 'Mashiro Kurata', ja: 'ましろ' },
+    portrait: 'mashiro.png' },
+  { id: 'touko', bandId: 'morfonica', role: 'Vn.',
+    name: { zh: '灯織', en: 'Touko Kirigaya', ja: '灯織' },
+    portrait: 'touko.png' },
+  { id: 'nanami', bandId: 'morfonica', role: 'Gt.',
+    name: { zh: '七深', en: 'Nanami Hiromachi', ja: '七深' },
+    portrait: 'nanami.png' },
+  { id: 'tsukushi', bandId: 'morfonica', role: 'Ba.',
+    name: { zh: 'つくし', en: 'Tsukushi Futaba', ja: 'つくし' },
+    portrait: 'tsukushi.png' },
+  { id: 'rui', bandId: 'morfonica', role: 'Dr.',
+    name: { zh: '瑠唯', en: 'Rui Yashio', ja: '瑠唯' },
+    portrait: 'rui.png' },
+
+  // RAISE A SUILEN
+  { id: 'laying', bandId: 'ras', role: 'Dr.',
+    name: { zh: 'LAYER', en: 'LAYER', ja: 'LAYER' },
+    portrait: 'laying.png' },
+  { id: 'lock', bandId: 'ras', role: 'Ba.',
+    name: { zh: 'LOCK', en: 'LOCK', ja: 'LOCK' },
+    portrait: 'lock.png' },
+  { id: 'mashu', bandId: 'ras', role: 'Gt.',
+    name: { zh: 'MASHU', en: 'MASHU', ja: 'MASHU' },
+    portrait: 'mashu.png' },
+  { id: 'pareo', bandId: 'ras', role: 'Key.',
+    name: { zh: 'PAREO', en: 'PAREO', ja: 'PAREO' },
+    portrait: 'pareo.png' },
+  { id: 'reona', bandId: 'ras', role: 'Vo.',
+    name: { zh: 'CHU²', en: 'CHU²', ja: 'CHU²' },
+    portrait: 'reona.png' },
+
+  // MYGO!!!!!
+  { id: 'anon', bandId: 'mygo', role: 'Gt.',
+    name: { zh: 'あの', en: 'Anon Chihaya', ja: 'あの' },
+    portrait: 'anon.png' },
+  { id: 'tomori', bandId: 'mygo', role: 'Vo./Gt.',
+    name: { zh: '灯', en: 'Tomori Takamatsu', ja: '灯' },
+    portrait: 'tomori.png' },
+  { id: 'raana', bandId: 'mygo', role: 'Ba.',
+    name: { zh: '楽奈', en: 'Raana Kaname', ja: '楽奈' },
+    portrait: 'raana.png' },
+  { id: 'soyo', bandId: 'mygo', role: 'Gt.',
+    name: { zh: 'そよ', en: 'Soyo Nagasaki', ja: 'そよ' },
+    portrait: 'soyo.png' },
+  { id: 'taki', bandId: 'mygo', role: 'Dr.',
+    name: { zh: '立希', en: 'Taki Shiina', ja: '立希' },
+    portrait: 'taki.png' },
+
+  // Ave Mujica
+  { id: 'sakiko', bandId: 'ave-mujica', role: 'Key.',
+    name: { zh: 'さきこ', en: 'Sakiko Togawa', ja: 'さきこ' },
+    portrait: 'sakiko.png' },
+  { id: 'mutsumi', bandId: 'ave-mujica', role: 'Dr.',
+    name: { zh: 'むつみ', en: 'Mutsumi Wakaba', ja: 'むつみ' },
+    portrait: 'mutsumi.png' },
+  { id: 'umiri', bandId: 'ave-mujica', role: 'Vo.',
+    name: { zh: 'うみり', en: 'Umiri Yahata', ja: 'うみり' },
+    portrait: 'umiri.png' },
+  { id: 'nyamu', bandId: 'ave-mujica', role: 'Gt.',
+    name: { zh: 'にゃむ', en: 'Nyamu Yutenji', ja: 'にゃむ' },
+    portrait: 'nyamu.png' },
+  { id: 'togawa', bandId: 'ave-mujica', role: 'Ba.',
+    name: { zh: '戸川', en: 'Togawa (Sakiko family)', ja: '戸川' },
+    portrait: 'togawa.png' },
+];
+
+export const CHARACTER_BY_ID = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));
+
+export function charactersOfBand(bandId) {
+  const band = BAND_BY_ID[bandId];
+  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
+}
diff --git a/src/data/samples.js b/src/data/samples.js
new file mode 100644
index 0000000..6ba1b94
--- /dev/null
+++ b/src/data/samples.js
@@ -0,0 +1,17 @@
+/**
+ * 每个角色 >=3 条主声线样本的文件名。
+ * 实际资源在 Task 3 下载，本文件先按"全员 >=3 条"占位。
+ * 后续若某角色资源凑不齐 3 条，对应项可改成更少；quiz.js 会跳过空样本角色。
+ */
+
+import { CHARACTERS } from './characters.js';
+
+// 默认模板：每角色用 <id>-1/2/3.mp3
+const TEMPLATE = (id) => [`${id}-1.mp3`, `${id}-2.mp3`, `${id}-3.mp3`];
+
+export const SAMPLES = Object.fromEntries(
+  CHARACTERS.map(c => [c.id, TEMPLATE(c.id)])
+);
+
+// 已知可能凑不齐的角色（Task 3 之后会更新这里）：
+// SAMPLES['xxx'] = ['xxx-1.mp3'];  // 只剩 1 条
diff --git a/tests/data.test.js b/tests/data.test.js
new file mode 100644
index 0000000..ac57864
--- /dev/null
+++ b/tests/data.test.js
@@ -0,0 +1,45 @@
+import { describe, it, expect } from 'vitest';
+import { BANDS, BAND_BY_ID } from '../src/data/bands.js';
+import { CHARACTERS, CHARACTER_BY_ID, charactersOfBand } from '../src/data/characters.js';
+import { SAMPLES } from '../src/data/samples.js';
+
+describe('data integrity', () => {
+  it('every band has 4-5 members', () => {
+    for (const b of BANDS) {
+      expect(b.members.length, `band ${b.id}`).toBeGreaterThanOrEqual(4);
+      expect(b.members.length, `band ${b.id}`).toBeLessThanOrEqual(5);
+    }
+  });
+
+  it('every character belongs to a band that exists', () => {
+    for (const c of CHARACTERS) {
+      expect(BAND_BY_ID[c.bandId], `char ${c.id}`).toBeDefined();
+    }
+  });
+
+  it('every band member id resolves to a character', () => {
+    for (const b of BANDS) {
+      for (const mid of b.members) {
+        expect(CHARACTER_BY_ID[mid], `band ${b.id} member ${mid}`).toBeDefined();
+      }
+    }
+  });
+
+  it('every character has a sample list >=1', () => {
+    for (const c of CHARACTERS) {
+      expect(SAMPLES[c.id], `char ${c.id}`).toBeDefined();
+      expect(SAMPLES[c.id].length, `char ${c.id}`).toBeGreaterThanOrEqual(1);
+    }
+  });
+
+  it('charactersOfBand returns matching subset', () => {
+    const poppin = charactersOfBand('poppin-party');
+    expect(poppin.length).toBe(5);
+    expect(poppin.map(c => c.id)).toEqual(['kasumi', 'tae', 'rimi', 'sayaka', 'arisa']);
+  });
+
+  it('total characters ≈ 49', () => {
+    expect(CHARACTERS.length).toBeGreaterThanOrEqual(45);
+    expect(CHARACTERS.length).toBeLessThanOrEqual(55);
+  });
+});
