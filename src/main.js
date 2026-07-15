/**
 * App entry. Boots i18n, mounts the app, handles fatal errors.
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

async function boot() {
  try {
    const { initI18n, applyTranslations, cycleLocale } = await import('./i18n/index.js');
    initI18n();
    applyTranslations();

    const sw = document.querySelector('[data-i18n-lang-switch]');
    if (sw) sw.addEventListener('click', cycleLocale);

    const { initApp } = await import('./ui/app.js');
    const root = document.getElementById('app');
    if (root) initApp(root);

    // Top-level tab buttons — dispatch via app module
    document.querySelectorAll('[data-tab-target]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const target = btn.getAttribute('data-tab-target');
        const { switchTab } = await import('./ui/app.js');
        switchTab(target);
      });
    });
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