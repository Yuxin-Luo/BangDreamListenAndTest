# 缺失资源列表（2026-07-15）

## 音频（全部缺失）
所有角色的音频样本在 bestdori.com 上均返回 HTML 占位符而非真实 MP3 文件。

**需要重新探索的音频来源：**
1. 萌娘百科「BanG Dream! 语音集」词条
2. bangdream.fandom.com（需解决 402 问题）
3. Bilibili 音频上传
4. 其他第三方 BanG Dream 资源站

## 乐队图标（全部缺失）
- `assets/images/band/poppin-party.png` - bestdori 占位图
- `assets/images/band/afterglow.png` - bestdori 占位图
- `assets/images/band/pastel-palettes.png` - bestdori 占位图
- `assets/images/band/roselia.png` - bestdori 占位图
- `assets/images/band/hhw.png` - bestdori 占位图
- `assets/images/band/morfonica.png` - bestdori 占位图
- `assets/images/band/ras.png` - bestdori 占位图
- `assets/images/band/mygo.png` - bestdori 占位图
- `assets/images/band/ave-mujica.png` - bestdori 占位图

**问题：** bestdori.com 的 `band_<id>.png` 所有 9 个 URL 返回相同 14084 字节占位图（非真实乐队 logo）。

**需要重新探索的乐队图标来源：**
1. bangdream.fandom.com（需解决 402 问题）
2. 萌娘百科（需解决 403 问题）
3. 官方 anime 网站
4. Bilibili WIKI (wiki.biligame.com/bangdream) - 当前 URL 结构返回 404

## 失败图片（缺失）
- `assets/images/fail/ksm-cry.png` - Kasumi 哭泣图未找到来源

## 角色肖像（部分缺失）
Ave Mujica 5 名角色在 bestdori.com 上无页面（IDs 41-49）：
- `assets/images/char/sakiko.png` - 无 bestdori 页面
- `assets/images/char/mutsumi.png` - 无 bestdori 页面
- `assets/images/char/umiri.png` - 无 bestdori 页面
- `assets/images/char/nyamu.png` - 无 bestdori 页面
- `assets/images/char/togawa.png` - 无 bestdori 页面

MYGO anon/raana/soyo/taki (bestdori IDs 36-40) 返回 14084 字节占位图：
- `assets/images/char/anon.png` - 占位图
- `assets/images/char/raana.png` - 占位图
- `assets/images/char/soyo.png` - 占位图
- `assets/images/char/taki.png` - 占位图

## 优先级建议
1. **高优先级**：找到音频来源（否则 quiz 无法运行）
2. **中优先级**：乐队图标（否则 band 选择页为空）
3. **低优先级**：Ave Mujica 角色肖像 + Kasumi 失败图
