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
     'Зачерпнула цапля чашкой Чай целебный из ромашки. Целый чан у цапли чая. Цапля - врач больных встречает. ',  // 24
     'Чукча с цыганом Чипсы считали.',  // 25
     'Череповчане те же англичане, только не чают про тех англичане.',  // 26
     
     'Цыпленок с курицей пьет чай на улице.',  // 27
     'Сачок зацепился за сучок.',  // 28
     'Як якчонка поучает и нотации читает: "Делай так как як вещает" - строго на строго стращает - "Станет явью мечта ячья - Стать бы яком настоящим". ',  // 29
     
     'В ночи не кирпичи лопочут на печи, Допочут на печи в опаре калачи',  // 30
     'Чёрной ночью чёрный кот Прыгнул в чёрный дымоход.',  // 31
     'Четыре черненьких чумазеньких чертёнка Чертили чёрными чернилами чертеж.',  // 32
     'Нвша дочь речистая. У нее речь чистая.',  // 33
     'Течёт речка. Печёт печка.',  // 34     
     'Были галчата в гостях у волчат. Были волчата в гостях у галчат. Нынче волчата галдят как галчата И как волчата галчата молчат.',  // 35
     
     'Добыл бобов бобыль, Забыл бобыль костыль, А баба бобыля добыла киселя.',  // 36
     'Белый снег, белый мел. Белый сахар тоже бел. Авот белка не бела. Белой даже не была.',  // 37
     'Дубовый столб стоит столбом. В него баран уперся лбом. Хотя не жаль барану лба, но лбом не сбить ему столба.',  // 38
     'Бык тупогуб, тупогубенький бычок. У быка бела губа была тупа.',  // 39
     'Бублик сахарный в блюдце плюхнулся.',  // 40
     'Все бобры для своих бобрят добры.',  // 41
     'Банкир бросал банкноты из блокнота. Банкрот бурча бранил банкира мота.',  // 42
     'Брит Клим брат, брит Игнат брат, а брат Панкрат бородат.',  // 43
     'У боярина-бобра нет богатства, нет добра. Два бобрёнка у бобра - лучше всякого добра.',  // 44
     
     'А в лесу у лисы на носу оса, а в песках на спине у осла — полоса. От укуса осы у лисы — две слезы, от седла — полоса на спине у осла.',  // 45
    
     'Съел Валерик вареник, а Валюшка - ватрушку .',  // 46
     'Стоит воз овса, а возле воза - овца.',  // 47
     'Варвара варенье доваривала, Доваривала, да, приговаривала: "Варись, ты мое вареньице, всем внукам на угощеньеце".',  // 48
     'Расчувствовавшаяся Варвара расчувствовала черствого барана.',  // 49
     
     'Громкоголосые гавайцы громко готовили гарнир.',  // 50
     'Бабе-Яге магия не помогает.',  // 51
     'Гво́здики в заборе, а гвозди́ки в вазоне.',  // 52
     'На нее глазели глаза газели.',  // 53
     
     'Змей Горыныч взгромоздясь Сел на гору весь дымясь.',  // 54
     'Грозди рябины на солнце горят. Рябит от рябины в глазах у ребят.',  // 55
     'Собирала Маргарита мрагаритки на горе, Потеряла Маргарита маргаритки во дворе.',  // 56
     'Сапог не в пору Прасковье до поры. До города - в гору, от города - с горы. С горы - не в гору, В гору - не с горы. Мы новые Прасковье купили сапоги.',  // 57
    
     'Из кузова в кузов шла перегрузка арбузов. В грозу в грязи от груза арбузов развалился кузов.',  // 58
     'Тащил Авдей мешок гвоздей. Тащил Гордей мешок груздей. Авдей Гордею дал гвоздей, Гордей Авдею дал груздей.',  // 59
     'Пал град на пять гряд.',  // 60
     'Грач сгоряча осерчал на грача.',  // 61
      
     'Дятел лечит древний дуб. Добрый дятел дубу люб.',  // 62
     'А мне не до недомогания.',  // 63
     'Догу Гогу недогнать. Долго Гогу догу гнать..',  // 64
     'Дед Данил дедил дыню. Дольку Диме, Дольку Дине.',  // 65
     'Не видно - ликвидны ли акции или неликвидны.',  // 66
     'Без дна ли бездна?',  // 67
     'Дорогие диадемы дарят дамам в дни рожденья.',  // 68
     
     'Несдерженность сдержим внутренним стержнем.',  // 69
     'Ужа ужадила ужица. Ужу с ужицей не ужиться. Уж от ужаса стал уже. Ужа ужица съест на ужин.',  // 70
     'Жук жужжит над абажуром.',  // 71
     'Жужжит над жимолостью жук. Тяжелый на жуке кожух. Я жук, давно я тут живу. Жужжу, кружу, с ежом дружу.',  // 72
     'У ежа в гостях ужата, у ужа в гостях ежата. Учит бегать ёж ежат. Учит ползать уж ежат.',  // 73
     'Цветные одежды дарили надежду, цвели на Надежде цветные одежды.',  // 74
     'Все клёны стали ражие И ни один не дразнится: раз всё равно все рыжие, Кому какая разница.',  // 75
      'Женя с Жанной подружилась. Дружба с Жанной не сложилась. Чтобы жить с друзьями дружно, Обижать друзей не нужно.',  // 76
     'Дирижёр пейзажем поражён.',  // 77
     
     'У Зины-Зинули болит задний зуб. Поэтому Зина не может есть суп.',  // 78
     'Встретиться змей и змея захотели. Встретиться змей и змея не сумели. Змей - в облаказ, а змея - на земле. Надо бы змею спуститься к змее.',  // 79
       'Зелёная берёза стоит в лесу, Зоя под берёзой поймала стрекозу.',  // 80
     'Зимним утром от мороза на заре звенят березы.',  // 81
        'Верзила-динозавр дерзил зря.',  // 82
     'Зарядка требуется для тренировки и разрядки.',  // 83
      'Лизкина киска лизнула Лизку.',  // 84
     'Зимой поле белое, промерзло-заледенелое.',  // 85
       'Зиновий, познакомь-ка знакомого с незнакомкой.',  // 88 
     
     'Майе на ярмарке в мае купили маленькую майку с каймой.',  // 86
   
     'Села мышка в уголок, съела бублика кусок.',  // 87
     'Из соседнего колодца целый день водица льется.',  // 89
      'Палку толкал лапкой Полкан, потом Полкан из Байкала лакал.',  // 90
     'Свёкла у Фёклы мокла и сохла. Сохла и мокла пока не поблёкла.',  // 91
       
     'Рите - открытка с Кипра, а Виктору - открытка с Крита. От Риты - открытка с Крита, от Виктора - открытка с Кипра.',  // 92
     'Сорок сорок в короткий срок съеди сырок.',  // 93
     'Утром присев на зеленом пригорке, Учат сороки скороговорки.',  // 94
     
     'Оксана таксе по таксофону такси заказала. Сев в такси спросила такса: "а у вас какая такса?". Ей таксист ответил так: "Возим такс мы просто так-с". ',  // 95
      'Если с таксой драться, такса станет кусаться. Если к таксе с лаской, станет такса сказкой.',  // 96
     
     'Микромир комара Макара микроскопический, а макромир комара Макара макроскопический.',  // 97
       'Кровельщик Кирилл криво крышу крыл. Перекрыть крышу пригласили Гришу.',  // 98
     'Крошка-Картошка нравится кошке, лежит на окошке -  стынет немножко .',  // 99
     
        'Мы ели, ели ершей у ели. Их еле-еле у ели доели.',  // 100
     'На мели мы налима лениво ловили. Меняли налима вы мне на линя. О любви не меня ли вы мило молили, и в туманы лимана манили меня?',  // 101
  
     'Мыла Мила мишку мылом. Мила мыло уронила. Уронила Мила мыло, Мишку Мила не домыла.',  // 103
       'Вымыли мышки миску для мишки.',  // 104
     'Лилипут на плоту ловил плотву.',  // 105
       
     'Переплелась и перезапуталась петля полета птеродактиля.',  // 106
     'Про пёстрых птиц поёт петух, Про перья пышные, про пух.',  // 107
      'Проверяли, проверяли, да, недопроверили. Перепроверять пробовали, да недоперепроверили.',  // 108
      'Речистый парень не плечмст, Плечистый парень не речист.',  // 109
     
     'Изобретательный изобретатель изобрел хитрое приспособление.',  // 110
      'Природа рада приросту растительности.',  // 111
     'У пруда в траве во мраке шуршат раки в шумной драке.',  // 112
      'Стаффордширский терьер ретив, а черношёрстный рейзеншнауцер резв.',  // 113
      'К Габсбургам из Страсбурга.',  // 114
     'Рекламный ролик разрекламировал картриджи.',  // 115
      'Антиквары отдают приоритет раритету.',  // 116
     
      'Аудитория рьяно апплодировала оратору.',  // 117
     'Баркас приехал в порт Мадрас. Матрос принес на борт матрас. В порту Мадрас матрас матроса Порвали в драке альбатросы.',  // 118
      'В Кабардино-Балкарии Валокордин из Болгарии.',  // 119
     'Ворон Карлсону оторвал карман. Карлсон завел моторчик и пропал.',  // 120
        'Марина грибы мариновала. Марина малину перебирала. Марина малину ела, малину ела и млела. Корзину малины умяла. Марине корзины мало. Звала по малину Марина Галину. Галина Марину звала по калину',  // 102
      'Король "орел" пароль завел.',  // 121
     'На корме, кроме Ромы, Егор и Артём. На корме, кроме Марка, Римма с Томаркой.',  // 122
     
      'Слоны умны, слоны смирны, слоны спокойны и сильны.',  // 123
     'Скворец скроил сороконожке Из кожи красные сапожки. Сошьёт скворец исправно в срок Все сорок скроеных сапог.',  // 124
      'Продавец продает сухие продукты: сухарики, сушки и сухофрукты. Сухие баранки и крекеры есть. Но в сухомятку не нужно их есть.',  // 125
     'Настины сласти - сластёнино счастье.',  // 126
      'Две мартышки бежали вприпрыжку, неся под мышкой Мишкины книжки.',  // 127
     'Саша - само совершенство, да еще и самосовершенствуется!',  // 128
  ];
  // Делит фрагмент на доли: по «|», а если их нет — по словам (одиночные тире пропускаем)
  const toBeats = t => t.includes('|')
    ? t.split('|').map(x => x.trim()).filter(Boolean)
    : t.split(/\s+/).filter(w => w && !/^[—–-]+$/.test(w));
  const ALPHABET = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ'.split('');
  const TOTAL = 30;      // смен позиций за задание
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
        const words = toBeats(pick(TWISTERS));          // один случайный фрагмент
        const w = i => words[i % words.length];         // короткое — повторяем по кругу
        speech = {
          title: 'Говори скороговорку: по слову на каждую смену',
          get: i => w(i),
          ctx: i => [1, 2, 3, 4].map(k => w(i + k)).join(' ')
        };
      } else if (mode === 'random') {
        // Случайная арифметическая последовательность: «Считай по 2, начиная с 3» / «Считай назад по 7 от 93».
        // Числа на экране не показываем — их нужно считать самому, на экране только правило.
        const back = Math.random() < 0.5;
        const stp = back ? 2 + Math.floor(Math.random() * 8)     // назад: шаг 2–9
                         : 2 + Math.floor(Math.random() * 6);    // вперёд: шаг 2–7
        const from = back ? 60 + Math.floor(Math.random() * 40)  // назад: старт 60–99
                          : 1 + Math.floor(Math.random() * 20);  // вперёд: старт 1–20
        const rule = back ? `Считай назад по ${stp}, начиная с ${from}`
                          : `Считай по ${stp}, начиная с ${from}`;
        speech = { title: rule, rule, get: () => '' };
      } else {
        speech = { title: 'Называй буквы по алфавиту', get: i => ALPHABET[i % ALPHABET.length] };
      }
    }

    let prevColor = -1;
    for (let i = 0; i < TOTAL; i++) {
      const pos = i % 2 === 0 ? A : B;
      const st = { type: 'pos', L: pos.L, R: pos.R, n: i + 1, say: '' };

      if (lvlId === 3) { st.say = speech.get(i); st.ctx = speech.ctx ? speech.ctx(i) : ''; st.rule = speech.rule || ''; }
      if (lvlId >= 4) {
        // левая рука — знак, правая — цветное число
        st.R = null;
        st.L = i % 2 === 0 ? A.L : A.R;
        let c;
        do { c = Math.floor(Math.random() * COLORS.length); } while (c === prevColor);
        prevColor = c;
        st.num = 1 + Math.floor(Math.random() * 9);
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
    const left = `<div style="flex:1 1 0;min-width:0;text-align:center">${lab('ЛЕВАЯ', '#185fa5')}
      ${handSVG(st.L, 'L', `width:${HAND_W};max-width:100%;height:auto;display:block;margin:0 auto`)}</div>`;
    const right = lvlId >= 4
      ? `<div style="flex:1 1 0;min-width:0;text-align:center">${lab('ПРАВАЯ', '#d85a30')}
          <div style="display:flex;align-items:center;justify-content:center;height:${HAND_W};font-size:${BIG};line-height:1;font-weight:700;color:${st.color}">${st.num}</div></div>`
      : `<div style="flex:1 1 0;min-width:0;text-align:center">${lab('ПРАВАЯ', '#d85a30')}
          ${handSVG(st.R, 'R', `width:${HAND_W};max-width:100%;height:auto;display:block;margin:0 auto`)}</div>`;
    let info = '';
    if (lvlId >= 4) info = 'Называй цвет числа';
    else if (st.say) info = `<b style="font-size:26px">${st.say}</b>` +
      (st.ctx ? `<div style="font-size:14px;color:var(--text3);margin-top:4px">${st.ctx}</div>` : '');
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
  // 30 шагов из функции fn(i) → [левая, правая]
  const posSteps = fn => Array.from({ length: TOTAL }, (_, i) => {
    const [L, R] = fn(i);
    return { type: 'pos', L, R, n: i + 1, say: '' };
  });
  const MENU = { bg: '#eeedfe', fg: '#3c3489' };
  const HELLO = ['ok', 'ok_mid', 'ok_ring', 'ok_pinky'];   // большой + указательный … мизинец

  CATS.bihem_hand = {
    name: 'Руки и ритм', desc: '30 смен под ритм: следи за руками',
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

/* ── BIHEM MATCH ── */
CATS.bihem_match = {
  name: 'Соотнеси пары', desc: 'Свяжи слова из двух колонок',
  icon: '🔗', bg: '#e1f5ee', fg: '#085041',
  gen() { return { type: 'bihem_match' }; }
};

const BM_PAIRS_ALL = [
  { L:['кошка','трава','лимон','море'],    R:['пушистая','зелёная','кислый','солёное'], map:{кошка:'пушистая',трава:'зелёная',лимон:'кислый',море:'солёное'} },
  { L:['огонь','лёд','солнце','ночь'],     R:['холодный','горячий','яркое','тёмная'],  map:{огонь:'горячий',лёд:'холодный',солнце:'яркое',ночь:'тёмная'} },
  { L:['роза','слон','молния','пустыня'],  R:['быстрая','большой','жаркая','красивая'],map:{роза:'красивая',слон:'большой',молния:'быстрая',пустыня:'жаркая'} },
  { L:['снег','лес','птица','река'],       R:['поёт','белый','течёт','густой'],        map:{снег:'белый',лес:'густой',птица:'поёт',река:'течёт'} },
];

function renderBihemMatch() {
  const lvl = getLvl();
  const p = pick(BM_PAIRS_ALL);
  const n = lvl.id <= 2 ? 3 : 4;
  // слова с одинаковым описанием в одну задачу не берём — иначе в правой колонке будут два одинаковых блока
  let LW, RW, guard = 0;
  do { LW = shu(p.L).slice(0, n); RW = LW.map(w => p.map[w]); }
  while (new Set(RW).size !== RW.length && ++guard < 50);
  RW = shu(RW);
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
    const opts = shu([...new Set([cnt, cnt+1, Math.max(0,cnt-1), cnt+2])].slice(0,4));
    return {
      q: `Сколько раз встречается <b style="font-size:22px">${tgt}</b> ${cq?'в ряду цветов':'в ряду фигур'}?`,
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
