import React from 'react';
import { Logo } from '@shared/ui/Logo';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columnLogo}>
          <Logo className={styles.logo} />

          <p className={styles.watermark}>SkillSwap — 2025</p>
        </div>

        <div className={styles.column}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                О проекте
              </button>
            </li>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                Все навыки
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                Контакты
              </button>
            </li>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                Блог
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                Политика конфиденциальности
              </button>
            </li>
            <li className={styles.navItem}>
              <button type="button" className={styles.navButton}>
                Пользовательское соглашение
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
