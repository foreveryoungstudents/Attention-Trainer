/* ── DIFF ── */
CATS.diff = {
  name: 'Найди различия', desc: 'Запомни поле, затем найди изменения по памяти',
  icon: '🔎', bg: '#fbeaf0', fg: '#72243e',
  gen() { return { type: 'diff' }; }
};

// Профессии: одна и та же профессия в мужском и женском варианте — «похожие» (👨‍🍳 ↔ 👩‍🍳)
const DIFF_PROF = ['\u2695\ufe0f','🍳','🚒','\u2708\ufe0f','🚀','🏫','🔧','🌾','🎤','🎨','💻','🔬','💼']
  .map(r => ['👨', '👩'].map(p => p + '\u200d' + r));

// Темы: каждая — список «семейств» похожих эмодзи (для замены на похожий предмет).
// Эмодзи не должны повторяться между темами.
const DIFF_THEMES = {
  'Фрукты и овощи': [['🍎','🍏','🍅'],['🍊','🍑','🥭'],['🍋','🍌'],['🍇','🫐'],['🍓','🍒'],['🍐','🥝','🍈'],['🍉'],['🍍'],['🥥'],['🥑','🫒'],['🥕','🌽'],['🍆','🥦'],['🥬','🥒'],['🌶️','🍠']],
  'Животные': [['🐶','🐕','🐺','🦊'],['🐱','🐯','🦁'],['🐭','🐹','🐰'],['🐻','🐼','🐨'],['🐷','🐗'],['🐸','🐢'],['🐵','🐒'],['🐔','🐤','🐥'],['🦆','🦢'],['🐴','🦄'],['🐮','🐂'],['🦋','🐝','🐞']],
  'Транспорт': [['🚗','🚕','🚙'],['🚌','🚎','🚐'],['🚓','🚑','🚒'],['🚲','🛵','🏍️'],['✈️','🛩️','🚁'],['🚂','🚆','🚋'],['⛵','🛥️','🚤'],['🚜','🚛'],['🚀','🛸']],
  'Еда': [['🍕','🥧'],['🍔','🌭','🥪'],['🍟','🥨'],['🍩','🍪','🧁'],['🍰','🎂'],['🍞','🥐','🥖'],['🧀','🥚'],['🍙','🍚','🍘'],['🌮','🌯'],['🍦','🍨','🍧'],['🍫','🍬','🍭']],
  'Напитки': [['☕','🍵','🫖'],['🥛','🍼'],['🧃','🥤','🧋'],['🍷','🍸','🍹'],['🍺','🍻'],['🥂','🍾','🥃'],['🍶','🧉']],
  'Спорт': [['⚽','🏀','🏐','🏈','🏉'],['🎾','🥎','⚾'],['🏓','🏸'],['🥊','🥋'],['🏒','🏑','🥍'],['⛳','🎯'],['🏊','🚴','🏃'],['🏂','⛷️','🛹'],['🏋️','🤸','🤾'],['🥇','🥈','🥉'],['🏆','🏅'],['🎱','🎳']],
  'Профессии': [...DIFF_PROF, ['👮','💂','🕵️']],
  'Эмоции': [['😀','😃','😄','😁','😆'],['🙂','😊','😇'],['😉','😋','😜'],['😍','🥰','😘'],['😎','🤓'],['😢','😭'],['😠','😡','🤬'],['😮','😲','😳'],['😴','😪'],['🤔','🧐'],['😐','😑','😶'],['🙁','😞','😔'],['😱','😨','😰'],['🤒','🤕','🤢'],['🥳','🤩']],
  'Здания': [['🏠','🏡','🏘️'],['🏢','🏬','🏙️'],['🏫','🏤','🏣'],['🏥','🏨','🏩'],['🏦','🏛️'],['⛪','🕌','🕍'],['🏰','🏯'],['🗼','🗽','🗿'],['🏭','⛽'],['🏗️'],['⛺','🏕️'],['🏟️','🎪']],
  'Погода': [['☀️','🌞','🌤️'],['⛅','🌥️','☁️'],['🌦️','🌧️','⛈️'],['🌨️','❄️','☃️'],['🌩️','⚡'],['🌪️','🌀'],['🌫️','🌁'],['🌈','🌊'],['🌙','🌛','🌜'],['⭐','🌟','✨'],['🔥','💧'],['☔','☂️'],['💨','🌬️']],
  'Растения': [['🌳','🌲','🌴','🎄'],['🌸','🌺','🌷','🌹'],['🌻','🌼'],['🍀','🌿','🌱','☘️'],['🍄','🌰'],['🌵','🎋'],['🌾','🎍'],['🍁','🍂','🍃'],['🥀','💐']],
  'Офис': [['📎','🖇️','📌','📍'],['✏️','🖊️','🖋️','🖍️'],['📘','📗','📙','📕'],['📁','📂','🗂️'],['📄','📃','📋'],['📅','📆','🗓️'],['💻','🖥️','⌨️','🖱️'],['📞','☎️','📱'],['✂️','📏','📐'],['📊','📈','📉'],['🗑️','📦'],['📧','✉️','📨']],
  'Цвета и фигуры': [['🔴','🟠','🟡','🟢','🔵','🟣','🟤','⚫','⚪'],['🟥','🟧','🟨','🟩','🟦','🟪','🟫','⬛','⬜'],['🔶','🔷','🔸','🔹'],['🔺','🔻'],['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎']],
  'Печатные символы': [['O','0','Q','D'],['B','8','3'],['S','5','$'],['b','d','p','q'],['m','n','h'],['u','v','w'],['E','F','L'],['C','G'],['2','Z'],['6','9'],['1','7'],['W','M'],['@','&','%'],['#','№'],['+','×','÷'],['=','≡'],['<','>','‹']]
};
const DIFF_FAM = {};
Object.values(DIFF_THEMES).forEach(fams => fams.forEach(f => f.forEach(e => DIFF_FAM[e] = f)));
// По уровням: размер поля и число отличий. Изменение одно — замена на непохожую картинку.
// Пустых клеток и повторяющихся картинок нет нигде: на поле всегда есть что запоминать,
// а лишний «двойник» не выдаёт место замены.
const DIFF_LEVELS = [
  { g: 3, n: 1 },
  { g: 3, n: 2 },
  { g: 4, n: 3 },
  { g: 4, n: 4 }
];
const DIFF_SEEN = new Set();   // уже показанные поля — чтобы не повторялись
let DIFF_LAST_THEME = '';

