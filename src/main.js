/**
 * App entry. Imports initApp from ui/app.js (Task 8 stub for now).
 */

function showBootError(err) {
  console.error('[boot] fatal error:', err);
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0;
    background: #f87171; color: #7f1d1d;
    padding: 12px 20px; font-family: monospace; font-size: 13px;
    border-bottom: 2px solid #b91c1c; z-index: 9999;
    white-space: pre-wrap; word-break: break-word;
  `;
  banner.textContent = '⚠️ 启动失败: ' + (err?.message || err);
  document.body.prepend(banner);
}

function boot() {
  try {
    // ui/app.js 的 initApp() 在 Task 8 接入。当前 Task 1 只做 i18n 初始化 + DOM 占位。
    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
    initI18n();
    applyTranslations();
    const sw = document.querySelector('[data-i18n-lang-switch]');
    if (sw) sw.addEventListener('click', cycleLocale);
  } catch (err) {
    showBootError(err);
  }
  window.addEventListener('error', (e) => console.error('[runtime] error:', e.error || e.message));
  window.addEventListener('unhandledrejection', (e) => console.error('[runtime] unhandled rejection:', e.reason));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
