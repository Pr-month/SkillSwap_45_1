import React, { useEffect, useRef, useState } from 'react';
import styles from './UserCardSection.module.css';
import { UserCard, type UserCardProps } from '@entities/user/ui/user-card';
import { Button } from '@shared/ui/Button';

export interface UserCardSectionProps {
  title?: string;
  items: Array<UserCardProps & { id: string | number }>;
  variant?: 'row' | 'grid';
  limit?: number;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
  renderHeader?: boolean;
  cardListClassName?: string; // добавили новый проп для управления со страницы
  showNavigation?: boolean; // добавили новый проп для показа кнопок навигации
  allGrid?: boolean; // добавили проп для фильтрованных карточек
}

// Иконка стрелки > (оптимизированный SVG)
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" fill="none">
    <path
      fill="#253017"
      d="M.69 16a.685.685 0 0 1-.49-.203.696.696 0 0 1 0-.978l6.018-6.017a1.136 1.136 0 0 0 0-1.606L.2 1.179A.696.696 0 0 1 .2.2a.696.696 0 0 1 .978 0l6.017 6.017c.47.47.738 1.107.738 1.78 0 .675-.258 1.311-.738 1.782l-6.017 6.017a.725.725 0 0 1-.49.203Z"
    />
  </svg>
);

// Иконка стрелки влево
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.20677 13.3327C9.32366 13.3327 9.44056 13.2896 9.53284 13.1973C9.71126 13.0189 9.71126 12.7236 9.53284 12.5452L5.5215 8.53384C5.22619 8.23852 5.22619 7.75864 5.5215 7.46332L9.53284 3.45198C9.71126 3.27356 9.71126 2.97825 9.53284 2.79983C9.35442 2.62141 9.05911 2.62141 8.88069 2.79983L4.86935 6.81117C4.55558 7.12494 4.37716 7.54946 4.37716 7.99858C4.37716 8.4477 4.5494 8.87222 4.86935 9.18599L8.88069 13.1973C8.97298 13.2835 9.08987 13.3327 9.20677 13.3327Z"
      fill="currentColor"
    />
  </svg>
);

// Иконка стрелки вправо
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.79323 13.3327C5.67634 13.3327 5.55944 13.2896 5.46716 13.1973C5.28874 13.0189 5.28874 12.7236 5.46716 12.5452L9.4785 8.53384C9.77381 8.23852 9.77381 7.75864 9.4785 7.46332L5.46716 3.45198C5.28874 3.27356 5.28874 2.97825 5.46716 2.79983C5.64558 2.62141 5.94089 2.62141 6.11931 2.79983L10.1307 6.81117C10.4444 7.12494 10.6228 7.54946 10.6228 7.99858C10.6228 8.4477 10.4506 8.87222 10.1307 9.18599L6.11931 13.1973C6.02702 13.2835 5.91013 13.3327 5.79323 13.3327Z"
      fill="currentColor"
    />
  </svg>
);

export const UserCardSection: React.FC<UserCardSectionProps> = ({
  title,
  items,
  variant: initialVariant = 'row',
  limit = 3,
  actionLabel = '',
  onActionClick,
  className = '',
  renderHeader = true,
  cardListClassName, // добавили новый проп для управления со страницы
  showNavigation = false, // по умолчанию отключено
  allGrid = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // Состояние для управления режимом отображения
  const [currentVariant, setCurrentVariant] = useState<'row' | 'grid'>(initialVariant);
  const [isExpanded, setIsExpanded] = useState(false);

  // Определяем, какие элементы показывать
  const displayedItems = currentVariant === 'row' ? items.slice(0, limit) : items;

  const buttonLabel = isExpanded && !allGrid ? 'Свернуть' : actionLabel;

  const handleActionClick = () => {
    if (isExpanded && !allGrid) {
      // Если развернуто - сворачиваем обратно в row режим
      setCurrentVariant('row');
      setIsExpanded(false);
    } else {
      // Если свернуто - переключаем в grid режим
      setCurrentVariant('grid');
      setIsExpanded(true);
    }

    // Вызываем внешний обработчик, если он предоставлен
    if (onActionClick) {
      onActionClick();
    }
  };

  // Функция для проверки видимости кнопок навигации
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px запас
    }
  };
  // Функции для прокрутки
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -338, // ширина прокрутки
        behavior: 'smooth',
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 338, // ширина прокрутки
        behavior: 'smooth',
      });
    }
  };

  // Синхронизируем внутреннее состояние с пропсом variant
  useEffect(() => {
    setCurrentVariant(initialVariant);
    setIsExpanded(initialVariant === 'grid');
  }, [initialVariant]);

  // Добавляем обработчик скролла
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && showNavigation && currentVariant === 'row') {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [showNavigation, currentVariant, displayedItems]);

  return (
    <section className={`${styles.section} ${className}`}>
      {renderHeader && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>

          {onActionClick && (
            <Button variant="ghost" onClick={handleActionClick} className={styles.actionButton}>
              <span className={styles.buttonContent}>
                {buttonLabel}
                <ArrowIcon />
              </span>
            </Button>
          )}
        </div>
      )}

      {displayedItems.length > 0 && (
        <div className={styles.cardsContainer}>
          {showNavigation && currentVariant === 'row' && showLeftButton && (
            <Button
              variant="ghost"
              onClick={scrollLeft}
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              aria-label="Прокрутить влево"
            >
              <ArrowLeftIcon />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className={`${cardListClassName} ${currentVariant === 'grid' ? styles.grid : styles.row} ${showNavigation && currentVariant === 'row' ? styles.scrollable : ''}`}
          >
            {displayedItems.map(({ id, ...cardProps }) => (
              <UserCard key={id} {...cardProps} />
            ))}
          </div>

          {showNavigation && currentVariant === 'row' && showRightButton && (
            <Button
              variant="ghost"
              onClick={scrollRight}
              className={`${styles.navButton} ${styles.navButtonRight}`}
              aria-label="Прокрутить вправо"
            >
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
