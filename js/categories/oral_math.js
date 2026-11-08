/* ── ORAL MATH ── */
CATS.oral_math = {
  name: 'Устный счёт', desc: 'Реши цепочку действий в уме',
  icon: '🧮', bg: '#faeeda', fg: '#633806',
  gen() {
    const lvl = getLvl();   // lvl.id (1–4) и lvl.timerMul
    const rnd = (lo, hi) => lo + r(hi - lo + 1);   // целое от lo до hi включительно

    /* «Слагаемое» — кусок выражения, который считается раньше + и −.
       tokens — что показать на экране, v — чему он равен. */
    const num = (lo, hi) => { const a = rnd(lo, hi); return { tokens: [a], v: a }; };
    const mul = (aLo, aHi, bLo, bHi) => {
      const a = rnd(aLo, aHi), b = rnd(bLo, bHi);
      return { tokens: [a, '×', b], v: a * b };
    };
    // Деление без остатка: сначала выбираем делитель и результат,
    // а делимое получаем умножением (оно всегда двузначное).
    const div = (bLo, bHi) => {
      const b = rnd(bLo, bHi);
      const q = rnd(Math.ceil(10 / b), Math.floor(99 / b));
      return { tokens: [b * q, '÷', b], v: q };
    };

    /* Состав выражения по уровням */
    const makers = {
      1: () => [num(10, 99), num(10, 99), num(2, 9)],        // 47 + 28 - 6
      2: () => [mul(10, 40, 2, 4), num(10, 99)],             // 24 × 3 + 57
      3: () => [mul(10, 99, 2, 5), div(2, 9)],               // 64 × 3 - 12 ÷ 3
      4: () => [mul(10, 99, 3, 9), div(2, 9), mul(10, 30, 2, 5)],
    };

    // Повторяем, пока ответ не окажется неотрицательным
    let terms, signs, ans;
    do {
      terms = shu(makers[lvl.id]());
      signs = terms.slice(1).map(() => pick(['+', '-']));
      ans = terms[0].v;
      signs.forEach((s, i) => { ans += s === '+' ? terms[i + 1].v : -terms[i + 1].v; });
    } while (ans < 0);

    const chain = [...terms[0].tokens];
    signs.forEach((s, i) => chain.push(s, ...terms[i + 1].tokens));

    // Неверные варианты: добираем случайные, пока не наберётся 3 разных
    const wrong = new Set();
    while (wrong.size < 3) {
      const w = ans + r(11) - 5;                 // от ans-5 до ans+5
      if (w !== ans && w >= 0) wrong.add(String(w));
    }
    const opts = shu([String(ans), ...wrong]);

    const chainHTML = chain.map(x =>
      typeof x === 'string' && ['+','–','-','×','÷'].includes(x)
        ? `<span class="math-op">${x}</span>`
        : `<span class="math-num">${x}</span>`
    ).join('');

    /* Время на задачу в ИТОГОВЫХ секундах (для уровней, которых тут нет — стандартное).
       Движок умножает базовое время на timerMul уровня, поэтому делим на него. */
    const SECONDS = { 4: 45 };
    const timer = SECONDS[lvl.id] ? SECONDS[lvl.id] / lvl.timerMul : undefined;

    return {
      q: 'Реши цепочку действий в уме',
      vis: `<div class="math-chain">${chainHTML}<span class="math-op">=</span><span style="font-size:28px;color:var(--text3)">?</span></div>`,
      ans: String(ans), opts, timer
    };
  }
};
