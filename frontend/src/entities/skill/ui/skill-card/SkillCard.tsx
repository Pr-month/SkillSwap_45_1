import React from 'react';
import { ImageGallery, type ImageGalleryProps } from '@shared/ui/ImageGallery';
import styles from './SkillCard.module.css';
import clsx from 'clsx';
import type { SkillImage } from '@shared/api/mock/types';

export interface SkillCardProps {
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  images: SkillImage[];
  actions?: React.ReactNode;
  className?: string;
  variant?: ImageGalleryProps['variant']; //для отключения интерактива
}

export const SkillCard: React.FC<SkillCardProps> = ({
  title,
  category,
  subcategory,
  description,
  images,
  actions,
  className,
  variant = 'interactive',
}) => {
  return (
    <div className={clsx(styles.skillCard, className)}>
      <div className={styles.contentContainer}>
        <div className={styles.headerColumn}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.category}>
            {category} / {subcategory ? subcategory : ''}
          </div>
        </div>

        <div className={styles.descriptionColumn}>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.actionsColumn}>
          {actions && <div className={styles.actionsContainer}>{actions}</div>}
        </div>

        <div className={styles.galleryColumn}>
          <ImageGallery images={images} variant={variant} />
        </div>
      </div>
    </div>
  );
};
