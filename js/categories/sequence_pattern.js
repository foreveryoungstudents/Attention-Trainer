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

/* ── PATTERN ── */
CATS.pattern = {
  name: 'Паттерны', desc: 'Продолжи последовательность',
  icon: '🔄', bg: '#eaf3de', fg: '#27500a',
  gen() {
    const lvl = getLvl();
    const rules = [
      // easy: 3-cycle emoji
      () => { const e=['🔴','🔵','🟢'], s=[...e,...e,'?']; return {s,a:e[0],opts:shu([e[0],e[1],e[2],'🟡'])}; },
      // shapes 3-cycle
      () => { const e=['△','○','□'], s=[...e,...e.slice(0,2),'?']; return {s,a:'□',opts:shu(['□','△','○','◇'])}; },
      // arithmetic sequence
      () => { const st=r(3)+1,d=2,n=[]; for(let i=0;i<5;i++) n.push(st+d*i); n.push('?'); const a=st+d*5; return {s:n,a:String(a),opts:shu([a,a+2,a-2,a+4]).map(String)}; },
      // 4-cycle (lvl 2+)
      () => { const e=['🌕','🌖','🌗','🌘'], s=[...e,...e.slice(0,3),'?']; return {s,a:e[3],opts:shu([...e])}; },
      // double step (lvl 3+)
      () => { const st=r(5)+2,d=3,n=[]; for(let i=0;i<6;i++) n.push(st+d*i); n.push('?'); const a=st+d*6; return {s:n,a:String(a),opts:shu([a,a+3,a-3,a+6]).map(String)}; },
      // alternating emoji (lvl 3+)
      () => { const a='🔺',b='🔷',s=[a,b,a,b,a,b,'?']; return {s,a:a,opts:shu([a,b,'🔶','🔻'])}; },
      // skip counting (lvl 4)
      () => { const st=r(10)+10,d=r(5)+3,n=[]; for(let i=0;i<5;i++) n.push(st+d*i*2); n.push('?'); const a=st+d*10; return {s:n,a:String(a),opts:shu([a,a+d,a-d,a+d*2]).map(String)}; },
    ];
    const avail = lvl.id===1 ? rules.slice(0,3) : lvl.id===2 ? rules.slice(0,4) : lvl.id===3 ? rules.slice(0,6) : rules;
    const {s, a, opts} = pick(avail)();
    return {
      q: 'Что стоит на месте <b>?</b>',
      vis: `<span style="font-size:22px;font-weight:600">${s.join(' → ')}</span>`,
      ans: String(a), opts: opts.map(String)
    };
  }
};
