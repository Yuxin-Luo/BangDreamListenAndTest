# Task 3-Audio-URL Brief：找到音频下载 URL 清单

## 上下文
用户要自己下载音频。我提供 URL 清单（页面 URL + 直链 URL），用户在浏览器里手动下载。

## 工作目录
`/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest`

## 已读到的上下文（不要再重复验证）
- `dev-docs/05-audio-source-survey-2026-07-15.md`：上一轮调研结论 0 直接可用
- `.superpowers/sdd/task-3-handoff-2026-07-15.md`

## 任务：找到能用的 URL 清单（用户浏览器访问）

**关键区别：**
- 之前调研用 curl 失败 → 不代表浏览器也不行
- 用户用浏览器访问 → 可绕过 UA 检测、JS 验证、cookie 验证
- **目标：找到浏览器里能正常播放 / 下载的 URL**

## 必做交付

### 1. 在 bestdori.com 里找到「实际可工作的音频 URL 模式」
- 用 curl + 浏览器 UA（如 `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`）+ 正确 Referer + 可能要带 Cookie
- 分析 bestdori 的 `/tool/voice` 页面在浏览器里实际请求了哪些 API 端点 / MP3 URL
- 用 curl 的 `-I` 看响应头判断 content-type 是不是 `audio/mpeg`
- 试：
  - `https://bestdori.com/api/voice/...`
  - `https://bestdori.com/assets/...` （不同子路径）
  - `https://bestdori.info/...`
  - `https://cdn.bandori.bestdori.com/...`
- **如果某个 URL 用浏览器 UA 能拿到真 MP3**，记录完整 URL 模板

### 2. 找直链聚合站（fan-made）
- 搜 GitHub：`bandori-voice`、`bangdream-audio`、`bandori-mp3`
- 搜 "BanG Dream voice download" "バンドリ キャラボイス 一括"
- 可能有：fan 个人博客、Discord 频道、archive.org 镜像
- 关键是找到 **任何可公开访问的、能直接 download MP3 的 URL**

### 3. 视频平台音频提取
- B 站有官方账号上传的角色语音合集视频
- 找：搜 `bangdream_bili`（官方账号）的视频列表
- 用户可以自己用浏览器开发者工具抓视频里的 .m4s/.mp4
- 提供 2-3 个具体视频 URL 作为「从这里提取」的指引

### 4. 写一份用户友好的清单

`/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest/dev-docs/06-audio-download-guide-2026-07-15.md`

格式：
```markdown
# 音频下载指南（用户手工下载用）

## 来源 1：[来源名]（推荐 ⭐）
- **页面 URL**：https://...
- **直接 MP3 URL 模式**：https://.../<id>.mp3
- **验证**：用 curl + 浏览器 UA 测试，返回 audio/mpeg
- **覆盖角色**：1-49（bestdori ID 体系）
- **下载步骤**：
  1. 打开页面
  2. 找到香澄
  3. ...
- **限制**：每 IP 每小时限 N 个 / 需要登录 / etc

## 来源 2：...
```

## 限制
- **不要下载任何文件**（你自己也不要下，给用户 URL 即可）
- 只查 URL 模式 + 用 curl 验证 content-type
- 时间预算 ≤ 20 min

## 完成报告
更新 `/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest/.superpowers/sdd/task-3-audio-url-report.md`：
- Status: DONE
- 找到 N 个可用源
- 每个源的 URL 模板 + 验证证据
- 用户手工下载建议

## 关键
- **不要假装找到** — 如果试完所有思路仍无解，明确说「无解」，让用户自己用浏览器试
- 失败时至少给出 bestdori 的官方 voice 工具页（用户自己去手动操作）