/* ═══════════════════════════════════════
   SNOWBALL — нарастающая цепочка слов
   Слова появляются по одному и исчезают. На «контрольных остановках»
   нужно нажать ВСЕ слова с самого начала в порядке появления.
   Одна ошибка — и цепочка заканчивается: показывается правильный вариант.
   Верно до конца — задача засчитана.
═══════════════════════════════════════ */

CATS.snowball = {
  name: 'Снежный ком', desc: 'Запоминай цепочку слов — она растёт',
  icon: '⛄', bg: '#e1f5ee', fg: '#085041',
  gen() { return { type: 'snowball' }; }
};

/* Настройки уровней:
   n     — сколько слов в полной цепочке
   every — проверка после каждого N-го слова (1 = после каждого слова, как в «чистом» снежном коме)
   ms    — сколько миллисекунд показывается каждое слово */
const SB_CFG = {
  1: { n: 10, every: 1, ms: 1800 },
  2: { n: 15, every: 2, ms: 1600 },
  3: { n: 20, every: 3, ms: 1400 },
  4: { n: 30, every: 5, ms: 1200 },
};
const SB_GAP = 250;   // пауза между словами, мс (чтобы одинаковые подряд не сливались)

const SB_WORDS = ('дом лес поле река озеро море гора остров берег мост дорога город деревня улица площадь парк сад огород двор забор ' +
  'ворота крыша окно дверь стена пол потолок лестница балкон комната кухня стол табурет диван кровать шкаф полка лампа зеркало ковёр ' +
  'часы ваза свеча подушка одеяло чашка тарелка ложка вилка нож кастрюля сковорода чайник ведро корзина коробка мешок сумка рюкзак ' +
  'чемодан зонт шапка шарф перчатки куртка платье рубашка ботинок носок ремень очки кольцо книга тетрадь карандаш ручка линейка ' +
  'ластик портфель письмо открытка картина карта ключ замок молоток пила топор лопата верёвка гвоздь колесо машина автобус поезд ' +
  'самолёт корабль лодка велосипед ракета яблоко груша банан лимон апельсин арбуз виноград вишня клубника морковь картошка капуста ' +
  'огурец помидор лук хлеб молоко сыр масло яйцо суп каша пирог конфета чай сок кот собака лошадь корова свинья овца курица утка ' +
  'заяц лиса волк медведь белка ёж мышь лягушка рыба птица бабочка пчела муравей паук ромашка роза тюльпан дерево дуб берёза ель ' +
  'трава гриб ягода камень песок снег дождь ветер облако солнце луна звезда радуга костёр огонь барабан гитара скрипка флейта мяч ' +
  'кубик кукла').split(' ');

/* Номера слов, после которых идёт проверка: every, 2·every, … и обязательно последнее */
function sbCheckpoints(n, every) {
  const cps = [];
  for (let k = every; k <= n; k += every) cps.push(k);
  if (cps[cps.length - 1] !== n) cps.push(n);
  return cps;
}

/* Задача ещё актуальна: не началась другая, окно не закрыто, ответ не засчитан */
function sbAlive(S) {
  return STATE.scratch === S && !STATE.answered &&
         document.getElementById('overlay').classList.contains('open');
}

const SB_BOX = 'text-align:center;background:var(--surface2);border-radius:12px;padding:2rem 1rem;min-height:110px;' +
               'display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:700;word-break:break-word;';

/* ─── Старт: инструкция ─── */
function renderSnowball() {
  const cfg = SB_CFG[getLvl().id];
  const all = shu([...SB_WORDS]);
  const S = STATE.scratch = {
    N: cfg.n, ms: cfg.ms,
    words: all.slice(0, cfg.n),          // цепочка
    spare: all.slice(cfg.n),             // запас слов для «лишних» вариантов (из цепочки не берутся)
    cps: sbCheckpoints(cfg.n, cfg.every),
    cpi: 0, shown: 0, held: 0, taps: [], pool: [],
  };
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Снежный ком</div>
    <div class="task-vis" style="line-height:1.7">
      Слова будут появляться <b>по одному</b>. Запоминай их по порядку.<br>
      Проверки после слов: <b>${S.cps.join(', ')}</b>.<br>
      На проверке нажимай <b>все слова с самого начала</b> в том же порядке.<br>
      <b>Одна ошибка — и цепочка заканчивается.</b><br>
      Всего в цепочке: <b>${S.N}</b>.
    </div>
    <div style="text-align:center"><button class="next-btn" id="sb-start">Начать</button></div>`;
  document.getElementById('sb-start').onclick = () => sbRun(S);
}

/* ─── Показ слов до ближайшей проверки ─── */
function sbRun(S) {
  const area = document.getElementById('task-area');
  const target = S.cps[S.cpi];
  const screen = (word, i) => `
    <div class="task-q">Запоминай</div>
    <div style="${SB_BOX}">${word}</div>
    <div style="font-size:14px;color:var(--text3);text-align:center;margin-top:10px">слово ${i + 1} из ${S.N} · проверка после слова №${target}</div>`;

  const step = () => {
    if (!sbAlive(S)) return;
    if (S.shown >= target) { sbAsk(S, target); return; }
    const i = S.shown;
    area.innerHTML = screen(S.words[i], i);
    setTimeout(() => {
      if (!sbAlive(S)) return;
      area.innerHTML = screen('', i);     // пустая пауза
      S.shown++;
      setTimeout(step, SB_GAP);
    }, S.ms);
  };
  step();
}

/* ─── Проверка: нажимать слова по порядку, первая ошибка заканчивает цепочку ─── */
function sbAsk(S, k) {
  const nDis = Math.min(5, 2 + Math.ceil(k / 8));                 // лишних слов в наборе
  S.taps = [];
  S.pool = shu([...S.words.slice(0, k), ...shu(S.spare).slice(0, nDis)]);

  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Повтори цепочку: нажимай слова в том порядке, как они появлялись</div>
    <div style="font-size:14px;color:var(--text3);text-align:center;margin-bottom:8px">Слов: <b id="sb-cnt">0</b> из ${k} · одна ошибка заканчивает цепочку</div>
    <div class="task-vis" id="sb-strip" style="min-height:56px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;line-height:1.2"></div>
    <div id="sb-pool" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:1rem 0"></div>`;

  const poolEl = document.getElementById('sb-pool');
  S.pool.forEach(w => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.style.padding = '8px 14px';
    b.textContent = w;
    b.onclick = () => sbTap(S, k, b, w);
    poolEl.appendChild(b);
  });
  sbRefresh(S);
}

