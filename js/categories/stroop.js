/* ── STROOP ── */
CATS.stroop = {
  name: 'Тест Струпа',
  desc: 'Определи цвет или значение слова',
  icon: '🎨',
  bg: '#eeedfe',
  fg: '#3c3489',

  gen() {
    const lvl = getLvl();


    /* ─────────────────────────────
       НАБОРЫ ЦВЕТОВ
       ───────────────────────────── */

    // Уровень 1 — 4 цвета
    const C4 = [
      'красный',
      'синий',
      'жёлтый',
      'зелёный'
    ];

    // Уровень 2 — 7 цветов
    const C7 = [
      ...C4,
      'оранжевый',
      'голубой',
      'фиолетовый'
    ];

    // Уровень 3 — 10 цветов
    const C10 = [
      ...C7,
      'розовый',
      'коричневый',
      'бордовый'
    ];

    // Уровень 4 — 12 цветов
    const C12 = [
      ...C10,
      'серый',
      'черный'
    ];


    /* ─────────────────────────────
       СТАНДАРТНЫЕ CSS-ЦВЕТА
       ───────────────────────────── */

    const K = {
      красный:     '#FF0000', // red
      синий:       '#0000FF', // blue
      жёлтый:      '#FFFF00', // yellow
      зелёный:     '#008000', // green

      оранжевый:   '#FFA500', // orange
      голубой:     '#00BFFF', // deep sky blue
      фиолетовый:  '#800080', // purple

      розовый:     '#FFC0CB', // pink
      коричневый:  '#A52A2A', // brown
      бордовый:    '#800000', // maroon

      серый:       '#808080', // gray
      черный:      '#000000'  // black
    };


    /* ─────────────────────────────
       ШРИФТЫ-ДИСТРАКТОРЫ
       Уровни 3–4
       ───────────────────────────── */

    const FONTS = [
      'Arial, sans-serif',
      'Georgia, serif',
      '"Courier New", monospace',
      '"Trebuchet MS", sans-serif',
      'Verdana, sans-serif',
      '"Times New Roman", serif'
    ];


    /* ─────────────────────────────
       ВЫБОР НАБОРА ПО УРОВНЮ
       ───────────────────────────── */

    let pool;

    if (lvl.id === 1) {
      pool = C4;
    }
    else if (lvl.id === 2) {
      pool = C7;
    }
    else if (lvl.id === 3) {
      pool = C10;
    }
    else {
      pool = C12;
    }


    /* ─────────────────────────────
       СЛОВО
       ───────────────────────────── */

    const word = pick(pool);


    /* ─────────────────────────────
       ЦВЕТ ШРИФТА

       10% — цвет совпадает со словом
       90% — цвет отличается
       ───────────────────────────── */

    const same = Math.random() < 0.10;

    const ink = same
      ? word
      : pick(
          pool.filter(color => color !== word)
        );


    /* ─────────────────────────────
       ТИП ВОПРОСА

       50% — определить цвет шрифта
       50% — определить значение слова
       ───────────────────────────── */

    const askInk = Math.random() < 0.5;

    const question = askInk
      ? 'Каким <b>цветом</b> написано слово?'
      : 'Какой <b>цвет обозначает</b> это слово?';

    const answer = askInk
      ? ink
      : word;


    /* ─────────────────────────────
       УРОВЕНЬ 3+
       СЛУЧАЙНЫЙ ШРИФТ
       ───────────────────────────── */

    const fontFamily = lvl.id >= 3
      ? pick(FONTS)
      : 'Arial, sans-serif';


    /* ─────────────────────────────
       УРОВЕНЬ 4
       ЦВЕТНОЙ ФОН-ДИСТРАКТОР
       ───────────────────────────── */

    let backgroundStyle = '';

    if (lvl.id >= 4) {

      /*
        В 10% случаев цвет фона
        совпадает с правильным ответом.

        В остальных 90% — отличается.
      */

      const bgSame = Math.random() < 0.10;

      const bgColorName = bgSame
        ? answer
        : pick(
            pool.filter(color => color !== answer)
          );

      /*
        Используем стандартный цвет,
        но делаем фон прозрачным,
        чтобы слово оставалось читаемым.

        "22" = небольшая прозрачность
        в HEX8.
      */

      backgroundStyle = `
        background:${K[bgColorName]}22;
        padding:18px 26px;
        border-radius:12px;
      `;
    }


    /* ─────────────────────────────
       РАЗМЕР СЛОВА
       ───────────────────────────── */

    let fontSize = 48;

    if (lvl.id === 2) {
      fontSize = 46;
    }

    if (lvl.id >= 3) {
      fontSize = 42;
    }


    /* ─────────────────────────────
       ВАРИАНТЫ ОТВЕТОВ

       Всегда 4 варианта.
       Правильный ответ гарантированно
       присутствует.
       ───────────────────────────── */

    const wrongAnswers = shu(
      pool.filter(color => color !== answer)
    ).slice(0, 3);

    const options = shu([
      answer,
      ...wrongAnswers
    ]);


    /* ─────────────────────────────
       РЕЗУЛЬТАТ
       ───────────────────────────── */

    return {
      q: question,

      vis: `
        <div style="
          display:inline-block;
          ${backgroundStyle}
        ">
          <span style="
            display:inline-block;
            font-size:${fontSize}px;
            font-family:${fontFamily};
            font-weight:700;
            color:${K[ink]};
          ">
            ${word}
          </span>
        </div>
      `,

      ans: answer,

      opts: options
    };
  }
};
