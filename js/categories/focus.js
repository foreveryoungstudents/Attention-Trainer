/* ── FOCUS ── */
CATS.focus = {
  name: 'Концентрация', desc: 'Подсчитай нужные символы',
  icon: '👁', bg: '#e6f1fb', fg: '#0c447c',
  gen() {
    const lvl = getLvl();
    const counts = [16, 24, 32, 40];
    const total = counts[lvl.id - 1];
    const sh4 = ['●','■','▲','◆','★'];
    const sh6 = [...sh4, '◉','⬟','✦'];
    const pool = lvl.id >= 3 ? sh6 : sh4;
    const tgt = pick(pool);
    const items = []; let cnt = 0;
    for (let i = 0; i < total; i++) {
      const s = pick(pool); items.push(s);
      if (s === tgt) cnt++;
    }
    const opts = shu([...new Set([cnt, cnt+1, Math.max(0,cnt-1), cnt+2])].slice(0,4));
    return {
      q: `Сколько символов <b style="font-size:24px">${tgt}</b>?`,
      vis: `<div style="display:flex;flex-wrap:wrap;gap:${lvl.id>=3?6:8}px;justify-content:center;font-size:${lvl.id>=3?22:26}px">${
        items.map(s => `<span style="color:${s===tgt?'var(--text)':'var(--text3)'}">${s}</span>`).join('')
      }</div>`,
      ans: String(cnt), opts: opts.map(String)
    };
  }
};
