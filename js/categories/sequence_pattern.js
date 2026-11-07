/* ── SEQUENCE ── */
CATS.sequence = {
  name: 'Числовые ряды', desc: 'Найди пропущенное число',
  icon: '🔢', bg: '#faece7', fg: '#712b13',
  gen() {
    const lvl = getLvl();
    const len = lvl.seqLen[0] + r(lvl.seqLen[1] - lvl.seqLen[0] + 1);
    const hi = lvl.numRange[1];

    const fns = [
      // arithmetic
      () => { const s=r(10)+1, d=r(hi/10)+2, pos=r(len-2)+2, n=[]; for(let i=0;i<len;i++) n.push(s+d*i); const a=n[pos]; n[pos]='?'; return {n,a}; },
      // geometric (small ratio)
      () => { const s=r(3)+2, rt=r(2)+2, pos=r(len-3)+1, n=[]; let v=s; for(let i=0;i<len;i++){n.push(v);v*=rt;} const a=n[pos]; n[pos]='?'; return {n,a}; },
      // descending
      () => { const s=r(hi/2)+hi/2, d=r(6)+2, pos=r(len-2)+1, n=[]; for(let i=0;i<len;i++) n.push(s-d*i); const a=n[pos]; n[pos]='?'; return {n,a}; },
      // fibonacci-like (lvl 3+)
      () => { const a0=r(4)+1, a1=r(4)+2, n=[a0,a1]; for(let i=2;i<len;i++) n.push(n[i-1]+n[i-2]); const pos=r(len-3)+2; const a=n[pos]; n[pos]='?'; return {n,a}; },
      // alternating step (lvl 4)
      () => { const s=r(10)+5, d1=r(5)+2, d2=r(3)+1, n=[]; let v=s; for(let i=0;i<len;i++){n.push(v);v+=(i%2===0?d1:d2);} const pos=r(len-3)+2; const a=n[pos]; n[pos]='?'; return {n,a}; },
    ];
    const avail = lvl.id <= 2 ? fns.slice(0,3) : lvl.id === 3 ? fns.slice(0,4) : fns;
    const {n, a} = pick(avail)();
    const wrong = [a+r(5)+1, a-r(5)-1, a*2].filter(x => x !== a && x > 0);
    return {
      q: 'Найди пропущенное число',
      vis: `<span style="font-size:22px;font-weight:600;letter-spacing:2px">${n.join(' — ')}</span>`,
      ans: String(a), opts: shu([a, ...wrong.slice(0,3)]).map(String)
    };
  }
};

/* ── BONGARD ── */
const BG_T = ['c','s','t'];                       // круг, квадрат, треугольник
const BG_RED = '#d85a30', BG_BLUE = '#378add', BG_INK = 'currentColor';
const bgRnd = (a, b) => a + Math.random() * (b - a);
const bgExt = s => s.r * (s.t === 't' ? 1.1 : 1); // радиус описанной окружности
const bgCorners = t => t === 'c' ? 0 : t === 's' ? 4 : 3;
const bgHalfY = () => Math.random() < .5 ? bgRnd(16, 24) : bgRnd(40, 46);

/* случайная раскладка без наложений; фигуры не стоят на осевых линиями карточки */
function bgScatter(specs) {
  const out = [];
  for (const sp of [...specs].sort((a, b) => b.r - a.r)) {
    const e = bgExt(sp);
    let ok = false;
    for (let k = 0; k < 80 && !ok; k++) {
      const x = bgRnd(e + 3, 61 - e), y = bgRnd(e + 3, 61 - e);
      if (Math.abs(x - 32) < 5 || Math.abs(y - 32) < 5) continue;
      if (out.every(o => Math.hypot(o.x - x, o.y - y) >= bgExt(o) + e + 3)) {
        out.push({...sp, x, y}); ok = true;
      }
    }
    if (!ok) return null;
  }
  return out;
}

