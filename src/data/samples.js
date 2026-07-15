/**
 * 每个角色 >=3 条主声线样本的文件名。
 * 实际资源在 Task 3 下载，本文件先按"全员 >=3 条"占位。
 * 后续若某角色资源凑不齐 3 条，对应项可改成更少；quiz.js 会跳过空样本角色。
 *
 * 2026-07-15 UPDATE: 所有音频路径在 bestdori.com 均返回 HTML 占位符（非真实 MP3）。
 * 当前 samples.js 保留模板路径占位，实际资源待后续获取。
 * 音频来源待重新探索（萌娘百科/其他源）。
 */

import { CHARACTERS } from './characters.js';

// 默认模板：每角色用 <id>-1/2/3.mp3
const TEMPLATE = (id) => [`${id}-1.mp3`, `${id}-2.mp3`, `${id}-3.mp3`];

export const SAMPLES = Object.fromEntries(
  CHARACTERS.map(c => [c.id, TEMPLATE(c.id)])
);

// 2026-07-15: 所有音频均无法下载（bestdori 返回占位符 HTML）
// 保留模板路径占位，实际文件待补充
// 已知问题：
// - Ave Mujica (sakiko, mutsumi, umiri, nyamu, togawa): 无 bestdori 页面
// - MYGO anon/raana/soyo/taki (ID 36-40): bestdori 返回 14084 bytes 占位图
// - 音频 bestdori://sound/voice/character/<id>.mp3 全部返回 HTML 而非 MP3
