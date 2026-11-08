/* ── BONGARD ── */
const BG_T = ['c','s','t'];                       // круг, квадрат, треугольник
const BG_RED = '#d85a30', BG_BLUE = '#378add', BG_INK = 'currentColor';
const bgRnd = (a, b) => a + Math.random() * (b - a);
// радиус описанной окружности (квадрат: 0.88·r·√2 ≈ 1.25·r)
const bgExt = s => s.r * (s.t === 't' ? 1.1 : s.t === 's' ? 1.25 : 1);
const bgCorners = t => t === 'c' ? 0 : t === 's' ? 4 : 3;
const bgLc = t => t[0].toLowerCase() + t.slice(1);   // «Есть треугольник» → «есть треугольник»
const BG_M = 1.5;   // запас на толщину контура, чтобы фигура не касалась осевой линии
const bgHalfY = () => Math.random() < .5 ? bgRnd(16, 24) : bgRnd(40, 46);

/* случайная раскладка без наложений; фигуры не стоят на осевых линиях карточки */
function bgScatter(specs, axes) {
  const out = [];
  for (const sp of [...specs].sort((a, b) => b.r - a.r)) {
    const e = bgExt(sp);
    let ok = false;
    for (let k = 0; k < 80 && !ok; k++) {
      const x = bgRnd(e + 3, 61 - e), y = bgRnd(e + 3, 61 - e);
      const gap = axes ? e + BG_M : 5;    // с осями: фигура не должна задевать ни одну линию
      if (Math.abs(x - 32) < gap || Math.abs(y - 32) < gap) continue;
      if (out.every(o => Math.hypot(o.x - x, o.y - y) >= bgExt(o) + e + 3)) {
        out.push({...sp, x, y}); ok = true;
      }
    }
    if (!ok) return null;
  }
  return out;
}

/* одна случайная карточка; col — использовать ли цвета */
function bgCard(col, axes) {
  const pc = () => col ? (Math.random() < .5 ? BG_RED : BG_BLUE) : BG_INK;
  const T = () => BG_T[r(3)], F = () => Math.random() < .5;
  const q = axes ? 1 : Math.random();   // axes: пропускаем особые раскладки

  /* Размеры только из чётко различимых классов: маленький (4–6), средний (10), большой (15+).
     Промежуточных радиусов (7, 8, 9) нет, иначе «маленькая» фигура от «не маленькой» не отличается на глаз. */

  // ряд фигур слева направо с заданными радиусами; jit — разброс по вертикали
  const row = (rads, y, jit) => {
    const items = rads.map(rad => { const t = T(); return {t, r:rad, e:bgExt({t, r:rad})}; });
    const total = items.reduce((a, it) => a + 2 * it.e, 0) + 3 * (items.length - 1);
    let x = (64 - total) / 2;                                     // центрируем по ширине
    return items.map(it => {
      x += it.e;
      // с разбросом по вертикали держим фигуру целиком внутри карточки
      const yy = jit ? Math.min(64 - it.e - 2.5, Math.max(it.e + 2.5, y + bgRnd(-jit, jit))) : y;
      const o = {t:it.t, r:it.r, f:F(), c:pc(), x, y: yy};
      x += it.e + 3;
      return o;
    });
  };

  if (q < .12) {                                   // одна фигура внутри другой
    const c1 = pc();
    return {k:'nest', s:[
      {t:T(), r:22, f:false, c:c1, x:32, y:32},
      {t:T(), r:6,  f:F(),   c:col ? pc() : c1, x:32, y:32}]};
  }
  if (q < .26) {                                   // фигуры в одну линию
    const n = 3 + r(2), y = bgHalfY();
    const rads = n === 3 ? shu(Math.random() < .5 ? [6,6,10] : [6,6,6]) : [5,5,5,5];
    return {k:'line', s: row(rads, y, 0)};
  }
  if (q < .38) {                                   // три фигуры: размеры растут / убывают
    const rads = [4, 6, 10]; if (Math.random() < .5) rads.reverse();
    return {k:'asc', s: row(rads, bgHalfY(), 3)};
  }
  for (let tr = 0; tr < 30; tr++) {                // обычная случайная карточка
    const n = pick([1,1,2,2,2,3,3,3,4]);
    const rs = n <= 2 ? [6,10,15] : n === 3 ? [6,10] : [6,6,10];
    const placed = bgScatter(Array.from({length:n}, () => ({t:T(), r:pick(rs), f:F(), c:pc()})), axes);
    if (placed) return {k:'rnd', s:placed};
  }
  return {k:'rnd', s:[{t:'c', r:10, f:true, c:pc(), x:20, y:20}]};
}

/* axes — рисовать ли пунктирные осевые линии (для правил про «половины») */
function bgSvg(c, axes) {
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
  const grid = axes
    ? `<line x1="32" y1="0" x2="32" y2="64" stroke="rgba(128,128,128,.35)" stroke-width="1" stroke-dasharray="2 3"/>` +
      `<line x1="0" y1="32" x2="64" y2="32" stroke="rgba(128,128,128,.35)" stroke-width="1" stroke-dasharray="2 3"/>`
    : '';
  return `<svg viewBox="0 0 64 64" style="width:100%;height:auto;display:block;border:1px solid rgba(128,128,128,.3);border-radius:6px">${grid}${body}</svg>`;
}

/* «Подпись» карточки: какие фигуры в ней есть (вид, размер, заливка, цвет) без учёта положения.
   Нужна, чтобы карточка «?» не повторяла уже показанную: иначе ответ находится сравнением, а не анализом. */
