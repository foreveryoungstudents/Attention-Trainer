/* ═══════════════════════════════════════
   THEME — Авто / Светлая / Тёмная
   Подключается в <head> ДО отрисовки страницы,
   чтобы не было вспышки неверной темы.
═══════════════════════════════════════ */
(function () {
  var KEY = 'theme-pref';                       // 'auto' | 'light' | 'dark'
  var ORDER = ['auto', 'light', 'dark'];
  var LABELS = { auto: 'Авто', light: 'Светлая', dark: 'Тёмная' };   // подписи
  var SVG = {
    auto:  '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    dark:  '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
  };
  function icon(k) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[k] + '</svg>';
  }
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function load() {
    try {
      var v = localStorage.getItem(KEY);
      if (ORDER.indexOf(v) > -1) return v;
    } catch (e) {}
    return 'auto';
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var current = load();   // хранится и в памяти — работает, даже если localStorage недоступен

  function apply() {
    var theme = current === 'auto' ? (mq.matches ? 'dark' : 'light') : current;
    document.documentElement.setAttribute('data-theme', theme);
    var b = document.getElementById('theme-btn');
    if (b) {
      b.innerHTML = icon(current) + '<span>' + LABELS[current] + '</span>';
      b.setAttribute('aria-label', 'Тема оформления: ' + LABELS[current]);
    }
  }

  apply();   // сразу, до появления <body>

  // В режиме «Авто» следим за сменой темы в системе
  var onSystemChange = function () { if (current === 'auto') apply(); };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  document.addEventListener('DOMContentLoaded', function () {
    apply();   // подставить подпись на кнопку
    var b = document.getElementById('theme-btn');
    if (!b) return;
    b.addEventListener('click', function () {
      current = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      save(current);
      apply();
    });
  });
})();
