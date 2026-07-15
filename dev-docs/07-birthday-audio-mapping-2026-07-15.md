# 生日音频映射表（2026-07-15）

## 你已经下载的 25 个文件

**位置**：`assets/audio/birthday/2019BDRE-XX.mp3`

**文件命名规律**：`2019BDRE-<2字母>.mp3`（2019 = 年份，BDRE = 生日回应/Birthday Reply，XX = 角色内部代号）

## 25 文件 → 角色映射

| 序号 | 文件 | 角色 | bestdori ID | 乐队 | 中文名 |
|---|---|---|---|---|---|
| 1 | 2019BDRE-KM.mp3 | Kasumi Toyama | 1 | poppin-party | 户山香澄 |
| 2 | 2019BDRE-TE.mp3 | Tae Hanazono | 2 | poppin-party | 花園多惠 |
| 3 | 2019BDRE-RM.mp3 | Rimi Ushigome | 3 | poppin-party | 牛込里美 |
| 4 | 2019BDRE-SA.mp3 | Sayaka Yamabuki | 4 | poppin-party | 山吹沙绫 |
| 5 | 2019BDRE-AR.mp3 | Arisa Ichigaya | 5 | poppin-party | 市谷有咲 |
| 6 | 2019BDRE-RA.mp3 | Ran Mitake | 6 | afterglow | 美竹兰 |
| 7 | 2019BDRE-MC.mp3 | Moca Aoba | 7 | afterglow | 青叶摩卡 |
| 8 | 2019BDRE-HM.mp3 | Himari Uehara | 8 | afterglow | 上原绯玛丽 |
| 9 | 2019BDRE-TG.mp3 | Tsugumi Hazawa | 10 | afterglow | 羽泽鸫 |
| 10 | 2019BDRE-TM.mp3 | Tomo Udagawa | 9 | afterglow | 宇田川巴 |
| 11 | 2019BDRE-AY.mp3 | Aya Maruyama | 16 | pastel-palettes | 丸山彩 |
| 12 | 2019BDRE-CI.mp3 | Chisato Shirasagi | 18 | pastel-palettes | 白鹭千圣 |
| 13 | 2019BDRE-MY.mp3 | Maya Yamato | 19 | pastel-palettes | 大和麻弥 |
| 14 | 2019BDRE-EV.mp3 | Eve Wakamiya | 20 | pastel-palettes | 若宫伊芙 |
| 15 | 2019BDRE-HI.mp3 | Hina Hikawa | 17 | pastel-palettes | 冰川日菜 |
| 16 | 2019BDRE-YK.mp3 | Yukina Minato | 21 | roselia | 凑友希那 |
| 17 | 2019BDRE-SY.mp3 | Sayo Hikawa | 22 | roselia | 冰川纱夜 |
| 18 | 2019BDRE-LS.mp3 | Lisa Imai | 23 | roselia | 今井莉莎 |
| 19 | 2019BDRE-AK.mp3 | Ako Udagawa | 24 | roselia | 宇田川亚子 |
| 20 | 2019BDRE-RN.mp3 | Rinko Shirokane | 25 | roselia | 白金燐子 |
| 21 | 2019BDRE-KO.mp3 | Kokoro Tsurumaki | 11 | hhw | 弦卷心 |
| 22 | 2019BDRE-KA.mp3 | Kaoru Seta | 12 | hhw | 濑田薰 |
| 23 | 2019BDRE-HG.mp3 | Hagumi Kitazawa | 13 | hhw | 北泽育美 |
| 24 | 2019BDRE-KN.mp3 | Kanon Matsubara | 14 | hhw | 松原花音 |
| 25 | 2019BDRE-MI.mp3 | Misaki Okusawa | 15 | hhw | 奥泽米歇尔 |

**注意：用户脚本中 `characterId` 字段（如 `himari: 8`）与 bestdori ID 一致，但 Afterglow 顺序里 `tomo=9`、`tsugumi=10` 已被打乱，请用上表的 bestdori ID。**

## 为什么只有 25 个？

你的猜测**完全正确**。bestdori 的 `voice/birthday/` 目录每个角色文件夹（如 `character1/`、`character8/`）按年份分隔：
- `2019BDRE-XXX` = 2019 年生日回复
- `2020BDRE-XXX` = 2020 年生日回复
- 依此类推

**Morfonica / RAS / MYGO / Ave Mujica 没有 2019 生日音频**（Morfonica 2020 才加入；MYGO/AveMujica 2023+）。

你目前只有 2019 一年的数据，恰好覆盖了 2019 年在役的 25 角色（5 个原始乐队）。

## 缺失的 24 个角色（按 bestdori ID 排序）

| bestdori ID | 角色 | 乐队 | 加入年份 |
|---|---|---|---|
| 26 | Mashiro Kurata | Morfonica | 2020 |
| 27 | Touko Kirigaya | Morfonica | 2020 |
| 28 | Nanami Hiromachi | Morfonica | 2020 |
| 29 | Tsukushi Futaba | Morfonica | 2020 |
| 30 | Rui Yashio | Morfonica | 2020 |
| 31 | LAYER | RAS | 2018 |
| 32 | LOCK | RAS | 2018 |
| 33 | MASHU | RAS | 2018 |
| 34 | PAREO | RAS | 2018 |
| 35 | CHU² | RAS | 2018 |
| 36 | Tomori | MYGO | 2023 |
| 37 | Anon | MYGO | 2023 |
| 38 | Raana | MYGO | 2023 |
| 39 | Soyo | MYGO | 2023 |
| 40 | Taki | MYGO | 2023 |
| 41+ | Ave Mujica (5 名) | Ave Mujica | 2024 |

