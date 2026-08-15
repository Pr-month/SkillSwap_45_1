import { useNavigate } from 'react-router-dom';
import {
  RegisterStep2Form,
  type RegisterStep2FormValues,
} from '@features/auth/ui/register-step-2-form';
import styles from './RegisterStepPage2.module.css';
import PersonImage from '@shared/assets/images/auth/registration_person.svg';
import { ContentSection } from '@shared/ui/content-section/ContentSection';
import { StepProgress } from '@shared/ui/step-progress/StepProgress';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { selectDb } from '@app/store/db/selectors';
import { useMemo, useState } from 'react';
import { saveStep2 } from '@features/auth/model/registrationSlice';
import { selectRegistrationStep2 } from '@features/auth/model/registrationSelectors';
import type { MultiSelectOption } from '@shared/ui/form-multi-select-field';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Не удалось прочитать файл'));
    r.readAsDataURL(file);
  });

const toYYYYMMDD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const isoToDate = (iso: string | null) => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const RegisterStep2Page: React.FC = () => {
  const db = useAppSelector(selectDb);
  const step2Draft = useAppSelector(selectRegistrationStep2);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(undefined);
  const [avatarMetadata, setAvatarMetadata] = useState<Record<string, unknown> | undefined>(
    undefined,
  );

  const values = useMemo<RegisterStep2FormValues>(() => {
    if (!step2Draft) {
      return {
        name: '',
        birthDate: null,
        gender: '',
        city: null,
        skillCategoryLearn: [],
        skillSubcategoryLearn: [],
      };
    }

    return {
      name: step2Draft.name ?? '',
      birthDate: step2Draft.birthDate ? isoToDate(step2Draft.birthDate) : null,
      gender: step2Draft.gender ?? '',
      city: step2Draft.city ?? null,
      skillCategoryLearn: step2Draft.categorySkill ?? [],
      skillSubcategoryLearn: step2Draft.subcategorySkill ?? [],
    };
  }, [step2Draft]);

  const handleAvatarChange = async (file: File) => {
    const url = await fileToDataUrl(file);
    setAvatarPreviewUrl(url);
    setAvatarMetadata({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  const genderOptions = useMemo(
    () => [
      { value: '', label: 'Не указан' },
      { value: 'm', label: 'Мужской' },
      { value: 'f', label: 'Женский' },
    ],
    [],
  );

  const cityOptions = useMemo(() => {
    if (!db) return [];
    return db.cities.map((c) => ({ value: String(c.id), label: c.name }));
  }, [db]);

  const skillCategoryLearnOptions = useMemo(() => {
    if (!db) return [];
    return db.categories.map((cat) => ({ value: String(cat.id), label: cat.name }));
  }, [db]);

  const subcategoryOptionsByCategoryId = useMemo<Record<string, MultiSelectOption[]>>(() => {
    if (!db) return {};

    return Object.fromEntries(
      Object.entries(db.subcategoriesByCategoryId).map(([categoryId, subs]) => [
        String(categoryId),
        subs.map((sub) => ({ value: String(sub.id), label: sub.name })),
      ]),
    );
  }, [db]);

  if (!db) return null;

  const heroText = (
    <div className={styles.heroContainer}>
      <h2 className={styles.heroTitle}>Расскажите немного о себе</h2>
      <p>Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена</p>
    </div>
  );

  const persistStep2 = (data: RegisterStep2FormValues) => {
    dispatch(
      saveStep2({
        name: data.name,
        birthDate: data.birthDate ? toYYYYMMDD(data.birthDate) : null,
        gender: data.gender,
        city: data.city,
        categorySkill: data.skillCategoryLearn,
        subcategorySkill: data.skillSubcategoryLearn,
        avatarPreviewUrl,
        avatarMetadata,
      }),
    );
  };

  const handleSubmit = (data: RegisterStep2FormValues) => {
    persistStep2(data);
    navigate('/auth/register/step-3');
  };

  const handleBack = (data: RegisterStep2FormValues) => {
    persistStep2(data);
    navigate('/auth/register/step-1');
  };

  return (
    <>
      <StepProgress currentStep={2} totalSteps={3} className={styles.stepProgress} />
      <ContentSection
        main={
          <RegisterStep2Form
            values={values}
            genderOptions={genderOptions}
            cityOptions={cityOptions}
            skillCategoryLearnOptions={skillCategoryLearnOptions}
            subcategoryOptionsByCategoryId={subcategoryOptionsByCategoryId}
            onAvatarChange={handleAvatarChange}
            avatarSrc={avatarPreviewUrl}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        }
        heroText={heroText}
        heroImage={<img src={PersonImage} alt="Картинка" />}
      />
    </>
  );
};
