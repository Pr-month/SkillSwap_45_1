import { type FC } from 'react';
import clsx from 'clsx';
import styles from './FavoriteToggle.module.css';

export interface FavoriteToggleProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

export const FavoriteToggle: FC<FavoriteToggleProps> = ({
  isActive = false,
  onClick,
  className,
  'aria-label': ariaLabel = 'Добавить в избранное',
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.heartButton, className, isActive && styles.active)}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        className={styles.heartIcon}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isActive ? (
          <path
            d="M7.95 4C5.21619 4 3 6.1521 3 8.80682C3 13.6136 8.85 17.9835 12 19C15.15 17.9835 21 13.6136 21 8.80682C21 6.1521 18.7838 4 16.05 4C14.3759 4 12.8958 4.80707 12 6.04238C11.1042 4.80707 9.62414 4 7.95 4Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M12 20.954a2.4 2.4 0 0 1-.8-.121C7.647 19.614 2 15.288 2 8.898 2 5.642 4.633 3 7.87 3A5.78 5.78 0 0 1 12 4.712 5.78 5.78 0 0 1 16.13 3C19.367 3 22 5.651 22 8.898c0 6.4-5.646 10.716-9.2 11.935a2.4 2.4 0 0 1-.8.12M7.87 4.394c-2.465 0-4.475 2.019-4.475 4.503 0 6.353 6.112 9.888 8.26 10.623.168.056.531.056.699 0 2.139-.735 8.26-4.26 8.26-10.623 0-2.484-2.01-4.503-4.474-4.503A4.42 4.42 0 0 0 12.567 6.2c-.26.353-.855.353-1.116 0A4.44 4.44 0 0 0 7.87 4.395"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  );
};