function sbTap(S, k, b, w) {
  if (!sbAlive(S) || b.disabled) return;
  const pos = S.taps.length;
  S.taps.push(w);
  if (w !== S.words[pos]) { sbFinish(S, false, k, pos); return; }   // первая ошибка — конец
  b.disabled = true; b.style.opacity = '.35';
  sbRefresh(S);
  if (S.taps.length === k) sbPassed(S, k);
}

function sbRefresh(S) {
  const strip = document.getElementById('sb-strip');
  if (!strip) return;
  strip.innerHTML = S.taps.length
    ? S.taps.map((w, i) => `<span style="background:var(--blue-bg);border:1px solid var(--blue-bd);color:var(--blue);border-radius:8px;padding:4px 10px;font-size:15px;font-weight:600">${i + 1}. ${w}</span>`).join('')
    : '<span style="color:var(--text3);font-size:14px">пока пусто</span>';
  document.getElementById('sb-cnt').textContent = S.taps.length;
}

/* Проверка пройдена: либо конец, либо показ следующих слов */
function sbPassed(S, k) {
  S.held = k;
  if (k === S.N) { sbFinish(S, true, k, -1); return; }
  S.cpi++;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">✓ Верно! Цепочка из ${k} слов</div>
    <div class="task-vis">Продолжаем. Следующая проверка — после слова №${S.cps[S.cpi]}.</div>`;
  setTimeout(() => { if (sbAlive(S)) sbRun(S); }, 1300);
}

/* ─── Итог ─── */
function sbFinish(S, ok, k, bad) {
  STATE.answered = true;
  STATE.scTot++;
  if (ok) STATE.scOk++;
  const held = ok ? S.N : Math.max(S.held, bad);

  const chip = (txt, kind) => {
    const c = kind === 'ok' ? ['green-bg', 'green-bd', 'green'] : kind === 'no' ? ['red-bg', 'red-bd', 'red'] : ['surface2', 'border2', 'text2'];
    return `<span style="background:var(--${c[0]});border:1px solid var(--${c[1]});color:var(--${c[2]});border-radius:8px;padding:4px 10px;font-size:15px;font-weight:600">${txt}</span>`;
  };
  const wrap = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;line-height:1.2';
  const muted = 'font-size:14px;color:var(--text3);text-align:center;margin:6px 0;line-height:1.6';

  if (ok) {
    document.getElementById('task-area').innerHTML = `
      <div class="task-q">Вся цепочка из ${S.N} слов — без ошибок!</div>
      <div class="task-vis" style="${wrap}">${S.words.map((w, i) => chip(`${i + 1}. ${w}`, 'ok')).join('')}</div>`;
  } else {
    // правильная цепочка: до ошибки зелёным, место ошибки красным, остальное нейтрально
    const right = S.words.slice(0, k).map((w, i) => chip(`${i + 1}. ${w}`, i < bad ? 'ok' : i === bad ? 'no' : 'idle')).join('');
    document.getElementById('task-area').innerHTML = `
      <div class="task-q">Удержано слов подряд: ${held} из ${S.N}</div>
      <div style="${muted}">На месте №${bad + 1} ты нажал «<b>${S.taps[bad]}</b>», а нужно было «<b>${S.words[bad]}</b>».</div>
      <div style="${muted}">Правильная цепочка (${k} слов):</div>
      <div class="task-vis" style="${wrap}">${right}</div>`;
  }

  STATE.curTask.explain = ok
    ? `Цепочка из ${S.N} слов воспроизведена без ошибок.`
    : `Удержано слов подряд: ${held} из ${S.N}. Ошибка на месте №${bad + 1}.`;
  showFb(ok, ok ? '' : `слово №${bad + 1}: «${S.words[bad]}»`);
  updScore();
  document.getElementById('nxt-btn').style.display = 'block';
}
