import { type FC, useState } from 'react';
import clsx from 'clsx';
import { FavoriteToggle } from '@shared/ui/favorite-toggle';
import styles from './LikesCounter.module.css';

export interface LikesCounterProps {
  isActive?: boolean;
  likesCount?: number;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  showCount?: boolean;
}

export const LikesCounter: FC<LikesCounterProps> = ({
  showCount = false,
  isActive: externalIsActive,
  likesCount: externalLikesCount,
  onClick: externalOnClick,
  className,
  'aria-label': ariaLabel,
}) => {
  // Внутреннее состояние для работы без внешнего управления
  const [internalIsActive, setInternalIsActive] = useState(false);
  const [internalLikesCount, setInternalLikesCount] = useState(externalLikesCount || 0);

  // Используем внешние значения, если они переданы, иначе внутренние
  const isActive = externalIsActive !== undefined ? externalIsActive : internalIsActive;
  const likesCount = externalLikesCount !== undefined ? externalLikesCount : internalLikesCount;

  const handleToggle = () => {
    if (externalOnClick) {
      // Если передан внешний обработчик, используем его
      externalOnClick();
    } else {
      // Иначе используем внутреннюю логику
      const newIsActive = !internalIsActive;
      setInternalIsActive(newIsActive);
      setInternalLikesCount((prev) => (newIsActive ? prev + 1 : prev - 1));
    }
  };
  return (
    <div className={clsx(styles.likesContainer, className)}>
      {showCount && (
        <span className={clsx(styles.likesCount, isActive && styles.active)}>{likesCount}</span>
      )}
      <FavoriteToggle
        isActive={isActive}
        onClick={handleToggle}
        aria-label={ariaLabel || 'Добавить в избранное'}
      />
    </div>
  );
};
