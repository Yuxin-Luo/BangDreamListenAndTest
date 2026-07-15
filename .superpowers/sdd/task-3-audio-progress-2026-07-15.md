# 音频突破进展（2026-07-15）

## 已确认的事实（突破点）

### 1. bestdori 有完整的资源清单 API
```
GET https://bestdori.com/api/explorer/cn/assets/_info.json
→ 609KB JSON，包含所有游戏资源的文件夹 + 文件计数
```

### 2. 角色 ID 体系确认
- 49 个 main 角色，ID 1-49
- `character1` = Kasumi，`character2` = Tae，...（已被 `_info.json` 中 `voice/birthday/character1` 等键证明）
- 角色名 + 乐队映射：`https://bestdori.com/api/characters/main.3.json`（已下载 13KB JSON，含 characterName / bandId）

### 3. 文件夹结构（manifest 部分）
```
sound/voice/
  ├── backstage/       (各 talkset 文件夹)
  ├── birthday/        ← 有 character1-character211 子文件夹（每个 = 3 个音频）
  ├── ingame/
  │   ├── fullcombovoice/  (125 个文件)
  │   └── startvoice/      (125 个文件)
  ├── scenario/        (大量故事事件)
  ├── system/
  ├── systeminteraction/
  ├── loginbonus/
  ├── gacha/
  └── newsituationintroduction/

sound/voice_stamp/      (int = 总数，未展开)
```

### 4. 关键限制
- `_info.json` 只给**文件计数**（int），不列**文件名**
- 直接试 `https://bestdori.com/assets/cn/sound/voice/<path>.mp3` **全部返回 text/html 占位符**（bestdori nginx 拦截）
- 只有用户在浏览器里**点击文件**触发 XHR 时，浏览器才知道真实 URL

## 卡点

**我们不知道单个 mp3 文件的真实文件名模板。**

可能格式（待验证）：
- `vo_<charId>_<line>.mp3`
- `vo_<charId>_<line>_<variant>.mp3`
- `character<id>/<scene>_<line>.mp3`

需要 1 个真实 URL 就能反推整个模板。

## 请用户协助（30 秒操作）

1. 浏览器打开 `https://bestdori.com/tool/explorer/asset/cn/sound/voice/birthday/character1`
2. F12 → Network 面板
3. 在左侧文件列表**点击任意一个 .mp3 文件**
4. 在 Network 面板中找以 `.mp3` 结尾的请求
5. 右键 → Copy → Copy URL
6. 把 URL 粘给我

我拿到 1 个 URL 就能反推：
- 文件名模板（推断全部文件名）
- 真实下载路径（curl 用浏览器 cookie 可下）

## 反推完成后能做的事

立即生成 `dev-docs/06-audio-mapping-2026-07-15.md`，含：
- 49 角色 ID → 真实 mp3 URL 列表
- 每个角色 ≥3 条样本 URL
- 浏览器/curl 下载命令

用户批量下载 → 解压到 `assets/audio/<charId>/` → 即可被 quiz 引擎使用。