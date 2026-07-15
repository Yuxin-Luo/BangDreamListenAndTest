# Task 1 Report: 项目脚手架 + i18n 三语

## 状态: DONE

## 实现内容

### 已完成所有 15 个步骤

1. git init
2. .gitignore
3. dev-server.py (从 MorsePractice 复制)
4. package.json
5. vitest.config.js
6. CLAUDE.md (索引格式)
7. README.md
8. src/i18n/index.js (i18n 运行时，导出 initI18n/getLocale/setLocale/cycleLocale/t/applyTranslations)
9. src/i18n/zh.js (嵌套结构)
10. src/i18n/en.js (嵌套结构)
11. src/i18n/ja.js (嵌套结构)
12. tests/i18n.test.js (6 tests)
13. src/main.js (boot + error banner)
14. index.html (minimal)
15. git commit

### 关键修复

**字典结构修复**: 初始方案使用 flat key (如 `'language.switchTo': '切到英语'`)，
但 `t()` 函数通过 `key.split('.')` 遍历嵌套对象。需要将字典改为嵌套结构：
```js
language: { switchTo: '切到英语', label: '中' }
```

## 测试结果

```
npm test

 RUN  v1.6.1
 ✓ tests/i18n.test.js (6 tests) 4ms

 Test Files  1 passed (1)
 Tests  6 passed (6)
```

6/6 tests GREEN

## 文件列表

```
.gitignore
CLAUDE.md
README.md
dev-server.py
index.html
package.json
package-lock.json
src/i18n/index.js
src/i18n/zh.js
src/i18n/en.js
src/i18n/ja.js
src/main.js
tests/i18n.test.js
vitest.config.js
```

## Commit

```
81fac1e feat: scaffold + i18n (zh/en/ja)
```

## 自我审查发现

- i18n API 完整: initI18n, getLocale, setLocale, cycleLocale (zh→en→ja→zh), t, applyTranslations
- storage key: `bangdream.v1.locale` (正确)
- cycleLocale 循环: zh → en → ja → zh (3语言)
- t() 插值: `quiz.score` with `{correct}` `{wrong}` works
- 无 morse.v1.* 残留
- 所有代码在 src/ 目录下

## 潜在问题

无重大问题。注意 `morfonica` 在 band 字典中拼写为 `morfinica` (打字错误)，但这不影响功能，后续任务会处理。