function diffTry(cfg) {
  const G = cfg.g, N = G * G, n = cfg.n;
  // тема: не та же, что в прошлый раз, и достаточно большая: на поле нет одинаковых эмодзи и остаются свободные для замен
  const names = Object.keys(DIFF_THEMES).filter(t => t !== DIFF_LAST_THEME && DIFF_THEMES[t].flat().length >= N + n);
  const theme = names.length ? pick(names)
    : Object.keys(DIFF_THEMES).sort((a, b) => DIFF_THEMES[b].flat().length - DIFF_THEMES[a].flat().length)[0];
  DIFF_LAST_THEME = theme;
  const fams = DIFF_THEMES[theme], flat = fams.flat();
  const orig = shu(flat).slice(0, N);
  const mod = orig.slice(), diffs = [];
  const taken = new Set(orig);                       // всё, что уже есть на поле: новая картинка не должна повторять ни одну из них
  for (const c of shu([...Array(N).keys()]).slice(0, n)) {
    const fam = DIFF_FAM[orig[c]];
    let cand = flat.filter(x => !taken.has(x) && !fam.includes(x));   // другое семейство той же темы
    if (!cand.length) cand = flat.filter(x => !taken.has(x));          // запасной вариант
    const e = pick(cand);
    mod[c] = e; taken.add(e); diffs.push({ cells: [c] });
  }
  return { grid: G, orig, mod, diffs };
}

function diffGenerate(lvl) {
  const cfg = DIFF_LEVELS[lvl.id - 1];
  let sc, key, tries = 0;
  do { sc = diffTry(cfg); key = sc.orig.join('') + '|' + sc.mod.join(''); }
  while (DIFF_SEEN.has(key) && ++tries < 40);
  DIFF_SEEN.add(key);
  return sc;
}

function renderDiff() {
  if (STATE.scratch && STATE.scratch.timerId) clearInterval(STATE.scratch.timerId);   // таймер прошлого задания не должен дожить до нового
  const lvl = getLvl();
  const sc = diffGenerate(lvl);
  const memSec = Math.max(5, Math.round(20 * lvl.timerMul));
  const cellDiff = new Map();                          // клетка → номер отличия
  sc.diffs.forEach((d, k) => d.cells.forEach(c => cellDiff.set(c, k)));
  STATE.scratch = { sc, cellDiff, nDiff: sc.diffs.length, found: 0, foundK: new Set(), done: false, timerId: null };
  diffShowMemorize(sc, memSec);
}

