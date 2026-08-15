import React from 'react';
import { Popover } from '@shared/ui/Popover';
import styles from './SkillsCatalogPopover.module.css';

import BusinessIcon from '../../../shared/assets/icons/common/icon_work.svg';
import HealthIcon from '../../../shared/assets/icons/common/icon_health.svg';
import DesignIcon from '../../../shared/assets/icons/common/icon_art.svg';
import HomeIcon from '../../../shared/assets/icons/common/icon_home.svg';
import LanguageIcon from '../../../shared/assets/icons/common/icon_earth.svg';
import PersonalDevelopmentIcon from '../../../shared/assets/icons/common/icon_book.svg';

export interface SkillsCatalogPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const categories = [
  {
    id: 1,
    name: 'Бизнес и карьера',
    icon: BusinessIcon,
    bgColor: 'var(--color-tag-business)',
    subcategories: [
      { id: 1, name: 'Управление командой' },
      { id: 2, name: 'Маркетинг и реклама' },
      //{ id: 3, name: "Продажи и переговоры" },
      ///{ id: 4, name: "Личный бренд" },
      //{ id: 5, name: "Резюме и собеседование" },
      //{ id: 6, name: "Тайм-менеджмент" },
      //{ id: 7, name: "Проектное управление" },
      //{ id: 8, name: "Предпринимательство" },
    ],
  },
  {
    id: 2,
    name: 'Иностранные языки',
    icon: LanguageIcon,
    bgColor: 'var(--color-tag-englih)',
    subcategories: [
      { id: 9, name: 'Английский' },
      //{ id: 10, name: "Французский" },
      //{ id: 11, name: "Испанский" },
      //{ id: 12, name: "Немецкий" },
      //{ id: 13, name: "Китайский" },
      //{ id: 14, name: "Японский" },
      //{ id: 15, name: "Подготовка к экзаменам (IELTS, TOEFL)" },
    ],
  },
  {
    id: 3,
    name: 'Дом и уют',
    icon: HomeIcon,
    bgColor: 'var(--color-tag-home)',
    subcategories: [
      { id: 16, name: 'Уборка и организация' },
      { id: 17, name: 'Домашние финансы' },
      //{ id: 18, name: "Приготовление еды" },
      //{ id: 19, name: "Домашние растения" },
      //{ id: 20, name: "Ремонт" },
      //{ id: 21, name: "Хранение вещей" },
    ],
  },
  {
    id: 4,
    name: 'Творчество и искусство',
    icon: DesignIcon,
    bgColor: 'var(--color-tag-creativity)',
    subcategories: [
      { id: 22, name: 'Рисование и иллюстрация' },
      { id: 23, name: 'Фотография' },
      //{ id: 24, name: "Видеомонтаж" },
      //{ id: 25, name: "Музыка и звук" },
      //{ id: 26, name: "Актёрское мастерство" },
      //{ id: 27, name: "Креативное письмо" },
      //{ id: 28, name: "Арт-терапия" },
      //{ id: 29, name: "Декор и DIY" },
    ],
  },
  {
    id: 5,
    name: 'Образование и развитие',
    icon: PersonalDevelopmentIcon,
    bgColor: 'var(--color-tag-education)',
    subcategories: [
      { id: 30, name: 'Личностное развитие' },
      { id: 31, name: 'Навыки обучения' },
      //{ id: 32, name: "Когнитивные техники" },
      //{ id: 33, name: "Скорочтение" },
      //{ id: 34, name: "Навыки преподавания" },
      //{ id: 35, name: "Коучинг" },
    ],
  },
  {
    id: 6,
    name: 'Здоровье и лайфстайл',
    icon: HealthIcon,
    bgColor: 'var(--color-tag-health)',
    subcategories: [
      //{ id: 36, name: "Йога и медитация" },
      //{ id: 37, name: "Питание и ЗОЖ" },
      //{ id: 38, name: "Ментальное здоровье" },
      //{ id: 39, name: "Осознанность" },
      { id: 40, name: 'Физические тренировки' },
      { id: 41, name: 'Сон и восстановление' },
      { id: 42, name: 'Баланс жизни и работы' },
    ],
  },
];

export const SkillsCatalogPopover: React.FC<SkillsCatalogPopoverProps> = ({
  isOpen,
  onClose,
  anchorRef,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      anchorRef={anchorRef}
      onClose={onClose}
      className={styles.popover_skill}
      offsetX={-450} // как смогла сдвинуть
      offsetY={20}
    >
      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryBlock}>
              <div className={styles.header}>
                <div className={styles.iconContainer} style={{ backgroundColor: category.bgColor }}>
                  <img src={category.icon} alt={category.name} className={styles.icon} />
                </div>
                <h2 className={styles.skill_title}>{category.name}</h2>
              </div>
              <div className={styles.subcategories}>
                {category.subcategories.map((subcat) => (
                  <div key={subcat.id} className={styles.subcategoryItem}>
                    {subcat.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Popover>
  );
};