/* одна случайная карточка; col — использовать ли цвета */
function bgCard(col) {
  const pc = () => col ? (Math.random() < .5 ? BG_RED : BG_BLUE) : BG_INK;
  const T = () => BG_T[r(3)], F = () => Math.random() < .5;
  const q = Math.random();

  if (q < .12) {                                   // одна фигура внутри другой
    const c1 = pc();
    return {k:'nest', s:[
      {t:T(), r:22, f:false, c:c1, x:32, y:32},
      {t:T(), r:8,  f:F(),   c:col ? pc() : c1, x:32, y:32}]};
  }
  if (q < .26) {                                   // фигуры в одну линию
    const n = 3 + r(2), y = bgHalfY();
    const xs = n === 3 ? [12,32,52] : [9,25,41,57], rs = n === 3 ? [6,9] : [6];
    return {k:'line', s: xs.map(x => ({t:T(), r:pick(rs), f:F(), c:pc(), x, y}))};
  }
  if (q < .38) {                                   // три фигуры: размеры растут / убывают
    const rs = [4.5, 7.5, 10.5]; if (Math.random() < .5) rs.reverse();
    const base = bgHalfY(); let x = 4; const s = [];
    rs.forEach(rad => {
      const t = T(), e = rad * (t === 't' ? 1.1 : 1);
      x += e;
      s.push({t, r:rad, f:F(), c:pc(), x, y: base + bgRnd(-3, 3)});
      x += e + 3;
    });
    return {k:'asc', s};
  }
  for (let tr = 0; tr < 30; tr++) {                // обычная случайная карточка
    const n = pick([1,1,2,2,2,3,3,3,4]);
    const rs = n <= 2 ? [6,10,15] : n === 3 ? [6,10] : [6,6,10];
    const placed = bgScatter(Array.from({length:n}, () => ({t:T(), r:pick(rs), f:F(), c:pc()})));
    if (placed) return {k:'rnd', s:placed};
  }
  return {k:'rnd', s:[{t:'c', r:10, f:true, c:pc(), x:20, y:20}]};
}

function bgSvg(c) {
  const body = c.s.map(s => {
    const a = `fill="${s.f ? s.c : 'none'}" stroke="${s.c}" stroke-width="2.4" stroke-linejoin="round"`;
    const x = s.x.toFixed(1), y = s.y.toFixed(1);
    if (s.t === 'c') return `<circle cx="${x}" cy="${y}" r="${s.r}" ${a}/>`;
    if (s.t === 's') {
      const h = s.r * .88;
      return `<rect x="${(s.x-h).toFixed(1)}" y="${(s.y-h).toFixed(1)}" width="${(2*h).toFixed(1)}" height="${(2*h).toFixed(1)}" ${a}/>`;
    }
    const R = s.r * 1.1, dx = R * .866, dy = R / 2;
    return `<polygon points="${x},${(s.y-R).toFixed(1)} ${(s.x+dx).toFixed(1)},${(s.y+dy).toFixed(1)} ${(s.x-dx).toFixed(1)},${(s.y+dy).toFixed(1)}" ${a}/>`;
  }).join('');
  return `<svg viewBox="0 0 64 64" style="width:100%;height:auto;display:block;border:1px solid rgba(128,128,128,.3);border-radius:6px">${body}</svg>`;
}

/* правила: t(card) → true, если правило выполняется */
const BG_RULES = [
  // — уровень 1–2: количество, заливка, вид, цвет —
  {n:'Ровно одна фигура',            from:1, to:2, t:c => c.s.length === 1},
  {n:'Ровно две фигуры',             from:1, to:2, t:c => c.s.length === 2},
  {n:'Три фигуры или больше',        from:1, to:3, t:c => c.s.length >= 3},
  {n:'Все фигуры закрашены',         from:1, to:3, t:c => c.s.every(s => s.f)},
  {n:'Все фигуры контурные',         from:1, to:3, t:c => c.s.every(s => !s.f)},
  {n:'Все фигуры — круги',           from:1, to:3, t:c => c.s.every(s => s.t === 'c')},
  {n:'Есть треугольник',             from:1, to:3, t:c => c.s.some(s => s.t === 't')},
  {n:'Нет ни одного круга',          from:2, to:4, t:c => c.s.every(s => s.t !== 'c')},
  {n:'Все фигуры красные',           from:1, to:2, col:true, t:c => c.s.every(s => s.c === BG_RED)},
  {n:'Есть синяя фигура',            from:1, to:2, col:true, t:c => c.s.some(s => s.c === BG_BLUE)},
  // — уровень 2–3: размер и положение —
  {n:'Все фигуры маленькие',         from:2, to:3, t:c => c.s.every(s => s.r <= 6)},
  {n:'Есть большая фигура',          from:2, to:4, t:c => c.s.some(s => s.r >= 15)},
  {n:'Все фигуры одного размера',    from:2, to:4, t:c => c.s.every(s => s.r === c.s[0].r)},
  {n:'Все фигуры одного вида',       from:2, to:4, t:c => c.s.every(s => s.t === c.s[0].t)},
  {n:'Все фигуры в верхней половине',from:2, to:3, t:c => c.s.every(s => s.y < 32)},
  {n:'Все фигуры в нижней половине', from:2, to:3, t:c => c.s.every(s => s.y > 32)},
  {n:'Все фигуры в левой половине',  from:2, to:3, t:c => c.s.every(s => s.x < 32)},
  {n:'Все фигуры в правой половине', from:2, to:3, t:c => c.s.every(s => s.x > 32)},
  // — уровень 3–4: отношения между фигурами —
  {n:'Одна фигура внутри другой',    from:3, to:4, t:c => c.k === 'nest'},
  {n:'Закрашенных больше, чем контурных', from:3, to:4,
    t:c => c.s.filter(s => s.f).length * 2 > c.s.length},
  {n:'Самая большая фигура — круг',  from:3, to:4, t:c => {
    const m = Math.max(...c.s.map(s => s.r)), b = c.s.filter(s => s.r === m);
    return b.length === 1 && b[0].t === 'c'; }},
  {n:'Все фигуры разного вида',      from:3, to:4,
    t:c => c.s.length >= 2 && new Set(c.s.map(s => s.t)).size === c.s.length},
  {n:'Фигуры стоят в одну линию',    from:3, to:4, t:c => {
    const ys = c.s.map(s => s.y); return c.s.length >= 3 && Math.max(...ys) - Math.min(...ys) < .5; }},
  {n:'Размеры растут слева направо', from:3, to:4, t:c => {
    if (c.s.length < 3) return false;
    const o = [...c.s].sort((a, b) => a.x - b.x);
    return o.every((s, i) => i === 0 || s.r > o[i-1].r); }},
  // — уровень 4: сложные правила —
  {n:'Закрашенных и контурных поровну', from:4, to:4,
    t:c => c.s.length % 2 === 0 && c.s.filter(s => s.f).length * 2 === c.s.length},
  {n:'Суммарно больше 6 углов',      from:4, to:4,
    t:c => c.s.reduce((a, s) => a + bgCorners(s.t), 0) > 6},
  {n:'Есть две одинаковые фигуры',   from:4, to:4,
    t:c => c.s.some((a, i) => c.s.some((b, j) => i < j && a.t === b.t && a.r === b.r && a.f === b.f))},
  {n:'Самая левая фигура — круг',    from:4, to:4, t:c => {
    if (c.s.length < 2) return false;
    const o = [...c.s].sort((a, b) => a.x - b.x);
    return o[1].x - o[0].x > 1 && o[0].t === 'c'; }},
];