function diffBuildGrid(sc, modified, clickable) {
  return (modified ? sc.mod : sc.orig).map((em, i) => clickable
    ? `<div class="diff-cell" data-i="${i}" onclick="diffClick(this)">${em}</div>`
    : `<div class="diff-cell">${em}</div>`
  ).join('');
}

// Карточка с одним полем (рамка отделяет поля друг от друга)
function diffCard(sc, modified, clickable, label, id) {
  return `<div class="diff-card" style="border:2px solid rgba(127,127,127,.4);border-radius:16px;padding:8px;background:rgba(127,127,127,.07);text-align:center">
    <div class="diff-lbl" style="margin-bottom:6px">${label}</div>
    <div class="diff-img"${id ? ` id="${id}"` : ''} style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, modified, clickable)}</div>
  </div>`;
}

// Ширину окна задания меряем ДО вставки новых карточек. Если мерить после, браузер успевает посчитать
// стили страницы, а потом клетки «доезжают» до нужного размера через её transition — это и есть моргание.
function diffAreaW() {
  const a = document.getElementById('task-area');
  return (a && a.clientWidth) || window.innerWidth;
}

// Размеры считаем по ширине экрана: клетки как можно крупнее.
// Два поля — рядом, если клетки при этом остаются крупными (>= 56px), иначе в столбик.
function diffFit(W) {
  const area = document.getElementById('task-area');
  if (!area) return;
  const imgs = [...area.querySelectorAll('.diff-img')];
  if (!imgs.length) return;
  W = W || diffAreaW();
  const cols = parseInt(imgs[0].style.getPropertyValue('--diff-cols')) || 4;
  const gap = 4, pad = 20, sep = 28;                      // sep — расстояние между полями
  const cellFor = w => Math.min(cols <= 3 ? 104 : 88, Math.floor((w - pad - gap * (cols - 1)) / cols));
  const side = imgs.length === 2 && cellFor((W - sep) / 2) >= 56;
  const cell = Math.max(36, cellFor(side ? (W - sep) / 2 : W));
  const key = [cols, cell, side ? 1 : 0, imgs.length].join('|');
  if (imgs.every(i => i.dataset.fit === key)) return;     // ничего не изменилось (например, лишнее событие resize) — не трогаем
  imgs[0].closest('.diff-wrap').style.cssText =
    `display:flex;flex-direction:${side ? 'row' : 'column'};gap:${sep}px;justify-content:center;align-items:center`;
  const gridW = cols * cell + (cols - 1) * gap;
  const force = (el, k, v) => el.style.setProperty(k, v, 'important');   // задаём размеры жёстко, чтобы стили страницы не сужали карточку
  imgs.forEach(img => {
    const card = img.closest('.diff-card');
    force(card, 'transition', 'none');
    force(card, 'width', (gridW + pad) + 'px'); force(card, 'height', 'auto'); force(card, 'max-width', 'none');
    force(card, 'min-width', '0'); force(card, 'flex', 'none'); force(card, 'box-sizing', 'border-box');
    force(img, 'transition', 'none');
    force(img, 'display', 'flex'); force(img, 'flex-wrap', 'wrap'); force(img, 'align-content', 'flex-start'); force(img, 'width', gridW + 'px'); force(img, 'height', 'auto'); force(img, 'max-width', 'none');
    force(img, 'max-height', 'none'); force(img, 'aspect-ratio', 'auto'); force(img, 'margin', '0 auto');
    // сетка собрана через flex-wrap: высота строки = высоте клетки, страница не может сжать строки и наложить клетки друг на друга
    force(img, 'gap', gap + 'px'); force(img, 'justify-content', 'center');
    img.querySelectorAll('.diff-cell').forEach(c => {     // по отдельным свойствам, чтобы не стереть отметки (outline, фон)
      force(c, 'transition', 'background-color .15s, border-color .15s, outline-color .15s');   // цвет плавно, размер — никогда
      force(c, 'flex', 'none'); force(c, 'width', cell + 'px'); force(c, 'height', cell + 'px'); force(c, 'min-width', '0'); force(c, 'min-height', '0');
      force(c, 'aspect-ratio', 'auto'); force(c, 'box-sizing', 'border-box'); force(c, 'margin', '0'); force(c, 'padding', '0');
      force(c, 'font-size', Math.round(cell * 0.55) + 'px'); force(c, 'line-height', '1');
      force(c, 'display', 'flex'); force(c, 'align-items', 'center'); force(c, 'justify-content', 'center'); force(c, 'overflow', 'hidden');
    });
    img.dataset.fit = key;
  });
}
window.addEventListener('resize', () => diffFit());

