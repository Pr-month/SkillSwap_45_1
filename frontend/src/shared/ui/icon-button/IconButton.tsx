import React, { forwardRef } from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'ghost' | 'solid';
  isActive?: boolean;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      isActive = false,
      className = '',
      type = 'button',
      disabled = false,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    if (!ariaLabel) {
      console.warn('IconButton требует aria-label для доступности');
    }

    const buttonClasses = [
      styles.iconButton,
      styles[variant],
      isActive ? styles.active : '',
      disabled ? styles.disabled : '',
      className,
    ]
      .join(' ')
      .trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        {...props}
      >
        <span className={styles.iconWrapper}>{icon}</span>
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
