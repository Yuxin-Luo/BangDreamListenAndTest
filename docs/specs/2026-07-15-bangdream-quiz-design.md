# BanG Dream 听声音猜角色 — 设计文档

| 项 | 值 |
|---|---|
| **Spec 日期** | 2026-07-15 |
| **项目目录** | `~/Desktop/LYX/VibeCoding/BangDreamListenAndTest/` |
| **状态** | 已获用户认可（2026-07-15 brainstorming 三节） |
| **范围** | 单页 Web demo · 浅色风格 · 本地 `python3 -m http.server` 运行 |

---

## 1. 目标

为 BanG Dream（バンドリ！）粉丝做一个"听声音猜角色"的趣味测试，UI 中英日三语切换。

### 1.1 核心闭环

```
点击「播放声音」
  → 播放目标角色的随机一条主声线台词
  → 用户在「当前乐队 Tab」下 5 张立绘中选一人
  → 判定正确：弹角色名(乐队)+ 立绘 + 复播样本 + 累计正确数
  → 判定错误：弹失败提示 + 香澄哭泣图 + 累计错误数
```

### 1.2 用户群 & 验收标准

- **用户**：BanG Dream 玩家（熟悉角色）
- **验收**：能在 3 次以内猜对至少一个角色；切到日语/英语后角色名同步显示对应译名；点「介绍」Tab 能听任意角色随机一条样本

---

## 2. 需求决策记录（已与用户确认）

| # | 决策点 | 选择 |
|---|---|---|
| 1 | 多语言显示 | UI 当前语言对应名（中文→香澄，日文→湊友希那，英文→Kasumi Toyama） |
| 2 | 测试模式 | 无尽模式 + 累计正确/错误统计 |
| 3 | 重试行为 | 重抽一条样本（可能与上次不同）+ 重置选项可点 |
| 4 | 持久化 | 复用 MorsePractice `progress.js`，累计对/错 + 每角色错数 |
| 5 | 覆盖范围 | 全部 7 乐队 + MYGO!!!!! + Ave Mujica |
| 6 | 介绍页集成 | 单页 Tab 切换 |
| 7 | 题目声音范围 | 主声线代表性台词 |
| 8 | 题库规模 | 每角色 ≥3 条样本 |
| 9 | PWA 范围 | 纯静态网页，无 SW / manifest |
| 10 | 部署 | 本地 `python3 -m http.server` |
| 11 | 失败图 | Kasumi（香澄）沮丧表情包（找不到则整理进缺失文档） |
| 12 | 资源限制 | 单条资源检索 ≤5min、下载 ≤180s；找不到整理进缺失文档 |
| 13 | 架构 | 复用 MorsePractice 模式：纯 ES Module + Vanilla JS |

---

## 3. 架构

### 3.1 模块边界

| 模块 | 职责 | 可复用对象 |
|---|---|---|
| `src/main.js` | 启动入口、错误条、booting | MorsePractice `main.js` |
| `src/core/audio.js` | 单例 AudioContext + `playSample(charId, idx)` | MorsePractice `audio.js` 单例模式 |
| `src/core/quiz.js` | 状态机（newQuestion/playCurrent/retry/next/pick） | 新建 |
| `src/core/tabs.js` | Tab 切换状态机 | 新建 |
| `src/i18n/index.js` | i18n 运行时（扩 3 语言） | MorsePractice `i18n/index.js` |
| `src/i18n/{zh,en,ja}.js` | 字典（ja.js 新增） | MorsePractice `zh/en.js` 模式 |
| `src/data/bands.js` | 9 乐队元数据 | 新建 |
| `src/data/characters.js` | 50+ 角色元数据 | 新建 |
| `src/data/samples.js` | 样本清单 | 新建 |
| `src/storage/progress.js` | localStorage 进度持久化 | MorsePractice `progress.js` 直接复用 |
| `src/ui/app.js` | 顶层控制器（挂载 Tab + i18n） | MorsePractice `app.js` 模式 |
| `src/ui/quiz.js` | 测验 UI 渲染 + 事件 | 新建 |
| `src/ui/intro.js` | 介绍 UI 渲染 + 事件 | 新建 |

### 3.2 目录结构

