/* ═══════════════════════════════════════
   ENGINE — session control + UI shell
═══════════════════════════════════════ */

/* ─── Level picker render ─── */
function renderLevelPicker() {
  document.getElementById('level-picker').innerHTML = LEVELS.map(l => `
    <button class="lvl-btn${STATE.level === l.id ? ' active' : ''}" onclick="setLevel(${l.id})">
      <span class="lvl-emoji">${l.emoji}</span>
      <span class="lvl-label">${l.label}</span>
    </button>`).join('');
}

function setLevel(id) {
  STATE.level = id;
  renderLevelPicker();
}

/* ─── Grid render ─── */
function renderGrid() {
  const root = document.getElementById('grid-root');
  root.innerHTML = SECTIONS.map(sec => `
    <div class="section-label">${sec.label}</div>
    <div class="grid">${sec.cats.map(id => {
      const c = CATS[id];
      return `<div class="card" onclick="openCat('${id}')">
        <div class="card-icon" style="background:${c.bg};color:${c.fg}">${c.icon}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-desc">${c.desc}</div>
      </div>`;
    }).join('')}</div>`).join('');
}

/* ─── Open single category ─── */
function openCat(id) {
  STATE.sessCats = [CATS[id]];
  STATE.sessIdx = 0; STATE.scOk = 0; STATE.scTot = 0;
  startSess();
}

/* ─── Random set: ONE task from each section ─── */
function startRandom() {
  STATE.sessCats = shu(
    SECTIONS.map(sec => CATS[pick(sec.cats)])
  );
  STATE.sessIdx = 0; STATE.scOk = 0; STATE.scTot = 0;
  startSess();
}

/* ─── Start session ─── */
function startSess() {
  STATE.curCat = STATE.sessCats[STATE.sessIdx];
  document.getElementById('m-title').textContent = STATE.curCat.name;
  setBadge(); updScore(); loadTask();
  document.getElementById('overlay').classList.add('open');
}

function setBadge() {
  const b = document.getElementById('m-badge');
  const total = STATE.sessCats.length;
  b.textContent = total > 1 ? `${STATE.sessIdx + 1}/${total}` : STATE.curCat.name;
  b.style.background = STATE.curCat.bg;
  b.style.color = STATE.curCat.fg;
}

/* ─── Load next task ─── */
function loadTask() {
  STATE.answered = false;
  STATE.scratch = {};
  STATE.curTask = STATE.curCat.gen();
  document.getElementById('sess-lbl').textContent =
    STATE.sessCats.length > 1
      ? `Задание ${STATE.sessIdx + 1} из ${STATE.sessCats.length}: ${STATE.curCat.name}`
      : '';
  document.getElementById('fb').style.display = 'none';
  document.getElementById('nxt-btn').style.display = 'none';
  document.getElementById('task-area').innerHTML = '';

  const tp = STATE.curTask.type;
  const noAutoTimer = ['schulte','memory','text_attn','diff','bihem_match','anagram','grid_memory'];

  if      (tp === 'schulte')     renderSchulte();
  else if (tp === 'memory')      renderMem1();
  else if (tp === 'text_attn')   renderTextAttn();
  else if (tp === 'diff')        renderDiff();
  else if (tp === 'bihem_match') renderBihemMatch();
  else if (tp === 'anagram')     renderAnagram();
  else if (tp === 'grid_memory') renderGridMemory();
  else if (tp === 'speech_odd')  renderExc();
  else if (tp === 'except')      renderExc();
  else                           renderStd();

  if (!noAutoTimer.includes(tp)) startTimer(35);
  else stopTimer();
}

/* ─── Next task / advance ─── */
function nextTask() {
  STATE.sessIdx++;
  if (STATE.sessIdx < STATE.sessCats.length) {
    STATE.curCat = STATE.sessCats[STATE.sessIdx];
    document.getElementById('m-title').textContent = STATE.curCat.name;
    setBadge(); loadTask();
  } else {
    showSummary();
  }
}

/* ─── Summary screen ─── */
function showSummary() {
  stopTimer();
  const pct = STATE.scTot ? Math.round(STATE.scOk / STATE.scTot * 100) : 0;
  const stars = pct >= 80 ? '★★★' : pct >= 50 ? '★★☆' : '★☆☆';
  const lvl = getLvl();
  document.getElementById('task-area').innerHTML = `
    <div class="summary">
      <div class="summary-stars">${stars}</div>
      <div class="summary-score">${STATE.scOk} из ${STATE.scTot}</div>
      <div class="summary-sub">${pct}% верных ответов</div>
      <div style="font-size:14px;color:var(--text3);margin-top:6px">Уровень: ${lvl.emoji} ${lvl.label}</div>
      <button class="next-btn" style="margin-top:1.5rem" onclick="closeModal()">Завершить</button>
    </div>`;
  document.getElementById('fb').style.display = 'none';
  document.getElementById('nxt-btn').style.display = 'none';
}

/* ─── Modal close ─── */
function closeModal() {
  stopTimer();
  document.getElementById('overlay').classList.remove('open');
}
function overlayClick(e) {
  if (e.target === document.getElementById('overlay')) closeModal();
}

/* ─── Boot ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderLevelPicker();
  renderGrid();
});
