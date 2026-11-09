/* ═══════════════════════════════════════
   REGISTRY — all categories + sections
   Each category: { name, desc, icon, bg, fg, gen() }
   gen() returns a task object; complex tasks set task.type
═══════════════════════════════════════ */

const SECTIONS = [
  { label: 'Внимание — базовые',          cats: ['focus','grid_search','diff'] },
  { label: 'Таблицы Шульте',              cats: ['schulte5','schulte7','schulte_chaos'] },
  { label: 'Память',                      cats: ['grid_memory', 'memory', 'snowball'] },
  { label: 'Математика',                  cats: ['oral_math','sequence'] },
  { label: 'Последовательности',          cats: ['matrix_logic','pattern','bongard'] }, 
  { label: 'Межполушарное взаимодействие',cats: ['stroop','bihem_hand'] },
  { label: 'Речь и словесное внимание',   cats: ['text_attn','anagram','speech_odd'] },
  { label: 'Мышление и логика',           cats: ['analogy','except','bihem_match','bihem_seq'] },
];

/* CATS is populated by each category file */
const CATS = {};
