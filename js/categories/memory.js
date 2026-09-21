/* ── MEMORY (words) ── */
CATS.memory = {
  name: 'Память', desc: 'Запомни слова — потом воспроизведи',
  icon: '🧠', bg: '#fbeaf0', fg: '#72243e',
  gen() {
    const lvl = getLvl();
    const pool = 'яблоко река книга замок лампа облако дерево ключ мост цветок стол луна огонь ветер камень корабль гора поезд окно птица море звезда флаг нож вилка чашка диван кровать зеркало шкаф пальто сумка телефон компьютер мышь клавиатура экран кот пёс конь лиса волк медведь орёл бабочка'.split(' ');
    const n = lvl.wordsN[0] + r(lvl.wordsN[1] - lvl.wordsN[0] + 1);
    const sel = [], p = [...pool];
    for (let i = 0; i < n; i++) { const idx = r(p.length); sel.push(p.splice(idx, 1)[0]); }
    // level 3-4: hide multiple words
    const hideCount = lvl.id >= 3 ? 2 : 1;
    const hidIdxs = shu([...Array(n).keys()].slice(1)).slice(0, hideCount);
    const hidden = hidIdxs.map(i => sel[i]);
    const dis = p.slice(0, 3);
    const opts = shu([...hidden, ...dis]).slice(0, 4);
    return {
      type: 'memory',
      words: sel, hidden: hidden[0], hidIdxs,
      hiddenAll: hidden,
      opts,
      q: hidIdxs.length > 1 ? `Какое из слов пропущено <b>первым</b>?` : 'Какое слово пропущено?'
    };
  }
};

function renderMem1() {
  const t = STATE.curTask;
  const lvl = getLvl();
  const secs = [5, 5, 4, 3][lvl.id - 1] + t.words.length;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни слова</div>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:1rem 0">${
      t.words.map(w => `<span style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:9px 16px;font-size:18px;font-weight:600">${w}</span>`).join('')
    }</div>
    <div class="mem-cd" id="mem-cd">${secs}</div>
    <div style="font-size:14px;color:var(--text3);text-align:center">секунд на запоминание</div>`;
  let s = secs;
  const iv = setInterval(() => {
    s--;
    const el = document.getElementById('mem-cd');
    if (el) el.textContent = s;
    if (s <= 0) { clearInterval(iv); renderMem2(); }
  }, 1000);
}

function renderMem2() {
  const t = STATE.curTask;
  const shown = [...t.words];
  t.hidIdxs.forEach(i => shown[i] = '???');
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">${t.q}</div>
    <div class="task-vis" style="font-size:18px;line-height:2.2">${shown.join(' · ')}</div>
    <div class="opts">${t.opts.map(o =>
      `<button class="opt" onclick="checkAns(this,'${esc(o)}','${esc(t.hidden)}',true)">${o}</button>`
    ).join('')}</div>`;
}
