/* ═══════════════════════════════════════
   THEME — Авто / Светлая / Тёмная
   Подключается в <head> ДО отрисовки страницы,
   чтобы не было вспышки неверной темы.
═══════════════════════════════════════ */
(function () {
  var KEY = 'theme-pref';                       // 'auto' | 'light' | 'dark'
  var ORDER = ['auto', 'light', 'dark'];
  var LABELS = { auto: '🖥️ Авто', light: '☀️ Светлая', dark: '🌙 Тёмная' };
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
      b.textContent = LABELS[current];
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
