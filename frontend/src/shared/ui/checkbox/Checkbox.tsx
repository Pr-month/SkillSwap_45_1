import { useId } from 'react';
import cls from './Checkbox.module.css';
import clsx from 'clsx';

export type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  errorText?: string;
  className?: string;
  name?: string;
  id?: string;
  value?: string;
  'aria-describedby'?: string;
  checkedMark?: 'dash' | 'check';
};

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  errorText,
  className,
  name,
  id: idProp,
  value,
  'aria-describedby': ariaDescribedBy,
  checkedMark = 'check',
}: CheckboxProps) {
  const generatedId = useId();
  const errorId = useId();
  const id = idProp ?? generatedId;

  const hasError = Boolean(errorText);
  const describedBy =
    [ariaDescribedBy, hasError ? errorId : null].filter(Boolean).join(' ').trim() || undefined;

  return (
    <div
      className={[
        cls.wrapper,
        disabled ? cls.disabled : '',
        hasError ? cls.error : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className={cls.label} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={clsx(cls.input, checkedMark === 'dash' ? cls.dash : cls.check)}
        />
        {label != null && <span className={cls.labelText}>{label}</span>}
      </label>
      {hasError && (
        <span id={errorId} className={cls.errorText}>
          {errorText}
        </span>
      )}
    </div>
  );
}
