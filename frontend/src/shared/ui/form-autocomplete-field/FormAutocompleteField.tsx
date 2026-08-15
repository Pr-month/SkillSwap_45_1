import { useState, useRef, useEffect, type ChangeEvent, useId, useMemo } from 'react';
import styles from './FormAutocompleteField.module.css';
import clsx from 'clsx';

export interface FormAutocompleteFieldProps {
  /** Подпись над полем */
  label?: string;
  /** Placeholder для поля */
  placeholder?: string;
  /** Текущее выбранное значение */
  value: string | null;
  /** Callback при выборе значения */
  onChange: (value: string | null) => void;
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

const iconClear = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function FormAutocompleteField({
  label,
  placeholder = 'Не указан',
  value,
  onChange,
  options,
  disabled = false,
  errorText,
  className = '',
  name,
}: FormAutocompleteFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Находим выбранную опцию
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  // Фильтруем опции на основе введенного текста
  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(filterText.toLowerCase())),
    [options, filterText],
  );

  // Сброс focusedIndex при изменении списка
  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFocusedIndex(0);
    } else {
      setFocusedIndex(-1);
    }
  }, [filteredOptions, isOpen]);

  // Скролл к focused элементу
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex, isOpen]);

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        // При закрытии сбрасываем фильтр к выбранному значению
        setFilterText(selectedOption?.label || '');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  // Обновляем фильтр при изменении value
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterText(selectedOption?.label || '');
  }, [selectedOption]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setFilterText(newText);

    // Если текст изменился и список не открыт - открываем
    if (!isOpen) {
      setIsOpen(true);
    }

    // Если поле стало пустым - очищаем значение
    if (newText === '') {
      onChange(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    setFilterText('');
    // Убедимся, что список не открыт после очистки
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex < filteredOptions.length - 1) {
          setFocusedIndex(focusedIndex + 1);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && focusedIndex > 0) {
          setFocusedIndex(focusedIndex - 1);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setFilterText(option.label);
            setIsOpen(false);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFilterText(selectedOption?.label || '');
        inputRef.current?.focus();
        break;
    }
  };

  const handleOptionClick = (option: (typeof options)[0]) => {
    if (!option.disabled) {
      onChange(option.value);
      setFilterText(option.label);
      setIsOpen(false);
      /* Не фокусируем инпут после выбора — иначе onFocus снова открывает список */
    }
  };

  const handleArrowClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        inputRef.current?.focus();
      }
    }
  };

  const hasError = !!errorText;
  const showClearButton = value !== null && !disabled;

  return (
    <div className={`${styles.wrapper} ${className}`} ref={ref}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.container}>
        <div
          className={clsx(
            styles.inputWrapper,
            disabled && styles.inputWrapperDisabled,
            isOpen && styles.inputWrapperOpen,
            hasError && styles.inputWrapperError,
          )}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            className={styles.input}
            value={filterText}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'autocomplete-dropdown' : undefined}
            aria-autocomplete="list"
            aria-invalid={hasError}
            aria-describedby={errorText ? 'autocomplete-error' : undefined}
          />

          <div className={styles.actions}>
            {showClearButton && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                tabIndex={-1}
                aria-label="Очистить"
              >
                {iconClear}
              </button>
            )}

            <button
              type="button"
              className={clsx(styles.arrowButton, isOpen && styles.arrowHidden)}
              onClick={handleArrowClick}
              disabled={disabled}
              tabIndex={-1}
              aria-label="Открыть список"
            >
              {iconArrowDown}
            </button>
          </div>
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div
            id="autocomplete-dropdown"
            className={clsx(styles.dropdown, styles.custom_scroll)}
            role="listbox"
          >
            {filteredOptions.map((option, index) => (
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
                )}
                onClick={() => handleOptionClick(option)}
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

        {isOpen && filteredOptions.length === 0 && (
          <div className={clsx(styles.dropdown, styles.emptyState)}>Ничего не найдено</div>
        )}
      </div>

      {errorText && (
        <span id="autocomplete-error" className={styles.errorText} role="alert">
          {errorText}
        </span>
      )}

      {name && <input type="hidden" name={name} value={value || ''} />}
    </div>
  );
}
