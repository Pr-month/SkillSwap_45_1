import React, { useState } from 'react';
import styles from './Avatar.module.css';
import placeholderImg from '../../assets/icons/common/icon_person_circle_nosize_new.svg';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number | string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Аватар',
  size = 65,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeStyle = { width: size, height: size };

  const showPlaceholder = !src || imgError;

  return (
    <div className={`${styles.avatarWrapper} ${className}`} style={sizeStyle}>
      {showPlaceholder ? (
        <div className={styles.Avatar_placeholder}>
          <img src={placeholderImg} alt="заглушка" className={styles.avatarImage} />
        </div>
      ) : (
        <img src={src} alt={alt} className={styles.avatarImage} onError={() => setImgError(true)} />
      )}
    </div>
  );
};
