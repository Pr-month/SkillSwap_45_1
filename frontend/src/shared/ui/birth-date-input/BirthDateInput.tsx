import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
  type ClipboardEvent,
} from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { format, parse, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Button } from '../Button';
import styles from './BirthDateInput.module.css';
import calendarIcon from '../../assets/icons/ui/icon_calendar.svg';

registerLocale('ru', ru);

const DATE_FORMAT = 'dd.MM.yyyy';
const FULL_RE = /^\d{2}\.\d{2}\.\d{4}$/;

const formatDate = (date: Date | null) => (date ? format(date, DATE_FORMAT) : '');

const parseDateStrict = (value: string): Date | null => {
  if (!FULL_RE.test(value)) return null;

  const parsed = parse(value, DATE_FORMAT, new Date(), { locale: ru });
  if (!isValid(parsed)) return null;

  // защита от "31.02.2026 -> 03.03.2026"
  if (format(parsed, DATE_FORMAT) !== value) return null;

  return parsed;
};

// Маска: только цифры, точки вставляются автоматически, максимум 8 цифр (ddmmyyyy)
const maskDate = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}.${mm}`;
  return `${dd}.${mm}.${yyyy}`;
};

export interface BirthDateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

const BirthDateInput = ({ value, onChange, disabled = false }: BirthDateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(value);
  const [inputText, setInputText] = useState<string>(() => formatDate(value));

  const containerRef = useRef<HTMLDivElement>(null);

  // Синхронизация с внешним value (reset/setValue в форме)
  useEffect(() => {
    setTempDate(value);
    setInputText(formatDate(value));
  }, [value]);

  const handleCancel = useCallback(() => {
    setTempDate(value);
    setInputText(formatDate(value));
    setIsOpen(false);
  }, [value]);

  const openPopup = useCallback(() => {
    if (disabled) return;

    // если пользователь ввел валидную дату руками, показать ее в календаре
    const parsed = parseDateStrict(inputText);
    setTempDate(parsed ?? value);
    setIsOpen(true);
  }, [disabled, inputText, value]);

  const applyMaskedText = useCallback(
    (nextRaw: string) => {
      const masked = maskDate(nextRaw);
      setInputText(masked);

      if (masked === '') {
        onChange(null);
        return;
      }

      // в форму отправляем только полностью введенную и валидную дату
      if (masked.length === 10) {
        const parsed = parseDateStrict(masked);
        if (parsed) onChange(parsed);
      }
    },
    [onChange],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    applyMaskedText(e.target.value);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    applyMaskedText(text);
  };

  // при выборе даты в календаре сразу подставляем в поле
  const handleCalendarChange = useCallback((d: Date | null) => {
    setTempDate(d);
    setInputText(formatDate(d));
  }, []);

  const handleConfirm = useCallback(() => {
    onChange(tempDate ?? null);
    setInputText(formatDate(tempDate ?? null));
    setIsOpen(false);
  }, [tempDate, onChange]);

  // Outside click + Escape = ведут себя как "Отменить", чтобы черновик не залипал
  useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (event: MouseEvent) => {
      const root = containerRef.current;
      if (!root) return;
      if (!root.contains(event.target as Node)) handleCancel();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleCancel();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, handleCancel]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="дд.мм.гггг"
          value={inputText}
          onChange={handleInputChange}
          onPaste={handlePaste}
          maxLength={10}
          disabled={disabled}
          className={styles.inputField}
        />

        <button
          type="button"
          className={styles.iconWrapper}
          onClick={openPopup}
          disabled={disabled}
          aria-label="Открыть календарь"
        >
          <img src={calendarIcon} alt="" className={styles.calendarIcon} />
        </button>
      </div>

      {isOpen && (
        <div className={styles.calendarPopup}>
          <DatePicker
            selected={tempDate}
            onChange={handleCalendarChange}
            inline
            locale="ru"
            fixedHeight
          />

          <div className={styles.buttonGroup}>
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={disabled}>
              Отменить
            </Button>
            <Button type="button" variant="primary" onClick={handleConfirm} disabled={disabled}>
              Выбрать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthDateInput;
