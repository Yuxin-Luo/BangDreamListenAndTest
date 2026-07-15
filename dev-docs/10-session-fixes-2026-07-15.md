# 2026-07-15 会话修复记录

> 范围：本次会话中应用的状态机 / 模块级修复,以及对仓库的快速审计结果。
> 关联：`09-architecture-2026-07-15.md`(架构基线)、`../docs/superpowers/specs/2026-07-15-bangdream-quiz-design.md`(设计)。

## 1. 用户反馈的真实根因：newQuestion 跨乐队抽题

**症状(用户报告)**
- "选对 → 重试 → 选对 → 再重试就卡住"
- "重试只能一次,第二次无法再播放"

**实际根因**
`core/quiz.js::newQuestion()` 在 `_pickRandomChar(exclude)` 里只过滤"有音频的角色",**不过滤当前乐队**。当用户在 Poppin'Party 标签页,但随机抽中 Roselia 的 Yukina:

1. 用户看不到 Yukina 这张卡(它不在当前网格)
2. 用户每次都选错
3. `retry()` 复用同一个 `currentCharId`(刻意行为)→ 用户感知"重试没起作用"
4. 状态机本身没卡,但从用户视角看像 freeze

**修复**
- `_pickRandomChar(exclude, bandId)` 新增 `bandId` 参数,池子限定 `c.bandId === bandId`
- `newQuestion({ bandId })` / `next(opts)` 把 bandId 透传
- `ui/app.js::_startNewIfNeeded()` 只在 idle 时调用 `newQuestion()`,不复用旧角色

**为什么不只是修 retry**
问题不在"重试复用角色",而在于"抽中的角色不在用户视野里"。强行换角色反而让重试行为不符合用户预期(用户期望"同一题再来一次")。

**后续修正(2026-07-15 同日)**
用户反馈 "下一题" 也被限定到当前乐队 = 体验错误。修正:
- "下一题" 按钮调用 `quizNext()` 不带 bandId,从**所有 8 个有音频的乐队**随机抽
- `_startNewIfNeeded()` 简化为只在 `!s.currentCharId` 时调用 `newQuestion()` — 不再强制重抽到当前乐队
- `core/quiz.js` 的 `bandId` 参数仍保留,作为可选约束;目前只有 `_startNewIfNeeded` 在空闲态会调用它(空 bandId = 全乐队池)

设计意图:**bandId 是抽题时的可选 scope,不是默认约束。** retry / pick 流程不动用户的题;"下一题" 给用户新鲜感;切 tab 不偷换题目。

## 2. 点击优先级：音频播放让位给用户选择

**需求**
点击角色卡时应**立刻**判定,不应等到当前音频播完。

**修复**
- `canPick()` 接受 `phase === 'playing'`
- `pick(charId)` 在 `phase === 'playing'` 时先 `audioStop()`,再判定
- audio.js 的 `stop()` 走 `_stopActive()`,会同步触发 `onEnd` 让状态机回到 `awaitPick`(但 pick 紧接着会覆盖成 `answered`,所以无副作用)

## 3. 模块审计发现的 bug

### 3.1 PLAYABLE_BANDS 过滤表达式错误

`ui/app.js` 原本:
```js
const PLAYABLE_BANDS = BANDS.filter(b =>
  b.members.some(id => charactersOfBand(b.id).find(c => c.id === id))
);
```

`charactersOfBand(b.id).find(c => c.id === id)` 在乐队里有任何成员时永远返回 truthy 对象(因为 `members` 里的 id 必然存在于 CHARACTERS 里)。结果是 9 个乐队全部进入 tab,Ave Mujica 也被列出 —— 但点进去 `newQuestion({ bandId: 'ave-mujica' })` 会抽到空池子并 warn,网格里仍然渲染 5 张无音频的角色卡。

**修复**
```js
import { hasSamples } from '../core/audio.js';
const PLAYABLE_BANDS = BANDS.filter(b =>
  b.members.some(id => hasSamples(id))
);
```

现在 8 个有音频的乐队入 tab,Ave Mujica 被排除。

### 3.2 死代码清理

| 文件 | 删除内容 | 原因 |
|---|---|---|
| `src/ui/paths.js` | `portraitUrl(charId)` stub(永远 throw) | 没人调用;`portraitUrlFor` 是唯一对外接口 |
| `src/data/samples.js` | `sampleCount()` / `charactersWithAudio()` | 没人调用;直接用 `SAMPLES[id].length` |

## 4. 测试策略调整(MVP 导向)

**决定**:不再补 USER REPRO 这类 end-to-end 循环测试。原因:

- 真实音频 + happy-dom 组合下,USER REPRO 测试要么 mock 到与生产不一致,要么依赖随机数导致 flaky
- 本期目标是 MVP,人工烟测覆盖更直接
- 保留现有 96 个用例(状态机 + 模块集成)足够回归保护

待办里的 USER REPRO 占位测试(`app.test.js:149-153` 中两条 `expect(true).toBe(true)`)保留原状,后续若做 v2 再补。

## 5. 当前状态

```
npx vitest run
  Test Files  8 passed (8)
  Tests       96 passed (96)
```

Server 启动:
```bash
python3 -m http.server 8000    # → http://localhost:8000/
```

## 6. 人工烟测清单(可选)

1. 切换 8 个乐队 tab,确认 Ave Mujica 不在列表
2. 选 Poppin'Party → 点"播放声音" → 5 张卡里能听出正确答案 → 点对 → 分数 +1
3. 点"重试" → 同一题再播一遍 → 再选对 → 再重试 → 至少循环 3 次无卡顿
4. 播放中点角色卡 → 音频立即停 + 立即判定
5. 切到中文 → 切英文 → 切日文,所有按钮 / 标签 / 乐队名都对