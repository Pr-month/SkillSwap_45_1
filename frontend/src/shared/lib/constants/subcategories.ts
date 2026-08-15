import type { Option } from '@shared/types';

type SubCategoriesOption = {
  [key: number]: Option[];
};

export const SUBCATEGORIES: SubCategoriesOption = {
  1: [
    { value: '1', label: 'Бизнес' },
    { value: '2', label: 'Карьера' },
  ],
  2: [
    { value: '3', label: 'Английский' },
    { value: '4', label: 'Немецкий' },
  ],
  3: [
    { value: '5', label: 'Дом' },
    { value: '6', label: 'Уют' },
  ],
  4: [
    { value: '7', label: 'Творчество' },
    { value: '8', label: 'Искусство' },
  ],
  5: [
    { value: '9', label: 'Образование' },
    { value: '10', label: 'Развитие' },
  ],
  6: [
    { value: '11', label: 'Здоровье' },
    { value: '12', label: 'Лайфстайл' },
  ],
  7: [
    { value: '13', label: 'Другое' },
    { value: '14', label: 'Другое' },
  ],
  8: [
    { value: '15', label: 'Другое' },
    { value: '16', label: 'Другое' },
  ],
} as const;

export type TSubCategory = (typeof SUBCATEGORIES)[number];
