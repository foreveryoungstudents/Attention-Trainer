/* ═══════════════════════════════════════
   REGISTRY — all categories + sections
   Each category: { name, desc, icon, bg, fg, gen() }
   gen() returns a task object; complex tasks set task.type
═══════════════════════════════════════ */

const SECTIONS = [
  { label: 'Гибкость',                   cats: ['bihem_hand','stroop'] },
  { label: 'Внимание',                   cats: ['schulte5','focus','grid_search','diff'] },
  { label: 'Память',                      cats: ['grid_memory', 'memory', 'snowball'] },
  { label: 'Речь и словесное внимание',   cats: ['tongue','anagram'] },
  { label: 'Математика',                  cats: ['oral_math','sequence'] },
  { label: 'Последовательности',          cats: ['matrix_logic','pattern','bongard'] }, 
  { label: 'Мышление и логика',           cats: ['text_recall','analogy','speech_odd'] },
];

/* CATS is populated by each category file */
const CATS = {};
