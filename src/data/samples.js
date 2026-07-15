/**
 * 每个角色 5 条主声线样本（从用户提供的 zip 包随机抽取，2026-07-15）。
 *
 * 文件结构：assets/audio/<bandId>/<charId>/{1..5}.mp3
 *
 * 实际文件从 Reference/Code/character_audio/<band>/<id>-<name>-<band>.zip
 * 随机抽取（seed=42），每个角色 5 条事件语音，共 40 个角色 200 个 mp3。
 *
 * Ave Mujica（sakiko/mutsumi/umiri/nyamu/togawa）已被用户排除，
 * 无音频，quiz.js 会跳过这些角色。
 */

import { CHARACTERS } from './characters.js';

// 每角色音频样本文件名列表
// 从实际目录扫描得到（确定性，方便 review）
const SAMPLES_MAP = {
  // Poppin'Party
  kasumi:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  tae:     ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  rimi:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  sayaka:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  arisa:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Afterglow
  ran:     ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  moca:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  himari:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  tsugumi: ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  tomo:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Pastel*Palettes
  aya:     ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  hina:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  chisato: ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  maya:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  eve:     ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Roselia
  yukina:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  sayo:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  lisa:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  rinko:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  ako:     ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Hello, Happy World!
  kokoro:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  kaoru:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  hagumi:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  kanon:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  misaki:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Morfonica
  mashiro:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  touko:    ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  nanami:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  tsukushi: ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  rui:      ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // RAISE A SUILEN
  laying: ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  lock:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  mashu:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  pareo:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  reona:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // MYGO!!!!!
  tomori: ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  anon:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  raana:  ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  soyo:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],
  taki:   ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3'],

  // Ave Mujica: 用户明确排除，列表为空 → quiz.js 跳过
  sakiko:  [],
  mutsumi: [],
  umiri:   [],
  nyamu:   [],
  uika:    [],
};

/**
 * 对外暴露：每个角色可用的样本文件名（绝对路径是 audio.js 的责任）
 * 调用方：quiz.js 选择角色后从这里取文件名
 */
export const SAMPLES = SAMPLES_MAP;

/**
 * 便捷查询：返回有效样本数
 */
export function sampleCount(charId) {
  return (SAMPLES_MAP[charId] || []).length;
}

/**
 * 便捷查询：返回所有有音频的角色 ID 列表
 */
export function charactersWithAudio() {
  return Object.keys(SAMPLES_MAP).filter(id => SAMPLES_MAP[id].length > 0);
}