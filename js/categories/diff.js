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
  'Флаги': [['🇷🇺','🇫🇷','🇳🇱','🇱🇺'],['🇮🇹','🇮🇪','🇲🇽'],['🇩🇪','🇧🇪'],['🇪🇸','🇵🇹'],['🇬🇧','🇺🇸','🇦🇺'],['🇸🇪','🇫🇮','🇳🇴','🇩🇰'],['🇯🇵','🇧🇩'],['🇨🇳','🇻🇳'],['🇵🇱','🇮🇩','🇲🇨'],['🇹🇷','🇹🇳'],['🇬🇷','🇮🇱'],['🇧🇷','🇨🇦'],['🇨🇭','🇦🇹'],['🇺🇦','🇰🇿']],
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
// По уровням: размер поля, число отличий, типы изменений, доля замен на похожий предмет,
// скрыто ли число отличий. Пустых клеток нет нигде: на поле всегда есть что запоминать.
const DIFF_LEVELS = [
  { g: 3, n: 1, types: ['replace'], sim: 0, hidden: false },
  { g: 4, n: 2, types: ['replace', 'dup'], sim: .5, hidden: false },
  { g: 5, n: 3, types: ['replace', 'dup', 'swap'], sim: .7, hidden: true },
  { g: 5, n: 4, types: ['replace', 'dup', 'swap'], sim: 1, hidden: true }
];
const DIFF_SEEN = new Set();   // уже показанные поля — чтобы не повторялись
let DIFF_LAST_THEME = '';

function diffNb(i, G) {
  const r = Math.floor(i / G), c = i % G, a = [];
  if (r > 0) a.push(i - G);
  if (r < G - 1) a.push(i + G);
  if (c > 0) a.push(i - 1);
  if (c < G - 1) a.push(i + 1);
  return a;
}

function diffTry(cfg) {
  const G = cfg.g, N = G * G, n = cfg.n;
  // тема: не та же, что в прошлый раз, и достаточно большая, чтобы на поле не было одинаковых эмодзи
  const names = Object.keys(DIFF_THEMES).filter(t => t !== DIFF_LAST_THEME && DIFF_THEMES[t].flat().length >= N);
  const theme = pick(names);
  DIFF_LAST_THEME = theme;
  const fams = DIFF_THEMES[theme], flat = fams.flat();
  const orig = shu(flat).slice(0, N);
  const mod = orig.slice(), used = new Set(), diffs = [];
  const free = () => [...Array(N).keys()].filter(i => !used.has(i));
  let guard = 0;
  while (diffs.length < n && guard++ < 300) {
    const t = guard > 100 ? 'replace' : pick(cfg.types);
    if (t === 'replace') {
      const c = pick(free()), o = orig[c], fam = DIFF_FAM[o];
      let e;
      if (Math.random() < cfg.sim && fam.length > 1) e = pick(fam.filter(x => x !== o));   // похожий
      else { const far = fams.filter(f => f !== fam).flat(); e = pick(far.length ? far : flat.filter(x => x !== o)); }   // непохожий: другое семейство той же темы
      mod[c] = e; used.add(c); diffs.push({ cells: [c], type: t });
    } else {                                          // swap / dup — нужен соседний предмет
      for (const c of shu(free())) {
        const ds = diffNb(c, G).filter(d => !used.has(d) && orig[d] !== orig[c]);
        if (!ds.length) continue;
        const d = pick(ds);
        if (t === 'swap') { mod[c] = orig[d]; mod[d] = orig[c]; used.add(c); used.add(d); diffs.push({ cells: [c, d], type: t }); }
        else { mod[c] = orig[d]; used.add(c); used.add(d); diffs.push({ cells: [c], type: t }); }
        break;
      }
    }
  }
  return { grid: G, orig, mod, diffs, hidden: cfg.hidden, types: cfg.types };
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
  const lvl = getLvl();
  const sc = diffGenerate(lvl);
  const memSec = Math.max(5, Math.round(20 * lvl.timerMul));
  const cellDiff = new Map();                          // клетка → номер отличия
  sc.diffs.forEach((d, k) => d.cells.forEach(c => cellDiff.set(c, k)));
  STATE.scratch = { sc, cellDiff, nDiff: sc.diffs.length, found: 0, done: false, timerId: null, sel: new Set() };
  diffShowMemorize(sc, memSec);
}

function diffBuildGrid(sc, modified, clickable) {
  return (modified ? sc.mod : sc.orig).map((em, i) => clickable
    ? `<div class="diff-cell" data-i="${i}" onclick="diffClick(this)">${em}</div>`
    : `<div class="diff-cell">${em}</div>`
  ).join('');
}