```
BangDreamListenAndTest/
├── Agent Rules.txt                  # 项目硬约束（已存在，不动）
├── CLAUDE.md                        # 项目索引（不包含规则，仅指向 dev-docs/06-handoff）
├── index.html                       # 单页入口（含 data-i18n 属性 + 两个 Tab 容器）
├── package.json                     # 复用 MorsePractice：vitest + happy-dom
├── vitest.config.js                 # 复用 MorsePractice
├── dev-server.py                    # 复用 MorsePractice（python3 -m http.server 8000）
├── src/                             # Agent Rules #8：所有代码入 src/
│   ├── main.js
│   ├── core/
│   │   ├── audio.js
│   │   ├── quiz.js
│   │   └── tabs.js
│   ├── data/
│   │   ├── bands.js
│   │   ├── characters.js
│   │   └── samples.js
│   ├── i18n/
│   │   ├── index.js
│   │   ├── zh.js
│   │   ├── en.js
│   │   └── ja.js
│   ├── storage/
│   │   └── progress.js
│   └── ui/
│       ├── app.js
│       ├── quiz.js
│       └── intro.js
├── assets/
│   ├── audio/<charId>/{1,2,3}.mp3   # 每角色 3 条样本
│   ├── images/band/<bandId>.png     # 9 个乐队图标
│   ├── images/char/<charId>.png     # 50+ 角色立绘
│   └── images/fail/ksm-cry.png      # Kasumi 失败图
├── docs/
│   └── superpowers/specs/2026-07-15-bangdream-quiz-design.md
├── dev-docs/                        # Agent Rules #6：过程文档
│   ├── 01-bangdream-domain-research-2026-07-15.md
│   ├── 02-resource-strategy-2026-07-15.md
│   ├── 03-resource-acquisition-log-2026-07-15.md
│   ├── 04-resource-missing-2026-07-15.md
│   ├── 05-architecture-decisions-2026-07-15.md
│   └── 06-handoff-2026-07-15.md
└── research/                        # Agent Rules #7：调研资料表
    ├── bands.xml
    └── characters.xml
```

### 3.3 数据模型

```js
// data/bands.js
export const BANDS = [
  { id: 'poppin-party',   name: { zh: "Poppin'Party",  en: "Poppin'Party",  ja: "Poppin'Party" }, icon: 'poppin-party.png',
    desc: { zh: '...', en: '...', ja: '...' } },
  // afterglow, pastel-palettes, roselia, hhw, morfonica, ras, mygo, ave-mujica
];

// data/characters.js
export const CHARACTERS = [
  { id: 'kasumi', bandId: 'poppin-party', role: 'Gt./Vo',
    name: { zh: '香澄', en: 'Kasumi Toyama', ja: '香澄' },
    portrait: 'kasumi.png' },
  // 50+ 项
];

// data/samples.js
export const SAMPLES = {
  'kasumi': ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
  // 每角色 ≥3 条
};
```

---

## 4. 状态机

### 4.1 quiz.js 状态字段

```js
const state = {
  currentCharId: null,
  currentSampleId: null,
  phase: 'idle',          // 'idle' | 'playing' | 'awaitPick' | 'answered'
  answered: false,        // 防二次答题（用户已点过角色）
  revealed: false,        // 答案按钮已被按下过（防再次按答案）
  pickedCharId: null,     // 用户本次选的角色（仅 answered 时有意义）
  score: {
    correct: 0,
    wrong: 0,
    byChar: {},           // { 'kasumi': 2, ... }
  },
};
```

### 4.2 状态转移

```
       newQuestion()
            ↓
       [idle]
            │ onPlay()
            ↓
       [playing] ─ onEnded ─→ [awaitPick]
                                   │ onPick(charId)
                                   ↓
                              [answered]
                                   │       ┌───────────────┐
                                   │       │ (only retry/next)
                                retry()     │
                                   ↓       ↓
                              [playing (same char, resample)]
```

### 4.3 公开 API

```js
// quiz.js
newQuestion()              // 随机抽 charId + sampleId → phase='awaitPick', answered=false
playCurrent()              // 调 audio.playSample，播完自动停在 awaitPick
retry()                    // 任意 phase 都可触发：换 sampleId + phase='awaitPick' + answered=false
next()                     // 任意 phase 都可：调 newQuestion() 并保持当前 answered 标记清零
pick(charId)               // 用户点角色 → 判定 → 触发 onResult({correct, charId, sampleId})
hintBand()                 // 在结果区显示当前题所属乐队名 + 图标（仅 awaitPick/answered 可用）
revealAnswer()             // 直接显示当前题角色名 + 立绘 + 所属乐队（仅 awaitPick/answered 可用）

// canXxx() 守卫
canPlay()     // phase==='idle' || phase==='awaitPick'
canPick()     // phase==='awaitPick'
canRetry()    // 始终 true
canNext()     // 始终 true
canHintBand() // (phase==='awaitPick' || phase==='answered') && !revealed
canReveal()   // (phase==='awaitPick' || phase==='answered') && !revealed
```

