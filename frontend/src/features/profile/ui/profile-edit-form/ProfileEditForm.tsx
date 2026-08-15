import { type FC, useCallback, useMemo, useState } from 'react';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { IconButton } from '@shared/ui/icon-button';
import { Button } from '@shared/ui/Button';
import { BirthDateInput } from '@shared/ui/birth-date-input';
import { FormSelectField } from '@shared/ui/form-select-field';
import { FormAutocompleteField } from '@shared/ui/form-autocomplete-field';
import { AvatarUploader } from '@shared/ui/avatar-uploader/AvatarUploader';
import iconEdit from '@shared/assets/icons/ui/icon_edit.svg';
import iconPhotoEdit from '@shared/assets/icons/ui/icon_photo_edit.svg';
import styles from './ProfileEditForm.module.css';

export interface ProfileEditFormValues {
  email: string;
  name: string;
  birthDate: Date | null;
  gender: string;
  city: string | null;
  about: string;
}

export interface ProfileEditFormProps {
  values: ProfileEditFormValues;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onBirthDateChange: (value: Date | null) => void;
  onGenderChange: (value: string) => void;
  onCityChange: (value: string | null) => void;
  onAboutChange: (value: string) => void;
  onSave: () => void;
  onChangePassword?: () => void;
  onAvatarChange?: (file: File) => void;
  genderOptions: { value: string; label: string; disabled?: boolean }[];
  cityOptions: { value: string; label: string; disabled?: boolean }[];
  avatarSrc?: string;
  className?: string;
}

const cloneValues = (v: ProfileEditFormValues): ProfileEditFormValues => ({
  ...v,
  birthDate: v.birthDate ? new Date(v.birthDate.getTime()) : null,
});

const isSameValues = (a: ProfileEditFormValues, b: ProfileEditFormValues) => {
  return (
    a.email === b.email &&
    a.name === b.name &&
    a.about === b.about &&
    a.gender === b.gender &&
    a.city === b.city &&
    (a.birthDate?.getTime() ?? null) === (b.birthDate?.getTime() ?? null)
  );
};

export const ProfileEditForm: FC<ProfileEditFormProps> = ({
  values,
  onEmailChange,
  onNameChange,
  onBirthDateChange,
  onGenderChange,
  onCityChange,
  onAboutChange,
  onSave,
  onChangePassword,
  onAvatarChange,
  genderOptions,
  cityOptions,
  avatarSrc,
  className,
}) => {
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<ProfileEditFormValues>(() => cloneValues(values));

  const isDirty = useMemo(() => !isSameValues(values, lastSaved), [values, lastSaved]);

  const canSave =
    (isEmailEditing || isNameEditing || isAboutEditing || isDirty) && values.email.trim() !== '';

  const handleSave = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canSave) return;
      onSave();
      setIsEmailEditing(false);
      setIsNameEditing(false);
      setIsAboutEditing(false);
      setLastSaved(cloneValues(values));
    },
    [onSave, canSave, values],
  );

  return (
    <form
      className={`${styles.form} ${className ?? ''}`}
      onSubmit={(e) => handleSave(e)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsEmailEditing(false);
          setIsNameEditing(false);
          setIsAboutEditing(false);
        }
        if (
          e.key === 'Enter' &&
          canSave &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
          !(e.target as HTMLElement).closest('[role="listbox"]')
        ) {
          e.preventDefault();
          handleSave();
        }
      }}
      noValidate
    >
      <div className={styles.formLayout}>
        <div className={styles.fieldsGeneral}>
          <div className={styles.fieldsColumn}>
            <div className={styles.field}>
              <Input
                className={styles.readOnlyOverride}
                label="Почта"
                value={values.email}
                onChange={onEmailChange}
                disabled={!isEmailEditing}
                rightSlot={
                  <IconButton
                    type="button"
                    icon={<img src={iconEdit} alt="" aria-hidden />}
                    variant="ghost"
                    aria-label={isEmailEditing ? 'Заблокировать поле почты' : 'Редактировать почту'}
                    onClick={() => setIsEmailEditing((prev) => !prev)}
                  />
                }
              />
              {onChangePassword && (
                <button
                  type="button"
                  className={styles.changePasswordLink}
                  onClick={onChangePassword}
                >
                  Изменить пароль
                </button>
              )}
            </div>

            <div className={styles.field}>
              <Input
                className={styles.readOnlyOverride}
                label="Имя"
                value={values.name}
                onChange={onNameChange}
                disabled={!isNameEditing}
                rightSlot={
                  <IconButton
                    type="button"
                    icon={<img src={iconEdit} alt="" aria-hidden />}
                    variant="ghost"
                    aria-label={isNameEditing ? 'Заблокировать поле имени' : 'Редактировать имя'}
                    onClick={() => setIsNameEditing((prev) => !prev)}
                  />
                }
              />
            </div>

            <div className={styles.birthDateGenderRow}>
              <div className={styles.field} role="group" aria-labelledby="birth-date-label">
                <span id="birth-date-label" className={styles.standaloneLabel}>
                  Дата рождения
                </span>
                <BirthDateInput
                  value={values.birthDate}
                  onChange={onBirthDateChange}
                  disabled={false}
                />
              </div>
              <div className={styles.field}>
                <FormSelectField
                  label="Пол"
                  value={values.gender}
                  onChange={onGenderChange}
                  options={genderOptions}
                  disabled={false}
                  placeholder="Не указан"
                />
              </div>
            </div>

            <div className={styles.field}>
              <FormAutocompleteField
                label="Город"
                value={values.city}
                onChange={onCityChange}
                options={cityOptions}
                disabled={false}
                placeholder="Не указан"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.textareaWrapper}>
                <Textarea
                  label="О себе"
                  value={values.about}
                  onChange={onAboutChange}
                  disabled={!isAboutEditing}
                  rows={4}
                  className={styles.textareaField}
                />
                <IconButton
                  type="button"
                  icon={<img src={iconEdit} alt="" aria-hidden />}
                  variant="ghost"
                  aria-label={
                    isAboutEditing ? 'Заблокировать поле «О себе»' : 'Редактировать «О себе»'
                  }
                  onClick={() => setIsAboutEditing((prev) => !prev)}
                  className={styles.textareaEditIcon}
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={!canSave}
            className={styles.saveButton}
            onClick={() => handleSave()}
          >
            Сохранить
          </Button>
        </div>

        {onAvatarChange && (
          <div className={styles.avatarColumn}>
            <AvatarUploader
              src={avatarSrc}
              alt="Аватар"
              size={244}
              onAddPhoto={onAvatarChange}
              icon={<img src={iconPhotoEdit} alt="" aria-hidden />}
            />
          </div>
        )}
      </div>
    </form>
  );
};
