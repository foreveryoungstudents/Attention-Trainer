/* ═══════════════════════════════════════════════════════════
   fit-task.js — автоподгонка задания под высоту окна.
   Если содержимое окна не помещается без прокрутки, область
   задания (#task-area) пропорционально уменьшается (CSS zoom),
   чтобы вопрос, поле и кнопки ответа были видны одновременно.
   Работает для всех категорий; код категорий менять не нужно.
   Подключить в конце index.html:  <script src="js/fit-task.js"></script>
═══════════════════════════════════════════════════════════ */
(function () {
  const MIN_SCALE = 0.5;   // меньше этого не уменьшаем (иначе не прочитать) — дальше будет прокрутка
  let queued = false;

  function fit() {
    queued = false;
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
    // следим за появлением нового задания, ответами, открытием окна
    new MutationObserver(schedule).observe(document.body, {
      subtree: true, childList: true,
      attributes: true, attributeFilter: ['class']
    });
    window.addEventListener('resize', schedule);
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
