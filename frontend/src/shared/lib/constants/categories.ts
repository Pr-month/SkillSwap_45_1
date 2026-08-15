//тип + массив/объект, экспорт по именам
/* Бизнес и карьера
Творчество и искусство
Иностранные языки
Образование и развитие
Здоровье и лайфстайл
Дом и уют */

import type { Category } from '@shared/api/mock/types';

/* пример
export const SKILL_CATEGORIES = [...] as const;
export type TSkillCategory = typeof SKILL_CATEGORIES[number]; */

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Бизнес и карьера', color: '#ff0000' },
  { id: 2, name: 'Творчество и искусство', color: '#00ff00' },
  { id: 3, name: 'Иностранные языки', color: '#0000ff' },
  { id: 4, name: 'Образование и развитие', color: '#ffff00' },
  { id: 5, name: 'Здоровье и лайфстайл', color: '#00ffff' },
  { id: 6, name: 'Дом и уют', color: '#ff00ff' },
  { id: 7, name: 'Другое', color: '#012317' },
  { id: 8, name: 'Другое', color: '#689f8e' },
] as const;

export type TSkillCategory = (typeof CATEGORIES)[number];
