/* ── MEMORY (words) ──
   Замените этим блоком старые CATS.memory, renderMem1 и renderMem2.
   Зависит от ваших функций: getLvl, r, shu, checkAns и объекта STATE.
   Новое: ровно 4 варианта, правильные ответы всегда среди них,
   на сложных уровнях нужно нажать оба слова по порядку,
   таймер сам останавливается, если ученик ушёл с экрана. */

CATS.memory = {
  name: 'Память', desc: 'Запомни слова — потом воспроизведи',
  icon: '🧠', bg: '#fbeaf0', fg: '#72243e',
  gen() {
    const lvl = getLvl();
    const pool = 'яблоко	река	книга	замок	лампа	облако	дерево	ключ	мост	цветок	стол	луна	огонь	ветер	камень	корабль	гора	поезд	окно	птица	море	звезда	флаг	нож	вилка	чашка	диван	кровать	зеркало	шкаф	пальто	сумка	телефон	компьютер	мышь	клавиатура	экран	кот	пёс	конь	лиса	волк	медведь	орёл	бабочка	груша	озеро	тетрадь	ворота	свеча	туча	куст	дверь	дорога	трава	стул	солнце	дым	дождь	песок	лодка	холм	самолёт	стена	рыба	океан	планета	карта	ложка	тарелка	стакан	кресло	подушка	ковёр	полка	куртка	рюкзак	планшет	ноутбук	кабель	принтер	монитор	тигр	заяц	олень	белка	ёж	сова	пчела	паук	слива	ручей	письмо	башня	фонарь	туман	лист	крыша	тропа	гриб	лавка	небо	искра	снег	глина	парус	скала	автобус	пол	жук	берег	комета	герб	топор	миска	чайник	одеяло	простыня	картина	ящик	шапка	чемодан	часы	камера	наушники	роутер	дисплей	лев	кабан	лось	барсук	крот	чайка	муха	муравей	вишня	пруд	газета	крепость	люстра	радуга	ветка	забор	площадь	ягода	тумба	земля	уголь	лёд	почва	якорь	пещера	трамвай	потолок	червь	волна	комета	знамя	пила	кастрюля	блюдце матрас	плед	штора	комод	шарф	кошелёк	радио	колонка	флешка	модем	проектор	слон	зебра	жираф	обезьяна	бобр	ворон	шмель	стрекоза'.split(/\s+/).filter(Boolean);
    const uniq = [...new Set(pool)];
    const n = lvl.wordsN[0] + r(lvl.wordsN[1] - lvl.wordsN[0] + 1);
    const sel = [], p = [...uniq];
    for (let i = 0; i < n; i++) { const idx = r(p.length); sel.push(p.splice(idx, 1)[0]); }

    // уровни 3–4: скрываем два слова; первое слово списка не скрываем
    const hideCount = lvl.id >= 3 ? 2 : 1;
    // индексы скрытых слов — строго по порядку появления в списке
    const hidIdxs = shu([...Array(n).keys()].slice(1))
      .slice(0, hideCount)
      .sort((a, b) => a - b);
    const hidden = hidIdxs.map(i => sel[i]);   // в порядке, в котором их нужно назвать

    // варианты: все скрытые слова + случайные отвлекающие, всего 4
    const dis = shu(p).slice(0, 4 - hidden.length);
    const opts = shu([...hidden, ...dis]);

    return {
      type: 'memory',
      words: sel, hidden: hidden[0], hidIdxs,
      hiddenAll: hidden,
      opts,
      q: hidIdxs.length > 1
        ? 'Нажми пропущенные слова <b>в том порядке</b>, в каком они стояли'
        : 'Какое слово пропущено?'
    };
  }
};

function renderMem1() {
  const t = STATE.curTask;
  const lvl = getLvl();
  const secs = [5, 5, 4, 3][lvl.id - 1] + t.words.length;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Запомни слова</div>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:1rem 0">${
      t.words.map(w => `<span style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:9px 16px;font-size:18px;font-weight:600">${w}</span>`).join('')
    }</div>
    <div class="mem-cd" id="mem-cd">${secs}</div>
    <div style="font-size:14px;color:var(--text3);text-align:center">секунд на запоминание</div>`;

  clearInterval(STATE.memTimer);            // на случай повторного запуска
  let s = secs;
  STATE.memTimer = setInterval(() => {
    const el = document.getElementById('mem-cd');
    // ученик закрыл задание или перешёл к другому: тихо останавливаем таймер
    if (!el || STATE.curTask !== t) { clearInterval(STATE.memTimer); return; }
    s--;
    el.textContent = s;
    if (s <= 0) { clearInterval(STATE.memTimer); renderMem2(); }
  }, 1000);
}

function renderMem2() {
  const t = STATE.curTask;
  t.step = 0;                               // сколько скрытых слов уже угадано
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">${t.q}</div>
    <div class="task-vis" id="mem-line" style="font-size:18px;line-height:2.2"></div>
    <div class="opts">${t.opts.map((o, i) =>
      `<button class="opt" onclick="memPick(this,${i})">${o}</button>`
    ).join('')}</div>`;
  memDrawLine();
}

// Строка со словами: угаданные показываются жирным, остальные остаются «???»
function memDrawLine() {
  const t = STATE.curTask;
  const line = t.words.map((w, i) => {
    const k = t.hidIdxs.indexOf(i);
    if (k === -1) return w;
    return k < t.step ? `<b>${w}</b>` : '???';
  });
  document.getElementById('mem-line').innerHTML = line.join(' · ');
}

function memPick(btn, i) {
  const t = STATE.curTask;
  const picked = t.opts[i];
  const need = t.hiddenAll[t.step];         // слово, которое ждём сейчас

  // Ошибка: не то слово или нарушен порядок — задание завершено как неверное
  if (picked !== need) {
    checkAns(btn, picked, t.hiddenAll.join(' → '), true);
    return;
  }

  t.step++;
  memDrawLine();

  // Угадано не последнее слово: фиксируем кнопку и ждём следующее
  if (t.step < t.hiddenAll.length) {
    btn.disabled = true;
    btn.style.opacity = '.55';
    btn.textContent = '✓ ' + picked;
    return;
  }

  // Все слова нажаты в правильном порядке — задание выполнено
  checkAns(btn, picked, picked, true);
}
