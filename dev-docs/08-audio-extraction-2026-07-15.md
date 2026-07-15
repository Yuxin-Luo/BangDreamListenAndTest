# 音频批量提取记录（2026-07-15）

## 来源
用户提供的 41 个 zip 包位于 `Reference/Code/character_audio/<band>/<id>-<name>-<band>.zip`。
- 总大小：~7.5 GB
- 每 zip 约 30-8000 个 mp3（bestdori 全角色语音）
- 文件名格式：`event<id>-<section>-<line>.mp3`（游戏事件语音）

## 处理方式
- 随机种子：`seed=42`（保证可复现）
- 每角色随机抽取 5 个 mp3（用户指定数量）
- 输出：`assets/audio/<bandId>/<charId>/{1..5}.mp3`
- 跳过 Ave Mujica（用户明确排除）
- 跳过重复包 `601-Misaki_Okusawa-Hello_Happy_World.zip`（与 Michelle 同角色）

## 结果
- 40 个角色 × 5 条 = **200 个 mp3**，共 11 MB
- 结构与 `assets/images/character/` 一致（乐队 → 角色子文件夹）
- samples.js 已改写，所有有效角色指向真实文件

## 角色 → ID 映射（关键差异）
zip 文件名用英文，characters.js 用内部 ID。重要转换：

| zip 英文名 | 内部 ID | 备注 |
|---|---|---|
| Saya_Yamabuki | sayaka | zip 用 "Saya" |
| Tomoe_Udagawa | tomo | zip 用 "Tomoe" |
| Michelle | misaki | HHW Misaki 英文别名 |
| Toko_Kirigaya | touko | zip 用 "Toko" |
| Rei_Wakana | laying | RAS = LAYER |
| Rokka_Asahi | lock | RAS = LOCK |
| Masuki_Sato | mashu | RAS = MASHU |
| Reona_Nyubara | pareo | RAS = PAREO |
| Chiyu_Tamade | reona | RAS = CHU² |
| Taki_Shina | taki | MYGO |

## 异常
- `601-Misaki_Okusawa-Hello_Happy_World.zip`（重复）：bestdori ID 601 是 Misaki 另一形态，与 ID 15 同角色，已跳过

## 测试
- 13/13 通过
- 新增：`characters with audio >= 40`
- 修改：原 `SAMPLES.length >= 1` 改为 `>= 0`（允许 Ave Mujica 留空，由 quiz.js 跳过）

## 已知限制
- 抽样是随机的，每次重启 seed 不同
- Ave Mujica 5 角色无音频，UI 不展示对应 Tab/按钮