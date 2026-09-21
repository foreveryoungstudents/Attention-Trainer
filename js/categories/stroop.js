/* ── STROOP ── */
CATS.stroop = {
  name: 'Тест Струпа', desc: 'Назови цвет, игнорируя слово',
  icon: '🎨', bg: '#eeedfe', fg: '#3c3489',
  gen() {
    const lvl = getLvl();
    const C4 = ['красный','синий','зелёный','жёлтый'];
    const C6 = [...C4, 'фиолетовый','оранжевый'];
    const K = { красный:'#d85a30', синий:'#378add', зелёный:'#639922', жёлтый:'#ba7517', фиолетовый:'#6d4aaa', оранжевый:'#d4700a' };
    const pool = lvl.id >= 3 ? C6 : C4;
    const w = pick(pool), ink = pick(pool.filter(c => c !== w));
    const distract = lvl.id === 4; // extra wrong word shown in grey
    const extraHtml = distract
      ? `<div style="font-size:16px;color:var(--text3);margin-top:8px">(отвлечение: <span style="color:${K[pick(pool.filter(c=>c!==w&&c!==ink))]}">фон</span>)</div>`
      : '';
    return {
      q: 'Какого <b>цвета</b> написано слово?',
      vis: `<span style="font-size:${lvl.id >= 3 ? 42 : 48}px;font-weight:700;color:${K[ink]}">${w}</span>${extraHtml}`,
      ans: ink, opts: shu([...pool]).slice(0, 4)
    };
  }
};
