import { useState, useRef, useEffect } from 'react';
import styles from './FormSelectField.module.css';
import clsx from 'clsx';

export interface FormSelectFieldProps {
  /** Подпись над полем */
  label?: string;
  /** Placeholder для поля */
  placeholder?: string;
  /** Текущее выбранное значение */
  value: string;
  /** Callback при выборе значения */
  onChange: (value: string) => void;
  /** Список опций для выбора */
  options: { value: string; label: string; disabled?: boolean }[];
  /** Отключает всё поле */
  disabled?: boolean;
  /** Текст ошибки (если есть, поле становится в состоянии ошибки) */
  errorText?: string;
  /** Дополнительный CSS-класс */
  className?: string;
  /** Имя поля для форм */
  name?: string;
}

const iconArrowDown = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 15.935a2.52 2.52 0 0 1-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018a2.5 2.5 0 0 1-1.781.738"
      fill="currentColor"
    />
  </svg>
);

export function FormSelectField({
  label,
  placeholder = 'Не указан',
  value,
  onChange,
  options,
  disabled = false,
  errorText,
  className = '',
  name,
}: FormSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Сброс focusedIndex при открытии/закрытии
  useEffect(() => {
    if (isOpen) {
      // Находим индекс выбранного элемента
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, options, value]);

  // Скролл к focused элементу
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (option && !option.disabled) {
            onChange(option.value);
            setIsOpen(false);
            triggerRef.current?.focus();
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => {
            let nextIndex = prev + 1;
            // Пропускаем disabled опции
            while (nextIndex < options.length && options[nextIndex].disabled) {
              nextIndex++;
            }
            return nextIndex < options.length ? nextIndex : prev;
          });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => {
            let nextIndex = prev - 1;
            // Пропускаем disabled опции
            while (nextIndex >= 0 && options[nextIndex].disabled) {
              nextIndex--;
            }
            return nextIndex >= 0 ? nextIndex : prev;
          });
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const selected = options.find((opt) => opt.value === value);
  const hasError = !!errorText;

  return (
    <div className={`${styles.wrapper} ${className}`} ref={ref}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.container}>
        <button
          ref={triggerRef}
          type="button"
          className={clsx(
            styles.trigger,
            hasError && styles.triggerError,
            disabled && styles.triggerDisabled,
            isOpen && styles.triggerOpen,
            className,
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          aria-invalid={hasError}
          aria-controls={isOpen ? 'select-dropdown' : undefined}
          aria-activedescendant={
            isOpen && focusedIndex >= 0 ? `option-${options[focusedIndex]?.value}` : undefined
          }
        >
          <span className={selected && selected.value !== '' ? styles.value : styles.placeholder}>
            {selected ? selected.label : placeholder}
          </span>
          <span
            className={styles.arrow}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {iconArrowDown}
          </span>
        </button>

        {isOpen && (
          <div
            id="select-dropdown"
            className={clsx(styles.dropdown, styles.custom_scroll, className)}
            role="listbox"
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                id={`option-${option.value}`}
                className={clsx(
                  styles.option,
                  value === option.value && styles.selected,
                  option.disabled && styles.optionDisabled,
                  focusedIndex === index && styles.optionFocused,
                  className,
                )}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                role="option"
                aria-selected={value === option.value}
                aria-disabled={option.disabled}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {errorText && <span className={styles.errorText}>{errorText}</span>}

      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
