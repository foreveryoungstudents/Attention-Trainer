/* ── GRID MEMORY ── */
CATS.grid_memory = {
  name: 'Сетка по памяти', desc: 'Запомни закрашенные клетки и воспроизведи',
  icon: '🟦', bg: '#e6f1fb', fg: '#0c447c',
  gen() { return { type: 'grid_memory' }; }
};

function renderGridMemory() {
  const lvl = getLvl();
  const configs = [
    { sz: 3, nFill: 3, secs: 5 },
    { sz: 4, nFill: 5, secs: 4 },
    { sz: 5, nFill: 8, secs: 4 },
    { sz: 5, nFill: 11, secs: 3 },
  ];
  const { sz, nFill, secs } = configs[lvl.id - 1];
  const tot = sz * sz;
  const cells = shu([...Array(tot)].map((_, i) => i)).slice(0, nFill).sort((a,b) => a-b);
  STATE.scratch = { pattern: cells, sz, nFill, selected: new Set() };

  const cw = Math.min(60, Math.floor(320 / sz));

  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни закрашенные клетки</div>
    <div class="mgrid" id="mg" style="grid-template-columns:repeat(${sz},${cw}px);max-width:${sz*(cw+4)+10}px;margin:0 auto 1rem;"></div>
    <div class="mem-cd" id="mem-cd">${secs}</div>
    <div style="font-size:14px;color:var(--text3);text-align:center">секунд на запоминание</div>`;

  const mg = document.getElementById('mg');
  for (let i = 0; i < tot; i++) {
    const d = document.createElement('div');
    d.className = 'mcell' + (cells.includes(i) ? ' filled' : '');
    d.style.width = cw + 'px'; d.style.height = cw + 'px';
    mg.appendChild(d);
  }

  let s = secs;
  const iv = setInterval(() => {
    s--;
    const el = document.getElementById('mem-cd');
    if (el) el.textContent = s;
    if (s <= 0) { clearInterval(iv); renderGridRecall(sz, cw); }
  }, 1000);
}

function renderGridRecall(sz, cw) {
  const { pattern, selected } = STATE.scratch;
  const tot = sz * sz;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Отметь клетки, которые были закрашены</div>
    <div class="mgrid" id="mg2" style="grid-template-columns:repeat(${sz},${cw}px);max-width:${sz*(cw+4)+10}px;margin:0 auto 1rem;"></div>
    <div style="text-align:center">
      <button class="next-btn" onclick="checkGridMemory()">Проверить</button>
    </div>`;

  const mg = document.getElementById('mg2');
  for (let i = 0; i < tot; i++) {
    const d = document.createElement('div');
    d.className = 'mcell'; d.style.width = cw + 'px'; d.style.height = cw + 'px';
    d.onclick = () => {
      if (STATE.answered) return;
      if (selected.has(i)) { selected.delete(i); d.classList.remove('selected'); }
      else { selected.add(i); d.classList.add('selected'); }
    };
    mg.appendChild(d);
  }
  document.getElementById('nxt-btn').style.display = 'none';
}

function checkGridMemory() {
  if (STATE.answered) return;
  STATE.answered = true; STATE.scTot++;
  const { pattern, selected } = STATE.scratch;
  const correct = new Set(pattern);
  const cells = document.getElementById('mg2').querySelectorAll('.mcell');
  let ok = true;
  cells.forEach((c, i) => {
    c.classList.remove('selected');
    if (correct.has(i) && selected.has(i)) c.classList.add('correct');
    else if (correct.has(i) && !selected.has(i)) { c.classList.add('missed'); ok = false; }
    else if (!correct.has(i) && selected.has(i)) { c.classList.add('wrong'); ok = false; }
  });
  if (ok) STATE.scOk++;
  document.querySelector('[onclick="checkGridMemory()"]').remove();
  showFb(ok, ok ? '' : `Правильно: ${pattern.filter(i => selected.has(i)).length}/${pattern.length}`);
  updScore();
  document.getElementById('nxt-btn').style.display = 'block';
}
