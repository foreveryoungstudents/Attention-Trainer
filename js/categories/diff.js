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

// Размеры и раскладка карточек. Если захотите, перенесите это в основной CSS и удалите функцию.
function diffEnsureStyle() {
  if (document.getElementById('diff-style')) return;
  const st = document.createElement('style');
  st.id = 'diff-style';
  st.textContent = `
#task-area .diff-wrap{display:flex;flex-direction:row;justify-content:center;align-items:flex-start;gap:24px;margin-top:12px}
#task-area .diff-wrap>div{flex:1 1 0;min-width:0;max-width:480px;padding:12px;border:2px solid rgba(127,127,127,.35);border-radius:16px;background:rgba(127,127,127,.07)}
#task-area .diff-lbl{text-align:center;font-weight:600;margin-bottom:8px}
#task-area .diff-img{display:grid!important;grid-template-columns:repeat(var(--diff-cols),1fr)!important;gap:4px!important;width:min(100%,calc(var(--diff-cols)*84px))!important;margin:0 auto!important;container-type:inline-size}
#task-area .diff-cell{display:flex!important;align-items:center;justify-content:center;aspect-ratio:1/1;width:auto!important;height:auto!important;line-height:1;font-size:clamp(24px,10vw,48px)!important;font-size:calc(100cqw/var(--diff-cols)*.62)!important}
@media(max-width:640px){#task-area .diff-wrap{flex-direction:column;align-items:center;gap:22px}#task-area .diff-wrap>div{flex:none;width:100%}}`;
  document.head.appendChild(st);
}

function renderDiff() {
  diffEnsureStyle();
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

// Карточка с одним полем (рамка отделяет поля друг от друга)
function diffCard(sc, modified, clickable, label, id) {
  return `<div class="diff-card" style="border:2px solid rgba(127,127,127,.4);border-radius:16px;padding:8px;background:rgba(127,127,127,.07);text-align:center">
    <div class="diff-lbl" style="margin-bottom:6px">${label}</div>
    <div class="diff-img"${id ? ` id="${id}"` : ''} style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, modified, clickable)}</div>
  </div>`;
}

// Размеры считаем по ширине экрана: клетки как можно крупнее.
// Два поля — рядом, если клетки при этом остаются крупными (>= 56px), иначе в столбик.
function diffFit() {
  const area = document.getElementById('task-area');
  if (!area) return;
  const imgs = [...area.querySelectorAll('.diff-img')];
  if (!imgs.length) return;
  const cols = parseInt(imgs[0].style.getPropertyValue('--diff-cols')) || 5;
  const gap = 4, pad = 20, sep = 28;                      // sep — расстояние между полями
  const W = area.clientWidth || window.innerWidth;
  const cellFor = w => Math.min(88, Math.floor((w - pad - gap * (cols - 1)) / cols));
  const side = imgs.length === 2 && cellFor((W - sep) / 2) >= 56;
  const cell = Math.max(36, cellFor(side ? (W - sep) / 2 : W));
  imgs[0].closest('.diff-wrap').style.cssText =
    `display:flex;flex-direction:${side ? 'row' : 'column'};gap:${sep}px;justify-content:center;align-items:center`;
  imgs.forEach(img => {
    img.style.display = 'grid';
    img.style.gridTemplateColumns = `repeat(${cols}, ${cell}px)`;
    img.style.gap = gap + 'px';
    img.style.justifyContent = 'center';
    img.querySelectorAll('.diff-cell').forEach(c => {     // по отдельным свойствам, чтобы не стереть отметки (outline, фон)
      c.style.width = c.style.height = cell + 'px';
      c.style.fontSize = Math.round(cell * 0.62) + 'px';
      c.style.display = 'flex';
      c.style.alignItems = c.style.justifyContent = 'center';
      c.style.lineHeight = '1';
    });
  });
}
window.addEventListener('resize', diffFit);

function diffShowMemorize(sc, secLeft) {
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни расположение — осталось <b id="diff-timer">${secLeft}</b> сек</div>
    <div class="diff-wrap">${diffCard(sc, false, false, 'Оригинал')}</div>
    <button class="btn-sm" id="diff-skip-btn" style="display:block;margin:14px auto 0" onclick="diffSkipMemorize()">Готов, дальше →</button>`;
  diffFit();

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
    <div class="diff-wrap" id="diff-pair">${diffCard(sc, true, true, 'Изменённое поле', 'diff-mod')}</div>
    <div style="text-align:center;font-size:14px;color:var(--text2);margin-top:10px" id="diff-cnt">${sc.hidden ? 'Отмечено: 0' : `Найдено: 0 из ${nDiff}`}</div>
    ${sc.hidden ? '<button class="btn-sm" id="diff-done-btn" style="display:block;margin:12px auto 0" onclick="diffFinish()">Готово</button>' : ''}`;
  diffFit();
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

// На момент ответа: оригинал и изменённое поле рядом (на узком экране — одно под другим), между ними заметный промежуток
function diffShowPair() {
  const sc = STATE.scratch.sc;
  document.getElementById('diff-pair').insertAdjacentHTML('afterbegin', diffCard(sc, false, false, 'Оригинал'));
  diffFit();
}