> 注：最佳查询方法 — 打开 `https://bestdori.com/tool/explorer/asset/cn/sound/voice/birthday` 看完整目录

## 获取缺失角色音频的去处

### 优先级 1：voice/birthday 后续年份
- 打开 `https://bestdori.com/tool/explorer/asset/cn/sound/voice/birthday`
- 找 `2020BDRE-XXX`、`2021BDRE-XXX` 等文件夹
- 下载 Morfonica 5 人（2020+ 才有）
- 下载 RAS 5 人（如果有 2018-2019 之外的年份）
- 下载 MYGO 5 人（2023+ 才有）
- 下载 Ave Mujica 5 人（2024+ 才有）

### 优先级 2：voice/ingame（每个角色都有）
- 路径：`https://bestdori.com/tool/explorer/asset/cn/sound/voice/ingame`
- 子目录 `startvoice/`（开始播放语音）+ `fullcombovoice/`（全连击语音）
- 每个文件 1-2 句台词，**包含全部 49 角色**

### 优先级 3：voice/scenario（剧情语音，覆盖最全）
- 路径：`https://bestdori.com/tool/explorer/asset/cn/sound/voice/scenario`
- 数量最大（几百个事件），每个角色在各种故事线都有台词

## 命名规范化（让代码能识别）

**当前目录结构**（你下载的）：
```
assets/audio/birthday/2019BDRE-KM.mp3
```

**目标结构**（代码期望）：
```
assets/audio/kasumi/1.mp3    # bestdori ID 1 = Kasumi
assets/audio/kasumi/2.mp3
assets/audio/kasumi/3.mp3
...
```

**重命名/移动命令**（手动执行或写个 shell 脚本）：

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest/assets/audio
mkdir -p kasumi tae rimi sayaka arisa ran moca himari tsugumi tomo
mkdir -p aya chisato maya eve hina yukina sayo lisa rinko ako
mkdir -p kokoro kaoru hagumi kanon misaki

# 2019 已有 → 移动并重命名
mv birthday/2019BDRE-KM.mp3 kasumi/1.mp3
mv birthday/2019BDRE-TE.mp3 tae/1.mp3
mv birthday/2019BDRE-RM.mp3 rimi/1.mp3
mv birthday/2019BDRE-SA.mp3 sayaka/1.mp3
mv birthday/2019BDRE-AR.mp3 arisa/1.mp3
mv birthday/2019BDRE-RA.mp3 ran/1.mp3
mv birthday/2019BDRE-MC.mp3 moca/1.mp3
mv birthday/2019BDRE-HM.mp3 himari/1.mp3
mv birthday/2019BDRE-TG.mp3 tsugumi/1.mp3
mv birthday/2019BDRE-TM.mp3 tomo/1.mp3
mv birthday/2019BDRE-AY.mp3 aya/1.mp3
mv birthday/2019BDRE-CI.mp3 chisato/1.mp3
mv birthday/2019BDRE-MY.mp3 maya/1.mp3
mv birthday/2019BDRE-EV.mp3 eve/1.mp3
mv birthday/2019BDRE-HI.mp3 hina/1.mp3
mv birthday/2019BDRE-YK.mp3 yukina/1.mp3
mv birthday/2019BDRE-SY.mp3 sayo/1.mp3
mv birthday/2019BDRE-LS.mp3 lisa/1.mp3
mv birthday/2019BDRE-AK.mp3 ako/1.mp3
mv birthday/2019BDRE-RN.mp3 rinko/1.mp3
mv birthday/2019BDRE-KO.mp3 kokoro/1.mp3
mv birthday/2019BDRE-KA.mp3 kaoru/1.mp3
mv birthday/2019BDRE-HG.mp3 hagumi/1.mp3
mv birthday/2019BDRE-KN.mp3 kanon/1.mp3
mv birthday/2019BDRE-MI.mp3 misaki/1.mp3

# 完成后可以删除 birthday/ 目录
rmdir birthday
```

## samples.js 调整

下载到更多音频后，可以更新 `src/data/samples.js`：

```js
// 当前（模板占位）
export const SAMPLES = {
  kasumi: ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
  // ...
};

// 改后（实际文件）
export const SAMPLES = {
  kasumi: ['1.mp3', '2.mp3', '3.mp3'],  // 实际下载到 3 条
  tae: ['1.mp3'],                         // 只下到 1 条
  // 空数组的角色 quiz 会自动跳过
  mashiro: [],  // 没下到
};
```

## 建议

**短期内**（5 分钟内可完成）：
1. 把 25 个生日音频按上表重命名 + 移动到 `assets/audio/<id>/1.mp3`
2. 25 角色足够跑端到端 demo（5 个原始乐队完整）

**中期**（30 分钟）：
1. 浏览器打开 `https://bestdori.com/tool/explorer/asset/cn/sound/voice/birthday`
2. 下载 `2020BDRE-XXX` → Morfonica 5 人
3. 下载 `2023BDRE-XXX` → MYGO 5 人
4. 下载 `2024BDRE-XXX` → Ave Mujica 5 人

**如果 RAS 仍未在 birthday 找到**（2018 年加入但生日音频可能缺失）：
- 退回到 `voice/ingame/startvoice/character<id>/` 找每人的开场语音

---

**最后：你的猜测对了**。文件名的最后俩字母确实是角色代号，但代号规则不公开（像是游戏内 hash 取首末字母），所以必须借助 bestdori 目录结构和已知信息来反推。25 个原始角色可以准确映射，后 24 个需要你提供真实文件才能确认代号。