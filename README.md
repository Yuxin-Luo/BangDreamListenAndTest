# BanG Dream 听声音猜角色 / Listen & Guess

> 一个用听角色语音来猜角色名字的轻量网页小游戏。BanG Dream 9 支乐队 × 40 位角色的语音题库,中文 / English / 日本語 三语界面。

![status](https://img.shields.io/badge/status-MVP-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![i18n](https://img.shields.io/badge/i18n-zh%20%2F%20en%20%2F%20ja-orange)

## ✨ 功能特性

- 🎵 **听声音猜角色** — 播放 5 条角色语音中随机一条,从 5 张角色卡里选出正确答案
- 🎸 **9 支乐队** — Poppin'Party / Afterglow / Pastel*Palettes / Roselia / Hello, Happy World! / Morfonica / RAISE A SUILEN / MYGO!!!!! / Ave Mujica(本仓库不包含 Ave Mujica 音频)
- 🌐 **三语界面** — 中文 / English / 日本語,语言选择会持久化到 localStorage
- 📊 **进度持久化** — 累计对错数、按角色统计错题,数据存在浏览器本地
- 🎯 **辅助按钮** — 重试(同题再来一次)、下一题(随机换题)、提示乐队、答案揭晓
- ⚡ **零构建** — 纯 ES Modules + 原生 HTML,无打包步骤
- 🧪 **96 个测试用例通过** — vitest + happy-dom

## 🚀 快速开始

需要 Python 3.x(用于静态服务器)和 Node.js 18+(用于测试)。

```bash
# 1. 安装依赖(可选,仅运行测试需要)
npm install

# 2. 启动开发服务器
python3 -m http.server 8000

# 3. 浏览器访问
open http://localhost:8000/
```

或者直接打开 `index.html`(部分浏览器对 ES Modules 有 `file://` 限制,**推荐用 HTTP 服务器**)。

### 运行测试

```bash
npm test
```

## 🖼 截图 / Demo

打开 `http://localhost:8000/`,默认进入"听声音猜角色"标签页:

```
┌──────────────────────────────────────────────────┐
│  🎵 听声音猜角色   📖 乐队·角色介绍  [中文][EN][日] │
├──────────────────────────────────────────────────┤
│  [▶️ 播放声音]    已答：0 对 0 错                │
│  [Poppin'Party][Afterglow][Pastel*Palettes]...   │
├──────────────────────────────────────────────────┤
│  [角色卡] [角色卡] [角色卡] [角色卡] [角色卡]    │
├──────────────────────────────────────────────────┤
│  [重试] [下一题] [提示乐队] [答案]                │
└──────────────────────────────────────────────────┘
```

## 📂 项目结构

```
.
├── index.html                  # 入口 HTML(包含语言切换器)
├── src/
│   ├── main.js                 # 启动入口 + 错误条
│   ├── core/
│   │   ├── audio.js            # HTMLAudioElement 播放引擎
│   │   ├── quiz.js             # 测验状态机 (idle/awaitPick/playing/answered)
│   │   └── tabs.js             # Tab 控制器 (top-level + band)
│   ├── data/
│   │   ├── bands.js            # 9 支乐队元数据
│   │   ├── characters.js       # 45 位角色元数据(三语姓名)
│   │   └── samples.js          # 每角色样本文件名清单
│   ├── i18n/
│   │   ├── index.js            # 运行时 + locale 持久化
│   │   ├── zh.js / en.js / ja.js  # 字典
│   ├── storage/
│   │   └── progress.js         # localStorage 进度(总分 + 按角色错题 + 历史)
│   └── ui/
│       ├── app.js              # 顶层控制器(quiz + intro + tabs 串联)
│       ├── quiz.js             # 测验视图渲染(角色网格 + 结果区)
│       ├── intro.js            # 介绍视图渲染(乐队描述 + 角色卡片)
│       ├── character.js        # 角色卡片组件
│       ├── band-tabs.js        # 乐队 Tab 条
│       ├── score.js            # 分数显示
│       ├── paths.js            # bandId ↔ 文件系统目录映射
│       └── main.css            # 浅色样式
├── tests/                      # vitest 单元测试(8 文件 / 96 用例)
├── assets/
│   ├── audio/<bandId>/<charId>/{1..5}.mp3
│   └── images/
│       ├── character/<bandDisplayName>/<charId>.png
│       ├── band/icon/<bandDisplayName> 100.webp
│       ├── band/groupPic/<bandDisplayName>.jpg
│       └── fail/crying.jpg
├── docs/
│   └── specs/                  # 设计文档
├── dev-docs/                   # 架构 + 修复记录
├── research/                   # 数据来源调查 (XML)
├── CLAUDE.md                   # 项目索引 + Agent 工作规则
├── LICENSE                     # MIT 许可证
└── package.json
```

## 🏗 架构

单向数据流:

```
用户操作 → ui/app.js → core/quiz.js (改变 state)
                          ↓
                  ui/app.js 读 state → 重渲染 DOM
                          ↓
                  core/audio.js 播放 / 停止音频
                          ↓
                  storage/progress.js 持久化
```

详见 [`dev-docs/09-architecture-2026-07-15.md`](./dev-docs/09-architecture-2026-07-15.md)。

## 🧪 测试

```bash
npm test
# Test Files  8 passed (8)
# Tests       96 passed (96)
```

覆盖:
- `audio.test.js` — 播放 / 停止 / 错误处理 / 多周期复用
- `quiz.test.js` — 状态机转换 / 重试 / 跨阶段点击
- `tabs.test.js` — top + band 双层 tab
- `progress.test.js` — localStorage 降级 / schema 迁移
- `i18n.test.js` — 三语字典完整性
- `ui.test.js` — DOM 渲染 + i18n 重渲
- `app.test.js` — 顶层控制器集成
- `data.test.js` — 数据一致性

## 🤝 贡献

欢迎贡献!但请注意以下几点:

1. **不要提交新的第三方音频 / 图片到 `assets/`** — 这些是 BanG Dream 的版权资产,不属于 MIT 许可范围
2. **新增乐队 / 角色** — 修改 `src/data/bands.js` 和 `src/data/characters.js`,并在 `src/i18n/{zh,en,ja}.js` 添加翻译
3. **新增测试** — 在 `tests/` 下对应模块添加 vitest 用例
4. **运行 `npm test` 确保通过**

## ⚠️ 第三方资产版权声明

**本项目是一个非官方粉丝项目,与 BanG Dream! 官方无关。**

仓库中包含的音频 (`assets/audio/`) 和图片 (`assets/images/`) 来自 BanG Dream! 企划,版权属于:

- **Bushiroad Inc.** — 企划方
- **Craft Egg Inc.** — 游戏开发方 (BanG Dream! Girls Band Party!)
- 各声优事务所

这些资产仅供**个人学习、研究、欣赏**使用,**不得用于商业用途**。如需删除这些资产:

```bash
# 删除音频
rm -rf assets/audio/

# 删除角色立绘
rm -rf assets/images/character/
```

代码本身(MIT License)可以在没有这些资产的情况下运行,只是不会有题目可玩 — UI 会显示空白占位符。

## 🙏 致谢

- **BanG Dream!** — 企划、音乐、声优演出 ([bushiroad.com](https://bushiroad.com/))
- **bestdori.com** — 角色/乐队元数据参考
- **MorsePractice** 仓库 — 架构模式参考(同作者早期项目)

## 📄 许可证

代码部分采用 **MIT License** — 详见 [LICENSE](./LICENSE)。

第三方资产(音频、图片)的所有权归各自权利人所有,不适用 MIT 许可。

## 📬 联系方式

- GitHub: [@Yuxin-Luo](https://github.com/Yuxin-Luo)
- Issues: [项目 issue 跟踪](https://github.com/Yuxin-Luo/BangDreamListenAndTest/issues)