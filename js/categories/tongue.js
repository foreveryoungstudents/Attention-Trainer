/* ═══════════════════════════════════════
   СКОРОВОРКИ  (раздел «Речь и словесное внимание»)
   1 ур.: панель звуков → короткая скороговорка: прочитать вслух, записать себя, прослушать запись
   2 ур.: метроном на 60 секунд со случайной короткой скороговоркой и меткой звука
   3 ур.: «Снежный ком» (как в категории Snowball): части длинной скороговорки из TG_SNOW появляются по одной и исчезают;
          на контрольных остановках надо нажать ВСЕ части с самого начала по порядку; одна ошибка — конец цепочки
   4 ур.: длинная скороговорка целиком с вертикальной прокруткой: прочитать вслух, записать себя, прослушать
   Озвучки нет — только запись своего голоса и её прослушивание. Проверки речи нет: самооценка (кнопки) либо выполнение шагов.

   КАК ПОДКЛЮЧИТЬ
     index.html : <script src="js/categories/tongue.js"></script>
     engine.js  : в noAutoTimer добавить 'tongue'; в loadTask добавить
                  else if (tp === 'tongue') renderTongue();
     registry.js: в раздел «Речь и словесное внимание» добавить 'tongue' в cats
   КАК МЕНЯТЬ ТЕКСТЫ
     TG_LONG   — длинная скороговорка, нумерованные фрагменты (номер = позиция в списке, с 1).
                 «|» внутри фрагмента делит его на доли для снежного кома; без «|» делится по словам.
     TG_SOUNDS — панель уровней 1–2: звук + номера фрагментов из TG_LONG, которые на него тренируют. */
