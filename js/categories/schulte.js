/* ═══════════════════════════════════════════════════════════
   ШУЛЬТЕ — одна категория, 4 уровня (5×5 = 25 клеток)
   1 — классика, найденные клетки подсвечиваются
   2 — цветные цифры / цветные поля (2 случайных цвета)
   3 — 1, А, 2, Б, 3, В … 12, К, 13
   4 — хаос (шрифты, цвета, повороты)
   На уровнях 2–4 клик подсвечивается на долю секунды.
   Внизу карточки — переключатель уровней: можно сменить уровень, не выходя из задания.
   Время каждого прохождения записывается (рекорд по уровню).
═══════════════════════════════════════════════════════════ */

const SCHULTE_SIZE = 5;          // размер поля
const SCHULTE_WRAP = true;       // после уровня 4 «Далее» возвращает на уровень 1
const SCHULTE_KEY  = 'attn_schulte_times_v1';
const SCHULTE_TITLES = { 1: 'классика', 2: 'цвета', 3: 'числа и буквы', 4: 'хаос' };

const SCHULTE_LETTERS = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К']; // 12 букв
const SCHULTE_PALETTE = [
  '#d63031', // красный
  '#2e6fdb', // синий
  '#1e9e5a', // зелёный
  '#e67e22', // оранжевый
  '#8e44ad', // фиолетовый
  '#138d9c', // бирюзовый
];

/* ── Категория ── */
CATS.schulte5 = {
  name: 'Шульте', desc: '4 уровня: классика, цвета, числа и буквы, хаос',
  icon: '⬜', bg: '#e1f5ee', fg: '#085041',
  gen() { return makeSchulteTask(getLvl().id); }
};

/* ── Данные задания ── */
function schulteItems(level) {
  if (level === 3) {                       // 1, А, 2, Б, … 12, К, 13
    const seq = [];
    for (let i = 0; i < 13; i++) {
      seq.push(String(i + 1));
      if (i < 12) seq.push(SCHULTE_LETTERS[i]);
    }
    return seq;                            // 13 чисел + 12 букв = 25
  }
  return [...Array(SCHULTE_SIZE * SCHULTE_SIZE)].map((_, i) => String(i + 1));
}

function schulteTwoColors() {
  const p = [...SCHULTE_PALETTE];
  const a = p.splice(Math.floor(Math.random() * p.length), 1)[0];
  const b = p[Math.floor(Math.random() * p.length)];
  return [a, b];
}

function makeSchulteTask(level) {
  return {
    type: 'schulte',
    level,
    size: SCHULTE_SIZE,
    seq: schulteItems(level),
    colors: level === 2 ? schulteTwoColors() : null,
  };
}

/* ── Запись времени ── */
function schulteLoad() {
  try { return JSON.parse(localStorage.getItem(SCHULTE_KEY)) || {}; }
  catch (e) { return {}; }
}

function schulteSave(level, time, errors) {
  const all = schulteLoad();
  const rec = all[level] || { best: null, runs: [] };
  const isBest = rec.best === null || time < rec.best;
  if (isBest) rec.best = time;
  rec.runs.push({ t: time, e: errors, d: new Date().toISOString().slice(0, 16) });
  rec.runs = rec.runs.slice(-20);          // храним последние 20
  all[level] = rec;
  try { localStorage.setItem(SCHULTE_KEY, JSON.stringify(all)); } catch (e) {}
  return { isBest, rec };
}

/* ── Хаос-стили (уровень 4) ── */
const CHAOS_STYLES = [
  { cls: 's-dark',   fonts: ["'Georgia',serif", "'Courier New',monospace", "'Arial Black',sans-serif"], sizes: ['13px','18px','22px','28px'], weight: '700' },
  { cls: '',         fonts: ["'Times New Roman',serif", "'Verdana',sans-serif", "'Trebuchet MS',sans-serif"], sizes: ['14px','18px','22px','26px'], weight: '600' },
  { cls: 's-blue',   fonts: ["'Impact',sans-serif", "'Palatino',serif", "system-ui"], sizes: ['13px','17px','21px','25px'], weight: '700' },
  { cls: 's-amber',  fonts: ["'Courier New',monospace", "'Comic Sans MS',cursive", "'Georgia',serif"], sizes: ['13px','17px','21px','24px'], weight: '600' },
  { cls: 's-green',  fonts: ["'Arial Black',sans-serif", "'Trebuchet MS',sans-serif", "'Times New Roman',serif"], sizes: ['14px','18px','22px','26px'], weight: '700' },
  { cls: 's-coral',  fonts: ["system-ui", "'Impact',sans-serif", "'Georgia',serif"], sizes: ['13px','16px','20px','25px'], weight: '600' },
  { cls: 's-purple', fonts: ["'Verdana',sans-serif", "'Courier New',monospace", "'Arial Black',sans-serif"], sizes: ['14px','18px','22px','27px'], weight: '700' },
];

