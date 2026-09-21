/* ── BIHEM HAND ── */
CATS.bihem_hand = {
  name: 'Руки и знаки', desc: 'Определи знак каждой руки',
  icon: '✋', bg: '#eeedfe', fg: '#3c3489',
  gen() {
    const lvl = getLvl();
    const signs4 = ['✊','✋','✌️','👊'];
    const signs8 = [...signs4, '🤙','👌','🤞','🤘'];
    const pool = lvl.id >= 3 ? signs8 : signs4;
    const L = pick(pool), R = pick(pool);
    const qtypes = [
      { q: 'Какой знак показывает <b>левая</b> рука?', ans: L, wrong: [R, ...pool.filter(s=>s!==L&&s!==R).slice(0,2)] },
      { q: 'Какой знак показывает <b>правая</b> рука?', ans: R, wrong: [L, ...pool.filter(s=>s!==R&&s!==L).slice(0,2)] },
      { q: 'Одинаковые ли знаки?', ans: L===R?'Да':'Нет', opts:['Да','Нет','Похожи','Разные'], forceOpts:true },
    ];
    // level 3-4: also ask how many total fingers (approximate)
    if (lvl.id >= 3) {
      qtypes.push({
        q: 'Сколько рук показывают <b>раскрытую ладонь</b> (✋)?',
        ans: String([L,R].filter(s=>s==='✋').length),
        opts: ['0','1','2','3'], forceOpts: true
      });
    }
    const qt = pick(qtypes);
    const opts = qt.forceOpts ? qt.opts : shu([qt.ans, ...qt.wrong.slice(0,3)]);
    return {
      q: qt.q,
      vis: `<div style="display:flex;justify-content:center;gap:32px;align-items:center">
        <div style="text-align:center"><div style="font-size:64px">${L}</div><div style="font-size:13px;color:var(--text2);margin-top:6px">Левая</div></div>
        <div style="font-size:18px;color:var(--text3)">—</div>
        <div style="text-align:center"><div style="font-size:64px">${R}</div><div style="font-size:13px;color:var(--text2);margin-top:6px">Правая</div></div>
      </div>`,
      ans: qt.ans, opts
    };
  }
};

/* ── BIHEM MATCH ── */
CATS.bihem_match = {
  name: 'Соотнеси пары', desc: 'Свяжи слова из двух колонок',
  icon: '🔗', bg: '#e1f5ee', fg: '#085041',
  gen() { return { type: 'bihem_match' }; }
};

const BM_PAIRS_ALL = [
  { L:['кошка','дерево','море','небо'],    R:['синее','зелёное','пушистая','высокое'], map:{кошка:'пушистая',дерево:'высокое',море:'синее',небо:'синее'} },
  { L:['огонь','лёд','солнце','ночь'],     R:['холодный','горячий','яркое','тёмная'],  map:{огонь:'горячий',лёд:'холодный',солнце:'яркое',ночь:'тёмная'} },
  { L:['роза','слон','молния','пустыня'],  R:['быстрая','большой','жаркая','красивая'],map:{роза:'красивая',слон:'большой',молния:'быстрая',пустыня:'жаркая'} },
  { L:['снег','лес','птица','река'],       R:['поёт','белый','течёт','густой'],        map:{снег:'белый',лес:'густой',птица:'поёт',река:'течёт'} },
];

function renderBihemMatch() {
  const lvl = getLvl();
  const p = pick(BM_PAIRS_ALL);
  const n = lvl.id <= 2 ? 3 : 4;
  const LW = shu(p.L).slice(0, n), RW = shu(LW.map(w => p.map[w]));
  STATE.scratch = { p, LW, RW, selL: null, selR: null, found: 0, total: n };

  document.getElementById('task-area').innerHTML = `
    <div class="task-q" style="font-size:16px">Соедини слово с подходящим описанием</div>
    <div class="bihem-wrap">
      <div class="bihem-col"><div class="bihem-hdr">Слова</div>${LW.map(w=>`<div class="bihem-cell" id="L_${w}" onclick="bmClick('L','${w}')">${w}</div>`).join('')}</div>
      <div class="bihem-col"><div class="bihem-hdr">Описания</div>${RW.map(w=>`<div class="bihem-cell" id="R_${w}" onclick="bmClick('R','${w}')">${w}</div>`).join('')}</div>
    </div>
    <div class="sc-info" id="bm-prog" style="margin-top:10px;font-size:14px">Совпадений: 0 из ${n}</div>`;
}

