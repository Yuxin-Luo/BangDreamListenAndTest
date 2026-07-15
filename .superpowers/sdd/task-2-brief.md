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