const bgSig = c => c.s.map(s => s.t + s.r + (s.f ? 'f' : 'o') + s.c).sort().join('|');

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
  {n:'Все фигуры красные',           from:1, to:2, col:true, opp:'Есть синяя фигура', t:c => c.s.every(s => s.c === BG_RED)},
  {n:'Есть синяя фигура',            from:1, to:2, col:true, opp:'Все фигуры красные', t:c => c.s.some(s => s.c === BG_BLUE)},
  // — уровень 2–3: размер и положение —
  {n:'Все фигуры маленькие',         from:2, to:3, t:c => c.s.every(s => s.r <= 6)},
  {n:'Есть большая фигура',          from:2, to:4, t:c => c.s.some(s => s.r >= 15)},
  {n:'Все фигуры одного размера',    from:2, to:4, t:c => c.s.every(s => s.r === c.s[0].r)},
  {n:'Все фигуры одного вида',       from:2, to:4, t:c => c.s.every(s => s.t === c.s[0].t)},
  {n:'Все фигуры в верхней половине', from:2, to:3, ax:true, t:c => c.s.every(s => s.y + bgExt(s) + BG_M < 32)},
  {n:'Все фигуры в нижней половине',  from:2, to:3, ax:true, t:c => c.s.every(s => s.y - bgExt(s) - BG_M > 32)},
  {n:'Все фигуры в левой половине',   from:2, to:3, ax:true, t:c => c.s.every(s => s.x + bgExt(s) + BG_M < 32)},
  {n:'Все фигуры в правой половине',  from:2, to:3, ax:true, t:c => c.s.every(s => s.x - bgExt(s) - BG_M > 32)},
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
    c = bgCard(!!rule.col, !!rule.ax);
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
    const axes = !!rule.ax;
    const svg = c => bgSvg(c, axes);   // обёртка: map не должен передавать индекс вторым аргументом

    // в какой группе (А или Б) правило выполняется — случайно
    const gP = pick(['А','Б']), gN = gP === 'А' ? 'Б' : 'А';
    // «Ложный след»: другое правило, которое выполняется во ВСЕХ карточках «неподходящей» группы,
    // но не во всех карточках «подходящей» (как «в каждой карточке А есть треугольник»).
    // Такие наборы перегенерируем, чтобы не сбивать с толку.
    const falseLead = (P, N) => BG_RULES.some(x =>
      x !== rule && x.n !== rule.opp && (!x.col || rule.col) && N.every(c => x.t(c)) && !P.every(c => x.t(c)));   // opp — то же правило, но «наоборот»
    let P, N;
    for (let k = 0; k < 60; k++) {
      P = Array.from({length:6}, () => bgSample(rule, true));
      N = Array.from({length:6}, () => bgSample(rule, false));
      if (!falseLead(P, N)) break;
    }
    const [A, B] = gP === 'А' ? [P, N] : [N, P];

    const panel = (lab, cards) =>
      `<div style="flex:1 1 150px;min-width:0">
         <div style="font-weight:700;font-size:15px;margin-bottom:4px;text-align:center">${lab}</div>
         <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">${cards.map(svg).join('')}</div>
       </div>`;

    const classify = Math.random() < .35;
    let extra = '', q, ans, opts, explain;

    if (classify) {
      const isPos = Math.random() < .5;
      // карточка «?» — новая: такой же по составу фигур среди показанных нет
      const seen = new Set([...P, ...N].map(bgSig));
      let qc;
      for (let k = 0; k < 300; k++) {
        qc = bgSample(rule, isPos);
        if (!seen.has(bgSig(qc))) break;
      }
      extra = `<div style="width:84px;margin:12px auto 0;text-align:center">
                 <div style="font-weight:700;margin-bottom:3px">?</div>${svg(qc)}</div>`;
      q = 'К какой группе относится карточка <b>?</b>';
      ans = isPos ? gP : gN;
      opts = ['А','Б'];
      explain = `Правило: ${bgLc(rule.n)}. Оно выполняется в каждой карточке группы ${gP} и ни в одной карточке группы ${gN}. ` +
                `У карточки «?» оно ${isPos ? 'выполняется' : 'не выполняется'}, поэтому она из группы ${ans}.`;
    } else {
      // ложные варианты: не сложнее уровня+1, не выполняются хотя бы для одной карточки группы
      // (одна из ловушек — верна для чужой группы)
      const pool = shu(BG_RULES.filter(x =>
        x !== rule && x.from <= L + 1 && (!x.col || rule.col) && !P.every(c => x.t(c))));
      const trap = pool.find(x => N.every(c => x.t(c)));
      const dist = [trap, ...pool.filter(x => x !== trap)].filter(Boolean).slice(0, 3);
      q = `Что объединяет карточки группы <b>${gP}</b> (и не подходит группе <b>${gN}</b>)?`;
      ans = rule.n;
      opts = shu([rule.n, ...dist.map(x => x.n)]);
      explain = `Правило: ${bgLc(rule.n)}. Оно выполняется в каждой карточке группы ${gP} и ни в одной карточке группы ${gN}.`;
    }

    /* Время на задачу в итоговых секундах (движок умножает базовое на timerMul уровня,
       поэтому делим на него). Здесь надо рассмотреть 12 карточек, 35 секунд мало. */
    const SECONDS = { 1: 90, 2: 75, 3: 75, 4: 60 };
    const timer = SECONDS[L] / getLvl().timerMul;

    return {
      q,
      vis: `<div style="display:flex;flex-wrap:wrap;gap:12px">${panel('А', A)}${panel('Б', B)}</div>${extra}`,
      ans, opts, timer, explain
    };
  }
};
