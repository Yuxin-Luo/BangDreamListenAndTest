# 音频资源来源调查（2026-07-15）

## 背景
本项目需要 49 个角色每人 >=3 条语音样本（bestdori 已确认全部返回 HTML 占位符）。
本调查旨在找到至少 3-5 个可用候选源。

---

## 已确认不可用（已知失败，5min 内验证）

| 来源 | URL 模式 | 问题 | 耗时 |
|---|---|---|---|
| bestdori.com | `sound/voice/character/<id>.mp3` | HTTP 200 但内容是 HTML | 2min |
| bestdori.com (备用路径) | `sound/vo/<id>_01.mp3` 等 | HTTP 200 但内容是 HTML | 2min |
| bangdream.fandom.com | wiki pages | 402 Payment Required | 1min |
| 萌娘百科 (mzh.moegirl.org.cn) | character pages | 403 Forbidden | 1min |
| BWIKI (wiki.biligame.com) | `/bangdream/香澄` | 页面无 mp3 链接 | 3min |

---

## 候选源调查（按优先级排序）

### 1. 百度百科 (baidu.com) — ❌ 不可用
**URL**: `https://baike.baidu.com/item/BanG%20Dream!/19290509`  
**测试结果**:
- BanG Dream 主条目：百度安全验证拦截（返回标题「百度安全验证」）
- MYGO!!!!! 条目：同样被拦截
- Ave Mujica 条目：页面加载（65KB），但无任何 `<img>` 标签，内容为空壳
**可获取内容**: 0 个角色  
**反爬**: 强（安全验证 + UA 检测）  
**风险**: 高，完全无法获取

---

### 2. GitHub 开源仓库 — ⚠️ 间接可用（无直接音频）
**搜索关键词**: `bandori voice`, `banG dream audio`, `bestdori`  
**发现的有用仓库**:

| 仓库 | 说明 | 音频情况 | Stars |
|---|---|---|---|
| `HELPMEEADICE/BANDORI-PET-REV` | Live2D 桌面宠物，支持 50+ 角色 300+ 服装 | 无音频，但可能有角色 ID 映射 | 327 |
| `MagiCircles/BanGDream` | BanG Dream 社区数据库 | 仓库不可访问 | 68 |
| `BandoriDatabase/bangdream-data-api` | 公共 API | data 目录为空 | 30 |
| `bangdream-NA/bandori-fans` | Fan-made archive | 仅 README，无音频文件 | 10 |
| `NonSpicyBurrito/sonolus-bandori-engine` | 游戏引擎复刻 | 无音频资源 | 25 |

**评估**: 无仓库直接提供可下载的 MP3 音频文件。最佳策略是利用 `BandoriDatabase/bangdream-data-api` 的 API 端点（如有 voice 相关）来获取音频 URL。

---

### 3. Bilibili (bilibili.com) — ⚠️ 无法自动化获取
**测试**:
- `api.bilibili.com/x/web-interface/search/all/v2?keyword=BanG Dream 音声` → 返回分类（tips/brand_ad/esports），无直接音频
- B 站音频需要登录且有 referer 检查，无法通过 curl 直接获取

**风险**: 高，无法自动化

---

### 4. YouTube / Niconico / Pixiv — ⚠️ 无法获取
**测试**:
- YouTube 搜索结果：需要 JS 渲染，curl 无法获取
- Niconico：返回空
- Pixiv：返回空

**风险**: 高，无法自动化获取

---

### 5. BWIKI 角色页面 — ❌ 无音频内容
**测试**: `wiki.biligame.com/bangdream/香澄` 页面 HTML 中无任何 `.mp3` 链接  
**反爬**: 中等（需要正确 UA）  
**结论**: 页面只有文本和图片，无音频

---

### 6. bestdori.com JS bundle 分析 — ❌ 无结果
**测试**: 下载并搜索 `InfoCharactersSingle.e0ad696f.js` 中的 `.mp3` 字符串  
**结果**: 无任何音频 URL 模式

---

### 7. 第三方 CDN 镜像 — ❌ 无发现
**测试**:
- `raw.githubusercontent.com/bestdori/bandori-resources/main/README.md` → 404
- `bestdori.info` → 无响应
- `bandori.io` → 无响应

---

## 结论

### 可用候选源数量：0 个直接可用

**音频获取阻塞原因总结**:
1. bestdori 音频路径已失效（全部返回 HTML）
2. 所有替代源（百度/BWIKI/萌娘）均有强反爬或无音频内容
3. GitHub 无任何仓库包含实际音频文件
4. 视频/图片平台无法自动化下载音频

### 推荐下一步动作

1. **手动录制方案**（最可靠）:
   - 从游戏内截图 + 录音
   - 或从 B 站官方账号视频中提取音轨

2. **众包采集**:
   - 发动社区成员贡献语音样本
   - 建立共享音频库

3. **官方渠道申请**:
   - 联系 Bushiroad 申请非商业用途授权
   - 或购买官方语音集 CD

4. **技术方案**（难度高）:
   - 解包游戏 APK 中的语音资源（需 Android 模拟器 + apktool）
   - 从游戏直播/视频中用语音识别提取

---

## 时间记录
- 百度百科测试：5min（被拦截）
- GitHub 仓库搜索：5min（无音频文件）
- BWIKI 音频扫描：3min（无 mp3）
- Bilibili API：2min（无结果）
- bestdori JS 分析：3min（无结果）
- 其他源（Niconico/Pixiv/YouTube）：2min（无法自动化）
- **总计：约 20min**
