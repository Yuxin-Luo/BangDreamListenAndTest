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

import { BAND_BY_ID } from './bands.js';

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
  const band = BAND_BY_ID[bandId];
  return band ? band.members.map(id => CHARACTER_BY_ID[id]) : [];
}