/* карточка, для которой правило выполняется (want=true) или нет (want=false) */
function bgSample(rule, want) {
  let c;
  for (let i = 0; i < 500; i++) {
    c = bgCard(!!rule.col);
    if (rule.t(c) === want) return c;
  }
  return c;
}

CATS.bongard = {
  name: 'Тест Бонгарда', desc: 'Найди правило',
  icon: '🧩', bg: '#eeedfe', fg: '#3c3489',
  gen() {
    const L = getLvl().id;
    const rule = pick(BG_RULES.filter(x => L >= x.from && L <= x.to));

    // в какой группе (А или Б) правило выполняется — случайно
    const gP = pick(['А','Б']), gN = gP === 'А' ? 'Б' : 'А';
    const P = Array.from({length:6}, () => bgSample(rule, true));
    const N = Array.from({length:6}, () => bgSample(rule, false));
    const [A, B] = gP === 'А' ? [P, N] : [N, P];

    const panel = (lab, cards) =>
      `<div style="flex:1 1 150px;min-width:0">
         <div style="font-weight:700;font-size:15px;margin-bottom:4px;text-align:center">${lab}</div>
         <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">${cards.map(bgSvg).join('')}</div>
       </div>`;

    const classify = Math.random() < .35;
    let extra = '', q, ans, opts;

    if (classify) {
      const isPos = Math.random() < .5;
      extra = `<div style="width:84px;margin:12px auto 0;text-align:center">
                 <div style="font-weight:700;margin-bottom:3px">?</div>${bgSvg(bgSample(rule, isPos))}</div>`;
      q = 'К какой группе относится карточка <b>?</b>';
      ans = isPos ? gP : gN;
      opts = ['А','Б'];
    } else {
      // варианты: верное правило + ложные (одна из ловушек — верна для чужой группы)
      const pool = shu(BG_RULES.filter(x => x !== rule && (!x.col || rule.col) && !P.every(x.t)));
      const trap = pool.find(x => N.every(x.t));
      const dist = [trap, ...pool.filter(x => x !== trap)].filter(Boolean).slice(0, 3);
      q = `Что объединяет карточки группы <b>${gP}</b> (и не подходит группе <b>${gN}</b>)?`;
      ans = rule.n;
      opts = shu([rule.n, ...dist.map(x => x.n)]);
    }

    return {
      q,
      vis: `<div style="display:flex;flex-wrap:wrap;gap:12px">${panel('А', A)}${panel('Б', B)}</div>${extra}`,
      ans, opts
    };
  }
};
