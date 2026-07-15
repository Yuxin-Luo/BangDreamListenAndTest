# 资源获取策略（2026-07-15）

## 限制（来自 Agent Rules + Spec）
- 搜索可用源：5 min
- 单条下载：≤180 s
- 找不到：整理进 `04-resource-missing-2026-07-15.md`

## 搜索优先级

### 图片
1. bangdream.fandom.com（英文 wiki，图片齐全）
2. 萌娘百科「BanG Dream!」系列词条
3. 邦邦官方 anime 官网
4. 微博/B 站官方账号

### 音频（主声线代表性台词）
1. bestdori.com（聚合语音库）
2. bangdream.fandom.com（部分语音）
3. 萌娘百科「BanG Dream! 语音集」词条

## 格式
- 图片：PNG（CSS 缩放到 4:5）
- 音频：MP3（角色台词 < 200 KB）

## 并行下载
使用 `xargs -P 8 -n 1` 或 `curl -Z` 控制并发，避免单 IP 限速。

## 资源获取优先级（快速上线导向）
1. **9 乐队图标** — 必须（展示乐队选择用）
2. **Kasumi 失败图** — 必须（猜错时反馈）
3. **至少 9 角色 × 3 音频** — 最少 demo 可玩（每乐队 1 名代表角色）
4. **更多音频** — 时间允许则继续
5. **角色立绘** — 次优先（如果下载顺利）

## 来源发现策略
- Fandom wiki 页面 HTML 中包含 `static.wikia.nocookie.net` 格式的直接图片 URL
- bestdori.com 语音库提供直接 MP3 链接
- 使用 WebFetch 抓取页面后用 grep 提取 URL