### 4.4 按钮可用性矩阵

| 状态 \ 按钮 | 重试 | 下一题 | 提示乐队 | 答案 |
|---|---|---|---|---|
| `playing` | ❌ | ✅ | ❌ | ❌ |
| `awaitPick` | ✅ | ✅ | ✅ | ✅ |
| `answered`（判错） | ✅ | ✅ | ✅ | ✅ |
| `answered`（判对） | ✅ | ✅ | ✅ | ✅ |
| 已显示答案 (`revealed=true`) | ✅ | ✅ | ❌ | ❌ |

---

## 5. UI 流程

### 5.1 顶栏

```
┌────────────────────────────────────────────────────┐
│ [🎵 听声音猜角色]  [📖 乐队·角色介绍]   [中 ▾]    │
└────────────────────────────────────────────────────┘
```

语言切换按钮调 `i18n.setLocale()`，复用 MorsePractice 模式。

### 5.2 听声音猜角色 Tab

```
┌──────────────────────────────────────────────────────────┐
│ ▶️ [播放声音]                              已答：12 对 3 错  │  顶栏
├──────────────────────────────────────────────────────────┤
│ [🎸 Poppin'Party] [🔥 Afterglow] [🎀 Pastel*Palettes]   │
│ [🌹 Roselia] [☀️ HHW] [🎻 Morfonica] [💥 RAS]           │  乐队 Tab（两行：名+图标）
│ [💜 MYGO] [🖤 Ave Mujica]                                │
├──────────────────────────────────────────────────────────┤
│  [香澄]  [りみ]  [紗綾]  [有咲]  [たえ]                  │  当前乐队 5 角色选项
│  [立绘] [立绘] [立绘]  [立绘]  [立绘]                    │  横向 5 卡片
├──────────────────────────────────────────────────────────┤
│  [ 重试 ]  [ 下一题 ]  [ 提示乐队 ]  [ 答案 ]            │  底部 4 按钮
├──────────────────────────────────────────────────────────┤
│  <结果区>                                                │  判对/判错/答案/提示在此显示
└──────────────────────────────────────────────────────────┘
```

### 5.3 介绍 Tab

```
┌──────────────────────────────────────────────────────────┐
│ [🎸 Poppin'Party] [🔥 Afterglow] ...                    │  乐队 Tab
├──────────────────────────────────────────────────────────┤
│   [立绘]   [立绘]   [立绘]   [立绘]   [立绘]             │  5 角色卡
│   香澄    りみ     紗綾    有咲    たえ                  │
│   ▶️ 听  ▶️ 听  ▶️ 听  ▶️ 听  ▶️ 听                     │  每次点击随机一条
├──────────────────────────────────────────────────────────┤
│  ▼ Poppin'Party 是由香澄组建的女子乐队…                │  乐队简介（i18n）
└──────────────────────────────────────────────────────────┘
```

### 5.4 结果区（判对/判错/答案/提示）

| 触发 | 内容 |
|---|---|
| 判对 | `✅ 正确！香澄 Kasumi Toyama（Poppin'Party）[立绘] ▶️ 再听一次` |
| 判错 | `❌ 失败 [ksm 哭泣图]` |
| 答案按钮 | `📖 答案：香澄 Kasumi Toyama（Poppin'Party）[立绘]` |
| 提示乐队按钮 | `💡 提示乐队：Poppin'Party [乐队图标]` |

---

## 6. 错误处理

| 场景 | 处理 |
|---|---|
| 音频 404 | `audio.js` 内 `playSample()` 用 `try/catch + HTMLAudioElement.onerror` 捕获；UI 弹非阻断提示「该角色样本暂缺」+ 自动 `newQuestion()`；记入 `progress.errors.audio404++` |
| 图片 404 | `<img onerror>` 触发：隐藏图片容器 + 显示文字占位（角色名/乐队名） |
| iOS Safari AudioContext suspended | 首次用户手势时 `ctx.resume()`（复用 MorsePractice 模式） |
| 启动失败 | 复用 MorsePractice `main.js` 错误条（红条置顶） |
| localStorage 不可用 | progress.js 内存 fallback（不影响功能） |
| 抽到空样本角色 | `newQuestion()` 过滤掉 `SAMPLES[charId].length === 0` 的角色 |

---

## 7. 测试

