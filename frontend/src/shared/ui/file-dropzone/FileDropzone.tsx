import React, {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import styles from './FileDropzone.module.css';
import iconPhotoAdd from '../../assets/icons/ui/icon_photo_add.svg';

export interface FileDropzoneProps {
  onChange: (files: File[]) => void;
  /** Текущий список загруженных файлов (для отображения "Выбрано: N") */
  value?: File[];
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
  errorText?: string;
}

const isAcceptedFileType = (file: File, accept: string): boolean => {
  if (!accept) return true;

  if (accept.includes('*')) {
    const mimeType = accept.replace('*', '').trim();
    return file.type.startsWith(mimeType);
  }

  const acceptTypes = accept.split(',').map((type) => type.trim());
  return acceptTypes.some((type) => {
    if (type.includes('/')) {
      return file.type === type || file.type.startsWith(type.replace('*', '') + '/');
    }

    if (type.startsWith('.')) {
      const ext = type.slice(1).toLowerCase();
      return file.name.toLowerCase().endsWith('.' + ext);
    }
    return false;
  });
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onChange,
  value,
  multiple = true,
  accept = 'image/*',
  disabled = false,
  className = '',
  errorText,
}) => {
  const fileCount = value?.length ?? 0;
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onChange(files);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];

    const acceptedFiles = files.filter((file) => isAcceptedFileType(file, accept));
    const finalFiles = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);

    if (finalFiles.length > 0) onChange(finalFiles);
  };

  const rootClasses = [
    styles.dropzone,
    isDragActive ? styles.active : '',
    errorText ? styles.error : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .join(' ')
    .trim();

  return (
    <>
      <div
        className={rootClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <p className={styles.mainText}>Перетащите или выберите изображения навыка</p>

        <div className={styles.selectImageContainer}>
          <img src={iconPhotoAdd} alt="Картинка выбрать изображения" className={styles.icon} />
          <span className={styles.selectImageText}>Выбрать изображения</span>
        </div>
      </div>

      {fileCount > 0 && <p className={styles.selectedCount}>Выбрано: {fileCount}</p>}

      {errorText && <span className={styles.errorMessage}>{errorText}</span>}
    </>
  );
};
