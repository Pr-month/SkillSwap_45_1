import React, { useRef, useState } from 'react';
import { Avatar } from '../Avatar/Avatar';
import styles from './AvatarUploader.module.css';

interface AvatarUploaderProps {
  src?: string;
  alt?: string;
  size?: number | string;
  onAddPhoto?: (file: File) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  src,
  alt,
  size = 72,
  onAddPhoto,
  icon,
  disabled = false,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // состояние для временного изображения

  const handleFileInputClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  const handleContainerClick = () => {
    handleFileInputClick();
  };

  const handleButtonClick = () => {
    handleFileInputClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleFileInputClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      if (onAddPhoto) {
        onAddPhoto(file);
      }
    } else if (file) {
      console.warn('Выбранный файл не является изображением:', file.name);
    }
    if (e.target) e.target.value = '';
  };

  const defaultIcon = (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
    >
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  );

  return (
    <div
      className={`${styles.avatarContainer} ${className || ''}`}
      style={{ '--size': typeof size === 'number' ? `${size}px` : size } as React.CSSProperties}
      onClick={handleContainerClick}
    >
      <div className={styles.imageWrapper}>
        <Avatar src={previewUrl || src} alt={alt} size={size} />

        <button
          type="button"
          aria-label={src ? 'Изменить аватар' : 'Добавить аватар'}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={styles.avatarButton}
          disabled={disabled}
        >
          {icon || defaultIcon}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.avatarInput}
        onChange={handleFileChange}
        aria-label="Загрузить аватар"
        disabled={disabled}
      />
    </div>
  );
};