(function () {
  const TG_LONG = [
    'В четверг четвёртого числа в четыре с че́твертью часа лигури́йский регулировщик регулировал в Лигу́рии.',  // 1
    'Но тридцать три корабля лави́ровали, лави́ровали, да так и не вы́лавировали.',  // 2
    'А потом протокол про протокол протоколом запротоколировал.',  // 3
    'Как интервьюе́ром интервьюи́руемый лигури́йский регулировщик речисто, да не чисто рапортова́л, да не дорапортова́л дорапорто́вывал да так зарапортова́лся про размокропогодившуюся погоду что, дабы инцидент не стал претендентом на судебный прецедент.',  // 4
    'Лигурийский регулировщик акклиматизировался в неконституционном Константинополе.',  // 5
    'А то придет бомбарди́р из Бранденбу́рга — бо́мбами забомбардиру́ет за то, что некто черноры́лый у него полдвора рылом изрыл, вырыл и подрыл.',  // 7
    'Но | на самом | деле | турка | не был | в деле, | да и Клара-краля | в то время | кра́лась | к ларю́, | пока | Карл | у Клары | кораллы | крал, | за что | Клара | у Карла | украла | кларнет,',  // 8
    'а потом на дворе дёготниковой вдовы Варвары два этих во́ра дрова воровали;',  // 9
    'но грех | — не смех | — не уложить | в орех: | о Кларе | с Карлом | во мраке | все раки | шумели | в драке, | — вот | и не | до бомбарди́ра | вора́м | было, | и не | до дёготниковой | вдовы, | и не | до дёготниковых | детей.',  // 10
    'Зато рассердившаяся вдова убрала в сарай дрова: раз дрова, два дрова, три дрова — не вместились все дрова,',  // 11
    'и два дровосека, два дровоко́ла-дроворуба для расчувствовавшейся Варвары вы́дворили дрова вширь двора обратно на дровяной двор,',  // 12
    'где цапля чахла, цапля сохла, цапля сдохла. Цыпленок же цапли цепко цеплялся за цепь;',  // 13
    'молодец против овец, а против молодца сам овца,',  // 14
    'которой носит Сеня сено в сани, потом везет Сенька Соньку с Санькой на санках: санки скок, Сеньку в бок, Соньку в лоб — все в сугроб,',  // 15
    'а Сашка только шапкой шишки сшиб, затем по шоссе Саша пошёл, Саша на шоссе саше́ нашёл.',  // 16
    'Сонька же — Сашкина подружка шла по шоссе и сосала сушку, да притом у Соньки-вертушки во рту еще и три ватрушки — аккурат в медовик, но ей не до медовика —',  // 17
    'Сонька и с ватрушками во рту пономаря́ перепономари́т, перевы́пономарит: жужжит, как жужелица, жужжит, да кружится:',  // 18
    'была у Фрола́ — Фролу́ на Ла́вра наврала́, пойдет к Лавру на Фрола Лавру наврёт,',  // 19
    'что — ва́хмистр с ва́хмистршей, ро́тмистр с ро́тмистршей, что у ужа — ужата, а у ежа — ежата, а у него высокопоставленный гость унес трость,',  // 20
    'и вскоре опять пять ребят съели пять опят с полче́твертью четверика́ чечеви́цы без червоточины, и тысячу шестьсот шестьдесят шесть пирогов с творого́м из сыворотки из-под простокваши,',  // 21
    '— о всём о том около кола́ колокола звоном раззванивали, да так, что даже Константин — зальцбуржский бесперспективняк из-под бронетранспортера констатировал:',  // 22
    'Как все колокола не переколоколова́ть, не перевы́колоколовать, так и всех скороговорок не перескороговорить, не перевыскороговорить; но попытка — не пытка.',  // 23
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

  const TG_SOUNDS = [
   
   { sound: 'Д-Р',  nums: [9, 11] },
   { sound: 'Ч',   nums: [1, 28, 30, 31, 32, 33, 34, 35] },
   { sound: 'Б',   nums: [36, 37, 38, 39, 40, 41, 42, 43, 44] },
   { sound: 'С-Ш',   nums: [16, 24, 25, 27, 28, 45, 95, 96, 123, 124, 125, 126, 128 ] },
   { sound: 'В',   nums: [46, 47, 48, 49] },
   { sound: 'Г',   nums: [50, 51, 52, 53] },
   { sound: 'Г-Р',  nums: [54, 55, 56, 57, 60] },
   { sound: 'З',   nums: [58, 59, 60, 61] },
   { sound: 'Д',   nums: [62, 63, 64, 65, 66, 67, 68] },
   { sound: 'Ж',   nums: [18, 69, 70, 71, 72, 73, 74, 75, 76, 77, 127] },
   { sound: 'З',   nums: [78, 79, 80, 81, 82, 83, 84, 85, 88] },
   { sound: 'Й',   nums: [86 ] },
   { sound: 'Л',   nums: [5, 87, 89, 90, 91, 100, 101, 102, 103, 104, 105] },
   { sound: 'К',   nums: [97, 98, 99] },
   { sound: 'ПР-ПЛ',   nums: [3, 106, 107, 108, 109] },
   { sound: 'Р',   nums: [110, 111, 112, 113, 114, 115, 116 ] },
   { sound: 'Р-Л',   nums: [2, 23, 19, 102, 117, 118, 119, 120, 121] },     
  ];


  /* Длинные скороговорки для уровня 3 («снежный ком»).
     «|» делит скороговорку на части-словосочетания — ком растёт ровно по этим долям.
     Хочешь мельче или крупнее — просто переставь «|». Без «|» текст делится по словам. */
  const TG_SNOW = [
    'Из-под Костромы, | из-под Костромищи | везёт | Сенька | Саньку | с Сонькой | на санках. | Везёт да | скороговорками | так и сыплет: | мол, | тетерев | сидел | на дереве, | от дерева — | тень тетерева; | мол, | у гусыни | усов не ищи, | не сыщешь; | мол, | каков Савва, | такова | и слава. | Скороговорил, | скороговорил, | да так | всех скороговорок | и не | перевыскороговорил.',  // 1
    'Два дровосека, | два дровокола, | два дроворуба | говорили | про Ларьку, | про Варьку, | про Ларькину жену, | спорили, | что у осы | не усы, | не усищи, | а усики, | что сшит колпак | не по-колпаковски, | что вылит колокол | не по-колоколовски.',  // 2
    'От топота копыт | пыль по полю летит — | едет баба | из города, | везёт | вестей | с три короба: | мол, съел молодец | тридцать три пирога | с пирогом, | да все с творогом; | мол, пришёл Прокоп | кипятить | свой укроп; | мол, супруги Пото | играли в лото. | От топота копыт | пыль по полю летит. | Тому, кто приносит | дурные вести, | в день бы плетей | по двести.',  // 3
    'Маланья-болтунья | болтала, | что тридцать три корабля | лавировали-лавировали, | да не вылавировали. | Болтала-болтала, | болтала-болтала, | да так | всего | не выболтала.',  // 4
    'В четверг | четвёртого числа | в четыре | с четвертью часа | шли три попа, | три Прокопия попа, | три Прокопьевича — | шли, шли, | вдруг пред ними река — | широка, | как Ока, | да не Ока. | А на том берегу | стоит поп | на копне, | колпак на попе, | копна под попом, | поп под колпаком. | Увидали попы, | рты раскрыли попы, | закричали попы, | побежали попы.',  // 5
    'От топота копыт | пыль по полю летит. | То курьера | курьер | обгоняет | в карьер. | Только бык-тупогуб | никуда | не спешил, | у дороги лежал, | головой лишь мотал, | бык-тупогуб, | тупогубенький бычок, | у быка | бела губа | была тупа.',  // 6
    'Тень-тень-потетень, | выше города | плетень. | Слушайте, | кому не лень, | сказку-небылицу | про красную девицу, | Маланью-болтунью, | что молоко | болтала, | выбалтывала, | да не выболтала, | а дала Ромаше | сыворотку | из-под простокваши. | Но Ромаша | своё на уме: | ел не ел, | а за столом просидел, | по усам текло, | да в рот не попало! | Вот вам сказка, | а нам | бубликов связка.',  // 7
    'Ромаше дала | сыворотку | из-под простокваши, | просто сыворотку | из-под простокваши, | а он всем говорил, | что, мол, | я удалец-молодец, | съел холодец, | да ещё | тридцать три пирога | с пирогом, | да все с творогом, | да один пирог | с грибами, | да один | с потрохами… | Болтал-болтал, | молол-молол, | язык болтает, | а голова | не знает.',  // 8
    'Языком | не расскажешь, | так и пальцем | не растычешь, | нечего руками | рассуждать, | коли бог | ума не дал, | речь умом | не красна, | а если язык | шепеляв, | то и поговори | скороговорочку | за скороговорочкой. | Нужно | все скороговорки | переговорить, | перевыговорить, | и тогда | так заговоришь — | словно речка | зажурчишь.',  // 9
    'Наш Филат | не бывает виноват, | у нашего Филата | всегда Маланья | виновата, | у самого | лоб что лопата, | да ума | небогато. | Пойдёт — | не дойдёт, | сядет | да вздремнёт, | а вздремнуть | не вздремнёт, | так хоть всхрапнёт | да присвистнет, | присвистнет | да проснётся, | проснётся | да внове свернётся: | мол, я не я, | да и лошадь | не моя. | Так и живёт: | себе не гож, | да и людям | не пригож.',  // 10
    'Жили-были | три японца: | Як, | Як Цыдрак, | Як Цыдрак | Цыдрак Цыкадрони. | Жили-были | три японки: | Цыпа, | Цыпа Дрыпа, | Цыпа Дрыпа | Лимпомпони. | Все они | пережинились: | Як на Цыпе, | Як Цыдрак | на Цыпе Дрыпе, | Як Цыдрак Цыдрак Цыкадрони | на Цыпе Дрыпе | Лимпомпони. | И родились | у них дети: | у Яка с Цыпой — | Шах, | у Як Цыдрака | с Цыпой Дрыпой — | Шах Шарах, | у Як Цыдрак Цыдрак Цыкадрони | с Цыпой Дрыпой Лимпомпони — | Шах Шарах | Шарах Шарони.',  // 11
    'Граф Пото | играл в лото, | а графиня Пото | знала про то, | что граф Пото | играл в лото. | А граф Пото | не знал про то, | что графиня Пото | знала про то, | что граф Пото | играет в лото.',  // 12
  ];

  const SNOW_CHECKS = 8;    // примерно сколько контрольных остановок за одну скороговорку (шаг проверки считается от длины)
  const SNOW_MS_BASE = 1000, SNOW_MS_WORD = 450;   // сколько мс показывается часть: база + за каждое слово в ней
  const SNOW_GAP = 250;     // пауза между частями, мс
  const METRO_SEC = 60;     // длительность метронома (уровень 2)
  const BPM_MIN = 40, BPM_MAX = 200, BPM_DEF = 100;   // диапазон темпа, ударов в минуту

  /* ── вспомогательное ── */
  const $ = id => document.getElementById(id);
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const frag = n => (typeof TG_LONG[n - 1] === 'string' ? TG_LONG[n - 1] : '');            // фрагмент №n (пустой, если в списке дыра)
  const flat = t => t.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();                   // для показа (ударения остаются)
  const beatsOf = t => (t = String(t == null ? '' : t)).includes('|')
    ? t.split('|').map(x => x.trim()).filter(Boolean)
    : t.split(/\s+/).filter(w => w && !/^[—–-]+$/.test(w));
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const BTN = 'padding:8px 14px;font-size:14px;border-radius:10px;border:1px solid rgba(128,128,128,.4);background:rgba(128,128,128,.12);color:inherit;cursor:pointer';
  const BTN_MAIN = 'padding:9px 20px;font-size:15px;border-radius:10px;border:none;background:#7f77dd;color:#fff;cursor:pointer';
  const rnd = n => Math.floor(Math.random() * n);

  /* ── жизненный цикл карточки: всё останавливается, если окно закрыли или карточку сменили ── */
  const alive = S => !S.dead && STATE.scratch === S && $('overlay') && $('overlay').classList.contains('open') && S.root && S.root.isConnected;
  function cleanup(S) {
    if (S.dead) return;
    S.dead = true;
    clearInterval(S.watch); clearTimeout(S.metro); clearInterval(S.clock); clearTimeout(S.snowT);
    recAbort(S);
    if (S.recUrl) { try { URL.revokeObjectURL(S.recUrl); } catch (e) {} S.recUrl = null; }
  }
  function watch(S) { S.watch = setInterval(() => { if (!alive(S)) cleanup(S); }, 200); }

  function finish(S) {
    if (STATE.answered || STATE.scratch !== S) return;
    STATE.answered = true; STATE.scOk++; STATE.scTot++;
    updScore(); showFb(true, '');
    $('fb').textContent = '✓ Выполнено!';
    $('nxt-btn').style.display = 'block';
  }

  /* ── запись голоса ── */
  function recStop(S) { try { if (S.rec && S.rec.state !== 'inactive') S.rec.stop(); } catch (e) {} }
  function recAbort(S) {
    clearInterval(S.recTimer);
    if (S.rec) { S.rec.onstop = null; try { if (S.rec.state !== 'inactive') S.rec.stop(); } catch (e) {} S.rec = null; }
    if (S.stream) { S.stream.getTracks().forEach(t => t.stop()); S.stream = null; }
  }

  /* ── блок «надиктуй — прослушай себя» (уровни 1 и 4) ── */
  function studioHTML() {
    const mk = (n, t) => `<div style="font-weight:600;margin:12px 0 6px"><span id="tg-m${n}" style="display:inline-block;width:20px;color:#2e9e4f"></span>${n}. ${t}</div>`;
    return `<div id="tg-studio">
      ${mk(1, 'Прочитай вслух и запиши себя')}
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button id="tg-rec" style="${BTN}">● Запись</button>
        <button id="tg-recstop" style="${BTN}" disabled>■ Стоп</button>
        <span id="tg-rt" style="font-size:13px;color:var(--text3)"></span>
      </div>
      <div id="tg-recmsg" style="font-size:13px;color:var(--text3);min-height:18px;margin-top:4px"></div>
      ${mk(2, 'Прослушай себя')}
      <audio id="tg-aud" controls style="width:100%;display:none"></audio>
      <div style="margin-top:14px;text-align:center"><button id="tg-done" style="${BTN_MAIN};opacity:.45" disabled>Готово</button></div>
    </div>`;
  }
  // o: { onDone() }
  function bindStudio(S, o) {
    S.recorded = false; S.played = false; S.micBad = false;
    if (S.recUrl) { try { URL.revokeObjectURL(S.recUrl); } catch (e) {} S.recUrl = null; }
    const upd = () => {
      $('tg-m1').textContent = S.recorded ? '✓' : '';
      $('tg-m2').textContent = S.played ? '✓' : '';
      const ok = S.played || S.micBad;                  // нет микрофона — можно завершить без записи
      const b = $('tg-done'); b.disabled = !ok; b.style.opacity = ok ? '1' : '.45';
    };
    const rmsg = t => { $('tg-recmsg').textContent = t || ''; };

    const recBtn = $('tg-rec'), recStopBtn = $('tg-recstop');
    recBtn.onclick = async () => {
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) {
        S.micBad = true; rmsg('Запись недоступна в этом браузере — можно продолжить без неё.'); return upd();
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (S.dead) { stream.getTracks().forEach(t => t.stop()); return; }
        S.stream = stream;
        const chunks = [], rec = new MediaRecorder(stream);
        S.rec = rec;
        rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = () => {
          clearInterval(S.recTimer);
          stream.getTracks().forEach(t => t.stop()); S.stream = null; S.rec = null;
          if (S.dead) return;
          recBtn.disabled = false; recStopBtn.disabled = true; $('tg-rt').textContent = '';
          if (S.recUrl) { try { URL.revokeObjectURL(S.recUrl); } catch (e) {} }
          S.recUrl = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
          const a = $('tg-aud'); a.src = S.recUrl; a.style.display = 'block';
          S.recorded = true; S.played = false;
          rmsg('Записано. Нажми ▶ ниже и послушай себя.');
          upd();
        };
        rec.start();
        recBtn.disabled = true; recStopBtn.disabled = false;
        const t0 = Date.now();
        $('tg-rt').textContent = '0:00';
        S.recTimer = setInterval(() => { $('tg-rt').textContent = fmt((Date.now() - t0) / 1000); }, 250);
        rmsg('Идёт запись…');
      } catch (e) {
        S.micBad = true;
        rmsg('Нет доступа к микрофону. Разрешите его в настройках браузера — или продолжайте без записи.');
        upd();
      }
    };
    recStopBtn.onclick = () => recStop(S);
    $('tg-aud').onended = () => { S.played = true; upd(); };
    $('tg-done').onclick = () => { if (!$('tg-done').disabled) o.onDone(); };
    upd();
  }
  // при смене вида внутри карточки — остановить запись
  function resetMedia(S) { recAbort(S); }

  /* ── УРОВЕНЬ 1: панель звуков ── */
  function renderL1(S) {
    resetMedia(S);
    S.root.innerHTML = `
      <div class="task-q" style="font-size:16px">Выбери звуки для тренировки</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px">
        ${TG_SOUNDS.map((x, i) => `<button class="tg-chip" data-i="${i}" style="${BTN};font-size:18px;padding:12px 18px">${esc(x.sound)}</button>`).join('')}
      </div>`;
    S.root.querySelectorAll('.tg-chip').forEach(b => { b.onclick = () => openShort(S, TG_SOUNDS[+b.dataset.i]); });
  }
  function pickShort(snd, last) {
    const pool = snd.nums.length > 1 ? snd.nums.filter(n => n !== last) : snd.nums;
    return pool[rnd(pool.length)];
  }
  function openShort(S, snd) {
    const n = pickShort(snd, S.lastN); S.lastN = n;
    S.root.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span style="padding:4px 12px;border-radius:999px;background:#eeedfe;color:#3c3489;font-weight:700">${esc(snd.sound)}</span>
        <button id="tg-back" style="${BTN}">← Другие звуки</button>
      </div>
      <div style="font-size:20px;line-height:1.5;margin:14px 0">${esc(flat(frag(n)))}</div>
      ${studioHTML()}`;
    $('tg-back').onclick = () => renderL1(S);
    bindStudio(S, { onDone: () => finish(S) });
  }

  /* ── УРОВЕНЬ 2: метроном ── */
  function renderL2(S) {
    const snd = TG_SOUNDS[rnd(TG_SOUNDS.length)];
    const n = pickShort(snd, -1);
    S.root.innerHTML = `
      <div style="text-align:center"><span style="padding:4px 12px;border-radius:999px;background:#eeedfe;color:#3c3489;font-weight:700">${esc(snd.sound)}</span></div>
      <div style="font-size:22px;line-height:1.5;margin:14px 0;text-align:center">${esc(flat(frag(n)))}</div>
      <div style="text-align:center;margin:8px 0">
        <div id="tg-dot" style="display:inline-block;width:44px;height:44px;border-radius:50%;background:#7f77dd;opacity:.25;transition:opacity .08s"></div>
      </div>
      <div id="tg-time" style="text-align:center;font-size:28px;font-weight:700">${fmt(METRO_SEC)}</div>
      <div style="height:6px;background:rgba(128,128,128,.2);border-radius:3px;margin:8px 0"><div id="tg-bar" style="height:100%;width:0;background:#7f77dd;border-radius:3px"></div></div>
      <div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:10px">
        <span style="font-size:13px;color:var(--text3)">темп</span>
        <button id="tg-bpm-minus" style="${BTN};padding:6px 12px;font-size:18px;line-height:1">−</button>
        <input id="tg-bpm" type="range" min="${BPM_MIN}" max="${BPM_MAX}" step="5" value="${BPM_DEF}" style="width:150px">
        <button id="tg-bpm-plus" style="${BTN};padding:6px 12px;font-size:18px;line-height:1">+</button>
        <span id="tg-bpmv" style="font-size:13px;min-width:70px">${BPM_DEF} уд/мин</span>
      </div>
      <div style="text-align:center;margin-top:14px"><button id="tg-start" style="${BTN_MAIN}">Старт</button></div>`;
    // темп можно менять и до старта, и во время работы метронома (следующий щелчок уже в новом темпе)
    S.bpm = BPM_DEF;
    const setBpm = v => {
      S.bpm = Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(v / 5) * 5));
      $('tg-bpm').value = S.bpm; $('tg-bpmv').textContent = S.bpm + ' уд/мин';
    };
    $('tg-bpm').oninput = () => setBpm(+$('tg-bpm').value);
    $('tg-bpm-minus').onclick = () => setBpm(S.bpm - 5);
    $('tg-bpm-plus').onclick = () => setBpm(S.bpm + 5);
    $('tg-start').onclick = () => {
      if (S.running) return stopMetro(S, true);
      startMetro(S);
    };
  }
  function click(accent) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      window.__tgAC = window.__tgAC || new AC();
      const ac = window.__tgAC, o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = accent ? 880 : 640; g.gain.value = 0.18;
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.04);
    } catch (e) {}
  }
  function stopMetro(S, reset) {
    clearTimeout(S.metro); clearInterval(S.clock); S.running = false;
    if (reset && !S.dead) {
      $('tg-start').textContent = 'Старт'; $('tg-bar').style.width = '0'; $('tg-time').textContent = fmt(METRO_SEC);
      $('tg-dot').style.opacity = '.25';
    }
  }
  function startMetro(S) {
    try { const AC = window.AudioContext || window.webkitAudioContext; window.__tgAC = window.__tgAC || new AC(); if (window.__tgAC.resume) window.__tgAC.resume(); } catch (e) {}
    S.running = true;
    $('tg-start').textContent = 'Стоп';
    const t0 = performance.now() + 800;                        // 0,8 с на подготовку
    const tEnd = t0 + METRO_SEC * 1000;                        // конец по часам — не зависит от темпа
    let k = 0, next = t0;
    const tick = () => {
      if (!S.running || !alive(S)) return;
      if (performance.now() >= tEnd) {
        stopMetro(S, false);
        $('tg-time').textContent = '0:00'; $('tg-bar').style.width = '100%'; $('tg-dot').style.opacity = '.25';
        $('tg-start').style.display = 'none';
        $('tg-time').insertAdjacentHTML('afterend', '<div style="text-align:center;font-weight:700;margin-top:6px">Готово ✔</div>');
        return finish(S);
      }
      click(k % 4 === 0);
      const dot = $('tg-dot'); dot.style.opacity = '1'; setTimeout(() => { if (!S.dead && $('tg-dot')) $('tg-dot').style.opacity = '.25'; }, 90);
      k++;
      next += 60000 / S.bpm;                                   // интервал до следующего щелчка — по текущему темпу
      S.metro = setTimeout(tick, Math.max(0, next - performance.now()));
    };
    S.clock = setInterval(() => {
      if (!alive(S)) return;
      const el = Math.max(0, (performance.now() - t0) / 1000);
      $('tg-time').textContent = fmt(Math.max(0, METRO_SEC - el));
      $('tg-bar').style.width = Math.min(100, el / METRO_SEC * 100) + '%';
    }, 200);
    S.metro = setTimeout(tick, 800);
  }

  /* ── УРОВЕНЬ 3: снежный ком (механика как в Snowball.js, вместо слов — части скороговорки) ── */
  const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const snowAlive = S => alive(S) && !STATE.answered;
  const snowCps = n => {                       // номера частей, после которых идёт проверка; последняя — обязательно
    const every = Math.max(1, Math.round(n / SNOW_CHECKS)), cps = [];
    for (let k = every; k <= n; k += every) cps.push(k);
    if (cps[cps.length - 1] !== n) cps.push(n);
    return cps;
  };
  const SN_BOX = 'text-align:center;background:var(--surface2);border-radius:12px;padding:2rem 1rem;min-height:110px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;word-break:break-word;';
  const snChip = (txt, kind, extra) => {
    const c = kind === 'ok' ? ['green-bg', 'green-bd', 'green'] : kind === 'no' ? ['red-bg', 'red-bd', 'red'] : ['surface2', 'border2', 'text2'];
    return `<span style="background:var(--${c[0]});border:1px solid var(--${c[1]});color:var(--${c[2]});border-radius:8px;padding:4px 10px;font-size:15px;font-weight:600;${extra || ''}">${txt}</span>`;
  };
  const SN_WRAP = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;line-height:1.2';
  const SN_MUTED = 'font-size:14px;color:var(--text3);text-align:center;margin:6px 0;line-height:1.6';

  function snowPick(S) {
    let i = rnd(TG_SNOW.length);
    if (TG_SNOW.length > 1 && i === S.lastSnow) i = (i + 1 + rnd(TG_SNOW.length - 1)) % TG_SNOW.length;   // не повторять подряд
    S.lastSnow = i;
    return i;
  }

  function renderL3(S) {
    const total = TG_SNOW.length;

    /* старт: инструкция */
    const intro = () => {
      const idx = snowPick(S);
      S.words = beatsOf(TG_SNOW[idx]); S.N = S.words.length; S.idx = idx;
      S.cps = snowCps(S.N); S.cpi = 0; S.shown = 0; S.held = 0; S.taps = [];
      const inChain = new Set(S.words);                       // «лишние» части берём из других скороговорок
      S.spare = mix([...new Set(TG_SNOW.flatMap((t, i) => i === idx ? [] : beatsOf(t)))].filter(w => !inChain.has(w)));
      S.root.innerHTML = `
        <div class="task-q">Снежный ком: скороговорка</div>
        <div class="task-vis" style="line-height:1.7">
          Части скороговорки будут появляться <b>по одной</b> и исчезать. Запоминай их по порядку.<br>
          Проверки после частей: <b>${S.cps.join(', ')}</b>.<br>
          На проверке нажимай <b>все части с самого начала</b> в том же порядке.<br>
          <b>Одна ошибка — и цепочка заканчивается.</b><br>
          Скороговорка ${idx + 1} из ${total}, всего частей: <b>${S.N}</b>.
        </div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="next-btn" id="tg-begin">Начать</button>
          <button id="tg-other" style="${BTN}">Другая скороговорка</button>
        </div>`;
      $('tg-begin').onclick = run;
      $('tg-other').onclick = intro;
    };

    /* показ частей до ближайшей проверки */
    const run = () => {
      const target = S.cps[S.cpi];
      const screen = (t, i) => `
        <div class="task-q">Запоминай</div>
        <div style="${SN_BOX}">${esc(t)}</div>
        <div style="font-size:14px;color:var(--text3);text-align:center;margin-top:10px">часть ${i + 1} из ${S.N} · проверка после части №${target}</div>`;
      const step = () => {
        if (!snowAlive(S)) return;
        if (S.shown >= target) return ask(target);
        const i = S.shown, w = S.words[i];
        const ms = SNOW_MS_BASE + SNOW_MS_WORD * w.split(/\s+/).length;
        S.root.innerHTML = screen(w, i);
        S.snowT = setTimeout(() => {
          if (!snowAlive(S)) return;
          S.root.innerHTML = screen('', i);                   // пустая пауза
          S.shown++;
          S.snowT = setTimeout(step, SNOW_GAP);
        }, ms);
      };
      step();
    };

    /* проверка: нажимать части по порядку, первая ошибка заканчивает цепочку */
    const ask = k => {
      const nDis = Math.min(5, 2 + Math.ceil(k / 8));
      S.taps = [];
      const pool = mix([...S.words.slice(0, k), ...mix(S.spare).slice(0, nDis)]);
      S.root.innerHTML = `
        <div class="task-q">Повтори скороговорку: нажимай части в том порядке, как они появлялись</div>
        <div style="font-size:14px;color:var(--text3);text-align:center;margin-bottom:8px">Частей: <b id="sb-cnt">0</b> из ${k} · одна ошибка заканчивает цепочку</div>
        <div id="sb-pool" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:1rem 0"></div>
        <div style="font-size:13px;color:var(--text3);text-align:center">Уже нажато:</div>
        <div class="task-vis" id="sb-strip" style="min-height:56px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;line-height:1.2"></div>`;
      const poolEl = $('sb-pool');
      pool.forEach(w => {
        const b = document.createElement('button');
        b.className = 'opt'; b.style.padding = '8px 14px'; b.textContent = w;
        b.onclick = () => tap(k, b, w);
        poolEl.appendChild(b);
      });
      refresh();
    };
    const refresh = () => {
      const strip = $('sb-strip'); if (!strip) return;
      strip.innerHTML = S.taps.length
        ? S.taps.map((w, i) => `<span style="background:var(--blue-bg);border:1px solid var(--blue-bd);color:var(--blue);border-radius:8px;padding:4px 10px;font-size:15px;font-weight:600">${i + 1}. ${esc(w)}</span>`).join('')
        : '<span style="color:var(--text3);font-size:14px">пока пусто</span>';
      $('sb-cnt').textContent = S.taps.length;
    };
    const tap = (k, b, w) => {
      if (!snowAlive(S) || b.disabled) return;
      const pos = S.taps.length;
      S.taps.push(w);
      if (w !== S.words[pos]) return end(false, k, pos);      // первая ошибка — конец
      b.disabled = true; b.style.opacity = '.35';
      refresh();
      if (S.taps.length === k) passed(k);
    };

    /* проверка пройдена: либо конец, либо показ следующих частей */
    const passed = k => {
      S.held = k;
      if (k === S.N) return end(true, k, -1);
      S.cpi++;
      S.root.innerHTML = `
        <div class="task-q">✓ Верно! Цепочка из ${k} частей</div>
        <div class="task-vis">Продолжаем. Следующая проверка — после части №${S.cps[S.cpi]}.</div>`;
      S.snowT = setTimeout(() => { if (snowAlive(S)) run(); }, 1300);
    };

    /* итог */
    const end = (ok, k, bad) => {
      STATE.answered = true; STATE.scTot++; if (ok) STATE.scOk++;
      const held = ok ? S.N : Math.max(S.held, bad);
      if (ok) {
        S.root.innerHTML = `
          <div class="task-q">Вся скороговорка — ${S.N} частей без ошибок!</div>
          <div class="task-vis" style="font-size:18px;line-height:1.6;text-align:center">${esc(flat(TG_SNOW[S.idx]))}</div>`;
      } else {
        const right = S.words.slice(0, k).map((w, i) => snChip(`${i + 1}. ${esc(w)}`, i <= bad ? 'ok' : 'idle', i === bad ? 'box-shadow:0 0 0 2px var(--green)' : '')).join('');
        S.root.innerHTML = `
          <div class="task-q">Удержано частей подряд: ${held} из ${S.N}</div>
          <div style="${SN_MUTED}">На месте №${bad + 1} ты нажала:</div>
          <div style="${SN_WRAP}">${snChip(esc(S.taps[bad]), 'no')}</div>
          <div style="${SN_MUTED}">а нужно было:</div>
          <div style="${SN_WRAP}">${snChip(esc(S.words[bad]), 'ok')}</div>
          <div style="${SN_MUTED}">Правильная цепочка (${k} частей), нужная часть обведена:</div>
          <div class="task-vis" style="${SN_WRAP}">${right}</div>
          <div style="${SN_MUTED}">Вся скороговорка целиком:</div>
          <div class="task-vis" style="font-size:16px;line-height:1.6;text-align:center">${esc(flat(TG_SNOW[S.idx]))}</div>`;
      }
      if (STATE.curTask) STATE.curTask.explain = ok
        ? `Скороговорка из ${S.N} частей воспроизведена без ошибок.`
        : `Удержано частей подряд: ${held} из ${S.N}. Ошибка на месте №${bad + 1}.`;
      showFb(ok, ok ? '' : `часть №${bad + 1}: «${S.words[bad]}»`);
      updScore();
      $('nxt-btn').style.display = 'block';
    };

    intro();
  }

  /* ── УРОВЕНЬ 4: вся скороговорка с прокруткой ── */
  function renderL4(S) {
    S.root.innerHTML = `
      <div style="font-size:13px;color:var(--text3);margin-bottom:6px">Вся скороговорка — прокручивай вниз</div>
      <div id="tg-scroll" style="max-height:34vh;overflow-y:auto;border:1px solid rgba(128,128,128,.3);border-radius:10px;padding:10px 12px;font-size:17px;line-height:1.6">
        ${TG_LONG.map((t, i) => !frag(i + 1) ? '' : `<p id="tg-f${i}" style="margin:0 0 10px;padding:2px 6px;border-radius:6px"><span style="color:var(--text3);font-size:12px;margin-right:6px">${i + 1}</span>${esc(flat(frag(i + 1)))}</p>`).join('')}
      </div>
      ${studioHTML()}`;
    bindStudio(S, { onDone: () => finish(S) });
  }

  /* ── вход ── */
  window.renderTongue = function () {
    const lvl = Math.min(Math.max(getLvl().id, 1), 4);
    const S = STATE.scratch = { level: lvl };
    $('task-area').innerHTML = '<div id="tg-root"></div>';
    S.root = $('tg-root');
    watch(S);
    try {
      ({ 1: renderL1, 2: renderL2, 3: renderL3, 4: renderL4 })[lvl](S);
    } catch (e) {
      console.error('Скороговорки:', e);
      S.root.innerHTML = `<div class="task-q" style="color:#e24b4a">Не удалось открыть карточку</div>
        <div class="task-vis" style="font-size:13px;word-break:break-word">${esc((e && e.message) || e)}</div>`;
    }
  };

  CATS.tongue = {
    name: 'Скороговорки', desc: 'Звуки, метроном, снежный ком, длинный текст',
    icon: '🗣️', bg: '#e1f5ee', fg: '#085041',
    gen() { return { type: 'tongue' }; }
  };
})();
