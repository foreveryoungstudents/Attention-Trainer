/* ── GRID SEARCH ── */
CATS.grid_search = {
  name: 'Поиск в сетке', desc: 'Найди все вхождения буквы',
  icon: '🔍', bg: '#eaf3de', fg: '#27500a',
  gen() {
    const lvl = getLvl();
    const cols = [4, 5, 6, 7][lvl.id - 1];
    const rows = [4, 5, 5, 6][lvl.id - 1];
    const total = cols * rows;
    const maxHits = [6, 8, 10, 12][lvl.id - 1];
    const syms = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ'.split('');
    // level 3-4: use visually similar letters
    const confusable = ['З','Э','С', 'Р','Ь','Ъ', 'Ш','Щ', 'И','Й','Н'];
    const pool = lvl.id >= 3 ? confusable : syms;
    const tgt = pick(pool), grid = []; let cnt = 0;
    for (let i = 0; i < total; i++) {
      if (Math.random() < 0.18 && cnt < maxHits) { grid.push(tgt); cnt++; }
      else { let s; do { s = pick(pool); } while (s === tgt); grid.push(s); }
    }
    const opts = shu([...new Set([cnt, cnt+1, Math.max(0,cnt-1), cnt+2])].slice(0,4));
    return {
      q: `Сколько раз встречается <b style="font-size:22px">${tgt}</b>?`,
      vis: `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:5px;font-family:monospace;font-size:${lvl.id>=3?15:17}px">${
        grid.map(c => `<span style="color:${c===tgt?'var(--text)':'var(--text3)'}">${c}</span>`).join('')
      }</div>`,
      ans: String(cnt), opts: opts.map(String)
    };
  }
};
