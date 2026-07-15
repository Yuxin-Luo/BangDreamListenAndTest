# 架构决策记录（2026-07-15）

## 模块最终结构

```
src/
├── main.js                          # 启动入口 + 错误条
├── core/
│   ├── audio.js                     # HTMLAudioElement 播放引擎
│   ├── quiz.js                      # 测验状态机
│   └── tabs.js                      # Tab 控制器（top-level + band）
├── data/
│   ├── bands.js                     # 9 乐队元数据
│   ├── characters.js                # 45+ 角色元数据
│   └── samples.js                   # 每角色样本文件名
├── i18n/
│   ├── index.js                     # 运行时 + locale 持久化
│   ├── zh.js / en.js / ja.js        # 字典
├── storage/
│   └── progress.js                  # localStorage 进度
└── ui/
    ├── app.js                       # 顶层控制器（quiz+intro+tabs 串联）
    ├── quiz.js                      # 测验视图渲染
    ├── intro.js                     # 介绍视图渲染
    ├── character.js                 # 角色卡片渲染
    ├── band-tabs.js                 # 乐队 Tab 条
    ├── score.js                     # 分数显示
    ├── paths.js                     # 文件系统路径映射
    └── main.css                     # 浅色样式（粉色主题）
```

## 关键架构决策

### 1. 状态分层
- `quiz.js` 状态机：纯逻辑，无 DOM/无 audio 直接调用
- `ui/app.js`：把 quiz 状态变化 → DOM 更新
- `core/audio.js`：纯播放接口（playSample/stop/hasSamples）
- 单向数据流：用户操作 → quiz.js 改变 state → app.js 读 state → 重渲染 DOM

### 2. 数据 vs UI 分离
- 数据层（bands/characters/samples）纯数据，无方法
- UI 层（quiz/intro/character）只渲染，不存状态
- 状态集中在 quiz.js

### 3. 文件系统映射
- `assets/audio/<bandId>/<charId>/<n>.mp3` — 路径 = `bandId + charId + 序号`
- `assets/images/character/<bandDisplayName>/<charId>.png` — 目录名带空格/撇号（实际文件名）
- `src/ui/paths.js` 集中映射 bandId ↔ 目录名

### 4. Ave Mujica 处理
- 用户明确要求不再开发
- 仍保留 5 角色元数据（图片保留）+ SAMPLES 空数组
- `app.js` 启动时过滤 PLAYABLE_BANDS 排除 Ave Mujica → 不显示 Tab
- samples.js 注释说明此约定

### 5. 音频容错
- audio.js 用 HTMLAudioElement（不依赖 Web Audio API）
- play() promise reject → onNotFound 回调 → UI 自动 newQuestion
- audio error 事件 → 同上
- 整套：用户感知不到"该角色没音频"

### 6. i18n 简洁
- 字典平铺：`{ tab: { quiz, intro }, quiz: { play, retry, ... } }`
- `t('quiz.correct')` 查表 + 支持 `{var}` 插值
- locale 存 localStorage，下次启动恢复
- 切换语言只触发 i18n:applied 事件 → 各 UI 重渲染

### 7. 测试策略
- 8 个测试文件，86 用例全通过
- audio.js 用 vi.fn + 假 Audio 替代全局 Audio
- UI 测试用 happy-dom（不真启动 audio）
- quiz.js 用 vi.mock 隔离 audio.js

## 踩坑历史

1. **`switch` 函数名** — 是关键字 → 改名为 `setActive`
2. **Ave Mujica zip 重复** — `601-Misaki_Okusawa` 与 `15-Michelle` 同角色，跳过
3. **audio 404** — early-return Promise.resolve() 路径不创建 audio，测试要分两条覆盖
4. **happy-dom classList** — 给 disabled 按钮加 classList 时不会触发渲染，需测后立即查询

## 验收

```
npx vitest run
  Test Files  8 passed (8)
  Tests       86 passed (86)
```

启动：`python3 -m http.server 8000` → `http://localhost:8000/`

## 下一步（已不在本期范围）

- Task 11+: 全分支代码审查（如果未来扩展需要）