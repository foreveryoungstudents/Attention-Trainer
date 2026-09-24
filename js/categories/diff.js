/* ── DIFF ── */
CATS.diff = {
  name: 'Найди различия', desc: 'Запомни поле, затем найди изменения по памяти',
  icon: '🔎', bg: '#fbeaf0', fg: '#72243e',
  gen() { return { type: 'diff' }; }
};

const DIFF_SCENES = [
  { grid: 5, items: [
    ['🌳','🌳','🏠','🌳','🌳'],
    ['🌸','🐦','☀️','🐦','🌸'],
    ['🚗','🌿','🌺','🌿','🚗'],
    ['🌳','🌳','🏠','🌳','🌳'],
    ['🐾','🌱','🌱','🌱','🐾']],
    allDiffs: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    alts: {[0*5+2]:'🏡',[1*5+2]:'🌤️',[2*5+2]:'🌻',[3*5+2]:'🏘️',[4*5+2]:'🐾'} },
  { grid: 5, items: [
    ['🍎','🍌','🍇','🍊','🍋'],
    ['🍓','🍑','🍒','🍍','🥝'],
    ['🫐','🍈','🍐','🍉','🍓'],
    ['🥭','🍌','🍇','🍑','🍎'],
    ['🍋','🍒','🍊','🥝','🍇']],
    allDiffs: [[1,0],[2,4],[3,2],[0,4],[4,1]],
    alts: {[1*5+0]:'🍅',[2*5+4]:'🫒',[3*5+2]:'🍑',[0*5+4]:'🍏',[4*5+1]:'🍇'} },
  { grid: 5, items: [
    ['🐶','🐱','🐭','🐹','🐰'],
    ['🦊','🐻','🐼','🐨','🐯'],
    ['🦁','🐮','🐷','🐸','🐵'],
    ['🐔','🐧','🐦','🦆','🦅'],
    ['🐴','🦄','🐝','🦋','🐛']],
    allDiffs: [[0,2],[1,3],[2,1],[3,4],[4,0]],
    alts: {[0*5+2]:'🐰',[1*5+3]:'🐻',[2*5+1]:'🐽',[3*5+4]:'🦉',[4*5+0]:'🐎'} }
];
const DIFF_COUNTS = [2, 3, 4, 5];

function renderDiff() {
  const lvl = getLvl();
  const sc = pick(DIFF_SCENES);
  const nDiff = DIFF_COUNTS[lvl.id - 1];
  const chosenDiffs = shu(sc.allDiffs).slice(0, nDiff);
  const ds = new Set(chosenDiffs.map(([row,col]) => row * sc.grid + col));
  const memSec = Math.max(5, Math.round(20 * lvl.timerMul));

  STATE.scratch = { sc, ds, nDiff, found: 0, done: false, timerId: null };
  diffShowMemorize(sc, memSec);
}

function diffBuildGrid(sc, ds, isModified) {
  return [...Array(sc.grid)].map((_, row) =>
    [...Array(sc.grid)].map((_, col) => {
      const idx = row * sc.grid + col;
      const isDiff = ds.has(idx);
      const em = isModified && isDiff ? (sc.alts[idx] || '❓') : sc.items[row][col];
      return isModified
        ? `<div class="diff-cell" data-diff="${isDiff?1:0}" onclick="diffClick(this)">${em}</div>`
        : `<div class="diff-cell">${em}</div>`;
    }).join('')
  ).join('');
}

function diffShowMemorize(sc, secLeft) {
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни расположение — осталось <b id="diff-timer">${secLeft}</b> сек</div>
    <div class="diff-wrap">
      <div>
        <div class="diff-lbl">Оригинал</div>
        <div class="diff-img" style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, STATE.scratch.ds, false)}</div>
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
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">По памяти найди <b>${nDiff} ${nDiff===1?'отличие':nDiff<5?'отличия':'отличий'}</b></div>
    <div class="diff-wrap">
      <div>
        <div class="diff-lbl">Изменённое поле</div>
        <div class="diff-img" style="--diff-cols:${sc.grid}">${diffBuildGrid(sc, STATE.scratch.ds, true)}</div>
      </div>
    </div>
    <div style="text-align:center;font-size:14px;color:var(--text2);margin-top:10px" id="diff-cnt">Найдено: 0 из ${nDiff}</div>`;
}

function diffClick(el) {
  if (STATE.scratch.done) return;
  if (el.classList.contains('found')) return;
  if (el.dataset.diff === '1') {
    el.classList.add('found');
    STATE.scratch.found++;
    document.getElementById('diff-cnt').textContent = `Найдено: ${STATE.scratch.found} из ${STATE.scratch.nDiff}`;
    if (STATE.scratch.found >= STATE.scratch.nDiff) {
      STATE.scratch.done = true;
      STATE.answered = true;
      STATE.scOk++; STATE.scTot++;
      updScore(); showFb(true, '');
      document.getElementById('nxt-btn').style.display = 'block';
    }
  } else {
    el.classList.add('wc');
    setTimeout(() => el.classList.remove('wc'), 400);
  }
}
