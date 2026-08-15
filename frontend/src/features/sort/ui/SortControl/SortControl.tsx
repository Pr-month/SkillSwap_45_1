import React from 'react';
import { Button } from '@shared/ui/Button';
import iconSort from '@shared/assets/icons/ui/icon_sort.svg';
import styles from './SortControl.module.css';

export type SortDirection = 'desc' | 'asc';

export interface SortControlProps {
  value: SortDirection;
  onChange: (value: SortDirection) => void;
  className?: string;
}

const LABELS: Record<SortDirection, string> = {
  desc: 'Сначала новые',
  asc: 'Сначала старые',
};

/**
 * UI-компонент сортировки: кнопка «Сначала новые / Сначала старые» со стрелками.
 * При клике переключает направление и вызывает onChange с новым значением.
 */
export const SortControl: React.FC<SortControlProps> = ({ value, onChange, className }) => {
  const handleClick = () => {
    const next: SortDirection = value === 'desc' ? 'asc' : 'desc';
    onChange(next);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className={`${styles.sortControl} ${className ?? ''}`.trim()}
      onClick={handleClick}
      aria-label={`Сортировка: ${LABELS[value]}. Нажмите для переключения`}
    >
      <img src={iconSort} alt="" aria-hidden className={styles.icon} />
      <span className={styles.label}>{LABELS[value]}</span>
    </Button>
  );
};
