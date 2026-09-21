/* ── ANALOGY ── */
CATS.analogy = {
  name: 'Аналогии', desc: 'Реши словесную аналогию',
  icon: '⚖️', bg: '#eaf3de', fg: '#27500a',
  gen() {
    const lvl = getLvl();
    const tasks = [
      { a:'птица',b:'перья',c:'рыба',ans:'чешуя',w:['плавники','вода','хвост'],lvl:1 },
      { a:'день',b:'солнце',c:'ночь',ans:'луна',w:['темнота','звёзды','сон'],lvl:1 },
      { a:'нож',b:'резать',c:'кисть',ans:'рисовать',w:['краска','художник','мазок'],lvl:1 },
      { a:'учитель',b:'школа',c:'врач',ans:'больница',w:['лекарство','пациент','белый'],lvl:2 },
      { a:'автомобиль',b:'бензин',c:'человек',ans:'еда',w:['энергия','ходить','движение'],lvl:2 },
      { a:'глаза',b:'видеть',c:'уши',ans:'слышать',w:['голова','звук','орган'],lvl:2 },
      { a:'книга',b:'читать',c:'музыка',ans:'слушать',w:['петь','звучать','концерт'],lvl:2 },
      { a:'художник',b:'картина',c:'писатель',ans:'книга',w:['текст','буква','рассказ'],lvl:3 },
      { a:'дерево',b:'лес',c:'дом',ans:'город',w:['улица','здание','крыша'],lvl:3 },
      { a:'зима',b:'снег',c:'лето',ans:'жара',w:['солнце','отпуск','пляж'],lvl:3 },
      { a:'термометр',b:'температура',c:'манометр',ans:'давление',w:['газ','труба','насос'],lvl:4 },
      { a:'глагол',b:'действие',c:'существительное',ans:'предмет',w:['слово','буква','часть'],lvl:4 },
      { a:'центр',b:'окружность',c:'фокус',ans:'эллипс',w:['парабола','кривая','точка'],lvl:4 },
    ];
    const avail = tasks.filter(t => t.lvl <= lvl.id);
    const t = pick(avail);
    return {
      q: 'Продолжи по аналогии',
      vis: `<div class="analogy-parts">
        <span class="a-kw">${t.a}</span><span class="a-rel">→</span>
        <span class="a-kw">${t.b}</span><span class="a-rel">=</span>
        <span class="a-kw">${t.c}</span><span class="a-rel">→</span>
        <span class="a-q">?</span>
      </div>`,
      ans: t.ans, opts: shu([t.ans, ...t.w.slice(0,3)])
    };
  }
};

/* ── EXCEPT ── */
CATS.except = {
  name: '4-й лишний', desc: 'Найди предмет, не входящий в группу',
  icon: '❌', bg: '#fbeaf0', fg: '#72243e',
  gen() {
    const lvl = getLvl();
    const sets = [
      { items:['волк','тигр','лиса','орёл'],          odd:'орёл',    why:'Птица', lvl:1 },
      { items:['2','4','6','9'],                        odd:'9',       why:'Нечётное', lvl:1 },
      { items:['суп','каша','борщ','чай'],             odd:'чай',     why:'Напиток', lvl:1 },
      { items:['молоток','пила','гвоздь','отвёртка'],  odd:'гвоздь',  why:'Не инструмент', lvl:2 },
      { items:['Луна','Марс','Венера','Комета'],        odd:'Комета',  why:'Не планета', lvl:2 },
      { items:['берёза','ель','сосна','рябина'],        odd:'ель',     why:'Хвойное', lvl:2 },
      { items:['Пушкин','Толстой','Чехов','Репин'],    odd:'Репин',   why:'Художник', lvl:2 },
      { items:['флейта','скрипка','виолончель','труба'],odd:'труба',  why:'Духовой', lvl:3 },
      { items:['Амазонка','Нил','Байкал','Волга'],     odd:'Байкал',  why:'Озеро', lvl:3 },
      { items:['квадрат','круг','треугольник','куб'],  odd:'куб',     why:'3D-фигура', lvl:3 },
      { items:['вирус','бактерия','грибок','антибиотик'],odd:'антибиотик',why:'Не микроорганизм',lvl:4 },
      { items:['5','7','11','9'],                       odd:'9',       why:'Не простое число', lvl:4 },
      { items:['Эйнштейн','Ньютон','Дарвин','Рафаэль'],odd:'Рафаэль', why:'Художник, не учёный', lvl:4 },
    ];
    const avail = sets.filter(s => s.lvl <= lvl.id);
    const s = pick(avail);
    return { q: 'Найди <b>лишний</b> предмет', type:'except', items: shu(s.items), odd: s.odd, why: s.why };
  }
};

