/* ═══════════════════════════════════════
   REGISTRY — all categories + sections
   Each category: { name, desc, icon, bg, fg, gen() }
   gen() returns a task object; complex tasks set task.type
═══════════════════════════════════════ */

const SECTIONS = [
  { label: 'Внимание — базовые',          cats: ['focus','grid_search','diff'] },
  { label: 'Таблицы Шульте',              cats: ['schulte5','schulte7','schulte_chaos'] },
  { label: 'Память',                      cats: ['grid_memory', 'memory'] },
  { label: 'Последовательности',          cats: ['pattern', 'matrix_logic', 'bongard'] }, 
  { label: 'Математика',                  cats: ['oral_math','sequence'] },
  { label: 'Межполушарное взаимодействие',cats: ['stroop','bihem_hand','bihem_match','bihem_seq'] },
  { label: 'Речь и словесное внимание',   cats: ['text_attn','anagram','speech_odd'] },
  { label: 'Мышление и логика',           cats: ['analogy','except'] },
];

/* CATS is populated by each category file */
const CATS = {};
