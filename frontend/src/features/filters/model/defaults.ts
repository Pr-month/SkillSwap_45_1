import type { Option } from '@shared/types';

export const SKILL_TYPE: Option[] = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
];

export const GENDER: Option[] = [
  { value: 'all', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

export type TSkillType = (typeof SKILL_TYPE)[number];
export type TGender = (typeof GENDER)[number];
