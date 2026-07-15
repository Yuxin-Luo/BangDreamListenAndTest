# 音频下载指南（用户手工下载用）

> 调研时间：2026-07-15 | 调研范围：bestdori / GitHub / Bilibili / 视频平台 / fan 存档

---

## 结论摘要

**没有任何直链 MP3 URL 可用于自动化下载。** 全部已知的公开音频 URL 路径均返回 HTML 占位符（bestdori）或需要登录/JS 渲染（其他平台）。

以下提供用户可在浏览器中手工操作的替代方案。

---

## 来源 1：bestdori.com 语音工具页（推荐 ⭐）

- **页面 URL**：https://bestdori.com/tool/voice
- **直接 MP3 URL 模式**：无（所有已知路径均返回 HTML）
- **验证结果**：
  ```
  curl -I "https://bestdori.com/sound/voice/character/1.mp3"
  → HTTP/2 200, content-type: text/html  ← 是 HTML，不是 MP3

  curl -I "https://bestdori.com/api/voice/1"
  → HTTP/2 200, content-type: text/html  ← 是 HTML，不是 JSON

  curl -I "https://bestdori.com/assets/sound/voice/character/1.mp3"
  → HTTP/2 200, content-type: text/html  ← 是 HTML，不是 MP3
  ```
- **覆盖角色**：bestdori IDs 1–49（但全部被拦截，返回 HTML）
- **下载步骤**：
  1. 在浏览器中打开 https://bestdori.com/tool/voice
  2. 在页面左侧选择角色（如「香澄」）
  3. 点击角色语音条目旁的播放按钮
  4. 在浏览器开发者工具 → Network 面板中，找到 `.mp3` 请求
  5. 右键 → Copy as cURL → 修改为下载命令
- **限制**：
  - 浏览器需保留在 bestdori.com 页面（音频 URL 有时效性/鉴权）
  - 无法批量获取，每次只能手动复制一个 URL
  - bestdori 已确认对所有 voice 路径返回 HTML 占位符（可能资源已下架）

---

## 来源 2：Bilibili 官方账号视频（需手工提取音频）

- **页面 URL**：https://www.bilibili.com/video/BV14x411y7XU/
  - 标题：BanG Dream! Girls Band Party! beta版 Band story Poppin'Party
  - 内含角色语音（花園たえ / 戸山香澄 / 牛込りみ / 山吹沙綾 / 市ヶ谷有咲 的对话）
- **直接 MP3 URL 模式**：无（B站音视频为 m4s/ts 分片，无法直接获取）
- **验证结果**：
  ```
  curl -I "https://www.bilibili.com/video/BV14x411y7XU/"
  → HTTP/2 301 → redirect（需要浏览器 cookie/session）
  ```
- **覆盖角色**：部分角色（取决于具体视频内容）
- **下载步骤**：
  1. 在浏览器打开目标 Bilibili 视频页面
  2. 按 F12 打开开发者工具 → Network 面板
  3. 播放视频，在 Network 中找到类型为 `media` 或 `x-mpegURL` 的请求
  4. 复制该请求的 URL，用浏览器下载工具（如 IDM、迅雷）下载
  5. 用 FFmpeg 合并分片：`ffmpeg -i "index.m3u8" -c copy output.mp4`
  6. 用 `ffmpeg -i output.mp4 -vn -c:a copy output.mp3` 提取音频
- **其他可用 Bilibili 视频**：
  - `BV1oo4y1C7xE` — BanG Dream! FILM LIVE 2nd Stage 60秒PV
  - `BV1Ny4y127iA` — SPECIAL 谱面合集（2022.02.04更新）
- **限制**：
  - 需要登录 Bilibili 账号
  - 视频音频为分片格式（.m4s），无法直接下载完整 MP3
  - 部分视频有地域限制或需要大会员

---

## 来源 3：网易云音乐 电台节目（歌曲为主，非角色语音）

- **页面 URL**：https://music.163.com/program?id=2538199419
  - 标题：ドラマチック!アライブ - BanG Dream! 解包专辑歌曲试听合集
- **直接 MP3 URL 模式**：有，但为歌曲而非角色语音
- **验证结果**：需浏览器 UA + 登录 cookie
- **覆盖角色**：无角色语音（仅为乐队歌曲）
- **下载步骤**：
  1. 在浏览器打开网易云音乐页面
  2. 开发者工具 Network 面板中找到 `audio` 类型的 `.mp3` 请求
  3. 复制 URL 下载
- **限制**：
  - 网易云的音频 URL 有时效性（签名验证）
  - 主要为歌曲，非角色语音
  - 无法批量获取

---

## 来源 4：游戏 APK 解包（技术难度高）

- **说明**：BanG Dream! 游戏的 APK 中包含所有角色语音文件（.mp3）
- **获取方式**：
  1. 安装 Android 模拟器（如 BlueStacks、雷电模拟器）
  2. 安装 BanG Dream! 游戏并获取语音包
  3. 使用 APKTool 解包：`apktool d game.apk`
  4. 语音文件通常在 `assets/sound/voice/` 或类似目录
- **URL**：无（需用户自行操作）
- **覆盖角色**：全部 49 角色（游戏内置完整语音库）
- **限制**：
  - 需要 Android 模拟器或 Root 设备
  - APKTool 操作有技术门槛
  - 游戏可能需要最新版本才能获取全部语音

---

## 来源 5：官方商品（最可靠但需付费）

- **BanG Dream! 角色语音 CD**
  - 可在 Amazon Japan、らしんばん、 animate 等购买
  - 搜索关键词：`バンドリ キャラボイス CD`
- **限制**：需付费，无法免费获取

---

## 推荐下载方案（按可行性排序）

| 方案 | 成本 | 难度 | 覆盖率 | 推荐度 |
|------|------|------|--------|--------|
| 1. B站视频提取音频 | 免费 | 中 | 部分角色 | ⭐⭐⭐ |
| 2. bestdori 页面手工复制 URL | 免费 | 低 | 部分角色 | ⭐⭐ |
| 3. 游戏 APK 解包 | 免费 | 高 | 全部角色 | ⭐⭐ |
| 4. 购买官方 CD | 付费 | 低 | 全部角色 | ⭐ |

---

## 已验证不可用（无需重试）

| 来源 | URL 模式 | 问题 |
|------|----------|------|
| bestdori.com | `sound/voice/character/<id>.mp3` | HTTP 200 但 content-type: text/html |
| bestdori.com | `api/voice/<id>` | HTTP 200 但 content-type: text/html |
| bestdori.com | `assets/sound/voice/character/<id>.mp3` | HTTP 200 但 content-type: text/html |
| bangdream.fandom.com | wiki pages | HTTP 402 付费墙 |
| 萌娘百科 | character pages | HTTP 403 反爬 |
| 百度百科 | character pages | 安全验证拦截 |
| BWIKI | `/bangdream/香澄` | 页面无 mp3 链接 |
| GitHub | 搜索 `bandori voice mp3` | 无仓库含实际 MP3 文件 |
| Niconico / Pixiv / YouTube | 搜索结果 | 需 JS 渲染，无法 curl |

---

*文档更新时间：2026-07-15*
