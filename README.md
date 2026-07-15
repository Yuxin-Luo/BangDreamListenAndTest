# BanG Dream 听声音猜角色

BanG Dream 听声音猜角色测试（zh/en/ja 三语）。

## 开发

```bash
npm install
npm run dev      # 启动 dev server（端口 8000）
npm test         # 运行测试
```

## 架构

- `src/i18n/` — i18n 运行时（zh/en/ja 三语）
- `src/main.js` — 启动入口
- `dev-server.py` — 无缓存 dev server

## 三语

- `src/i18n/zh.js` — 中文
- `src/i18n/en.js` — 英文
- `src/i18n/ja.js` — 日文