/* ── MATRIX LOGIC ── */
CATS.matrix_logic = {
  name: 'Матрица', desc: 'Логическая задача на внимание',
  icon: '🔲', bg: '#e6f1fb', fg: '#0c447c',
  gen() {
    const lvl = getLvl();
    const td = (c, extra='') =>
      `<td style="border:1px solid var(--border2);padding:12px;width:58px;text-align:center;${extra}">${c}</td>`;
    const blankStyle = 'background:var(--surface2);font-size:16px;color:var(--text3)';

    const tasks = [
      // Level 1-2
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:22px"><tr>${td('🔴')}${td('🔵')}${td('🟢')}</tr><tr>${td('🔵')}${td('🟢')}${td('🔴')}</tr><tr>${td('🟢')}${td('🔴')}${td('?',blankStyle)}</tr></table>`, q:'Что в правом нижнем углу?', ans:'🔵', opts:['🔵','🔴','🟢','🟡'], lvl:1 },
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:20px;font-weight:600"><tr>${td('A')}${td('B')}${td('C')}</tr><tr>${td('D')}${td('E')}${td('F')}</tr><tr>${td('G')}${td('?',blankStyle)}${td('I')}</tr></table>`, q:'Какая буква пропущена?', ans:'H', opts:['H','J','G','K'], lvl:1 },
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:20px;font-weight:600"><tr>${td('1')}${td('2')}${td('3')}</tr><tr>${td('4')}${td('5')}${td('6')}</tr><tr>${td('7')}${td('8')}${td('?',blankStyle)}</tr></table>`, q:'Какое число в правом нижнем углу?', ans:'9', opts:['9','10','8','7'], lvl:1 },
      // Level 2+: row/col sums
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:18px;font-weight:600"><tr>${td('1')}${td('2')}${td('3')}</tr><tr>${td('4')}${td('5')}${td('6')}</tr><tr>${td('7')}${td('?',blankStyle)}${td('9')}</tr></table>`, q:'Найди число (строки/столбцы считаются по порядку)', ans:'8', opts:['8','7','9','6'], lvl:2 },
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:22px"><tr>${td('△')}${td('△△')}${td('△△△')}</tr><tr>${td('○')}${td('○○')}${td('○○○')}</tr><tr>${td('□')}${td('?',blankStyle)}${td('□□□')}</tr></table>`, q:'Что пропущено?', ans:'□□', opts:['□□','□','□□□','△△'], lvl:2 },
      // Level 3+: 4x4 matrix
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:18px;font-weight:600"><tr>${td('2')}${td('4')}${td('6')}${td('8')}</tr><tr>${td('3')}${td('6')}${td('9')}${td('12')}</tr><tr>${td('4')}${td('8')}${td('12')}${td('16')}</tr><tr>${td('5')}${td('10')}${td('?',blankStyle)}${td('20')}</tr></table>`, q:'Число в строке 4, столбце 3?', ans:'15', opts:['15','14','16','12'], lvl:3 },
      // Level 4: complex pattern
      { vis:`<table style="border-collapse:collapse;margin:0 auto;font-size:18px;font-weight:600"><tr>${td('1')}${td('1')}${td('2')}</tr><tr>${td('1')}${td('2')}${td('3')}</tr><tr>${td('2')}${td('3')}${td('?',blankStyle)}</tr></table>`, q:'Правило: каждое число = сумма двух левых/верхних. Что пропущено?', ans:'5', opts:['5','4','6','7'], lvl:4 },
    ];
    const avail = tasks.filter(t => t.lvl <= lvl.id);
    const t = pick(avail);
    return { q: t.q, vis: t.vis, ans: t.ans, opts: shu(t.opts) };
  }
};

/* ── Exception/speech renderer (shared) ── */
function renderExc() {
  const t = STATE.curTask;
  const odd = t.odd;
  const why = t.reason || t.why;
  document.getElementById('task-area').innerHTML = `
    <div class="task-q">${t.q}</div>
    <div class="exc-box">${t.items.map(w =>
      `<div class="exc-item" onclick="excClick(this,'${esc(w)}','${esc(odd)}','${esc(why)}')">${w}</div>`
    ).join('')}</div>`;
  startTimer(30);
}

function excClick(el, val, odd, why) {
  if (STATE.answered) return;
  STATE.answered = true; stopTimer(); STATE.scTot++;
  const ok = val === odd; if (ok) STATE.scOk++;
  el.classList.add(ok ? 'ok' : 'no');
  document.querySelectorAll('.exc-item').forEach(b => {
    b.onclick = null;
    if (b.textContent === odd) b.classList.add('ok');
  });
  const fb = document.getElementById('fb');
  fb.style.display = 'block'; fb.className = 'feedback ' + (ok ? 'ok' : 'no');
  fb.textContent = (ok ? '✓ Верно! ' : '✗ Лишнее: ' + odd + '. ') + why;
  updScore();
  document.getElementById('nxt-btn').style.display = 'block';
}