function bmClick(side, word) {
  const sc = STATE.scratch;
  if (!sc || STATE.answered) return;
  const el = document.getElementById(side + '_' + word);
  if (!el || el.classList.contains('ok')) return;
  if (side === 'L') {
    if (sc.selL) { const old = document.getElementById('L_' + sc.selL); if (old) old.classList.remove('sel'); }
    sc.selL = word; el.classList.add('sel');
  } else {
    if (sc.selR) { const old = document.getElementById('R_' + sc.selR); if (old) old.classList.remove('sel'); }
    sc.selR = word; el.classList.add('sel');
  }
  if (sc.selL && sc.selR) {
    const lw = sc.selL, rw = sc.selR;
    const ok = sc.p.map[lw] === rw;
    const le = document.getElementById('L_' + lw), re = document.getElementById('R_' + rw);
    if (ok) {
      le.classList.remove('sel'); re.classList.remove('sel');
      le.classList.add('ok'); re.classList.add('ok');
      le.onclick = null; re.onclick = null;
      sc.found++;
      document.getElementById('bm-prog').textContent = `Совпадений: ${sc.found} из ${sc.total}`;
      if (sc.found >= sc.total) {
        STATE.answered = true; STATE.scOk++; STATE.scTot++;
        updScore(); showFb(true, '');
        document.getElementById('nxt-btn').style.display = 'block';
      }
    } else {
      le.classList.remove('sel'); re.classList.remove('sel');
      le.classList.add('no'); re.classList.add('no');
      setTimeout(() => { le.classList.remove('no'); re.classList.remove('no'); }, 500);
    }
    sc.selL = null; sc.selR = null;
  }
}

/* ── BIHEM SEQ ── */
CATS.bihem_seq = {
  name: 'Двойная задача', desc: 'Следи за двумя рядами одновременно',
  icon: '⚡', bg: '#faeeda', fg: '#633806',
  gen() {
    const lvl = getLvl();
    const colors = ['🔴','🔵','🟢','🟡','🟣'];
    const shapes = ['■','▲','●','◆','★'];
    const nc = 3 + r(lvl.id), ns = 3 + r(lvl.id);
    const cseq = [...Array(nc)].map(() => pick(colors));
    const sseq = [...Array(ns)].map(() => pick(shapes));
    const cq = r(2) === 0;
    const tgt_seq = cq ? cseq : sseq, tgt = pick(tgt_seq);
    const cnt = tgt_seq.filter(x => x === tgt).length;
    // Level 3+: ask about BOTH rows
    const bothRows = lvl.id >= 3 && r(2) === 0;
    const tgt2 = bothRows ? pick(cq ? sseq : cseq) : null;
    const cnt2 = tgt2 ? (cq ? sseq : cseq).filter(x => x === tgt2).length : null;
    const opts = shu([...new Set([cnt, cnt+1, Math.max(0,cnt-1), cnt+2])].slice(0,4));
    return {
      q: bothRows
        ? `Сколько <b>${tgt}</b> ${cq?'в цветах':'в фигурах'}? (и запомни кол-во <b>${tgt2}</b>)`
        : `Сколько раз встречается <b style="font-size:22px">${tgt}</b> ${cq?'в ряду цветов':'в ряду фигур'}?`,
      vis: `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Цвета</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:28px">${cseq.join('')}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Фигуры</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:28px">${sseq.join('')}</div>
        </div>`,
      ans: String(cnt), opts: opts.map(String)
    };
  }
};