const CHAOS_TRANSFORMS = [
  null, null, null,               // чаще всего без поворота
  'rotate(180deg)',
  'rotate(90deg)',
  'rotate(-90deg)',
  'scaleX(-1)',
  'rotate(180deg) scaleX(-1)',
];

/* ── Вспомогательное ── */
// чёрный или белый текст — что контрастнее на данном фоне
function schulteInk(hex) {
  const n = parseInt(hex.slice(1), 16);
  const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
  return (0.299 * R + 0.587 * G + 0.114 * B) > 140 ? '#000' : '#fff';
}

// короткая подсветка клика (виден факт, что клик засчитан)
function schulteFlash(el, color, ms) {
  clearTimeout(el._ft);
  el.style.boxShadow = `inset 0 0 0 4px ${color}`;
  el._ft = setTimeout(() => { el.style.boxShadow = ''; }, ms || 300);
}

/* ── «Далее» → задание следующего уровня ── */
function schulteNextLevel() {
  const cur = (STATE.curTask && STATE.curTask.level) || getLvl().id;
  let nl = cur + 1;
  if (nl > 4) nl = SCHULTE_WRAP ? 1 : 4;
  STATE.curTask = makeSchulteTask(nl);
  STATE.answered = false;
  const nb = document.getElementById('nxt-btn');
  if (nb) nb.style.display = 'none';
  renderSchulte();
}

// один раз вешаем перехват на кнопку «Далее»; для других категорий она работает как раньше
function schulteInstallNextHook() {
  const nb = document.getElementById('nxt-btn');
  if (!nb || nb.dataset.schulteHook) return;
  nb.dataset.schulteHook = '1';
  nb.addEventListener('click', e => {
    if (STATE.curTask && STATE.curTask.type === 'schulte') {
      e.stopImmediatePropagation();
      e.preventDefault();
      schulteNextLevel();
    }
  }, true);
}

/* ── Переключатель уровней (внизу карточки) ── */
// стили добавляются отсюда один раз, чтобы не трогать style.css; цвета — из переменных темы
function schulteInstallStyles() {
  if (document.getElementById('schulte-style')) return;
  const st = document.createElement('style');
  st.id = 'schulte-style';
  st.textContent = `
    .sc-lvls { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center; margin-top:18px; }
    .sc-lvls-label { font-size:13px; font-weight:500; color:var(--text3); margin-right:2px; }
    .sc-lvl { display:inline-flex; align-items:center; gap:6px; background:var(--surface); border:1px solid var(--border2);
      border-radius:10px; padding:8px 14px; font-family:inherit; font-size:14px; font-weight:500; color:var(--text2);
      cursor:pointer; transition:all .15s; }
    .sc-lvl b { font-weight:700; }
    .sc-lvl:hover { border-color:var(--text3); color:var(--text); }
    .sc-lvl.active { background:var(--btn-bg); border-color:var(--btn-border); color:var(--btn-text); }
    .sc-lvl:focus-visible { outline:2px solid var(--blue-bd); outline-offset:2px; }
    @media (hover:hover) { .sc-lvl:not(.active):hover { color:var(--hover-text); } }
    @media (max-width:420px) { .sc-lvl { padding:7px 11px; font-size:13px; } }`;
  document.head.appendChild(st);
}

function schulteSwitcherHtml(level) {
  const btns = [1, 2, 3, 4].map(n => {
    const on = n === level;
    return `<button type="button" class="sc-lvl${on ? ' active' : ''}" data-l="${n}" aria-pressed="${on}"` +
      ` title="${on ? 'Начать этот уровень заново' : 'Перейти на уровень ' + n}"><b>${n}</b> ${SCHULTE_TITLES[n]}</button>`;
  }).join('');
  return `<div class="sc-lvls" role="group" aria-label="Уровень Шульте"><span class="sc-lvls-label">Уровень:</span>${btns}</div>`;
}

// сменить уровень прямо в задании (текущее прохождение сбрасывается, в рекорды не идёт)
function schulteSetLevel(n) {
  if (SCHULTE_TIMER) clearInterval(SCHULTE_TIMER);
  STATE.curTask = makeSchulteTask(n);
  STATE.answered = false;
  const nb = document.getElementById('nxt-btn');
  if (nb) nb.style.display = 'none';
  renderSchulte();
  const b = document.querySelector('.sc-lvl[data-l="' + n + '"]');
  if (b) b.focus({ preventScroll: true });     // чтобы можно было листать уровни с клавиатуры
}

/* ── Рендер ── */
let SCHULTE_TIMER = null;

