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
      en: 'A powerful band led by LAYER.',
      ja: 'LAYER が主導する実力派バンド。',
    },
  },
  {
    id: 'mygo',
    name: { zh: 'MYGO!!!!!', en: 'MYGO!!!!!', ja: 'MYGO!!!!!' },
    icon: 'mygo.png',
    members: ['anon', 'tomori', 'raana', 'soyo', 'taki'],
    desc: {
      zh: "《BanG Dream! It's MyGO!!!!!》登场乐队。",
      en: "Band from BanG Dream! It's MyGO!!!!!",
      ja: "『BanG Dream! It's MyGO!!!!!』登場バンド。",
    },
  },
  {
    id: 'ave-mujica',
    name: { zh: 'Ave Mujica', en: 'Ave Mujica', ja: 'Ave Mujica' },
    icon: 'ave-mujica.png',
    members: ['sakiko', 'mutsumi', 'umiri', 'nyamu', 'togawa'],
    desc: {
      zh: '《BanG Dream! Ave Mujica》登场乐队。',
      en: 'Band from BanG Dream! Ave Mujica.',
      ja: '『BanG Dream! Ave Mujica』登場バンド。',
    },
  },
];

export const BAND_BY_ID = Object.fromEntries(BANDS.map(b => [b.id, b]));
