import React, { useState, useMemo } from 'react';
import styles from './ImageGallery.module.css';
import type { SkillImage } from '@shared/api/mock/types';

export interface ImageGalleryProps {
  /** Массив изображений */
  images: SkillImage[];
  /** Вариант отображения: interactive (интерактивный) или static (статический) */
  variant?: 'interactive' | 'static';
  /** Дополнительный CSS класс */
  className?: string;
}

/**
 * Компонент галереи изображений
 * Поддерживает два режима:
 * - interactive: можно переключать изображения кликом по миниатюрам и стрелкам
 * - static: только просмотр, первое изображение большое, остальные миниатюры
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  variant = 'interactive',
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const correctedActiveIndex = useMemo(() => {
    if (images.length === 0) return 0;
    return activeIndex >= images.length ? 0 : activeIndex;
  }, [activeIndex, images.length]);

  // Если нет изображений — показываем заглушку
  const displayImages = useMemo(() => {
    if (images.length === 0) {
      return [
        { src: '/images/skills/placeholders/111_4.jpg' },
        { src: '/images/skills/placeholders/111_6.jpg' },
        { src: '/images/skills/placeholders/111_8.jpg' },
        { src: '/images/skills/placeholders/111_10.jpg' },
      ];
    }
    return images;
  }, [images]);

  const isInteractive = variant === 'interactive';

  const mainImage = isInteractive ? displayImages[correctedActiveIndex] : displayImages[0];

  const thumbnails = displayImages.slice(1, 4);

  const remainingCount = displayImages.length - 4;

  const showOverlay = remainingCount > 0 && thumbnails.length === 3;

  const handlePrev = () => {
    if (isInteractive && correctedActiveIndex > 0) {
      setActiveIndex(correctedActiveIndex - 1);
    }
  };

  const handleNext = () => {
    if (isInteractive && correctedActiveIndex < displayImages.length - 1) {
      setActiveIndex(correctedActiveIndex + 1);
    }
  };

  const handleThumbnailClick = (thumbnailIndex: number) => {
    if (!isInteractive) return;

    if (thumbnailIndex === 2 && showOverlay) return;

    setActiveIndex(thumbnailIndex + 1);
  };

  return (
    <div className={`${styles.gallery} ${className}`}>
      <div className={styles.mainContainer}>
        <img
          src={mainImage.src}
          alt={isInteractive ? `Изображение ${correctedActiveIndex + 1}` : 'Главное изображение'}
          className={styles.mainImage}
        />

        {isInteractive && displayImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton} ${
                correctedActiveIndex === 0 ? styles.disabled : ''
              }`}
              onClick={handlePrev}
              disabled={correctedActiveIndex === 0}
              aria-label="Предыдущее изображение"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.20677 13.3327C9.32366 13.3327 9.44056 13.2896 9.53284 13.1973C9.71126 13.0189 9.71126 12.7236 9.53284 12.5452L5.5215 8.53384C5.22619 8.23852 5.22619 7.75864 5.5215 7.46332L9.53284 3.45198C9.71126 3.27356 9.71126 2.97825 9.53284 2.79983C9.35442 2.62141 9.05911 2.62141 8.88069 2.79983L4.86935 6.81117C4.55558 7.12494 4.37716 7.54946 4.37716 7.99858C4.37716 8.4477 4.5494 8.87222 4.86935 9.18599L8.88069 13.1973C8.97298 13.2835 9.08987 13.3327 9.20677 13.3327Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.nextButton} ${
                correctedActiveIndex === displayImages.length - 1 ? styles.disabled : ''
              }`}
              onClick={handleNext}
              disabled={correctedActiveIndex === displayImages.length - 1}
              aria-label="Следующее изображение"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.79323 13.3327C5.67634 13.3327 5.55944 13.2896 5.46716 13.1973C5.28874 13.0189 5.28874 12.7236 5.46716 12.5452L9.4785 8.53384C9.77381 8.23852 9.77381 7.75864 9.4785 7.46332L5.46716 3.45198C5.28874 3.27356 5.28874 2.97825 5.46716 2.79983C5.64558 2.62141 5.94089 2.62141 6.11931 2.79983L10.1307 6.81117C10.4444 7.12494 10.6228 7.54946 10.6228 7.99858C10.6228 8.4477 10.4506 8.87222 10.1307 9.18599L6.11931 13.1973C6.02702 13.2835 5.91013 13.3327 5.79323 13.3327Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className={styles.thumbnailsColumn}>
        {thumbnails.map((image, index) => {
          const isLastWithOverlay = index === 2 && showOverlay;
          const isClickable = isInteractive && !isLastWithOverlay;

          return (
            <div
              key={index}
              className={`${styles.thumbnailContainer} ${
                isClickable ? styles.clickable : ''
              } ${isLastWithOverlay ? styles.withOverlay : ''}`}
              onClick={() => handleThumbnailClick(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <img
                src={image.src}
                alt={`Миниатюра ${index + 2}`}
                className={styles.thumbnailImage}
              />

              {isLastWithOverlay && (
                <div className={styles.overlay}>
                  <span className={styles.overlayText}>+{remainingCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
