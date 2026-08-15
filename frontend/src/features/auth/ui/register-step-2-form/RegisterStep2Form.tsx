import { type FC, useState, useEffect, useMemo } from 'react';
import { AvatarUploader } from '@shared/ui/avatar-uploader/AvatarUploader';
import { Input } from '@shared/ui/input';
import { BirthDateInput } from '@shared/ui/birth-date-input';
import { FormSelectField } from '@shared/ui/form-select-field';
import { FormAutocompleteField } from '@shared/ui/form-autocomplete-field';
import { FormMultiSelectField } from '@shared/ui/form-multi-select-field';
import { Button } from '@shared/ui/Button';
import type { MultiSelectOption } from '@shared/ui/form-multi-select-field';
import styles from './RegisterStep2Form.module.css';
import type { Url } from '@shared/types';
import { getLinkedOptions, sanitizeLinkedSelection } from '@shared/lib/linkedMultiselect';

export type RegisterStep2FormValues = {
  name: string;
  birthDate: Date | null;
  gender: string;
  city: string | null;
  skillCategoryLearn: string[];
  skillSubcategoryLearn: string[];
  avatarPreviewUrl?: Url;
  avatarMetadata?: Record<string, unknown>;
};

export interface RegisterStep2FormProps {
  values: RegisterStep2FormValues;
  onSubmit?: (data: RegisterStep2FormValues) => void;
  onBack?: (data: RegisterStep2FormValues) => void;
  onAvatarChange?: (file: File) => void;
  avatarSrc?: string;
  genderOptions: Array<{ value: string; label: string; disabled?: boolean }>;
  cityOptions: Array<{ value: string; label: string; disabled?: boolean }>;
  skillCategoryLearnOptions: MultiSelectOption[];
  subcategoryOptionsByCategoryId: Record<string, MultiSelectOption[]>;
  className?: string;
}

export const RegisterStep2Form: FC<RegisterStep2FormProps> = ({
  values,
  onSubmit,
  onBack,
  onAvatarChange,
  avatarSrc,
  genderOptions,
  cityOptions,
  skillCategoryLearnOptions,
  subcategoryOptionsByCategoryId,
  className,
}) => {
  const [name, setName] = useState(values.name);
  const [birthDate, setBirthDate] = useState<Date | null>(values.birthDate);
  const [gender, setGender] = useState(values.gender);
  const [city, setCity] = useState(values.city);
  const [skillCategoryLearn, setSkillCategoryLearn] = useState(values.skillCategoryLearn);
  const [skillSubcategoryLearn, setSkillSubcategoryLearn] = useState(values.skillSubcategoryLearn);

  // Обновление состояний при изменении пропсов
  useEffect(() => {
    setName(values.name);
    setBirthDate(values.birthDate);
    setGender(values.gender);
    setCity(values.city);
    setSkillCategoryLearn(values.skillCategoryLearn);
    setSkillSubcategoryLearn(values.skillSubcategoryLearn);
  }, [values]);

  const formData: RegisterStep2FormValues = {
    name,
    birthDate,
    gender,
    city,
    skillCategoryLearn,
    skillSubcategoryLearn,
  };

  const filteredSubcategoryOptions = useMemo(() => {
    return getLinkedOptions(skillCategoryLearn, subcategoryOptionsByCategoryId);
  }, [skillCategoryLearn, subcategoryOptionsByCategoryId]);

  useEffect(() => {
    setSkillSubcategoryLearn((prev) => sanitizeLinkedSelection(prev, filteredSubcategoryOptions));
  }, [filteredSubcategoryOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleContinue = () => {
    onSubmit?.(formData);
  };

  const canContinue =
    name.trim().length > 0 &&
    city !== null &&
    skillCategoryLearn.length > 0 &&
    skillSubcategoryLearn.length > 0;

  return (
    <form className={`${styles.form} ${className ?? ''}`} onSubmit={handleSubmit} noValidate>
      <div className={styles.formContent}>
        <div className={styles.avatarWrap}>
          <AvatarUploader src={avatarSrc} alt="Аватар" size={72} onAddPhoto={onAvatarChange} />
        </div>

        <div className={styles.field}>
          <Input label="Имя" placeholder="Введите ваше имя" value={name} onChange={setName} />
        </div>

        <div className={styles.twoColRow}>
          <div className={styles.field}>
            <span className={styles.standaloneLabel}>Дата рождения</span>
            <BirthDateInput value={birthDate} onChange={setBirthDate} disabled={false} />
          </div>
          <div className={styles.field}>
            <FormSelectField
              label="Пол"
              placeholder="Не указан"
              value={gender}
              onChange={setGender}
              options={genderOptions}
              disabled={false}
              className={styles.genderField}
            />
          </div>
        </div>

        <div className={styles.field}>
          <FormAutocompleteField
            label="Город"
            placeholder="Не указан"
            value={city}
            onChange={setCity}
            options={cityOptions}
            disabled={false}
          />
        </div>

        <div className={styles.field}>
          <FormMultiSelectField
            label="Категория навыка, которому хотите научиться"
            placeholder="Выберите категорию"
            value={skillCategoryLearn}
            onChange={setSkillCategoryLearn}
            options={skillCategoryLearnOptions}
            disabled={false}
          />
        </div>

        <div className={styles.field}>
          <FormMultiSelectField
            label="Подкатегория навыка, которому хотите научиться"
            placeholder={
              skillCategoryLearn.length === 0
                ? 'Сначала выберите категорию'
                : 'Выберите подкатегорию'
            }
            value={skillSubcategoryLearn}
            onChange={setSkillSubcategoryLearn}
            options={filteredSubcategoryOptions}
            disabled={skillCategoryLearn.length === 0}
          />
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.buttonsRow}>
            <Button type="button" variant="secondary" fullWidth onClick={() => onBack?.(formData)}>
              Назад
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Продолжить
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
