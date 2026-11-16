/* ═══════════════════════════════════════════════════════════
   fit-task.js
   1) На компьютере окно задания открывается в полноэкранном
      режиме браузера (как по F11) и закрывается вместе с ним.
   2) Если содержимое всё равно не помещается без прокрутки,
      область задания пропорционально уменьшается (CSS zoom).
   Работает для всех категорий; код категорий менять не нужно.
   Подключить в конце index.html:  <script src="js/fit-task.js"></script>
═══════════════════════════════════════════════════════════ */
(function () {
  const AUTO_FULLSCREEN = true;   // false — не включать полноэкранный режим
  const DESKTOP_ONLY    = true;   // true — только на компьютере (на телефоне всё остаётся как есть)
  const MIN_SCALE       = 0.5;    // меньше этого не уменьшаем — дальше будет прокрутка

  let queued = false;
  let wasOpen = false;

  /* ── полноэкранный режим ── */
  function isDesktop() {
    return !DESKTOP_ONLY || window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function enterFullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement || !isDesktop()) return;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req) return;
    try {
      const p = req.call(el, { navigationUI: 'hide' });
      if (p && p.catch) p.catch(() => {});      // браузер мог отказать (нет «жеста» пользователя) — не страшно
    } catch (e) {}
  }

  function leaveFullscreen() {
    if (!document.fullscreenElement) return;
    const ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (ex) { try { const p = ex.call(document); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  }

  function syncFullscreen() {
    const isOpen = !!document.querySelector('.modal-overlay.open');
    if (AUTO_FULLSCREEN && isOpen && !wasOpen) enterFullscreen();
    if (AUTO_FULLSCREEN && !isOpen && wasOpen) leaveFullscreen();
    wasOpen = isOpen;
  }

  /* ── подгонка размера ── */
  function fit() {
    queued = false;
    syncFullscreen();

    const modal = document.querySelector('.modal-overlay.open .modal');
    const area  = document.getElementById('task-area');
    if (!modal || !area) return;

    area.style.zoom = '';                                   // меряем при естественном размере
    for (let pass = 0; pass < 3; pass++) {
      const overflow = modal.scrollHeight - modal.clientHeight;
      const h = area.offsetHeight;
      if (overflow <= 1 || h <= 0) break;                   // уже помещается
      const cur = parseFloat(area.style.zoom) || 1;
      const next = Math.max(MIN_SCALE, cur * (h - overflow) / h);
      if (Math.abs(next - cur) < 0.01) break;
      area.style.zoom = next.toFixed(3);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(fit);
  }

  function init() {
    new MutationObserver(schedule).observe(document.body, {
      subtree: true, childList: true,
      attributes: true, attributeFilter: ['class']
    });
    window.addEventListener('resize', schedule);
    document.addEventListener('fullscreenchange', schedule);
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
