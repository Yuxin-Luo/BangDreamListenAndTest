# Task 3 Fix Brief：去除 MYGO + Ave Mujica，补 7 队资源

## 上下文
Task 3 implementer 已完成（commit `bd7f380`），但资源发现严重问题：
- bestdori 上 MYGO + Ave Mujica 共 14 个角色的立绘无法获取（MYGO 返回占位 HTML，Ave Mujica 无页面）
- 全部 9 个乐队图标是 14084 字节占位符
- 音频全部返回 HTML 而非 MP3
- Kasumi 失败图找不到

**用户最新决策**：「如果MYGO和AVE MUJICA的资源实在不好找，你就先整理其他七个乐队的」

→ **彻底删除 MYGO + Ave Mujica**，专心搞 7 队资源。

## 工作目录
`/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest`

## 必做修改

### 1. 数据模型精简（删除 MYGO + Ave Mujica）
**修改文件：**
- `src/data/bands.js`：删除 `mygo` + `ave-mujica` 两个对象
- `src/data/characters.js`：删除 10 个角色（anon, tomori, raana, soyo, taki, sakiko, mutsumi, umiri, nyamu, togawa）
- `src/data/samples.js`：保留模板自动生成（CHARACTERS 减少后自动只生成 35 个）
- `src/i18n/zh.js`、`src/i18n/en.js`、`src/i18n/ja.js`：删除 `band` 字典中 `mygo` + `ave-mujica` 两个键
- `tests/data.test.js`：把 `≈ 49` 改成 `== 35`；`charactersOfBand('poppin-party')` 断言保持不变（仍然 5）

### 2. 资源清理
- 删除 `assets/images/char/` 下的 MYGO 5 个 HTML 占位文件（anon.png, tomori.png, raana.png, soyo.png, taki.png）
- 删除 `assets/images/band/` 下的 9 个占位文件（mygo.png, ave-mujica.png 是本来就没有，另外 7 个是 14084 字节占位符）
- `assets/images/char/` 中 sakiko/mutsumi/umiri/nyamu/togawa 本来就不存在（task 3 report 已说明）

### 3. 补关键资源（必须）
**优先级：**
1. **7 个乐队图标**：`assets/images/band/{poppin-party,afterglow,pastel-palettes,roselia,hhw,morfonica,ras}.png`
   - 全部是 14084 字节占位符，需重新下载
   - 尝试源：bestdori 其它路径、bangdream.fandom.com wiki logo、BWIKI (wiki.biligame.com/bangdream) 乐队页 logo
   - 失败则接受占位符，记录到 `dev-docs/04-resource-missing-2026-07-15.md`
2. **≥21 条音频**（7 乐队 × ≥1 角色 × 3 样本）
   - 尝试：bestdori 其它路径、萌娘百科「BanG Dream! 语音集」、BWIKI 角色页附件
   - 失败 → **不阻塞 demo**，保持 samples.js 模板路径，文档说明音频待补
3. **Kasumi 失败图**（1 个）：`assets/images/fail/ksm-cry.png`
   - 找不到 → 用占位符（透明 1×1 PNG 或文档占位），quiz.js 在 fail UI 显示 "（图片待补）"

### 4. 更新文档
- `dev-docs/04-resource-missing-2026-07-15.md`：把 MYGO + Ave Mujica 改为「**主动放弃**，资源不可获取，待后续补充」；新增 band icons / audio / fail image 缺失状态
- `research/bands.xml`：删除 mygo + ave-mujica 两个 band 节点
- `research/characters.xml`：删除 10 个角色节点

### 5. 测试 + commit
```bash
cd /home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest
npm test                                              # 应 6/6 通过
git add -A
git commit -m "refactor: drop MYGO/Ave Mujica, 7-band demo"
```

## 时间预算
≤ 25 min。超时 → 停止资源搜索，保留占位符提交。

## 完成定义
- `npm test` 通过（6/6，断言 35 chars / 7 bands）
- git commit 成功（fix commit 在 bd7f380 之后）
- `dev-docs/04-resource-missing-2026-07-15.md` 反映最新状态
- 报告路径：`/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest/.superpowers/sdd/task-3-fix-report.md`

## 报告格式
返回：
- Status (DONE / DONE_WITH_CONCERNS / BLOCKED)
- 1-行测试结果
- Commit hash
- 资源现状：7 乐队图标 X/7，音频 X 条，失败图 X/1
- Concerns（如有）