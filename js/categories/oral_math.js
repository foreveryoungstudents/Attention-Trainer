/* ── ORAL MATH ── */
CATS.oral_math = {
  name: 'Устный счёт', desc: 'Реши цепочку действий в уме',
  icon: '🧮', bg: '#faeeda', fg: '#633806',
  gen() {
    const lvl = getLvl();
    let chain, ans;

    if (lvl.id === 1) {
      // 2 operations, small numbers, only + –
      const a = r(15) + 3, b = r(10) + 2, c = r(8) + 1;
      const op1 = pick(['+', '-']), op2 = pick(['+', '-']);
      const v1 = op1 === '+' ? a + b : a - b;
      ans = op2 === '+' ? v1 + c : v1 - c;
      chain = [a, op1, b, op2, c];
    } else if (lvl.id === 2) {
      // 2–3 operations with ×
      const a = r(10) + 2, b = r(5) + 2, c = r(10) + 1;
      const op2 = pick(['+', '-']);
      const v1 = a * b;
      ans = op2 === '+' ? v1 + c : v1 - c;
      chain = [a, '×', b, op2, c];
    } else if (lvl.id === 3) {
      // 3 operations, ×, ÷ possible
      const a = r(8) + 3, b = r(4) + 2, c = r(6) + 2, d = r(8) + 1;
      const ops = [pick(['+','-']), pick(['+','-'])];
      const v1 = a * b, v2 = ops[0] === '+' ? v1 + c : v1 - c;
      ans = ops[1] === '+' ? v2 + d : v2 - d;
      chain = [a, '×', b, ops[0], c, ops[1], d];
    } else {
      // Level 4: 3–4 ops, large numbers, two-step multiplications
      const a = r(10) + 5, b = r(5) + 3, c = r(7) + 2, d = r(6) + 2, e = r(10) + 3;
      const v1 = a * b, v2 = v1 - c * d;
      ans = v2 + e;
      chain = [a, '×', b, '–', c, '×', d, '+', e];
    }

    const wrong = [ans + r(5)+1, ans - r(5)-1, ans + r(10)+5].filter(x => x !== ans);
    const opts = shu([ans, ...wrong.slice(0,3)]).map(String);

    const chainHTML = chain.map(x =>
      typeof x === 'string' && ['+','–','-','×','÷'].includes(x)
        ? `<span class="math-op">${x}</span>`
        : `<span class="math-num">${x}</span>`
    ).join('');

    return {
      q: 'Реши цепочку действий в уме',
      vis: `<div class="math-chain">${chainHTML}<span class="math-op">=</span><span style="font-size:28px;color:var(--text3)">?</span></div>`,
      ans: String(ans), opts
    };
  }
};
