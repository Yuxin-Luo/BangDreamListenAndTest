## Task 3：资源下载（图片 + 音频）

**Files:**
- Create: `assets/audio/<charId>/{1,2,3}.mp3`（约 147 个）
- Create: `assets/images/band/<bandId>.png`（9 个）
- Create: `assets/images/char/<charId>.png`（约 49 个）
- Create: `assets/images/fail/ksm-cry.png`（1 个）
- Update: `research/bands.xml`, `research/characters.xml`
- Create: `dev-docs/02-resource-strategy-2026-07-15.md`, `dev-docs/03-resource-acquisition-log-2026-07-15.md`, `dev-docs/04-resource-missing-2026-07-15.md`

**Step 3.1：写 `dev-docs/02-resource-strategy-2026-07-15.md`**

```markdown
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
```

**Step 3.2：写 `dev-docs/03-resource-acquisition-log-2026-07-15.md`（模板）**

```markdown
# 资源下载日志（2026-07-15）

每条资源一行：`[乐队/角色] [类型] [URL] [本地路径] [状态] [耗时]`

## 图片

| 时间 | 角色/乐队 | URL | 本地路径 | 状态 | 耗时 |
|---|---|---|---|---|---|

## 音频

| 时间 | 角色 | URL | 本地路径 | 状态 | 耗时 |
|---|---|---|---|---|---|
```

**Step 3.3：创建 `assets/` 目录骨架**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
mkdir -p assets/audio assets/images/band assets/images/char assets/images/fail
```

**Step 3.4：下载乐队图标（9 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

# 示例：Poppin'Party logo（替换为实际 URL）
curl -L --max-time 180 \
  -o assets/images/band/poppin-party.png \
  "https://example.com/poppin-party-logo.png"

# 其他 8 支同样方式下载，文件名按 bands.js 中的 id
# ... (afterglow, pastel-palettes, roselia, hhw, morfonica, ras, mygo, ave-mujica)
```

**注意**：执行 `curl` 前先把真实 URL 填进 `research/bands.xml` 的 `<logo-source>` 字段（首次下载时同步更新）。每条命令单独跑，便于记录成功/失败到 `03-acquisition-log`。

**Step 3.5：下载角色立绘（约 49 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

curl -L --max-time 180 \
  -o assets/images/char/kasumi.png \
  "https://example.com/kasumi-portrait.png"

# 其他 48 名同样方式下载，按 characters.js 的 id 命名
```

每条命令单独跑。失败则在 `03-acquisition-log` 标 ❌ 并加入 `04-resource-missing`。

**Step 3.6：下载 Kasumi 失败图（1 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest

curl -L --max-time 180 \
  -o assets/images/fail/ksm-cry.png \
  "https://example.com/kasumi-cry.png"
```

找不到时按 `dev-docs/04-resource-missing-2026-07-15.md` 整理。

**Step 3.7：下载角色音频（约 147 个）**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
mkdir -p assets/audio/kasumi

curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-1.mp3 \
  "https://example.com/kasumi-voice-1.mp3"
curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-2.mp3 \
  "https://example.com/kasumi-voice-2.mp3"
curl -L --max-time 180 \
  -o assets/audio/kasumi/kasumi-3.mp3 \
  "https://example.com/kasumi-voice-3.mp3"

# 其他 48 名同样方式
```

**Step 3.8：实际下载时同步更新日志**

把每条资源的：角色、URL、本地路径、状态（✅/❌）、耗时 填进 `03-acquisition-log`。失败的填进 `04-resource-missing`。

**Step 3.9：根据下载结果更新 `src/data/samples.js`**

对于凑不齐 3 条的角色，把 SAMPLES[id] 改成实际能下载到的列表（可能只有 1-2 条）。找不到任何音频的角色，整项设为 `[]`，quiz.js 会自动跳过。

```js
// src/data/samples.js（更新后示例）
export const SAMPLES = {
  'kasumi': ['kasumi-1.mp3', 'kasumi-2.mp3', 'kasumi-3.mp3'],
  'tae':   ['tae-1.mp3', 'tae-2.mp3'],  // 只下到 2 条
  'xxx':   [],                          // 完全找不到
  // ...
};
```

**Step 3.10：跑测试确认数据模型仍合法**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm test
```

期望：data.test.js 全部 passing（已经写好 ≥1 的断言，空列表 `[]` 也算 ≥1；但若用户后续想要 ≥3 严格，可放宽）。

**Step 3.11：commit**

```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
git add -A
git commit -m "feat: resources (images + audio) + missing log"
```

注：音频文件可能很大（每条 ~200KB × 147 ≈ 30MB），如果担心 repo 体积，可加 `.gitignore` 规则忽略 `assets/audio/*.mp3`，运行时直接从外部 CDN 加载。当前 demo 阶段先全部进 git。

---

