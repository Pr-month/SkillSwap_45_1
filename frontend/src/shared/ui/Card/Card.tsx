import { type FC, type ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children?: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
};
