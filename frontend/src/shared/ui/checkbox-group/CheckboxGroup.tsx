import { useMemo } from 'react';
import clsx from 'clsx';
import styles from './CheckboxGroup.module.css';
import { Checkbox } from '@shared/ui/checkbox';

export type CheckboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type CheckboxGroupProps = {
  label?: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  errorText?: string;
  className?: string;
  name?: string;
};

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
  errorText,
  className,
  name,
}: CheckboxGroupProps) {
  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggleValue = (optionValue: string, nextChecked: boolean) => {
    const nextSet = new Set(selectedSet);

    if (nextChecked) nextSet.add(optionValue);
    else nextSet.delete(optionValue);

    const ordered = options.map((option) => option.value).filter((value) => nextSet.has(value));

    onChange(ordered);
  };

  return (
    <div className={clsx(styles.group, disabled && styles.disabled, className)}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.list}>
        {options.map((opt) => {
          const isChecked = selectedSet.has(opt.value);
          const isDisabled = disabled || Boolean(opt.disabled);

          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={isChecked}
              disabled={isDisabled}
              name={name}
              value={opt.value}
              onChange={(nextChecked) => toggleValue(opt.value, nextChecked)}
            />
          );
        })}
      </div>

      {errorText && <p className={styles.errorText}>{errorText}</p>}
    </div>
  );
}
