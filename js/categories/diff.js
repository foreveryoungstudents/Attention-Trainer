/* ── DIFF ── */
CATS.diff = {
  name: 'Найди различия', desc: 'Кликни на отличия правой картинки',
  icon: '🔎', bg: '#fbeaf0', fg: '#72243e',
  gen() { return { type: 'diff' }; }
};

function renderDiff() {
  const lvl = getLvl();
  const diffCounts = [2, 3, 4, 5];
  const scenes = [
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
  const sc = pick(scenes);
  const nDiff = diffCounts[lvl.id - 1];
  const chosenDiffs = shu(sc.allDiffs).slice(0, nDiff);
  const ds = new Set(chosenDiffs.map(([row,col]) => row * sc.grid + col));
  STATE.scratch = { found: 0, total: nDiff, done: false };

  function buildG(isR) {
    return [...Array(sc.grid)].map((_, row) =>
      [...Array(sc.grid)].map((_, col) => {
        const idx = row * sc.grid + col;
        const isDiff = ds.has(idx);
        const em = isR && isDiff ? (sc.alts[idx] || '❓') : sc.items[row][col];
        return `<div class="diff-cell" data-diff="${isDiff&&isR?1:0}" onclick="diffClick(this,${isR?1:0})">${em}</div>`;
      }).join('')
    ).join('');
  }

  document.getElementById('task-area').innerHTML = `
    <div class="task-q" style="font-size:16px">Найди <b>${nDiff} ${nDiff===1?'отличие':nDiff<5?'отличия':'отличий'}</b> в правой картинке</div>
    <div class="diff-wrap">
      <div><div class="diff-lbl">Оригинал</div><div class="diff-img" style="--diff-cols:${sc.grid}">${buildG(false)}</div></div>
      <div class="diff-sep"></div>
      <div><div class="diff-lbl">Изменённая</div><div class="diff-img" style="--diff-cols:${sc.grid}">${buildG(true)}</div></div>
    </div>
    <div style="text-align:center;font-size:14px;color:var(--text2);margin-top:10px" id="diff-cnt">Найдено: 0 из ${nDiff}</div>`;
}

function diffClick(el, isR) {
  if (!isR || STATE.scratch.done) return;
  if (el.classList.contains('found')) return;
  if (el.dataset.diff === '1') {
    el.classList.add('found');
    STATE.scratch.found++;
    document.getElementById('diff-cnt').textContent = `Найдено: ${STATE.scratch.found} из ${STATE.scratch.total}`;
    if (STATE.scratch.found >= STATE.scratch.total) {
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
