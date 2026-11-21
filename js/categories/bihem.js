/* ── BIHEM HAND (ритм) ── */
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

  function handSVG(poseId, side) {
    const P = HAND_POSES.find(p => p.id === poseId) || HAND_POSES[0];
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
        ...(P.fig ? [] : [[rect(72, 18, 94, 24, 4, 72, 94), 't']]),
        [`<rect x="16" y="66" width="88" height="66" rx="24"/>`, 'p'],
        // «фига»: кончик большого пальца — кружок между указательным и средним (лежит ПОД пальцами, виден в щели)
        ...(P.fig ? [[`<circle cx="76" cy="81" r="7.5"/>`, 't']] : []),
        // у «фиги» внутренний край указательного приподнят, у основания пальцы по-прежнему вместе
        ...[72, 87, 102, 117].map((y, k) => [`<rect x="22" y="${y}" width="70" height="14" rx="7"${P.fig && k === 0 ? ' transform="rotate(-14 29 79)"' : ''}/>`, 'c']),
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
      // 1) общий тёмный контур всей кисти (цвета — в css/style.css, классы .hp-*)
      `<g class="hp-ol">${all.map(a => a[0]).join('')}</g>` +
      // 2) заливка: у каждой части свой оттенок и своя тёмная обводка, чтобы пальцы не сливались с ладонью
      all.map(a => `<g class="hp-${a[1]}">${a[0]}</g>`).join('');
    const rotated = P.rot ? `<g transform="rotate(${P.rot} 60 ${P.rc ?? 85})">${inner}</g>` : inner;
    const mirror = side === 'R';   // ← чтобы поменять левую и правую местами, замените 'R' на 'L'
    const body = mirror ? `<g transform="translate(120 0) scale(-1 1)">${rotated}</g>` : rotated;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 4 136 136" class="bh-hand" role="img" aria-label="${P.name}, ${side === 'L' ? 'левая' : 'правая'} рука">${body}</svg>`;
  }
  const SIGNS = HAND_POSES.map(p => p.id);
  const COLORS = [
    { name: 'красный', hex: '#e24b4a' },
    { name: 'синий',   hex: '#185fa5' },
    { name: 'зелёный', hex: '#2e9e4f' },
    { name: 'жёлтый',  hex: '#e6a700' },
    { name: 'фиолетовый', hex: '#7a3fc4' },
  ];

  // Скороговорки. Символ | разбивает текст на фрагменты (один фрагмент = одна смена рук).
  // Под руками скороговорка выводится целиком, по строкам и строфам, текущий фрагмент подсвечивается.
  // Если | нет — по одному слову на смену.
  const TWISTERS = [
  'Зачерпнула цапля чашкой | чай целебный из ромашки. | Целый чан | у цапли чая. | Цапля — врач | больных встречает.', // 24
  'Чукча с цыганом | чипсы считали.', // 25
  'Череповчане | те же англичане, | только наречие | на «ц».', // 26
  
  'Цыплёнок с курицей | пьёт чай | на улице.', // 27
  'Сачок зацепился | за сучок.', // 28
  'Як якчонка поучает | и нотации читает: | "Делай так, | как як вещает" | — строго-настрого стращает: | "Станет явью | мечта ячея — | Стать бы яком | настоящим".', // 29
  
  'В ночи | не кирпичи | лопочут на печи, | лопочут на печи | в опаре калачи.', // 30
  'Чёрной ночью | чёрный кот | прыгнул | в чёрный дымоход.', // 31
  'Четыре черненьких | чумазеньких чертёнка | чертили чёрными чернилами | чертёж.', // 32
  'Наша дочь | речистая. | У неё | речь чистая.', // 33
  'Течёт речка. | Печёт печка.', // 34     
  'Были галчата | в гостях у волчат. | Были волчата | в гостях у галчат. | Нынче волчата галдят | как галчата, | и как волчата | галчата молчат.', // 35
  
  'Добыл бобов бобыль, | забыл бобыль костыль, | а баба бобыля | добыла киселя.', // 36
  'Белый снег, | белый мел. | Белый сахар | тоже бел. | А вот белка | не бела. | Белой даже | не была.', // 37
  'Дубовый столб | стоит столбом. | В него баран | уперся лбом. | Хотя не жаль | барану лба, | но лбом | не сбить ему столба.', // 38
  'Бык тупогуб, | тупогубенький бычок. | У быка | бела губа | была тупа.', // 39
  'Бублик сахарный | в блюдце плюхнулся.', // 40
  'Все бобры | для своих бобрят | добры.', // 41
  'Банкир бросал банкноты | из блокнота. | Банкрот бурча | бранил | банкира мота.', // 42
  'Брит Клим брат, | брит Игнат брат, | а брат Панкрат | бородат.', // 43
  'У боярина-бобра | нет богатства, | нет добра. | Два бобрёнка | у бобра — | лучше всякого добра.', // 44
  
  'А в лесу | у лисы на носу оса, | а в песках на спине | у осла — полоса. | От укуса осы | у лисы — две слезы, | от седла — полоса | на спине у осла.', // 45
  
  'Съел Валерик вареник, | а Валюшка — ватрушку.', // 46
  'Стоит воз овса, | а возле воза | — овца.', // 47
  'Варвара варенье доваривала, | доваривала, да, приговаривала: | "Варись, | ты моё вареньице, | всем внукам | на угощеньице".', // 48
  'Расчувствовавшаяся Варвара | расчувствовала | черствого барана.', // 49
  
  'Громкоголосые гавайцы | громко готовили | гарнир.', // 50
  'Бабе-Яге | магия | не помогает.', // 51
  'Гво́здики в заборе, | а гвозди́ки в вазоне.', // 52
  'На неё глазели | глаза газели.', // 53
  
  'Змей Горыныч | взгромоздясь | сел на гору | весь дымясь.', // 54
  'Грозди рябины | на солнце горят. | Рябит от рябины | в глазах у ребят.', // 55
  'Собирала Маргарита | маргаритки на горе, | потеряла Маргарита | маргаритки во дворе.', // 56
  'Сапог не в пору Прасковье | до поры. | До города — в гору, | от города — с горы. | С горы — не в гору, | в гору — не с горы. | Мы новые Прасковье | купили сапоги.', // 57
  
  'Из кузова в кузов | шла перегрузка арбузов. | В грозу, | в грязи, | от груза арбузов | развалился кузов.', // 58
  'Тащил Авдей | мешок гвоздей. | Тащил Гордей | мешок груздей. | Авдей Гордею | дал гвоздей, | Гордей Авдею | дал груздей.', // 59
  'Пал град | на пять гряд.', // 60
  'Грач сгоряча | осерчал | на грача.', // 61
   
  'Дятел лечит | древний дуб. | Добрый дятел | дубу люб.', // 62
  'А мне | не до недомогания.', // 63
  'Догу Гогу | не догнать. | Долго Гогу | догу гнать.', // 64
  'Дед Данил | дедил дыню. | Дольку Диме, | дольку Дине.', // 65
  'Не видно — | ликвидны ли акции | или неликвидны.', // 66
  'Без дна ли | бездна?', // 67
  'Дорогие диадемы | дарят дамам | в дни рожденья.', // 68
  
  'Несдержанность сдержим | внутренним стержнем.', // 69
  'Ужа ужалила ужица. | Ужу с ужицей | не ужиться. | Уж от ужаса | стал уже. | Ужа ужица | съест на ужин.', // 70
  'Жук жужжит | над абажуром.', // 71
  'Жужжит над жимолостью жук. | Тяжёлый на жуке кожух. | Я жук, | давно я тут живу. | Жужжу, кружу, | с ежом дружу.', // 72
  'У ежа в гостях ужата, | у ужа в гостях ежата. | Учит бегать | ёж ежат. | Учит ползать | уж ежат.', // 73
  'Цветные одежды | дарили надежду, | цвели на Надежде | цветные одежды.', // 74
  'Все клёны | стали рыжие, | и ни один | не дразнится: | раз всё равно | все рыжие, | кому какая | разница.', // 75
  'Женя с Жанной | подружилась. | Дружба с Жанной | не сложилась. | Чтобы жить | с друзьями дружно, | обижать друзей | не нужно.', // 76
  'Дирижёр | пейзажем поражён.', // 77
  
  'У Зины-Зинули | болит задний зуб. | Поэтому Зина | не может есть суп.', // 78
  'Встретиться змей и змея захотели. | Встретиться змей и змея не сумели. | Змей — в облака, | а змея — на земле. | Надо бы змею | спуститься к змее.', // 79
  'Зелёная берёза | стоит в лесу, | Зоя под берёзой | поймала стрекозу.', // 80
  'Зимним утром | от мороза | на заре | звенят берёзы.', // 81
  'Верзила-динозавр | дерзил зря.', // 82
  'Зарядка требуется | для тренировки | и разрядки.', // 83
  'Лизкина киска | лизнула Лизку.', // 84
  'Зимой поле белое, | промёрзло-заледенелое.', // 85
  'Зиновий, | познакомь-ка знакомого | с незнакомкой.', // 88 
  
  'Майе на ярмарке | в мае купили | маленькую майку | с каймой.', // 86
  'Села мышка | в уголок, | съела бублика | кусок.', // 87
  'Из соседнего колодца | целый день | водица льётся.', // 89
  'Палку толкал | лапкой Полкан, | потом Полкан | из Байкала лакал.', // 90
  'Свёкла у Фёклы | мокла и сохла. | Сохла и мокла, | пока не поблёкла.', // 91
    
  'Рите — открытка с Кипра, | а Виктору — открытка с Крита. | От Риты — открытка с Крита, | от Виктора — открытка с Кипра.', // 92
  'Сорок сорок | в короткий срок | съели сырок.', // 93
  'Утром присев | на зелёном пригорке, | учат сороки | скороговорки.', // 94
  
  'Оксана таксе | по таксофону | такси заказала. | Сев в такси, | спросила такса: | "А у вас | какая такса?". | Ей таксист ответил так: | "Возим такс | мы просто так-с".', // 95
  'Если с таксой драться, | такса станет кусаться. | Если к таксе с лаской, | станет такса сказкой.', // 96
  
  'Микромир комара Макара | микроскопический, | а макромир комара Макара | макроскопический.', // 97
  'Кровельщик Кирилл | криво крышу крыл. | Перекрыть крышу | пригласили Гришу.', // 98
  'Крошка-Картошка | нравится кошке, | лежит на окошке — | стынет немножко.', // 99
  
  'Мы ели, ели ершей у ели. | Их еле-еле | у ели доели.', // 100
  'На мели | мы налима | лениво ловили. | Меняли налима | вы мне на линя. | О любви | не меня ли | вы мило молили, | и в туманы лимана | манили меня?', // 101

  'Мыла Мила мишку мылом. | Мила мыло уронила. | Уронила Мила мыло, | Мишку Мила не домыла.', // 103
  'Вымыли мышки | миску для мишки.', // 104
  'Лилипут на плоту | ловил плотву.', // 105
    
  'Переплелась и перепуталась | петля полёта | птеродактиля.', // 106
  'Про пёстрых птиц | поёт петух, | про перья пышные, | про пух.', // 107
  'Проверяли, проверяли, | да, недо проверили. | Перепроверять пробовали, | да недо перепроверили.', // 108
  'Речистый парень | не плечист, | плечистый парень | не речист.', // 109
  
  'Изобретательный изобретатель | изобрёл | хитрое приспособление.', // 110
  'Природа рада | приросту растительности.', // 111
  'У пруда в траве | во мраке | шуршат раки | в шумной драке.', // 112
  'Стаффордширский терьер ретив, | а черношерстный ризеншнауцер | резв.', // 113
  'К Габсбургам | из Страсбурга.', // 114
  'Рекламный ролик | разрекламировал картриджи.', // 115
  'Антиквары отдают | приоритет раритету.', // 116
  
  'Аудитория | рьяно аплодировала | оратору.', // 117
  'Баркас приехал | в порт Мадрас. | Матрос принёс | на борт матрас. | В порту Мадрас | матрас матроса | порвали в драке | альбатросы.', // 118
  'В Кабардино-Балкарии | Валокордин | из Болгарии.', // 119
  'Ворон Карлсону | оторвал карман. | Карлсон завёл моторчик | и пропал.', // 120
  'Марина грибы | мариновала. | Марина малину перебирала. | Марина малину ела, | малину ела | и млела. | Корзину малины | умяла. | Марине корзины | мало. | Звала по малину | Марина Галину. | Галина Марину | звала по калину.', // 102
  'Король "орёл" | пароль завёл.', // 121
  'На корме, кроме Ромы, | Егор и Артём. | На корме, кроме Марка, | Римма с Томаркой.', // 122
  
  'Слоны умны, | слоны смирны, | слоны спокойны | и сильны.', // 123
  'Скворец скроил сороконожке | из кожи красные сапожки. | Сошьет скворец | исправно в срок | все сорок скроенных сапог.', // 124
  'Продавец продаёт | сухие продукты: | сухарики, | сушки и сухофрукты. | Сухие баранки | и крекеры есть. | Но в сухомятку | не нужно их есть.', // 125
  'Настины сласти | — сластенина счастье.', // 126
  'Две мартышки | бежали вприпрыжку, | неся под мышкой | Мишкины книжки.', // 127
  'Саша — | само совершенство, | да ещё и | самосовершенствуется!', // 128  
  ];

  // Делит фрагмент на доли: по «|», а если их нет — по словам (одиночные тире пропускаем)
  const toBeats = t => t.includes('|')
    ? t.split('|').map(x => x.trim()).filter(Boolean)
    : t.split(/\s+/).filter(w => w && !/^[—–-]+$/.test(w));

  /* ── Скороговорка целиком: строки и строфы ──
     Строка заканчивается на . ? ! … или двоеточии. Слишком длинное предложение делится по запятой/тире пополам.
     Строки группируются в строфы: 2–4 строки — одна строфа; дальше четверостишия, трёхстишия или двустишия. */
  function buildPoem(raw) {
    const beats = toBeats(raw);
    const END = /[.?!…:]["»”)]*$/;
    const sentences = []; let cur = [];
    beats.forEach((t, i) => { cur.push({ t, i }); if (END.test(t)) { sentences.push(cur); cur = []; } });
    if (cur.length) sentences.push(cur);

    const lines = [];
    sentences.forEach(s => {
      const len = s.reduce((n, b) => n + b.t.length + 1, 0);
      if (len > 46 && s.length > 2) {
        let best = -1, bestD = 1e9, acc = 0;
        s.forEach((b, k) => {
          acc += b.t.length + 1;
          if (k < s.length - 1 && /[,;—–]["»”]*$/.test(b.t) && acc >= 14 && len - acc >= 14) {
            const d = Math.abs(acc - len / 2);
            if (d < bestD) { bestD = d; best = k; }
          }
        });
        if (best >= 0) { lines.push(s.slice(0, best + 1)); lines.push(s.slice(best + 1)); return; }
      }
      if (len > 54 && s.length > 2) {          // очень длинная строка без запятых — делим на границе фрагментов ближе к середине
        let best = -1, bestD = 1e9, acc = 0;
        s.forEach((b, k) => {
          acc += b.t.length + 1;
          if (k < s.length - 1 && acc >= 14 && len - acc >= 14) {
            const d = Math.abs(acc - len / 2);
            if (d < bestD) { bestD = d; best = k; }
          }
        });
        if (best >= 0) { lines.push(s.slice(0, best + 1)); lines.push(s.slice(best + 1)); return; }
      }
      lines.push(s);
    });

    const n = lines.length;
    let size;
    if (n <= 4) size = n;
    else if (n % 4 === 0) size = 4;
    else if (n % 3 === 0) size = 3;
    else if (n % 2 === 0) size = 2;
    else size = 4;
    const stanzas = [];
    for (let k = 0; k < n; k += size) stanzas.push(lines.slice(k, k + size));
    const last = stanzas[stanzas.length - 1], prev = stanzas[stanzas.length - 2];
    if (stanzas.length > 1 && last.length === 1 && prev.length > 2) last.unshift(prev.pop());   // не оставляем одинокую строку
    return { count: beats.length, stanzas };
  }
  window.__bihemBuildPoem = buildPoem;

  function poemHTML(poem, cur) {
    return '<div class="bh-poem">' + poem.stanzas.map(st =>
      '<div class="bh-stanza">' + st.map(line =>
        '<div class="bh-line">' + line.map(b =>
          `<span class="bh-w${b.i === cur ? ' on' : ''}">${b.t}</span>`).join(' ') + '</div>').join('') + '</div>').join('') + '</div>';
  }

  const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const TOTAL = 32;      // смен позиций за задание
  const STEP_MS = 2000;  // шаг = 1 с смена + 1 с задержка до следующей смены

  window.__bihem = window.__bihem || {};

  function buildSteps(lvlId) {
    // Пара A и её зеркало B (руки меняются знаками)
    const l = pick(SIGNS);
    const r = pick(SIGNS.filter(s => s !== l));
    const A = { L: l, R: r }, B = { L: r, R: l };
    const steps = [];

    // Режим речи для 3 уровня
    let speech = null;
    if (lvlId === 3) {
      const mode = pick(['twister', 'random', 'alphabet']);
      if (mode === 'twister') {
        const poem = buildPoem(pick(TWISTERS));        // один случайный фрагмент, показывается целиком
        speech = {
          title: 'Говори скороговорку: на каждую смену рук — следующий фрагмент',
          poem,
          get: () => ''
        };
      } else if (mode === 'random') {
        // Счёт: на КАЖДУЮ смену рук показывается следующее число.
        // «Считай по 3, начиная с 1» → 1, 4, 7, 10 …;  «Считай назад по 4, начиная с 140» → 140, 136, 132 …
        // Назад: старт подбирается так, чтобы за все смены не уйти ниже нуля.
        const back = Math.random() < 0.5;
        const stp = back ? 2 + Math.floor(Math.random() * 4)     // назад: шаг 2–5
                         : 2 + Math.floor(Math.random() * 6);    // вперёд: шаг 2–7
        const from = back ? stp * (TOTAL - 1) + 1 + Math.floor(Math.random() * 10)
                          : 1 + Math.floor(Math.random() * 20);
        const val = i => back ? from - i * stp : from + i * stp;
        const rule = back ? `Считай назад по ${stp}, начиная с ${from}`
                          : `Считай по ${stp}, начиная с ${from}`;
        speech = { title: rule, rule, big: true, get: i => String(val(i)), ctx: () => rule };
      } else {
        speech = { title: 'Называй буквы по алфавиту', get: i => ALPHABET[i % ALPHABET.length] };
      }
    }

    let prevColor = -1, prevPose = null, prevNum = -1;   // чтобы подряд не было одинаковых положений, цифр и цветов
    for (let i = 0; i < TOTAL; i++) {
      const pos = i % 2 === 0 ? A : B;
      const st = { type: 'pos', L: pos.L, R: pos.R, n: i + 1, say: '' };

      if (lvlId === 3) {
        st.say = speech.get(i);
        st.ctx = speech.ctx ? speech.ctx(i) : '';
        st.rule = speech.rule || '';
        st.big = !!speech.big;
        if (speech.poem) { st.poem = speech.poem; st.cur = i % speech.poem.count; }
      }
      if (lvlId >= 4) {
        // левая рука — случайный знак, правая — цветная цифра от 0 до 5 (столько пальцев на одной руке);
        // знак, цифра и цвет не повторяются два раза подряд
        st.R = null;
        let pose;
        do { pose = pick(SIGNS); } while (pose === prevPose);
        prevPose = pose; st.L = pose;
        let c;
        do { c = Math.floor(Math.random() * COLORS.length); } while (c === prevColor);
        prevColor = c;
        let num;
        do { num = Math.floor(Math.random() * 6); } while (num === prevNum);
        prevNum = num; st.num = num;
        st.color = COLORS[c].hex;
      }
      steps.push(st);

      // 2 уровень: хлопок отдельной секундой между сменами
      if (lvlId === 2 && i < TOTAL - 1) steps.push({ type: 'clap' });
    }
    return { steps, hint: speech ? speech.title : '' };
  }

  // Звук: AudioContext создаём и «будим» в момент нажатия «Старт» (иначе iPhone/Safari молчат), дальше только пищим
  function audioCtx() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      window.__bihemAC = window.__bihemAC || new AC();
      if (window.__bihemAC.state === 'suspended') window.__bihemAC.resume();
      return window.__bihemAC;
    } catch (e) { return null; }
  }
  function beep() {
    const ac = audioCtx();
    if (!ac) return;
    try {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 660; g.gain.value = 0.06;
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.05);
    } catch (e) {}
  }

  // Содержимое «сцены» для одного шага (используется и для предпросмотра до старта)
  function stepHTML(st, lvlId, preview) {
    if (st.type === 'clap') {
      // хлопок — обе руки сразу, поэтому только один символ
      return '<div class="bh-clap">👏</div><div class="bh-clap-lbl">ХЛОПОК!</div>';
    }
    const lab = (t, cls) => `<div class="bh-lab ${cls}">${t}</div>`;
    const left = `<div class="bh-col">${lab('ЛЕВАЯ', 'l')}<div class="bh-pad">${handSVG(st.L, 'L')}</div></div>`;
    const right = lvlId >= 4
      ? `<div class="bh-col">${lab('ПРАВАЯ', 'r')}<div class="bh-pad"><div class="bh-num" style="color:${st.color}">${st.num}</div></div></div>`   // цвет — часть задания
      : `<div class="bh-col">${lab('ПРАВАЯ', 'r')}<div class="bh-pad">${handSVG(st.R, 'R')}</div></div>`;
    const hintStart = '<div class="bh-hint">Приготовься и нажми «Старт»</div>';
    let info = '';
    if (lvlId >= 4) info = 'Называй цвет числа';
    else if (st.poem) info = poemHTML(st.poem, preview ? -1 : st.cur) + (preview ? hintStart : '');
    else if (preview && st.rule) info = `<b class="bh-rule">${st.rule}</b>` + hintStart;
    else if (st.say) info = `<b class="bh-say${st.big ? ' big' : ''}">${st.say}</b>` +
      (st.ctx ? `<div class="bh-hint">${st.ctx}</div>` : '');
    else if (st.rule) info = `<b class="bh-rule">${st.rule}</b>`;
    else if (preview) info = 'Приготовься и нажми «Старт»';
    return `<div class="bh-row">${left}${right}</div><div class="bh-info">${info}</div>`;
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
    audioCtx();   // создаём звук прямо в обработчике нажатия (требование браузеров)
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
      vis: `<div id="${id}" class="bh">
        <div id="${id}-stage">${stepHTML(steps[0], lvlId, true)}</div>
        <div class="bh-prog"><div id="${id}-bar"></div></div>
        <div class="bh-foot">
          <span id="${id}-cnt" class="bh-cnt">0 / ${TOTAL}</span>
          <button id="${id}-btn" class="btn-sm btn-main" onclick="bihemRun('${id}')">Старт</button>
        </div>
      </div>`,
      type: 'bihem_rhythm', rhythmId: id,   // свой рендерер, без таймера и вариантов ответа
      ans: '', opts: []
    };
  }
  // 30 шагов из функции fn(i) → [левая, правая]
  const posSteps = fn => Array.from({ length: TOTAL }, (_, i) => {
    const [L, R] = fn(i);
    return { type: 'pos', L, R, n: i + 1, say: '' };
  });
  const MENU = { bg: '#eeedfe', fg: '#3c3489' };
  const HELLO = ['ok', 'ok_mid', 'ok_ring', 'ok_pinky'];   // большой + указательный … мизинец

  CATS.bihem_hand = {
    name: 'Пальчиковая гимнастика', desc: TOTAL + ' смены + ритм',
    icon: '✋', ...MENU,
    gen() {
      const lvl = getLvl();
      const lvlId = Math.min(Math.max(lvl.id, 1), 4);
      const { steps, hint } = buildSteps(lvlId);
      const rules = {
        1: 'Повторяй позиции рук вслух со счётом. Позиции меняются зеркально.',
        2: 'Меняй позиции зеркально. Между сменами — хлопок.',
        3: 'Меняй позиции зеркально и одновременно говори: ' + (hint || ''),
        4: 'Левая рука — знак, правая — число. Называй ЦВЕТ, которым написано число.',
      }[lvlId];
      return rhythmTask(rules, steps, lvlId);
    }
  };

  // 1) Волк и пистолет: руки меняются местами каждую смену
  CATS.bihem_wolfgun = {
    name: 'Волк и пистолет', desc: 'Одна рука — волк, другая — пистолет; каждую смену меняются',
    icon: '🐺', ...MENU,
    gen() {
      const A = Math.random() < 0.5 ? ['wolf', 'sidegun'] : ['sidegun', 'wolf'];
      const nm = { wolf: 'волк', sidegun: 'пистолет' };
      const steps = posSteps(i => i % 2 === 0 ? A : [A[1], A[0]]);
      return rhythmTask(`Левая рука — ${nm[A[0]]}, правая — ${nm[A[1]]}. Каждую смену руки меняются: волк ↔ пистолет.`, steps, 1);
    }
  };

  // 2) Пальцы здороваются синхронно: обе руки показывают одно и то же, по одному положению за смену
  CATS.bihem_hello_sync = {
    name: 'Пальцы здороваются — вместе', desc: 'Обе руки синхронно: указательный → мизинец',
    icon: '🤝', ...MENU,
    gen() {
      const steps = posSteps(i => [HELLO[i % 4], HELLO[i % 4]]);
      return rhythmTask('Обе руки вместе: большой палец здоровается по очереди с указательным, средним, безымянным и мизинцем, и снова с указательного. Правая и левая не меняются.', steps, 1);
    }
  };

  // 3) Пальцы здороваются асинхронно: одна рука идёт от указательного, другая от мизинца, дальше — обратно без повтора крайних
  CATS.bihem_hello_async = {
    name: 'Пальцы здороваются — навстречу', desc: 'Одна рука от указательного, другая от мизинца',
    icon: '🔄', ...MENU,
    gen() {
      const leftFirst = Math.random() < 0.5;
      const path = [0, 1, 2, 3, 2, 1];                      // туда и обратно, крайние не повторяются
      const steps = posSteps(i => {
        const a = HELLO[path[i % 6]], b = HELLO[3 - path[i % 6]];
        return leftFirst ? [a, b] : [b, a];
      });
      const who = leftFirst ? ['Левая', 'правая'] : ['Правая', 'левая'];
      return rhythmTask(`${who[0]} рука начинает с указательного, ${who[1]} — с мизинца. Дойдя до края, идите обратно (крайний палец не повторяется).`, steps, 1);
    }
  };

  // 4) Большой палец вверх на одной руке и «фига» на другой; каждую смену меняются
  CATS.bihem_thumb_fig = {
    name: 'Большой палец и фига', desc: 'Одна рука — 👍, другая — фига; каждую смену меняются',
    icon: '👍', ...MENU,
    gen() {
      const A = Math.random() < 0.5 ? ['thumbup', 'fig'] : ['fig', 'thumbup'];
      const nm = { thumbup: 'большой палец вверх', fig: 'фига' };
      const steps = posSteps(i => i % 2 === 0 ? A : [A[1], A[0]]);
      return rhythmTask(`Левая рука — ${nm[A[0]]}, правая — ${nm[A[1]]}. Каждую смену руки меняются.`, steps, 1);
    }
  };
})();