function diffShowMemorize(sc, secLeft) {
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни расположение — осталось <b id="diff-timer">${secLeft}</b> сек</div>
    <div class="diff-wrap">
      <div>
        <div class="diff-lbl">Оригинал</div>
        <div class="diff-img" style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, false, false)}</div>
      </div>
    </div>
    <button class="btn-sm" id="diff-skip-btn" style="display:block;margin:14px auto 0" onclick="diffSkipMemorize()">Готов, дальше →</button>`;

  let t = secLeft;
  STATE.scratch.timerId = setInterval(() => {
    t--;
    const el = document.getElementById('diff-timer');
    if (!el) { clearInterval(STATE.scratch.timerId); return; }
    if (t <= 0) {
      clearInterval(STATE.scratch.timerId);
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
  const nDiff = STATE.scratch.nDiff;
  const word = nDiff === 1 ? 'отличие' : nDiff < 5 ? 'отличия' : 'отличий';
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">${sc.hidden
      ? 'По памяти отметь <b>все изменения</b> и нажми «Готово»'
      : `По памяти найди <b>${nDiff} ${word}</b>`}</div>
    <div class="diff-wrap" id="diff-pair">
      <div>
        <div class="diff-img" id="diff-mod" style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, true, true)}</div>
      </div>
    </div>
    <div style="text-align:center;font-size:14px;color:var(--text2);margin-top:10px" id="diff-cnt">${sc.hidden ? 'Отмечено: 0' : `Найдено: 0 из ${nDiff}`}</div>
    ${sc.hidden ? '<button class="btn-sm" id="diff-done-btn" style="display:block;margin:12px auto 0" onclick="diffFinish()">Готово</button>' : ''}`;
}

function diffClick(el) {
  const S = STATE.scratch;
  if (S.done) return;
  const i = +el.dataset.i;
  if (S.sc.hidden) {                                   // уровни 3–4: отмечаем, проверка — по кнопке «Готово»
    if (S.sel.has(i)) { S.sel.delete(i); el.style.outline = ''; }
    else { S.sel.add(i); el.style.outline = '3px solid #378add'; el.style.outlineOffset = '-3px'; }
    document.getElementById('diff-cnt').textContent = `Отмечено: ${S.sel.size}`;
    return;
  }
  if (el.classList.contains('found')) return;          // уровни 1–2: сразу проверяем
  if (S.cellDiff.has(i)) {
    S.sc.diffs[S.cellDiff.get(i)].cells.forEach(c => document.querySelector(`#diff-mod [data-i="${c}"]`).classList.add('found'));
    S.found++;
    document.getElementById('diff-cnt').textContent = `Найдено: ${S.found} из ${S.nDiff}`;
    if (S.found >= S.nDiff) {
      S.done = true;
      STATE.answered = true;
      STATE.scOk++; STATE.scTot++;
      diffShowPair();
      updScore(); showFb(true, '');
      document.getElementById('nxt-btn').style.display = 'block';
    }
  } else {
    el.classList.add('wc');
    setTimeout(() => el.classList.remove('wc'), 400);
  }
}

function diffFinish() {
  const S = STATE.scratch;
  if (S.done) return;
  S.done = true; STATE.answered = true;
  const cellEl = i => document.querySelector(`#diff-mod [data-i="${i}"]`);
  let foundN = 0;
  S.sc.diffs.forEach(d => {
    const hit = d.cells.some(c => S.sel.has(c));       // у обмена достаточно отметить любую из двух клеток
    if (hit) foundN++;
    d.cells.forEach(c => {
      const el = cellEl(c);
      if (hit) { el.classList.add('found'); el.style.outline = ''; }
      else { el.style.outline = '3px solid #ef9f27'; el.style.outlineOffset = '-3px'; }
    });
  });
  const wrong = [...S.sel].filter(c => !S.cellDiff.has(c));
  wrong.forEach(c => { const el = cellEl(c); el.style.outline = ''; el.style.background = '#f7c1c1'; });
  const ok = foundN === S.nDiff && wrong.length === 0;
  document.getElementById('diff-cnt').textContent =
    `Найдено ${foundN} из ${S.nDiff}` + (wrong.length ? `, лишних отметок: ${wrong.length}` : '') +
    (foundN < S.nDiff ? ' · оранжевым показаны пропущенные' : '');
  document.getElementById('diff-done-btn').style.display = 'none';
  diffShowPair();
  STATE.scOk += ok ? 1 : 0; STATE.scTot++;
  updScore(); showFb(ok, '');
  document.getElementById('nxt-btn').style.display = 'block';
}

// На момент ответа: слева оригинал, справа изменённое поле — две карточки рядом
function diffShowPair() {
  const sc = STATE.scratch.sc, wrap = document.getElementById('diff-pair');
  wrap.style.cssText = 'display:flex;gap:12px;justify-content:center;align-items:flex-start;flex-wrap:nowrap';
  wrap.firstElementChild.insertAdjacentHTML('afterbegin', '<div class="diff-lbl">Изменённое</div>');
  wrap.insertAdjacentHTML('afterbegin', `<div><div class="diff-lbl">Оригинал</div><div class="diff-img" style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, false, false)}</div></div>`);
  const k = wrap.clientWidth / wrap.scrollWidth;       // на узком экране уменьшаем, чтобы обе карточки поместились рядом
  if (k < 1) [...wrap.children].forEach(c => c.style.zoom = k);
}