function renderSchulte() {
  schulteInstallNextHook();
  schulteInstallStyles();

  const task  = STATE.curTask;
  const level = task.level || getLvl().id;
  const sz    = task.size || SCHULTE_SIZE;
  const seq   = task.seq || schulteItems(level);
  const tot   = seq.length;
  const cells = shu([...seq]);
  const found = new Set();
  let idx = 0, errors = 0;
  const t0 = Date.now();

  if (SCHULTE_TIMER) clearInterval(SCHULTE_TIMER);

  const area  = document.getElementById('task-area');
  const avail = Math.min(560, area.clientWidth || (window.innerWidth - 48));
  const cw    = Math.max(40, Math.min(88, Math.floor(avail / sz) - 4));
  const k     = cw / 56;                                   // масштаб шрифтов хаоса

  const best = (schulteLoad()[level] || {}).best;

  area.innerHTML = `
    <div class="sc-info" style="font-size:13px;color:var(--text3)">Уровень ${level} · ${SCHULTE_TITLES[level] || ''}</div>
    <div class="sc-info">Найди: <span class="sc-target" id="sc-next">${seq[0]}</span>
      <span style="font-size:14px;color:var(--text3)" id="sc-step"> (1 из ${tot})</span>
    </div>
    <div class="sc-info" style="font-size:15px">⏱ <b id="sc-clock">0.0</b> с
      <span style="color:var(--text3);font-size:13px">${best != null ? ' · рекорд: ' + best + ' с' : ''}</span>
    </div>
    <div class="schulte-grid" id="sg"
      style="grid-template-columns:repeat(${sz},${cw}px);max-width:${sz * (cw + 4) + 10}px;"></div>
    <div class="sc-info" id="sc-time" style="margin-top:10px;font-size:14px"></div>
    ${schulteSwitcherHtml(level)}`;

  area.querySelectorAll('.sc-lvl').forEach(b => {
    b.onclick = () => schulteSetLevel(+b.dataset.l);
  });

  SCHULTE_TIMER = setInterval(() => {
    const el = document.getElementById('sc-clock');
    if (!el) { clearInterval(SCHULTE_TIMER); return; }
    el.textContent = ((Date.now() - t0) / 1000).toFixed(1);
  }, 100);

  const sg = document.getElementById('sg');

  cells.forEach(item => {
    const d = document.createElement('div');
    d.className = 'sc-cell' + (level === 4 ? ' chaos' : '');
    d.style.height = cw + 'px';
    d.textContent = item;

    if (level === 4) {
      const cs = pick(CHAOS_STYLES);
      if (cs.cls) d.classList.add(cs.cls);
      d.style.fontFamily = pick(cs.fonts);
      d.style.fontSize = Math.round(parseInt(pick(cs.sizes), 10) * k) + 'px';
      d.style.fontWeight = cs.weight;
      if (r(4) === 0) d.style.fontStyle = 'italic';
      const tr = pick(CHAOS_TRANSFORMS);
      if (tr) d.style.transform = tr;
      if (r(3) === 0) d.style.opacity = (0.6 + Math.random() * 0.4).toFixed(2);
    } else {
      d.style.fontSize = Math.max(14, Math.round(cw * 0.42)) + 'px';
      d.style.fontWeight = '600';
      if (level === 2) {
        const [c1, c2] = task.colors;
        const col = Math.random() < 0.5 ? c1 : c2;
        if (Math.random() < 0.3) {          // залитое поле, цифра чёрная или белая
          d.style.background = col;
          d.style.borderColor = col;
          d.style.color = schulteInk(col);
        } else {                            // цветная цифра
          d.style.color = col;
        }
      }
    }

    d.onclick = () => {
      if (idx >= tot || found.has(item)) return;

      if (item === seq[idx]) {
        found.add(item);
        if (level === 1) d.classList.add('hit');          // на 1 уровне подсветка остаётся
        else schulteFlash(d, '#1d9e75', 300);             // на 2–4 — короткая вспышка
        idx++;

        const el = document.getElementById('sc-next');
        if (el) el.textContent = idx < tot ? seq[idx] : '✓';
        const st = document.getElementById('sc-step');
        if (st) st.textContent = idx < tot ? ` (${idx + 1} из ${tot})` : '';

        if (idx >= tot) {
          clearInterval(SCHULTE_TIMER);
          const time = +((Date.now() - t0) / 1000).toFixed(1);
          const clock = document.getElementById('sc-clock');
          if (clock) clock.textContent = time.toFixed(1);

          const { isBest, rec } = schulteSave(level, time, errors);
          const last = rec.runs.slice(-5).map(x => x.t).join(' · ');
          let nl = level + 1; if (nl > 4) nl = SCHULTE_WRAP ? 1 : 4;

          const el2 = document.getElementById('sc-time');
          if (el2) el2.innerHTML =
            `Готово за <b>${time}</b> сек · ошибок: ${errors}<br>` +
            (isBest ? '🏆 Новый рекорд!' : `Рекорд: ${rec.best} сек`) +
            `<br><span style="color:var(--text3)">Последние: ${last}</span>` +
            `<br><span style="color:var(--text3)">Дальше — уровень ${nl}</span>`;

          STATE.scOk++; STATE.scTot++;
          STATE.answered = true;
          updScore();
          document.getElementById('nxt-btn').style.display = 'block';
        }
      } else {
        errors++;
        if (level === 1) {
          d.classList.add('mis');
          setTimeout(() => d.classList.remove('mis'), 400);
        } else {
          schulteFlash(d, '#e24b4a', 400);
        }
      }
    };

    sg.appendChild(d);
  });
}