复用 MorsePractice 现有 vitest + happy-dom 设置。

```js
// tests/quiz.test.js
- newQuestion() 抽到的 charId 必在 CHARACTERS 内
- newQuestion() 抽到的 sampleId 必在 SAMPLES[charId] 内
- pick(correctCharId) → state.phase === 'answered', score.correct++
- pick(wrongCharId)   → state.phase === 'answered', score.wrong++
- retry()             → 同 charId、不同 sampleId、phase='awaitPick'、answered=false、revealed=false
- next()              → 不同 charId、phase='awaitPick'、answered=false、revealed=false
- revealAnswer()      → state.revealed=true
- revealAnswer() 二次调用 → state.revealed 仍为 true（幂等）
- retry()/next() 后 state.revealed=false
- canPick() 在 answered 后返回 false
- canRetry() 始终 true
- canNext() 始终 true
- canHintBand()/canReveal() 在 playing 后 false
- canReveal() 在 revealed 后 false（防二次按答案）
- newQuestion() 1000 次不出现空样本角色

// tests/audio.test.js (mock AudioContext)
- playSample(charId, idx) 调用 HTMLAudioElement
- 404 触发 fallback + newQuestion()
- stop() 中断正在播的样本

// tests/i18n.test.js
- t('band.poppin-party', {locale:'zh'}) === "Poppin'Party"
- t('char.kasumi.name', {locale:'ja'}) === "香澄"
- t('char.kasumi.name', {locale:'en'}) === "Kasumi Toyama"
- applyTranslations() 切换所有 data-i18n 元素
```

---

## 8. 资源获取策略

### 8.1 图片

- 搜索优先级：bangdream.fandom.com → 萌娘百科 BanG Dream! 词条 → 官方 anime 官网 → 微博/B站官方
- 单条图片检索 ≤180s；找不到记录进 `dev-docs/04-resource-missing-2026-07-15.md`
- 立绘选 4:5 竖版（约 600×750），CSS 缩放

### 8.2 音频

- 搜索优先级：Bestdori（bestdori.com）→ bangdream.fandom.com → 萌娘百科「BanG Dream! 语音集」
- 5min 内必须锁定源；找不到则记录
- 单文件下载 ≤180s；接受 mp3/ogg；优先短小（角色台词通常 <200KB）

### 8.3 调研资料表（Agent Rules #7）

- `research/bands.xml`：每乐队的参考链接 + 关键属性
- `research/characters.xml`：每角色的参考链接 + 所属乐队 + 简介 + 资源链接

---

## 9. 项目文档

按 Agent Rules #6 序号命名：

```
dev-docs/
  01-bangdream-domain-research-2026-07-15.md  # 邦邦乐队/角色域资料
  02-resource-strategy-2026-07-15.md          # 资源获取策略与限制
  03-resource-acquisition-log-2026-07-15.md   # 资源下载日志
  04-resource-missing-2026-07-15.md           # 找不到的资源清单
  05-architecture-decisions-2026-07-15.md     # 关键架构决策记录
  06-handoff-2026-07-15.md                    # 接手指南
```

---

## 10. Agent Rules 自查

| # | 规则 | 落实 |
|---|---|---|
| 1 | 不假设用户清楚自己要什么 | brainstorming 三节全过 |
| 2 | 路径最优 | 复用 MorsePractice，避免重造 |
| 3 | 追根因不补丁 | 状态机以"重抽 vs 重播 vs 二次答题"为根因设计 |
| 4 | 输出说重点 | 本 spec 全文 |
| 5 | RPM<200, TPM<10M | Opus/Fable 5 不突破；下载走 curl |
| 6 | dev-doc 序号命名 | 见 §9 |
| 7 | 调研 XML 表 | 见 §8.3 |
| 8 | 代码入 src/ | 见 §3.2 |
| 9 | 系统信息已记录 | Ubuntu 22.04 / X11 / i5-13600KF / 32GB / RTX 4060 |
| 10 | 迅捷 demo | 本地 http.server，不部署 |
| 11 | 方案含难度+风险 | brainstorming 三节都有 |

---

## 11. 范围外（YAGNI）

- ❌ 计分 / 排名 / 排行榜
- ❌ 用户账号
- ❌ 服务端 / 后端
- ❌ Cloudflare Pages 部署（保留为未来扩展）
- ❌ Service Worker / 离线缓存
- ❌ 移动端原生 App

---

## 12. 后续

brainstorming 通过后 → 调用 `superpowers:writing-plans` 生成实施计划 → 进入开发。