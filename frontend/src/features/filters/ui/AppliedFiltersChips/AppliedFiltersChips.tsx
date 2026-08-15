import React from 'react';
import { IconButton } from '@shared/ui/icon-button';
import iconCross from '@shared/assets/icons/ui/icon_close.svg';
import type { TBadge } from '../../model/badges';
import styles from './AppliedFiltersChips.module.css';

export type AppliedBadge = TBadge;

export interface AppliedFiltersChipsProps {
  badges: AppliedBadge[];
  onRemove: (badge: AppliedBadge) => void;
  className?: string;
}

export const AppliedFiltersChips: React.FC<AppliedFiltersChipsProps> = ({
  badges,
  onRemove,
  className = '',
}) => {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {badges.map((badge) => (
        <div key={badge.id} className={styles.chip}>
          <span className={styles.label}>{badge.label}</span>
          <IconButton
            icon={<img src={iconCross} alt="" aria-hidden="true" />}
            variant="ghost"
            aria-label="Удалить фильтр"
            onClick={() => onRemove(badge)}
            className={styles.removeButton}
          />
        </div>
      ))}
    </div>
  );
};
