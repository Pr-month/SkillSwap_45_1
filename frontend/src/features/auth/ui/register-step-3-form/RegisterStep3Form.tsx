import { type FC, useState, useEffect, useMemo } from 'react';
import { Input } from '@shared/ui/input';
import { FormMultiSelectField } from '@shared/ui/form-multi-select-field';
import type { MultiSelectOption } from '@shared/ui/form-multi-select-field';
import { getLinkedOptions, sanitizeLinkedSelection } from '@shared/lib/linkedMultiselect';
import { Textarea } from '@shared/ui/textarea';
import { FileDropzone } from '@shared/ui/file-dropzone';
import { Button } from '@shared/ui/Button';
import styles from './RegisterStep3Form.module.css';

export type RegisterStep3FormValues = {
  skillName: string;
  category: string[];
  subcategory: string[];
  description: string;
  photos: File[];
};

export interface RegisterStep3FormProps {
  values: RegisterStep3FormValues;
  onSubmit?: (data: RegisterStep3FormValues) => void;
  onBack?: (data: RegisterStep3FormValues) => void;
  className?: string;
  categoryOptions: MultiSelectOption[];
  subcategoryOptionsByCategoryId: Record<string, MultiSelectOption[]>;
}

export const RegisterStep3Form: FC<RegisterStep3FormProps> = ({
  values,
  onSubmit,
  onBack,
  className,
  categoryOptions,
  subcategoryOptionsByCategoryId,
}) => {
  const [skillName, setSkillName] = useState(values.skillName);
  const [category, setCategory] = useState(values.category);
  const [subcategory, setSubcategory] = useState(values.subcategory);
  const [description, setDescription] = useState(values.description);
  const [photos, setPhotos] = useState(values.photos);

  // синхронизация при возврате на шаг / загрузке черновика
  useEffect(() => {
    setSkillName(values.skillName);
    setCategory(values.category);
    setSubcategory(values.subcategory);
    setDescription(values.description);
    setPhotos(values.photos);
  }, [values]);

  const filteredSubcategoryOptions = useMemo(() => {
    return getLinkedOptions(category, subcategoryOptionsByCategoryId);
  }, [category, subcategoryOptionsByCategoryId]);

  useEffect(() => {
    setSubcategory((prev) => sanitizeLinkedSelection(prev, filteredSubcategoryOptions));
  }, [filteredSubcategoryOptions]);

  const canContinue = skillName.trim().length > 0 && category.length > 0 && subcategory.length > 0;

  const submitPayload: RegisterStep3FormValues = {
    skillName,
    category,
    subcategory,
    description,
    photos,
  };

  return (
    <form
      className={`${styles.registerForm} ${className || ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(submitPayload);
      }}
      noValidate
    >
      {/* Группа полей — все поля внутри одного div */}
      <div className={styles.fieldsGroup}>
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          value={skillName}
          onChange={setSkillName}
        />

        <FormMultiSelectField
          label="Категория навыка"
          placeholder="Выберите категорию навыка"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />

        <FormMultiSelectField
          label="Подкатегория навыка"
          placeholder={
            category.length === 0 ? 'Сначала выберите категорию' : 'Выберите подкатегорию'
          }
          value={subcategory}
          onChange={setSubcategory}
          options={filteredSubcategoryOptions}
          disabled={category.length === 0}
        />

        <Textarea
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          value={description}
          onChange={setDescription}
          rows={4}
        />

        <FileDropzone value={photos} onChange={setPhotos} multiple={true} accept="image/*" />
      </div>

      {/* Кнопки — отдельный блок */}
      <div className={styles.buttonsContainer}>
        <Button variant="secondary" fullWidth type="button" onClick={() => onBack?.(submitPayload)}>
          Назад
        </Button>
        <Button type="submit" variant="primary" fullWidth disabled={!canContinue}>
          Продолжить
        </Button>
      </div>
    </form>
  );
};
