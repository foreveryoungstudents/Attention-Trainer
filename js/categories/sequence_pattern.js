/* ── SEQUENCE ── */
CATS.sequence = {
  name: 'Числовые ряды', desc: 'Найди пропущенное число',
  icon: '🔢', bg: '#faece7', fg: '#712b13',
  gen() {
    const lvl = getLvl();
    const len = lvl.seqLen[0] + r(lvl.seqLen[1] - lvl.seqLen[0] + 1);
    const hi = lvl.numRange[1];
    const h2 = Math.max(2, Math.floor(hi / 2));    // всегда целое
    const h10 = Math.max(1, Math.floor(hi / 10));  // всегда целое

    const fns = [
      // arithmetic
      () => { const s=r(10)+1, d=r(h10)+2, pos=r(len-2)+2, n=[]; for(let i=0;i<len;i++) n.push(s+d*i); const a=n[pos]; n[pos]='?'; return {n,a}; },
      // geometric (при длинном ряде только ×2, чтобы числа не улетали)
      () => { const s=r(3)+2, rt=len>5 ? 2 : r(2)+2, pos=r(len-3)+1, n=[]; let v=s; for(let i=0;i<len;i++){n.push(v);v*=rt;} const a=n[pos]; n[pos]='?'; return {n,a}; },
      // descending (последний член гарантированно > 0)
      () => { const d=r(6)+2, s=d*len + r(h2) + 1, pos=r(len-2)+1, n=[]; for(let i=0;i<len;i++) n.push(s-d*i); const a=n[pos]; n[pos]='?'; return {n,a}; },
      // fibonacci-like (lvl 3+)
      () => { const a0=r(4)+1, a1=r(4)+2, n=[a0,a1]; for(let i=2;i<len;i++) n.push(n[i-1]+n[i-2]); const pos=r(len-3)+2; const a=n[pos]; n[pos]='?'; return {n,a}; },
      // alternating step (lvl 4)
      () => { const s=r(10)+5, d1=r(5)+2, d2=r(3)+1, n=[]; let v=s; for(let i=0;i<len;i++){n.push(v);v+=(i%2===0?d1:d2);} const pos=r(len-3)+2; const a=n[pos]; n[pos]='?'; return {n,a}; },
    ];
    const avail = lvl.id <= 2 ? fns.slice(0,3) : lvl.id === 3 ? fns.slice(0,4) : fns;
    const {n, a} = pick(avail)();

    // ровно 3 уникальных неверных варианта, все > 0 и ≠ a
    const wrong = new Set();
    for (let g = 0; wrong.size < 3 && g < 60; g++) {
      const w = pick([a + r(5) + 1, a - r(5) - 1, a * 2, a + r(10) + 1]);
      if (w !== a && w > 0) wrong.add(w);
    }
    for (let k = 1; wrong.size < 3; k++) wrong.add(a + k);   // страховка

    return {
      q: 'Найди пропущенное число',
      vis: `<span style="font-size:22px;font-weight:600;letter-spacing:2px">${n.join(' — ')}</span>`,
      ans: String(a), opts: shu([a, ...wrong]).map(String)
    };
  }
};

