/* ── FOCUS ── */
CATS.focus = {
  name: 'Концентрация', desc: 'Подсчитай нужные символы',
  icon: '👁', bg: '#e6f1fb', fg: '#0c447c',
  gen() {
    const lvl = getLvl();
    const counts = [28, 42, 58, 76];
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
    const fontSz = lvl.id >= 3 ? 30 : 36;
    const gap = lvl.id >= 3 ? 8 : 10;
    return {
      q: `Сколько символов <b style="font-size:${fontSz}px">${tgt}</b>?`,
      vis: `<div style="width:min(420px, 100%);margin:0 auto;display:flex;flex-wrap:wrap;gap:${gap}px;justify-content:center;font-size:${fontSz}px;line-height:1">${
        items.map(s => `<span style="color:var(--text)">${s}</span>`).join('')
      }</div>`,
      ans: String(cnt), opts: opts.map(String)
    };
  }
};
