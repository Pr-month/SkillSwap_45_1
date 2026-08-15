import { forwardRef, useId } from 'react';
import clsx from 'clsx'; // Импортируем clsx
import styles from './Textarea.module.css'; // Переименовал cls → styles для ясности
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  errorText?: string;
  rows?: number;
  className?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      name,
      rows = 4,
      disabled,
      errorText,
      className,
      maxLength,
      ...rest
    },
    ref,
  ) => {
    const hasError = Boolean(errorText);
    const textareaId = useId();
    const errorId = useId();
    const describedBy = hasError ? errorId : undefined;

    return (
      <div
        className={clsx(
          styles.wrapper,
          disabled && styles.disabled,
          hasError && styles.error,
          className,
        )}
      >
        {label && (
          <label className={styles.label} htmlFor={textareaId}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          name={name}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          maxLength={maxLength}
          {...rest}
        />
        {hasError && (
          <span id={errorId} className={styles.errorText}>
            {errorText}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