/* ── PATTERN ── */
const PT = (() => {
  const R = n => Math.floor(Math.random() * n);
  const P = a => a[R(a.length)];
  const S = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const range = n => [...Array(n).keys()];
  const LET = ['А', 'Б', 'В', 'Г'];
  const COL = ['#e4572e', '#2e86ab', '#3fa34d', '#f2b134', '#8e5bd1'];
  const SH = {
    circle: '<circle cx="22" cy="22" r="16"/>',
    square: '<rect x="7" y="7" width="30" height="30" rx="3"/>',
    tri: '<polygon points="22,5 38,36 6,36"/>',
    diamond: '<polygon points="22,4 40,22 22,40 4,22"/>',
    star: '<polygon points="22,4 27,16 40,17 30,26 33,39 22,32 11,39 14,26 4,17 17,16"/>',
    arrow: '<polygon points="22,4 38,22 28,22 28,40 16,40 16,22 6,22"/>',
    quarter: '<path d="M6 38V6a32 32 0 0 1 32 32z"/>',
    hex: '<polygon points="22,4 38,13 38,31 22,40 6,31 6,13"/>'
  };
  const SC = [.6, .82, 1.05], PO = [-10, 0, 10];
  // s — форма, c — цвет, z — размер, r — поворот (шаг 90°), p — положение по вертикали
  const PROPS = { s: { pool: ['circle', 'square', 'tri', 'diamond', 'star', 'hex'], cyc: [2, 3] }, c: { cyc: [2, 3, 4] }, z: { cyc: [2, 3] }, r: { cyc: [4] }, p: { cyc: [2, 3] } };
  const SYMS = [{ s: 'circle', c: 0 }, { s: 'square', c: 1 }, { s: 'tri', c: 2 }, { s: 'diamond', c: 3 }, { s: 'star', c: 4 }];

  const svg = t => `<svg viewBox="-2 -12 48 68" width="38" height="52" style="overflow:visible"><g fill="${COL[t.c]}" transform="translate(0 ${PO[t.p]}) rotate(${t.r * 90} 22 22) translate(22 22) scale(${SC[t.z]}) translate(-22 -22)">${SH[t.s]}</g></svg>`;
  const cell = (t, lab) => `<span style="display:inline-flex;flex-direction:column;align-items:center;margin:3px;padding:4px 3px 2px;min-width:42px;border-radius:10px;background:rgba(127,127,127,.13)">${t ? svg(t) : '<span style="font:700 26px/52px system-ui,sans-serif;color:#2f5bea">?</span>'}<span style="font:12px system-ui,sans-serif;opacity:.65">${lab === '' ? '&nbsp;' : lab}</span></span>`;
  const row = h => `<div style="text-align:center;line-height:1.1">${h}</div>`;
  const cap = t => `<div style="font-size:13px;opacity:.7;margin:12px 0 2px;text-align:center">${t}</div>`;
  const sig = t => [t.s, t.c, t.z, t.r, t.p].join();
  const T = y => ({ s: y.s, c: y.c, z: 2, r: 0, p: 1 });

  function spec(keys, pers) {
    let per;
    do { per = {}; keys.forEach((k, j) => per[k] = pers ? pers[j] : P(PROPS[k].cyc)); }
    while (!pers && new Set(keys.map(k => per[k])).size === 1);
    const sh = keys.includes('r') ? ['tri', 'arrow', 'quarter'] : PROPS.s.pool, vals = {};
    keys.forEach(k => {
      const n = per[k];
      vals[k] = k === 's' ? S(sh).slice(0, n)
        : k === 'c' ? S([0, 1, 2, 3, 4]).slice(0, n)
        : k === 'r' ? (d => (a => [0, 1, 2, 3].map(j => (a + d * j) % 4))(R(4)))(P([1, 3]))
        : S([0, 1, 2]).slice(0, n);
    });
    return { keys, per, vals, fixed: { s: keys.includes('r') ? 'arrow' : P(PROPS.s.pool), c: R(5), z: 1, r: 0, p: 1 } };
  }
  const mk = (sp, i) => ({ ...sp.fixed, ...Object.fromEntries(sp.keys.map(k => [k, sp.vals[k][i % sp.per[k]]])) });
  const alter = (sp, t, k) => ({ ...t, [k]: P(sp.vals[k].filter(v => v !== t[k])) });
  function pickKeys() {
    const x = Math.random();
    let k = ['s', 'c', 'z', P(['r', 'p'])];
    if (x < .2) k = ['s', 'c', 'z', 'r', 'p'];       // 5 свойств
    else if (x >= .6) k.splice(R(3), 1);              // 3 свойства
    return k;                                         // иначе 4
  }

  // Уровни 2 и 3: «что на месте ?» — варианты А–Г показаны внутри vis
  function pickTask(lv) {
    const keys = lv === 2 ? ['s', 'c'] : pickKeys();
    const sp = spec(keys, lv === 2 ? P([[2, 3], [3, 2], [3, 4], [4, 3], [2, 4], [4, 2]]) : null);
    const N = lv === 2 ? 7 : 8, cor = mk(sp, N);
    const combos = keys.length === 2 ? [['s'], ['c'], keys] : S(keys).slice(0, 3).map(k => [k]);
    const cands = S([cor, ...combos.map(ks => ks.reduce((o, k) => alter(sp, o, k), cor))]);
    const seq = range(N).map(i => cell(mk(sp, i), '')).join('') + cell(null, '');
    return {
      q: lv === 2 ? 'Что стоит на месте <b>?</b> Форма и цвет меняются по разным циклам.' : 'Что стоит на месте <b>?</b> Каждое свойство меняется по своему циклу.',
      vis: row(seq) + cap('Варианты') + row(cands.map((c, i) => cell(c, LET[i])).join('')),
      ans: LET[cands.findIndex(c => sig(c) === sig(cor))],
      opts: LET.slice()
    };
  }

  // Уровни 1 и 4: «найди ошибку» — ответ «№ позиции → буква замены»
  function fixTask(items, groups, axis, e, cor, cands, trap, q) {
    const boxed = groups.length > 1 || axis;
    const cellsOf = g => g.map(i => cell(items[i], i + 1)).join('');
    const sep = axis ? '<span style="display:inline-block;width:3px;height:64px;vertical-align:middle;background:#2f5bea;opacity:.5;border-radius:2px;margin:0 4px"></span>' : '';
    const seq = groups.map(g => boxed && !axis ? `<span style="display:inline-block;border:1.5px dashed rgba(127,127,127,.5);border-radius:12px;padding:2px;margin:3px">${cellsOf(g)}</span>` : cellsOf(g)).join(sep);
    const cl = LET[cands.findIndex(c => sig(c) === sig(cor))];
    const wl = LET[cands.findIndex(c => sig(c) === sig(items[e]))];
    const mkO = (p, l) => `№${p + 1} → ${l}`;
    let trap2; do { trap2 = R(items.length); } while (trap2 === e || trap2 === trap);
    const list = [mkO(e, cl)];
    [[e, wl], [trap, cl], [trap2, wl], [trap, wl]].forEach(([p, l]) => { const o = mkO(p, l); if (!list.includes(o) && list.length < 4) list.push(o); });
    while (list.length < 4) { const o = mkO(R(items.length), P(LET.slice(0, cands.length))); if (!list.includes(o)) list.push(o); }
    return {
      q,
      vis: row(seq) + cap('Чем можно заменить') + row(cands.map((c, i) => cell(c, LET[i])).join('')),
      ans: mkO(e, cl),
      opts: S(list)
    };
  }

  function l1() {
    const pool = S(SYMS).slice(0, P([3, 4])), A = pool[0], B = pool[1];
    let items = [], groups = [], e, trap, axis = 0, q;
    if (Math.random() < .5) {            // нарастание: A, AB, ABB, ABBB (или B…BA)
      const left = Math.random() < .5;
      for (let j = 0; j < 4; j++) {
        const arr = left ? [A, ...Array(j).fill(B)] : [...Array(j).fill(B), A];
        groups.push(arr.map(x => (items.push(x), items.length - 1)));
      }
      e = R(items.length); trap = e > 0 ? e - 1 : e + 1;
      q = 'Ряд строится по правилу нарастания. Найди <b>ошибку</b>: укажи номер элемента и чем его заменить.';
    } else {                             // зеркало: ABCCBA
      const m = P([3, 4]); let h;
      do { h = Array.from({ length: m }, () => P(pool)); } while (new Set(h).size < 2);
      items = [...h, ...h.slice().reverse()];
      groups = [range(m), range(m).map(i => i + m)]; axis = 1;
      e = m + R(m); trap = 2 * m - 1 - e;
      q = 'Ряд зеркальный, <b>левая половина верна</b>. Найди ошибку справа: номер элемента и замена.';
    }
    const cor = items[e];
    items[e] = P(pool.filter(x => x !== cor));
    return fixTask(items.map(T), groups, axis, e, T(cor), S(pool.map(T)), trap, q);
  }

  function l4() {
    const keys = pickKeys(), sp = spec(keys), items = range(9).map(i => mk(sp, i)), wk = P(keys);
    // позиция ошибки: у неё должно быть ≥2 «напарника» по циклу, чтобы ошибка определялась однозначно
    const okp = range(9).filter(i => range(9).filter(j => j !== i && (j - i) % sp.per[wk] === 0).length >= 2);
    const e = P(okp), cor = items[e], wr = alter(sp, cor, wk);
    items[e] = wr;
    const ds = S(keys.filter(k => k !== wk)).slice(0, 2).map(k => alter(sp, cor, k));
    return fixTask(items, [range(9)], 0, e, cor, S([cor, wr, ...ds]), e > 0 ? e - 1 : e + 1,
      'В ряду одна фигура нарушает правила (у каждого свойства свой цикл). Найди <b>ошибку</b>: номер и замена.');
  }

  return { gen() { const id = getLvl().id; return id === 1 ? l1() : id === 2 ? pickTask(2) : id === 3 ? pickTask(3) : l4(); } };
})();

CATS.pattern = {
  name: 'Паттерны', desc: 'Найди закономерность и исправь ошибку',
  icon: '🔄', bg: '#eaf3de', fg: '#27500a',
  gen() { return PT.gen(); }
};
