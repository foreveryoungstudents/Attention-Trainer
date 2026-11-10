/* ── BIHEM HAND (ритм, 30 смен) ── */
(function () {
  /* ── РИСОВАННЫЕ РУКИ (SVG) ──
     Базовый рисунок: ладонь к зрителю, пальцы вверх, большой палец справа — это ЛЕВАЯ рука.
     ПРАВАЯ рука — точное зеркальное отражение (большой палец слева). Чтобы поменять местами — см. строку «const mirror».
     Каждое положение — строка таблицы HAND_POSES; правьте её без знания SVG:
       name   — название (показывается в превью/подсказках)
       thumb  — большой палец: 'out' (в сторону под углом), 'horiz' (строго горизонтально), 'side' (почти прижат), 'up' (вверх, как 👍), 'in' (прижат к ладони), 'none'
       f      — [указательный, средний, безымянный, мизинец]: 1 — выпрямлен, 0 — согнут
       ang    — углы наклона пальцев в градусах [указ., сред., безым., мизинец]; + вправо, − влево
       rot    — поворот всей кисти в градусах (180 — «большой вниз»)
       ring — «здороваются»: номер пальца (0 указательный … 3 мизинец), который согнут и касается кончика большого;  pinch / cross — щепотка, скрещённые пальцы
       side — вид сбоку: кисть лежит горизонтально, пальцы смотрят вправо (f — какие пальцы вытянуты, thumb:'out' — большой вверх-вперёд, 'none' — не виден)
       thumbs — кулак сбоку с большим пальцем вверх (для «вниз» добавлен rot:180);  rc — центр поворота по вертикали
       fig (вместе с thumbs) — тот же кулак, но вместо поднятого пальца между указательным и средним виден кружок — кончик большого */
  const HAND_POSES = [
    { id:'fist',     name:'Кулак',                       thumb:'in',   f:[0,0,0,0] },
    { id:'palm',     name:'Ладонь, пальцы вместе',       thumb:'side', f:[1,1,1,1] },
    { id:'spread',   name:'Ладонь, пальцы врозь',        thumb:'out',  f:[1,1,1,1], ang:[14,4,-6,-18] },
    { id:'vulcan',   name:'Вулкан (2+2)',                thumb:'side', f:[1,1,1,1], ang:[6,3,-12,-24] },
    { id:'peace',    name:'Виктори (V)',                 thumb:'in',   f:[1,1,0,0], ang:[10,-8,0,0] },
    { id:'three',    name:'Три пальца',                  thumb:'in',   f:[1,1,1,0] },
    { id:'four',     name:'Четыре пальца',               thumb:'in',   f:[1,1,1,1] },
    { id:'point',    name:'Указательный вверх',          thumb:'in',   f:[1,0,0,0] },
    { id:'gun',      name:'Указательный + большой (Г)',  thumb:'horiz', f:[1,0,0,0] },
    { id:'horns',    name:'Коза',                        thumb:'in',   f:[1,0,0,1], ang:[8,0,0,-12] },
    { id:'love',     name:'Я тебя люблю',                thumb:'out',  f:[1,0,0,1], ang:[8,0,0,-12] },
    { id:'call',     name:'Позвони (большой + мизинец)', thumb:'horiz', f:[0,0,0,1] },
    { id:'sidegun',  name:'Пистолет (вид сбоку)',      side:true, thumb:'out', f:[1,1,0,0] },
    { id:'wolf',     name:'Волк (вид сбоку)',          side:true, thumb:'out', f:[0,0,1,1] },
    { id:'thumbup',  name:'Большой вверх',               thumbs:true,  f:[0,0,0,0] },
    { id:'fig',      name:'Фига (кулак сбоку)',          thumbs:true, fig:true, f:[0,0,0,0] },
    { id:'thumbdn',  name:'Большой вниз',                thumbs:true,  f:[0,0,0,0], rot:180, rc:74 },
    { id:'ok',       name:'Большой + указательный',  thumb:'none', f:[0,1,1,1], ring:0, ang:[0,4,-4,-12] },
    { id:'ok_mid',   name:'Большой + средний',       thumb:'none', f:[1,0,1,1], ring:1, ang:[8,0,-6,-14] },
    { id:'ok_ring',  name:'Большой + безымянный',    thumb:'none', f:[1,1,0,1], ring:2, ang:[10,4,0,-12] },
    { id:'ok_pinky', name:'Большой + мизинец',       thumb:'none', f:[1,1,1,0], ring:3, ang:[10,4,-4,0] },
    { id:'pinch',    name:'Щепотка',                     thumb:'none', f:[0,0,0,0], pinch:true },
    { id:'cross',    name:'Скрещённые пальцы',           thumb:'in',   f:[1,1,0,0], cross:true },
  ];

  function handSVG(poseId, side, css) {
    const P = HAND_POSES.find(p => p.id === poseId) || HAND_POSES[0];
    const SK = '#fcc934', SK2 = '#a8651a', OL = '#8a5214';
    const C = { f: '#fcc934', p: '#ffe39a', c: '#f0a824', t: '#f7bb30' };  // пальцы / ладонь / согнутые пальцы / большой
    const FX = [80, 62, 44, 27], FW = [16, 16, 16, 14], FL = [52, 58, 52, 40];
    const BY = 90;                       // линия основания пальцев
    const ang = P.ang || [0, 0, 0, 0];
    const rect = (cx, y1, y2, w, a, ox, oy) =>
      `<rect x="${cx - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="${w / 2}"` +
      (a ? ` transform="rotate(${a} ${ox ?? cx} ${oy ?? y2})"` : '') + '/>';

    const RING = P.ring ?? (P.ok ? 0 : -1);   // какой палец в кольце с большим (-1 — никакой)
    const back = [], front = [];       // back — за ладонью, front — поверх неё; элементы вида [svg, тип]
    // большой палец (за ладонью)
    const th = P.thumb;
    if (th === 'horiz') back.push([rect(88, 108 - 36, 108, 18, 90, 88, 108), 't']);   // строго горизонтально
    if (th === 'out')  back.push([rect(88, 112 - 46, 112, 18, 50, 88, 112), 't']);
    if (th === 'side') back.push([rect(88, 112 - 44, 112, 18, 20, 88, 112), 't']);
    if (th === 'up')   back.push([rect(84, 100 - 62, 100, 19, 4, 84, 100), 't']);
    // выпрямленные пальцы (за ладонью)
    const fingerShape = i => rect(FX[i], BY - FL[i], BY + 8, FW[i], ang[i], FX[i], BY + 4);
    const up = [0, 1, 2, 3].filter(i => P.f[i] && !P.cross && !P.pinch);
    up.forEach(i => back.push([fingerShape(i), 'f']));
    // ладонь
    const palm = `<rect x="16" y="78" width="76" height="54" rx="24"/>`;
    // согнутые пальцы (поверх ладони)
    [0, 1, 2, 3].forEach(i => {
      const curled = !P.f[i] && !(i === 0 && P.pinch) && i !== RING;
      if (curled) front.push([rect(FX[i], 80, 106, FW[i] - 1, ang[i], FX[i], 100), 'c']);
    });
    // большой палец, прижатый к ладони (поверх согнутых)
    if (th === 'in') front.push([rect(88, 116 - 52, 116, 17, -75, 88, 116), 't']);
    // особые положения
    if (RING >= 0) {
      // выбранный палец согнут вниз, большой палец идёт по ладони и касается его кончика (другие пальцы не перекрывает)
      const cx = FX[RING] + (RING === 0 ? 3 : 0), ty = 111;
      const bx = RING === 0 ? 113 : 92, by = RING === 0 ? 130 : 124;   // у указательного большой палец выходит сбоку от ладони
      front.push([rect(FX[RING], 76, 108, FW[RING] - 1, 0, FX[RING], 100), 'c']);
      const dx = cx - bx, dy = ty - by, L = Math.hypot(dx, dy), th = Math.atan2(dx, -dy) * 180 / Math.PI;
      front.push([rect(bx, by - L, by, 17, th, bx, by), 't']);
    }
    if (P.pinch) {
      front.push([rect(80, 92 - 44, 92, 15, -25, 80, 92), 'f']);
      front.push([rect(88, 114 - 64, 114, 17, -30, 88, 114), 't']);
    }
    if (P.cross) {
      // указательный и средний скрещены
      front.push([rect(FX[0], BY - FL[0], BY + 8, FW[0], -14, FX[0], BY + 4), 'f']);
      front.push([rect(FX[1], BY - FL[1], BY + 8, FW[1], 14, FX[1], BY + 4), 'f']);
    }

    let all = [...back, [palm, 'p'], ...front];
    if (P.thumbs) {
      // кулак сбоку: пальцы лежат горизонтальной стопкой, большой палец растёт сверху из середины кулака
      all = [
        ...(P.fig ? [] : [[rect(68, 18, 94, 24, 4, 68, 94), 't']]),
        [`<rect x="16" y="66" width="82" height="66" rx="24"/>`, 'p'],
        // у «фиги» внутренний край указательного приподнят, у основания пальцы по-прежнему вместе
        ...[72, 87, 102, 117].map((y, k) => [`<rect x="22" y="${y}" width="58" height="14" rx="7"${P.fig && k === 0 ? ' transform="rotate(-14 29 79)"' : ''}/>`, 'c']),
        // «фига»: кончик большого пальца — кружок в щели между указательным и средним, чуть заходит на их границы
        ...(P.fig ? [[`<circle cx="64" cy="81" r="10"/>`, 't']] : []),
      ];
    }
    if (P.side) {
      // кисть сбоку: пальцы лежат стопкой (сверху вниз: указательный, средний, безымянный, мизинец), смотрят вправо
      const SY = [54, 74, 93, 111], SH = [20, 20, 18, 16];     // верх и толщина «слотов» пальцев
      const EX = [108, 122, 112, 98];                          // докуда доходит вытянутый палец
      const CX = [78, 80, 76, 72];                             // докуда доходит согнутый палец
      const bk = [], fr = [];
      if (P.thumb === 'out') bk.push([`<rect x="26" y="40" width="54" height="19" rx="9.5" transform="rotate(-18 28 49)"/>`, 't']);
      [0, 1, 2, 3].forEach(i => {
        if (i === RING) {
          // палец и большой соединены — сбоку это кольцо в «слоте» этого пальца
          const cx = 76, cy = SY[i] + SH[i] / 2, R1 = 17, R2 = 6.5;
          fr.push([`<path fill-rule="evenodd" d="M${cx} ${cy - R1}a${R1} ${R1} 0 1 0 0.01 0zM${cx} ${cy - R2}a${R2} ${R2} 0 1 1 -0.01 0z"/>`, 'f']);
        }
        else if (P.f[i]) bk.push([`<rect x="40" y="${SY[i]}" width="${EX[i] - 40}" height="${SH[i]}" rx="${SH[i] / 2}"/>`, 'f']);
        else fr.push([`<rect x="46" y="${SY[i] + 2}" width="${CX[i] - 46}" height="${SH[i] - 2}" rx="${(SH[i] - 2) / 2}"/>`, 'c']);
      });
      all = [...bk, [`<rect x="4" y="50" width="62" height="76" rx="14"/>`, 'p'], ...fr];
    }
    const inner =
      // 1) общий тёмный контур всей кисти
      `<g fill="${OL}" stroke="${OL}" stroke-width="7" stroke-linejoin="round">${all.map(a => a[0]).join('')}</g>` +
      // 2) заливка: у каждой части свой оттенок и своя тёмная обводка, чтобы пальцы не сливались с ладонью
      all.map(a => `<g fill="${C[a[1]]}" stroke="${SK2}" stroke-width="2.4" stroke-linejoin="round">${a[0]}</g>`).join('');
    const rotated = P.rot ? `<g transform="rotate(${P.rot} 60 ${P.rc ?? 85})">${inner}</g>` : inner;
    const mirror = side === 'R';   // ← чтобы поменять левую и правую местами, замените 'R' на 'L'
    const body = mirror ? `<g transform="translate(120 0) scale(-1 1)">${rotated}</g>` : rotated;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 4 136 136" style="${css || ''}" role="img" aria-label="${P.name}, ${side === 'L' ? 'левая' : 'правая'} рука">${body}</svg>`;
  }
  const SIGNS = HAND_POSES.map(p => p.id);
  const COLORS = [
    { name: 'красный', hex: '#e24b4a' },
    { name: 'синий',   hex: '#185fa5' },
    { name: 'зелёный', hex: '#2e9e4f' },
    { name: 'жёлтый',  hex: '#e6a700' },
    { name: 'фиолетовый', hex: '#7a3fc4' },
  ];
  // Скороговорки: 23 фрагмента. Символ | разбивает фрагмент на доли (одна доля = одна секунда).
  // Если | нет — по одному слову на секунду.
  const TWISTERS = [
    'В четверг | четвёртого числа | в четыре с че́твертью часа | лигури́йский регулировщик | регулировал в Лигу́рии. |',
    'Но тридцать три корабля | лави́ровали, лави́ровали, | да так и не вы́лавировали.',
    'А потом протокол | про протокол | протоколом запротоколировал.',
    'Как интервьюе́ром | интервьюи́руемый | лигури́йский регулировщик | речисто, да не чисто | рапортова́л, да не дорапортова́л | дорапорто́вывал | да так зарапортова́лся | про размокропогодившуюся погоду | что, дабы инцидент не стал претендентом | на судебный прецедент',
    'лигурийский регулировщик акклиматизировался в неконституционном Константинополе, Где хохлатые хохотушки хохотом хохотали',
    'и кричали турке, который начерно обкурен трубкой: Не кури, турка, трубку, купи лучше кипу пик, лучше пик кипу купи.',
    'А то придет бомбарди́р из Бранденбу́рга — бо́мбами забомбардиру́ет за то, что некто черноры́лый у него полдвора рылом изрыл, вырыл и подрыл.',
    'Но | на самом | деле | турка | не был | в деле, | да и Клара-краля | в то время | кра́лась | к ларю́, | пока | Карл | у Клары | кораллы | крал, | за что | Клара | у Карла | украла | кларнет,',
    'а потом на дворе дёготниковой вдовы Варвары два этих во́ра дрова воровали;',
    'но грех | — не смех | — не уложить | в орех: | о Кларе | с Карлом | во мраке | все раки | шумели | в драке, | — вот | и не | до бомбарди́ра | вора́м | было, | и не | до дёготниковой | вдовы, | и не | до дёготниковых | детей.',
    'Зато рассердившаяся вдова убрала в сарай дрова: раз дрова, два дрова, три дрова — не вместились все дрова,',
    'и два дровосека, два дровоко́ла-дроворуба для расчувствовавшейся Варвары вы́дворили дрова вширь двора обратно на дровяной двор,',
    'где цапля чахла, цапля сохла, цапля сдохла. Цыпленок же цапли цепко цеплялся за цепь;',
    'молодец против овец, а против молодца сам овца,',
    'которой носит Сеня сено в сани, потом везет Сенька Соньку с Санькой на санках: санки скок, Сеньку в бок, Соньку в лоб — все в сугроб,',
    'а Сашка только шапкой шишки сшиб, затем по шоссе Саша пошёл, Саша на шоссе саше́ нашёл.',
    'Сонька же — Сашкина подружка шла по шоссе и сосала сушку, да притом у Соньки-вертушки во рту еще и три ватрушки — аккурат в медовик, но ей не до медовика —',
    'Сонька и с ватрушками во рту пономаря́ перепономари́т, перевы́пономарит: жужжит, как жужелица, жужжит, да кружится:',
    'была у Фрола́ — Фролу́ на Ла́вра наврала́, пойдет к Лавру на Фрола Лавру наврёт,',
    'что — ва́хмистр с ва́хмистршей, ро́тмистр с ро́тмистршей, что у ужа — ужата, а у ежа — ежата, а у него высокопоставленный гость унес трость,',
    'и вскоре опять пять ребят съели пять опят с полче́твертью четверика́ чечеви́цы без червоточины, и тысячу шестьсот шестьдесят шесть пирогов с творого́м из сыворотки из-под простокваши,',
    '— о всём о том около кола́ колокола звоном раззванивали, да так, что даже Константин — зальцбуржский бесперспективняк из-под бронетранспортера констатировал:',
    'Как все колокола не переколоколова́ть, не перевы́колоколовать, так и всех скороговорок не перескороговорить, не перевыскороговорить; но попытка — не пытка.',
  ];
  // Делит фрагмент на доли: по «|», а если их нет — по словам (одиночные тире пропускаем)
  const toBeats = t => t.includes('|')
    ? t.split('|').map(x => x.trim()).filter(Boolean)
    : t.split(/\s+/).filter(w => w && !/^[—–-]+$/.test(w));
  const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const TOTAL = 30;      // смен позиций за задание
  const STEP_MS = 2000;  // шаг = 1 с смена + 1 с задержка до следующей смены

  window.__bihem = window.__bihem || {};

  /* ── ЧЕРЕДОВАНИЕ РЕЖИМОВ ПО СЕССИЯМ ──
     Сессия = 5 карточек подряд (новый массив STATE.sessCats). Внутри одной сессии режим один и тот же,
     в следующей сессии — следующий по кругу (отдельный счётчик для каждого уровня).
       3 уровень: алфавит → скороговорки → счёт → алфавит …
       4 уровень: левая — положения, правая — числа  →  правая — положения, левая — числа → … */
  const MODES3 = ['alphabet', 'twister', 'count'];
  const rot = { ref: null, seen: {}, n: {} };
  function sessionRound(key) {
    if (rot.ref !== STATE.sessCats) { rot.ref = STATE.sessCats; rot.seen = {}; }
    if (!(key in rot.seen)) { rot.n[key] = (rot.n[key] ?? -1) + 1; rot.seen[key] = rot.n[key]; }
    return rot.seen[key];
  }

  // Строит шаги по готовой последовательности seq (30 пар [левая, правая], см. PATTERNS)
  // и добавляет то, что даёт уровень: хлопки (2) или речь (3). round — номер сессии для чередования режимов
  function buildSteps(lvlId, seq, round) {
    const steps = [];

    // Режим речи для 3 уровня
    let speech = null;
    if (lvlId === 3) {
      const mode = MODES3[round % MODES3.length];
      if (mode === 'twister') {
        const words = toBeats(pick(TWISTERS));          // один случайный фрагмент
        const w = i => words[i % words.length];         // короткое — повторяем по кругу
        speech = {
          title: 'Говори скороговорку: по слову на каждую смену',
          get: i => w(i),
          ctx: i => [1, 2, 3, 4].map(k => w(i + k)).join(' ')
        };
      } else if (mode === 'count') {
        // Счёт: на экране правило (прибавлять или отнимать) и текущее число на каждой смене рук.
        // Назад — старт подобран так, чтобы все 30 чисел остались положительными.
        const back = Math.random() < 0.5;
        const stp = back ? 2 + r(5) : 2 + r(6);                  // назад: шаг 2–6, вперёд: шаг 2–7
        const from = back ? stp * 29 + 5 + r(15) : 1 + r(20);    // назад: старт с запасом, вперёд: 1–20
        const vals = Array.from({ length: TOTAL }, (_, i) => back ? from - stp * i : from + stp * i);
        const rule = back ? `Счёт: отнимай по ${stp}, начиная с ${from}`
                          : `Счёт: прибавляй по ${stp}, начиная с ${from}`;
        speech = { title: rule, rule, get: i => String(vals[i]) };
      } else {
        speech = { title: 'Называй буквы по алфавиту', get: i => ALPHABET[i % ALPHABET.length] };
      }
    }

    for (let i = 0; i < TOTAL; i++) {
      const st = { type: 'pos', L: seq[i][0], R: seq[i][1], n: i + 1, say: '' };
      if (lvlId === 3) { st.say = speech.get(i); st.ctx = speech.ctx ? speech.ctx(i) : ''; st.rule = speech.rule || ''; }
      steps.push(st);

      // 2 уровень: хлопок отдельной секундой между сменами
      if (lvlId === 2 && i < TOTAL - 1) steps.push({ type: 'clap' });
    }
    return { steps, hint: speech ? speech.title : '' };
  }

  // 4 уровень. Одна рука показывает положение (каждый раз новое, без повторов подряд),
  // на второй — цветная цифра 0–5: показать столько пальцев и назвать вслух ЦВЕТ цифры.
  // Нечётные сессии — цифры на правой руке, чётные — на левой.
  function buildSteps4(round) {
    const numHand = round % 2 === 0 ? 'R' : 'L';
    const poseHand = numHand === 'R' ? 'L' : 'R';
    let deck = [], last = null, prevColor = -1;
    const nextPose = () => {
      if (!deck.length) {                                  // колода всех положений, перемешанная; на стыке без повтора
        deck = shu(SIGNS);
        if (deck[0] === last) deck.push(deck.shift());
      }
      return (last = deck.shift());
    };
    const steps = [];
    for (let i = 0; i < TOTAL; i++) {
      let c;
      do { c = r(COLORS.length); } while (c === prevColor);
      prevColor = c;
      const st = { type: 'pos', L: null, R: null, n: i + 1, say: '', numHand, num: r(6), color: COLORS[c].hex };
      st[poseHand] = nextPose();
      steps.push(st);
    }
    const who = numHand === 'R' ? { pose: 'Левая', num: 'правой' } : { pose: 'Правая', num: 'левой' };
    const rule = `${who.pose} рука повторяет положения на экране. На ${who.num} руке показывай пальцами число и вслух называй ЦВЕТ, которым оно написано.`;
    return { steps, rule };
  }


  function beep() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      window.__bihemAC = window.__bihemAC || new AC();
      const ac = window.__bihemAC, o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 660; g.gain.value = 0.06;
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.05);
    } catch (e) {}
  }

  // Размер фигурок: максимально крупно, подстраивается под ширину экрана
  const BIG = 'clamp(80px, 24vw, 150px)';          // для чисел и хлопка
  const HAND_W = 'clamp(90px, 26vw, 170px)';       // ширина нарисованной руки

  // Содержимое «сцены» для одного шага (используется и для предпросмотра до старта)
  function stepHTML(st, lvlId, preview) {
    if (st.type === 'clap') {
      // хлопок — обе руки сразу, поэтому только один символ
      return `<div style="text-align:center;font-size:${BIG};line-height:1.15">👏</div>
              <div style="text-align:center;min-height:64px;margin-top:8px;font-size:22px;font-weight:700;color:var(--text2)">ХЛОПОК!</div>`;
    }
    const lab = (t, c) => `<div style="font-size:12px;font-weight:700;letter-spacing:.06em;color:${c}">${t}</div>`;
    // колонка руки: рисунок положения либо цветная цифра (4 уровень)
    const col = (h, label, color) => {
      const body = (lvlId >= 4 && st.numHand === h)
        ? `<div style="display:flex;align-items:center;justify-content:center;height:${HAND_W};font-size:${BIG};line-height:1;font-weight:700;color:${st.color}">${st.num}</div>`
        : handSVG(st[h], h, `width:${HAND_W};max-width:100%;height:auto;display:block;margin:0 auto`);
      return `<div style="flex:1 1 0;min-width:0;text-align:center">${lab(label, color)}${body}</div>`;
    };
    const left = col('L', 'ЛЕВАЯ', '#185fa5'), right = col('R', 'ПРАВАЯ', '#d85a30');
    let info = '';
    if (lvlId >= 4) info = 'Покажи пальцами число и назови ЦВЕТ';
    else if (st.say) info = `<b style="font-size:26px">${st.say}</b>` +
      (st.ctx ? `<div style="font-size:14px;color:var(--text3);margin-top:4px">${st.ctx}</div>`
       : st.rule ? `<div style="font-size:14px;color:var(--text3);margin-top:4px">${st.rule}</div>` : '');
    else if (st.rule) info = `<b style="font-size:20px">${st.rule}</b>` +
      (preview ? '<div style="font-size:14px;color:var(--text3);margin-top:4px">Приготовься и нажми «Старт»</div>' : '');
    else if (preview) info = 'Приготовься и нажми «Старт»';
    return `<div style="display:flex;justify-content:center;gap:2vw;align-items:flex-start;max-width:100%;overflow:hidden">${left}${right}</div>
            <div style="text-align:center;min-height:64px;margin-top:8px;font-size:16px;color:var(--text2)">${info}</div>`;
  }

  // Остановка ритма. keepButton=true — показать кнопку «Старт» снова
  function stopRun(cfg, id, resetUI) {
    clearTimeout(cfg.timer); cfg.timer = null;
    clearInterval(cfg.watch); cfg.watch = null;
    cfg.running = false;
    if (resetUI) {
      const btn = document.getElementById(id + '-btn');
      if (btn) { btn.style.display = ''; btn.textContent = 'Старт'; }
    }
  }
  // окно/задание закрыто или скрыто?
  const isGone = id => {
    const el = document.getElementById(id);
    return !el || !el.isConnected || el.getClientRects().length === 0;
  };

  // Задание выполнено: засчитываем карточку и показываем «Далее»
  function finishTask(id) {
    const t = STATE.curTask;
    if (!t || t.rhythmId !== id || STATE.answered) return;
    STATE.answered = true;
    STATE.scTot++; STATE.scOk++;
    updScore();
    showFb(true, '');
    document.getElementById('fb').textContent = '✓ Выполнено!';
    document.getElementById('nxt-btn').style.display = 'block';
  }

  // Отрисовка карточки (вызывается из engine.js для type === 'bihem_rhythm'): без вариантов ответа
  window.renderBihemRhythm = function () {
    const t = STATE.curTask;
    document.getElementById('task-area').innerHTML =
      `<div class="task-q">${t.q}</div><div class="task-vis">${t.vis}</div>`;
  };

  // Запуск: вызывается кнопкой «Старт»
  window.bihemRun = function (id) {
    const cfg = window.__bihem[id];
    if (!cfg) return;
    // останавливаем любые другие запущенные ритмы
    Object.keys(window.__bihem).forEach(k => {
      if (k !== id && window.__bihem[k].running) stopRun(window.__bihem[k], k, false);
    });
    stopRun(cfg, id, false);
    const $ = s => document.getElementById(id + s);
    cfg.running = true;
    $('-btn').style.display = 'none';
    $('-bar').style.width = '0';
    let i = 0;
    const t0 = performance.now() + 1000; // 1 с на подготовку перед первой сменой

    // Сторож: если окно закрыли/скрыли или вкладка ушла в фон — ритм сразу останавливается
    cfg.watch = setInterval(() => {
      if (isGone(id) || document.hidden) {
        const gone = isGone(id);
        stopRun(cfg, id, !gone);
        if (!gone) {
          $('-stage').innerHTML = stepHTML(cfg.steps[0], cfg.lvlId, true);
          $('-cnt').textContent = '0 / ' + TOTAL;
          $('-bar').style.width = '0';
        }
      }
    }, 150);

    function tick() {
      if (!cfg.running) return;
      if (isGone(id)) { stopRun(cfg, id, false); return; }
      if (i >= cfg.steps.length) {
        stopRun(cfg, id, true);
        $('-btn').textContent = 'Ещё раз';
        const inf = $('-stage').lastElementChild;
        if (inf) inf.innerHTML = '<b>Готово ✔</b>';
        finishTask(id);
        return;
      }
      const st = cfg.steps[i];
      $('-stage').innerHTML = stepHTML(st, cfg.lvlId, false);
      if (st.type === 'pos') $('-cnt').textContent = st.n + ' / ' + TOTAL;
      $('-bar').style.width = ((i + 1) / cfg.steps.length * 100) + '%';
      beep();
      i++;
      // компенсируем дрейф таймера
      const next = t0 + i * STEP_MS - performance.now();
      cfg.timer = setTimeout(tick, Math.max(0, next));
    }
    cfg.timer = setTimeout(tick, 1000);
  };

  // Общая сборка карточки-ритма: правило, 30 шагов, первая позиция видна сразу
  function rhythmTask(q, steps, lvlId) {
    const id = 'bh' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    window.__bihem[id] = { steps, lvlId, timer: null, watch: null, running: false };
    return {
      q,
      vis: `<div id="${id}" style="max-width:100%;overflow-x:hidden">
        <div id="${id}-stage">${stepHTML(steps[0], lvlId, true)}</div>
        <div style="height:6px;background:rgba(128,128,128,.2);border-radius:3px;margin:8px 0">
          <div id="${id}-bar" style="height:100%;width:0;background:#7f77dd;border-radius:3px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span id="${id}-cnt" style="font-size:13px;color:var(--text3)">0 / ${TOTAL}</span>
          <button id="${id}-btn" onclick="bihemRun('${id}')" style="padding:8px 22px;font-size:15px;border-radius:10px;border:none;background:#7f77dd;color:#fff;cursor:pointer">Старт</button>
        </div>
      </div>`,
      type: 'bihem_rhythm', rhythmId: id,   // свой рендерер, без таймера и вариантов ответа
      ans: '', opts: []
    };
  }
  const MENU = { bg: '#eeedfe', fg: '#3c3489' };
  const HELLO = ['ok', 'ok_mid', 'ok_ring', 'ok_pinky'];   // большой + указательный … мизинец
  const seqOf = fn => Array.from({ length: TOTAL }, (_, i) => fn(i));   // 30 шагов из функции fn(i) → [левая, правая]

  /* ── СЦЕНАРИИ СМЕНЫ ПОЛОЖЕНИЙ ──
     Каждая карточка «Руки и ритм» берёт один сценарий случайно (w — вес: чем больше, тем чаще).
     Уровни 1–3 (счёт, хлопки, речь) работают поверх любого сценария; 4 уровень сценарии не использует.
     make() возвращает:
       seq      — 30 пар [левая, правая] (id положений из HAND_POSES)
       lead     — как описать смены в правиле задания
     Новый сценарий — ещё один объект в этом списке. */
  const PATTERNS = [
    // 1) Две случайные позиции, руки меняются ими зеркально
    { id: 'pair', w: 4, make() {
      const a = pick(SIGNS), b = pick(SIGNS.filter(s => s !== a));
      return { seq: seqOf(i => i % 2 === 0 ? [a, b] : [b, a]),
               lead: 'Меняй позиции зеркально.' };
    } },
    // 2) Волк и пистолет: руки меняются местами каждую смену
    { id: 'wolfgun', w: 1, make() {
      const A = Math.random() < 0.5 ? ['wolf', 'sidegun'] : ['sidegun', 'wolf'];
      const nm = { wolf: 'волк', sidegun: 'пистолет' };
      return { seq: seqOf(i => i % 2 === 0 ? A : [A[1], A[0]]),
               lead: `Левая рука — ${nm[A[0]]}, правая — ${nm[A[1]]}. Каждую смену руки меняются: волк ↔ пистолет.` };
    } },
    // 3) Большой палец вверх на одной руке и «фига» на другой; каждую смену меняются
    { id: 'thumbfig', w: 1, make() {
      const A = Math.random() < 0.5 ? ['thumbup', 'fig'] : ['fig', 'thumbup'];
      const nm = { thumbup: 'большой палец вверх', fig: 'фига' };
      return { seq: seqOf(i => i % 2 === 0 ? A : [A[1], A[0]]),
               lead: `Левая рука — ${nm[A[0]]}, правая — ${nm[A[1]]}. Каждую смену руки меняются.` };
    } },
    // 4) Пальцы здороваются синхронно: обе руки показывают одно и то же, по одному положению за смену
    { id: 'hello_sync', w: 1, make() {
      return { seq: seqOf(i => [HELLO[i % 4], HELLO[i % 4]]),
               lead: 'Обе руки вместе: большой палец здоровается по очереди с указательным, средним, безымянным и мизинцем, и снова с указательного. Правая и левая не меняются.' };
    } },
    // 5) Пальцы здороваются навстречу: одна рука от указательного, другая от мизинца, дальше — обратно без повтора крайних
    { id: 'hello_async', w: 1, make() {
      const leftFirst = Math.random() < 0.5;
      const path = [0, 1, 2, 3, 2, 1];                      // туда и обратно, крайние не повторяются
      const who = leftFirst ? ['Левая', 'правая'] : ['Правая', 'левая'];
      return { seq: seqOf(i => {
                 const a = HELLO[path[i % 6]], b = HELLO[3 - path[i % 6]];
                 return leftFirst ? [a, b] : [b, a];
               }),
               lead: `${who[0]} рука начинает с указательного, ${who[1]} — с мизинца. Дойдя до края, идите обратно (крайний палец не повторяется).` };
    } },
  ];
  // случайный сценарий с учётом весов
  const pickPattern = () => {
    let x = Math.random() * PATTERNS.reduce((sum, p) => sum + p.w, 0);
    for (const p of PATTERNS) { x -= p.w; if (x < 0) return p; }
    return PATTERNS[0];
  };

  CATS.bihem_hand = {
    name: 'Руки и ритм', desc: '30 смен под ритм: следи за руками',
    icon: '✋', ...MENU,
    gen() {
      const lvl = getLvl();
      const lvlId = Math.min(Math.max(lvl.id, 1), 4);
      const round = lvlId >= 3 ? sessionRound(lvlId) : 0;     // номер сессии — для чередования режимов
      if (lvlId === 4) {
        const { steps, rule } = buildSteps4(round);
        return rhythmTask(rule, steps, 4);
      }
      const pat = pickPattern().make();
      const { steps, hint } = buildSteps(lvlId, pat.seq, round);
      const rules = {
        1: 'Повторяй позиции рук вслух со счётом. ' + pat.lead,
        2: pat.lead + ' Между сменами — хлопок.',
        3: pat.lead + ' Одновременно говори: ' + (hint || ''),
      }[lvlId];
      return rhythmTask(rules, steps, lvlId);
    }
  };
})();

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
