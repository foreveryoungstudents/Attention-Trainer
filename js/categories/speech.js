/* ── TEXT ATTENTION ── */
CATS.text_attn = {
  name: 'Внимание в тексте', desc: 'Найди нужные слова в тексте',
  icon: '📝', bg: '#f1efe8', fg: '#444441',
  gen() { return { type: 'text_attn' }; }
};

const TEXT_TASKS_ALL = [
  { par: 'Мама мыла раму. Рядом стояла кошка. Кошка смотрела в окно. За окном шёл дождь. Дождь барабанил по стеклу. Стекло запотело. Мама вытерла стекло тряпкой. Тряпка намокла. Кошка зевнула и ушла спать.', q: 'Нажми на все слова с буквой <b>о</b>', lvl: 1, test: w => w.replace(/[^а-яёА-ЯЁ]/g,'').toLowerCase().includes('о') },
  { par: 'Синий шар летел над городом. В городе жили добрые люди. Люди смотрели на небо. Небо было ясным и чистым. Чистый воздух приятно пах. Пахло цветами и травой.', q: 'Нажми на все <b>прилагательные</b> (признаки)', lvl: 1, test: w => ['синий','ясным','чистым','чистый','добрые'].includes(w.toLowerCase().replace(/[^а-яё]/g,'')) },
  { par: 'Пять котят сидели на крыше. Три котёнка были рыжими. Два котёнка были серыми. Все котята смотрели вниз. Один котёнок прыгнул вниз.', q: 'Нажми на все <b>числительные</b>', lvl: 1, test: w => ['пять','три','два','все','один'].includes(w.toLowerCase().replace(/[^а-яё]/g,'')) },
  { par: 'Весна пришла внезапно. Солнце стало греть сильнее. Птицы вернулись с юга. Деревья покрылись листьями. Дети вышли гулять на улицу. Воздух пах цветами и свежестью.', q: 'Нажми на все <b>глаголы</b> (действия)', lvl: 2, test: w => ['пришла','стало','вернулись','покрылись','вышли','пах'].includes(w.toLowerCase().replace(/[^а-яё]/g,'')) },
  { par: 'Река несла холодную воду в море. Рыбы плескались у берега. Берег был покрыт мелким песком. Песок блестел на солнце. Солнце клонилось к горизонту. Горизонт пылал красным.', q: 'Нажми на слова, которые встречаются <b>дважды</b>', lvl: 3, test: w => ['река','берег','песок','солнце','горизонт'].includes(w.toLowerCase().replace(/[^а-яё]/g,'')) },
  { par: 'Кот сидел на окне и смотрел на птиц. Птицы летали над садом. Сад был полон цветов. Цветы пахли медово. Мёд тёк из улья. Улей гудел на весь двор.', q: 'Нажми на все <b>существительные</b> (предметы)', lvl: 2, test: w => ['кот','окне','птиц','птицы','садом','саду','цветов','цветы','мёд','улья','улей','двор'].includes(w.toLowerCase().replace(/[^а-яё]/g,'')) },
];

function renderTextAttn() {
  const lvl = getLvl();
  const avail = TEXT_TASKS_ALL.filter(t => t.lvl <= lvl.id);
  const t = pick(avail.length ? avail : TEXT_TASKS_ALL);
  const words = t.par.split(/(\s+)/);
  const total = words.filter(w => t.test(w)).length;
  const html = words.map(w => {
    if (/^\s+$/.test(w) || !w.trim()) return w;
    return `<span class="tw" data-tgt="${t.test(w) ? 1 : 0}" onclick="twClick(this)">${w}</span>`;
  }).join('');
  document.getElementById('task-area').innerHTML = `
    <div class="task-q" style="font-size:16px">${t.q}</div>
    <div class="task-vis" style="text-align:left;font-size:17px;line-height:2.1">${html}</div>
    <div class="sc-info" id="txt-prog" style="margin-top:8px;font-size:14px">Найдено: 0 из ${total}</div>`;
  STATE.scratch = { total, found: 0, done: false };
}

function twClick(el) {
  if (el.classList.contains('hit') || STATE.scratch.done) return;
  if (el.dataset.tgt === '1') {
    el.classList.add('hit');
    STATE.scratch.found++;
    document.getElementById('txt-prog').textContent = `Найдено: ${STATE.scratch.found} из ${STATE.scratch.total}`;
    if (STATE.scratch.found >= STATE.scratch.total) {
      STATE.scratch.done = true;
      STATE.answered = true; STATE.scOk++; STATE.scTot++;
      updScore(); showFb(true, '');
      document.getElementById('nxt-btn').style.display = 'block';
      document.querySelectorAll('.tw:not(.hit)').forEach(e => { if (e.dataset.tgt === '1') e.classList.add('show'); });
    }
  } else {
    el.classList.add('mis');
    setTimeout(() => el.classList.remove('mis'), 400);
  }
}

