import styles from './RadioGroup.module.css';

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  errorText?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  disabled = false,
  errorText,
}: RadioGroupProps) {
  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      {options.map((option) => (
        <label key={option.value} className={styles.label}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
          <span className={styles.customRadio}></span>
          <span>{option.label}</span>
        </label>
      ))}
      {errorText && <div className={styles.error}>{errorText}</div>}
    </div>
  );
}
