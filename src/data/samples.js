/**
 * 每个角色 >=3 条主声线样本的文件名。
 * 实际资源在 Task 3 下载，本文件先按"全员 >=3 条"占位。
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
