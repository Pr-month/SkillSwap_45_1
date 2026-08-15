import React from 'react';
import clsx from 'clsx';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
  main: React.ReactNode;
  heroText?: React.ReactNode;
  heroImage?: React.ReactNode;
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  main,
  heroText,
  heroImage,
  className,
}) => {
  return (
    <section className={clsx(styles.section, className)}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.main}>{main}</div>
          {(heroText || heroImage) && (
            <div className={styles.hero}>
              {heroImage && <div className={styles.heroImage}>{heroImage}</div>}
              {heroText && <div className={styles.heroText}>{heroText}</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
