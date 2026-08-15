import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import cls from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  errorText?: string;
  className?: string;
  rightSlot?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      name,
      type = 'text',
      disabled,
      errorText,
      className,
      rightSlot,
      ...rest
    },
    ref,
  ) => {
    const hasError = Boolean(errorText);

    const inputId = useId();

    const errorId = useId();
    const describedBy = hasError ? errorId : undefined;

    return (
      <div
        className={[
          cls.wrapper,
          disabled ? cls.disabled : '',
          hasError ? cls.error : '',
          className ?? '',
        ].join(' ')}
      >
        {label && (
          <label className={cls.label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <div className={[cls.inputContainer, rightSlot ? cls.hasRightSlot : ''].join(' ')}>
          <input
            ref={ref}
            id={inputId}
            className={cls.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            name={name}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            {...rest}
          />
          {rightSlot && <span className={cls.rightSlot}>{rightSlot}</span>}
        </div>
        {hasError && (
          <span id={errorId} className={cls.errorText}>
            {errorText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
