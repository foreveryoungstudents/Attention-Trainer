/* ── SCHULTE 5x5 ── */
CATS.schulte5 = {
  name: 'Шульте 5×5', desc: 'Найди числа по порядку',
  icon: '⬜', bg: '#e1f5ee', fg: '#085041',
  gen() { return { type: 'schulte', size: 5, chaos: false }; }
};

/* ── SCHULTE 7x7 ── */
CATS.schulte7 = {
  name: 'Шульте 7×7', desc: 'Сложная версия — 49 чисел',
  icon: '🟩', bg: '#faeeda', fg: '#633806',
  gen() { return { type: 'schulte', size: 7, chaos: false }; }
};

/* ── SCHULTE CHAOS ── */
CATS.schulte_chaos = {
  name: 'Шульте Хаос', desc: 'Разные шрифты, цвета, ориентации',
  icon: '🌀', bg: '#eeedfe', fg: '#3c3489',
  gen() {
    const lvl = getLvl();
    const sizes = [4, 5, 5, 7];
    return { type: 'schulte', size: sizes[lvl.id - 1], chaos: true };
  }
};

/* ── Schulte renderer ── */
const CHAOS_STYLES = [
  { cls: 's-dark',   fonts: ["'Georgia',serif", "'Courier New',monospace", "'Arial Black',sans-serif"], sizes: ['13px','18px','22px','28px'], weight: '700' },
  { cls: '',         fonts: ["'Times New Roman',serif", "'Verdana',sans-serif", "'Trebuchet MS',sans-serif"], sizes: ['14px','18px','22px','26px'], weight: '600' },
  { cls: 's-blue',   fonts: ["'Impact',sans-serif", "'Palatino',serif", "system-ui"], sizes: ['13px','17px','21px','25px'], weight: '700' },
  { cls: 's-amber',  fonts: ["'Courier New',monospace", "'Comic Sans MS',cursive", "'Georgia',serif"], sizes: ['13px','17px','21px','24px'], weight: '600' },
  { cls: 's-green',  fonts: ["'Arial Black',sans-serif", "'Trebuchet MS',sans-serif", "'Times New Roman',serif"], sizes: ['14px','18px','22px','26px'], weight: '700' },
  { cls: 's-coral',  fonts: ["system-ui", "'Impact',sans-serif", "'Georgia',serif"], sizes: ['13px','16px','20px','25px'], weight: '600' },
  { cls: 's-purple', fonts: ["'Verdana',sans-serif", "'Courier New',monospace", "'Arial Black',sans-serif"], sizes: ['14px','18px','22px','27px'], weight: '700' },
];

const CHAOS_TRANSFORMS = [
  null, null, null,               // mostly normal
  'rotate(180deg)',               // upside-down
  'rotate(90deg)',                // rotated
  'rotate(-90deg)',
  'scaleX(-1)',                   // mirrored
  'rotate(180deg) scaleX(-1)',    // both
];

function renderSchulte() {
  const { size: sz, chaos } = STATE.curTask;
  const lvl = getLvl();
  const tot = sz * sz;
  const nums = shu([...Array(tot)].map((_, i) => i + 1));
  let next = 1, t0 = Date.now();
  const cw = Math.min(56, Math.floor(520 / sz) - 4);

  document.getElementById('task-area').innerHTML = `
    <div class="sc-info">Найди: <span class="sc-target" id="sc-next">1</span>
      <span style="font-size:14px;color:var(--text3)"> из ${tot}</span>
    </div>
    <div class="schulte-grid" id="sg"
      style="grid-template-columns:repeat(${sz},${cw}px);max-width:${sz*(cw+4)+10}px;"></div>
    <div class="sc-info" id="sc-time" style="margin-top:10px;font-size:14px"></div>`;

  const sg = document.getElementById('sg');
  nums.forEach(n => {
    const d = document.createElement('div');
    d.className = 'sc-cell' + (chaos ? ' chaos' : '');

    if (chaos) {
      const cs = pick(CHAOS_STYLES);
      if (cs.cls) d.classList.add(cs.cls);
      d.style.fontFamily = pick(cs.fonts);
      d.style.fontSize = pick(cs.sizes);
      d.style.fontWeight = cs.weight;
      if (r(4) === 0) d.style.fontStyle = 'italic';
      const tr = pick(CHAOS_TRANSFORMS);
      if (tr) d.style.transform = tr;
      // Level 4 chaos: extra opacity jitter
      if (lvl.id === 4 && r(3) === 0) d.style.opacity = (0.6 + Math.random() * 0.4).toFixed(2);
    } else {
      d.style.fontSize = Math.max(13, cw * 0.38) + 'px';
      d.style.fontWeight = '600';
    }
    d.style.height = cw + 'px';
    d.textContent = n;
    d.onclick = () => {
      if (n === next) {
        d.classList.add('hit'); d.onclick = null; next++;
        const el = document.getElementById('sc-next');
        if (el) el.textContent = next <= tot ? next : '✓';
        if (next > tot) {
          const t = ((Date.now() - t0) / 1000).toFixed(1);
          const el2 = document.getElementById('sc-time');
          if (el2) el2.textContent = `Готово за ${t} сек!`;
          STATE.scOk++; STATE.scTot++;
          STATE.answered = true;
          updScore();
          document.getElementById('nxt-btn').style.display = 'block';
        }
      } else {
        d.classList.add('mis');
        setTimeout(() => d.classList.remove('mis'), 400);
      }
    };
    sg.appendChild(d);
  });
}