/* ── ANAGRAM ── */
CATS.anagram = {
  name: 'Анаграммы', desc: 'Собери слово из перемешанных букв',
  icon: '🔤', bg: '#eeedfe', fg: '#3c3489',
  gen() {
    const lvl = getLvl();
    const words = [
      { w: 'КОТ',      h: 'Животное',   lvl: 1 },
      { w: 'ДОМ',      h: 'Здание',     lvl: 1 },
      { w: 'ЛИСТ',     h: 'У дерева',   lvl: 1 },
      { w: 'ЗАМОК',    h: 'Строение',   lvl: 2 },
      { w: 'КНИГА',    h: 'Читают',     lvl: 2 },
      { w: 'ОБЛАКО',   h: 'На небе',    lvl: 2 },
      { w: 'ДЕРЕВО',   h: 'В лесу',     lvl: 2 },
      { w: 'ЦВЕТОК',   h: 'Растение',   lvl: 2 },
      { w: 'КОРАБЛЬ',  h: 'В море',     lvl: 3 },
      { w: 'ГИТАРА',   h: 'Инструмент', lvl: 3 },
      { w: 'ФОНАРЬ',   h: 'Светит',     lvl: 3 },
      { w: 'КРОЛИК',   h: 'Животное',   lvl: 3 },
      { w: 'РАКЕТА',   h: 'В космос',   lvl: 3 },
      { w: 'ТЕТРАДЬ',  h: 'Пишут',      lvl: 4 },
      { w: 'КАРАНДАШ', h: 'Пишут им',   lvl: 4 },
      { w: 'ПЛАНЕТА',  h: 'В космосе',  lvl: 4 },
      { w: 'БИБЛИОТЕКА', h: 'Много книг', lvl: 4 },
    ];
    const avail = words.filter(x => x.lvl <= lvl.id);
    const { w, h } = pick(avail);
    return { type: 'anagram', word: w, letters: shu(w.split('')), hint: h };
  }
};

function renderAnagram() {
  const t = STATE.curTask;
  STATE.scratch = { answer: [] };

  function refresh() {
    const ans = STATE.scratch.answer;
    const tileHTML = t.letters.map((l, i) =>
      `<div class="ana-tile${ans.includes(i) ? ' used' : ''}" onclick="anaClick(${i})">${l}</div>`
    ).join('');
    const slotHTML = ans.length
      ? ans.map(idx => `<div class="ana-slot" onclick="anaRm(${idx})" title="убрать">${t.letters[idx]}</div>`).join('')
      : `<div style="color:var(--text3);font-size:14px;align-self:center;padding:4px">нажимай буквы</div>`;
    document.getElementById('ana-tiles').innerHTML = tileHTML;
    document.getElementById('ana-slots').innerHTML = slotHTML;
    if (!STATE.answered && ans.map(i => t.letters[i]).join('') === t.word) {
      STATE.answered = true; stopTimer(); STATE.scOk++; STATE.scTot++;
      updScore(); showFb(true, t.word);
      document.getElementById('nxt-btn').style.display = 'block';
    }
  }
  window.anaClick = i => { if (!STATE.scratch.answer.includes(i)) { STATE.scratch.answer.push(i); refresh(); } };
  window.anaRm = i => { STATE.scratch.answer = STATE.scratch.answer.filter(x => x !== i); refresh(); };

  document.getElementById('task-area').innerHTML = `
    <div class="task-q">Составь слово из букв<br><span style="font-size:14px;color:var(--text2)">Подсказка: ${t.hint}</span></div>
    <div class="anagram-letters" id="ana-tiles"></div>
    <div class="anagram-answer" id="ana-slots"></div>
    <div style="text-align:center;margin-top:8px"><button class="btn-sm" onclick="anaReset()">Сбросить</button></div>`;
  window.anaReset = () => { STATE.scratch.answer = []; refresh(); };
  refresh();
  startTimer(50);
}

/* ── SPEECH ODD ── */
CATS.speech_odd = {
  name: 'Лишнее слово', desc: 'Найди слово, лишнее по смыслу',
  icon: '🚫', bg: '#faece7', fg: '#712b13',
  gen() {
    const lvl = getLvl();
    const groups = [
      { items:['кошка','собака','лиса','ромашка','волк'], odd:'ромашка', reason:'Не животное', lvl:1 },
      { items:['январь','февраль','среда','март','апрель'], odd:'среда', reason:'День недели', lvl:1 },
      { items:['молоко','кефир','сок','йогурт','сметана'], odd:'сок', reason:'Не молочный', lvl:1 },
      { items:['красный','синий','тяжёлый','зелёный','жёлтый'], odd:'тяжёлый', reason:'Не цвет', lvl:2 },
      { items:['роза','тюльпан','лилия','дуб','ромашка'], odd:'дуб', reason:'Не цветок', lvl:2 },
      { items:['Москва','Лондон','Париж','Нева','Берлин'], odd:'Нева', reason:'Река, не город', lvl:2 },
      { items:['яблоко','груша','морковь','слива','вишня'], odd:'морковь', reason:'Не фрукт', lvl:2 },
      { items:['скрипка','пианино','гитара','флейта','барабан'], odd:'флейта', reason:'Духовой', lvl:3 },
      { items:['самолёт','поезд','пароход','велосипед','ракета'], odd:'велосипед', reason:'Без мотора', lvl:3 },
      { items:['Толстой','Пушкин','Чехов','Репин','Достоевский'], odd:'Репин', reason:'Художник', lvl:3 },
      { items:['вирус','бактерия','грибок','таблетка','паразит'], odd:'таблетка', reason:'Не микроорганизм', lvl:4 },
      { items:['нейтрон','протон','электрон','атом','фотон'], odd:'атом', reason:'Не элементарная частица', lvl:4 },
    ];
    const avail = groups.filter(g => g.lvl <= lvl.id);
    const g = pick(avail);
    return { q: 'Найди <b>лишнее</b> слово', type:'speech_odd', items: shu(g.items), odd: g.odd, reason: g.reason };
  }
};
