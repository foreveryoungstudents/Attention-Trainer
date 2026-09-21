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
       ЦВЕТА ПО УРОВНЯМ
       ───────────────────────────── */

    const C4 = [
      'красный',
      'синий',
      'жёлтый',
      'зелёный'
    ];

    const C7 = [
      ...C4,
      'оранжевый',
      'голубой',
      'фиолетовый'
    ];

    const C10 = [
      ...C7,
      'розовый',
      'коричневый',
      'бордовый'
    ];

    const C12 = [
      ...C10,
      'серый',
      'чёрный'
    ];


    /* ─────────────────────────────
       СТАНДАРТНЫЕ ЦВЕТА
       ───────────────────────────── */

    const K = {
      красный:     '#FF0000',
      синий:       '#0000FF',
      жёлтый:      '#FFFF00',
      зелёный:     '#008000',

      оранжевый:   '#FFA500',
      голубой:     '#00BFFF',
      фиолетовый:  '#800080',

      розовый:     '#FFC0CB',
      коричневый:  '#A52A2A',
      бордовый:    '#800000',

      серый:       '#808080',
      чёрный:      '#000000'
    };


    /* ─────────────────────────────
       ШРИФТЫ ДЛЯ 3–4 УРОВНЯ

       Специально выбраны максимально
       визуально разные системные шрифты.
       ───────────────────────────── */

    const FONTS = [
      {
        family: 'Arial, sans-serif',
        weight: '700'
      },
      {
        family: 'Georgia, serif',
        weight: '700'
      },
      {
        family: '"Courier New", monospace',
        weight: '700'
      },
      {
        family: 'Impact, sans-serif',
        weight: '400'
      },
      {
        family: '"Times New Roman", serif',
        weight: '700'
      },
      {
        family: '"Comic Sans MS", cursive',
        weight: '700'
      }
    ];


    /* ─────────────────────────────
       НАБОР ЦВЕТОВ
       ───────────────────────────── */

    let pool;

    switch (lvl.id) {
      case 1:
        pool = C4;
        break;

      case 2:
        pool = C7;
        break;

      case 3:
        pool = C10;
        break;

      default:
        pool = C12;
        break;
    }


    /* ─────────────────────────────
       СЛОВО
       ───────────────────────────── */

    const word = pick(pool);


    /* ─────────────────────────────
       ЦВЕТ ШРИФТА

       10% — совпадает со словом
       90% — отличается
       ───────────────────────────── */

    const wordInkMatch = Math.random() < 0.10;

    const ink = wordInkMatch
      ? word
      : pick(
          pool.filter(c => c !== word)
        );


    /* ─────────────────────────────
       ТИП ВОПРОСА — 50 / 50
       ───────────────────────────── */

    const askInk = Math.random() < 0.5;

    const question = askInk
      ? 'Каким <b>цветом</b> написано слово?'
      : 'Какой <b>цвет обозначает</b> это слово?';


    /* ─────────────────────────────
       ПРАВИЛЬНЫЙ ОТВЕТ
       ───────────────────────────── */

    const answer = askInk
      ? ink
      : word;


    /* ─────────────────────────────
       ШРИФТ

       1–2 уровни — обычный Arial
       3–4 уровни — случайный шрифт
       ───────────────────────────── */

    const font = lvl.id >= 3
      ? pick(FONTS)
      : {
          family: 'Arial, sans-serif',
          weight: '700'
        };


    /* ─────────────────────────────
       РАЗМЕР
       ───────────────────────────── */

    const fontSize =
      lvl.id === 1 ? 48 :
      lvl.id === 2 ? 46 :
      42;


    /* ─────────────────────────────
       УРОВЕНЬ 4 — ФОН
       ───────────────────────────── */

    let backgroundHtmlStart = '';
    let backgroundHtmlEnd = '';

    if (lvl.id >= 4) {

      /*
        В 10% случаев фон совпадает
        с правильным ответом.

        В 90% — другой цвет.
      */

      const backgroundMatchesAnswer =
        Math.random() < 0.10;

      const bgName = backgroundMatchesAnswer
        ? answer
        : pick(
            pool.filter(c => c !== answer)
          );

      const bgColor = K[bgName];


      /*
        Цветной внешний фон остаётся
        хорошо заметным.

        Белая полупрозрачная внутренняя
        подложка нужна, чтобы красный,
        жёлтый, голубой и другие цвета
        текста всегда оставались читаемыми.
      */

      backgroundHtmlStart = `
        <div style="
          display:inline-flex;
          align-items:center;
          justify-content:center;

          min-width:260px;
          min-height:105px;

          padding:16px 24px;

          background-color:${bgColor} !important;

          border-radius:14px;
          box-sizing:border-box;
        ">
          <div style="
            display:inline-flex;
            align-items:center;
            justify-content:center;

            padding:8px 14px;

            background:rgba(255,255,255,0.82);

            border-radius:8px;
          ">
      `;

      backgroundHtmlEnd = `
          </div>
        </div>
      `;
    }


    /* ─────────────────────────────
       САМО СЛОВО
       ───────────────────────────── */

    const wordHtml = `
      <span style="
        display:inline-block;

        font-family:${font.family} !important;
        font-weight:${font.weight} !important;
        font-size:${fontSize}px !important;

        line-height:1.15;

        color:${K[ink]} !important;
      ">
        ${word}
      </span>
    `;


    /* ─────────────────────────────
       VIS
       ───────────────────────────── */

    const vis = lvl.id >= 4
      ? `
          ${backgroundHtmlStart}
            ${wordHtml}
          ${backgroundHtmlEnd}
        `
      : wordHtml;


    /* ─────────────────────────────
       ВАРИАНТЫ ОТВЕТОВ

       Всегда 4 кнопки.
       Гарантированно попадают:
         - правильный ответ (answer)
         - цвет чернил (ink) — самый заметный
           "отвлекающий" вариант на всех уровнях
         - слово-значение (word) — второй
           "острый" вариант
       Остальное — случайные филлеры до 4 штук.
       Работает одинаково на уровнях 1–4:
       на уровне 1 (пул из 4 цветов) заполнит
       все 4 кнопки гарантированными + филлером,
       на уровнях 2–4 — гарантированные + случайные.
       ───────────────────────────── */

    const guaranteed = new Set([answer, ink, word]);

    const fillers = shu(
      pool.filter(c => !guaranteed.has(c))
    );

    let fi = 0;
    while (guaranteed.size < 4 && fi < fillers.length) {
      guaranteed.add(fillers[fi]);
      fi++;
    }

    const options = shu([...guaranteed]);


    /* ─────────────────────────────
       РЕЗУЛЬТАТ
       ───────────────────────────── */

    return {
      q: question,
      vis: vis,
      ans: answer,
      opts: options
    };
  }
};