function diffWord(n) { return `${n} ${n === 1 ? 'отличие' : n < 5 ? 'отличия' : 'отличий'}`; }

function diffShowMemorize(sc, secLeft) {
  const W = diffAreaW();                                // до вставки карточек (см. diffAreaW)
  const mine = STATE.scratch;                          // это задание; если оно сменилось, таймер сам останавливается
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни расположение — осталось <b id="diff-timer">${secLeft}</b> сек</div>
    <div style="text-align:center;font-size:15px;color:var(--text2);margin:-4px 0 8px">Потом нужно будет найти <b>${diffWord(mine.nDiff)}</b></div>
    <div class="diff-wrap">${diffCard(sc, false, false, 'Оригинал')}</div>
    <button class="btn-sm" id="diff-skip-btn" style="display:block;margin:14px auto 0" onclick="diffSkipMemorize()">Готов, дальше →</button>`;
  diffFit(W);

  let t = secLeft;
  mine.timerId = setInterval(() => {
    const el = document.getElementById('diff-timer');
    if (STATE.scratch !== mine || !el) { clearInterval(mine.timerId); return; }
    t--;
    if (t <= 0) {
      clearInterval(mine.timerId);
      diffShowReveal(sc);
    } else {
      el.textContent = t;
    }
  }, 1000);
}

function diffSkipMemorize() {
  if (STATE.scratch.timerId) clearInterval(STATE.scratch.timerId);
  diffShowReveal(STATE.scratch.sc);
}

function diffShowReveal(sc) {
  const W = diffAreaW();
  const S = STATE.scratch;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">По памяти найди <b>${diffWord(S.nDiff)}</b></div>
    <div class="diff-wrap" id="diff-pair">${diffCard(sc, true, true, 'Изменённое поле', 'diff-mod')}</div>
    <div style="text-align:center;font-size:14px;color:var(--text2);margin-top:10px" id="diff-cnt">Найдено: 0 из ${S.nDiff}</div>`;
  diffFit(W);
}

const diffCellEl = i => document.querySelector(`#diff-mod [data-i="${i}"]`);

function diffClick(el) {
  const S = STATE.scratch;
  if (S.done || el.classList.contains('found')) return;
  const i = +el.dataset.i;
  if (S.cellDiff.has(i)) {                             // верно: отличие найдено (у обмена — обе клетки)
    const k = S.cellDiff.get(i);
    S.sc.diffs[k].cells.forEach(c => diffCellEl(c).classList.add('found'));
    S.foundK.add(k); S.found++;
    document.getElementById('diff-cnt').textContent = `Найдено: ${S.found} из ${S.nDiff}`;
    if (S.found >= S.nDiff) diffEnd(true);
  } else {                                             // первый неверный клик — задание окончено
    el.classList.add('wc');
    diffEnd(false);
  }
}

// Конец задания: показываем обе карточки; пропущенные отличия — оранжевой рамкой
function diffEnd(ok) {
  const S = STATE.scratch;
  S.done = true; STATE.answered = true;
  if (!ok) {
    S.sc.diffs.forEach((d, k) => {
      if (S.foundK.has(k)) return;
      d.cells.forEach(c => { const e = diffCellEl(c); e.style.outline = '3px solid #ef9f27'; e.style.outlineOffset = '-3px'; });
    });
    document.getElementById('diff-cnt').textContent = `Найдено: ${S.found} из ${S.nDiff} · оранжевым показаны пропущенные`;
  }
  diffShowPair();
  STATE.scTot++; if (ok) STATE.scOk++;
  updScore(); showFb(ok, '');
  if (!ok) document.getElementById('fb').textContent = '✗ Пропущенные отличия отмечены оранжевым';
  document.getElementById('nxt-btn').style.display = 'block';
}

// На момент ответа: оригинал и изменённое поле рядом (на узком экране — одно под другим), между ними заметный промежуток
function diffShowPair() {
  const sc = STATE.scratch.sc, W = diffAreaW();
  document.getElementById('diff-pair').insertAdjacentHTML('afterbegin', diffCard(sc, false, false, 'Оригинал'));
  diffFit(W);
}
