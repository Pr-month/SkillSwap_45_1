import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RegisterStep3Form,
  type RegisterStep3FormValues,
} from '@features/auth/ui/register-step-3-form';
import styles from './RegisterStep3Page.module.css';
import RegistrBoardImage from '@shared/assets/images/auth/registration_board.svg';
import { ContentSection } from '@shared/ui/content-section/ContentSection';
import { StepProgress } from '@shared/ui/step-progress/StepProgress';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { selectDb } from '@app/store/db/selectors';
import type { MultiSelectOption } from '@shared/ui/form-multi-select-field';
import { selectRegistrationStep3 } from '@features/auth/model/registrationSelectors';
import { finishRegistrationFromStep3 } from '@features/auth/model/registrationThunks';
import { saveStep3, type RegistrationStep3 } from '@features/auth/model/registrationSlice';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });

const buildPhotoPayload = async (
  files: File[],
): Promise<{ photoPreviewUrl?: string; photoMetadata?: Record<string, unknown> }> => {
  const first = files[0];
  if (!first) return {};

  const photoPreviewUrl = await fileToDataUrl(first);
  const photoMetadata: Record<string, unknown> = {
    name: first.name,
    size: first.size,
    type: first.type,
    lastModified: first.lastModified,
  };

  return { photoPreviewUrl, photoMetadata };
};

export const RegisterStep3Page: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const db = useAppSelector(selectDb);
  const step3Draft = useAppSelector(selectRegistrationStep3);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const categoryOptions = useMemo<MultiSelectOption[]>(() => {
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

  const initialValues = useMemo<RegisterStep3FormValues>(() => {
    if (!step3Draft) {
      return {
        skillName: '',
        category: [],
        subcategory: [],
        description: '',
        photos: [],
      };
    }

    return {
      skillName: step3Draft.skillName ?? '',
      category: step3Draft.categorySkill ?? [],
      subcategory: step3Draft.subcategorySkill ?? [],
      description: step3Draft.description ?? '',
      photos: [],
    };
  }, [step3Draft]);

  const handleSubmit = async (data: RegisterStep3FormValues) => {
    setSubmitError(null);

    try {
      await dispatch(
        finishRegistrationFromStep3({
          skillName: data.skillName,
          category: data.category,
          subcategory: data.subcategory,
          description: data.description,
          photos: data.photos,
        }),
      ).unwrap();

      navigate('/', { replace: true });
    } catch (e) {
      setSubmitError(typeof e === 'string' ? e : 'Ошибка регистрации');
    }
  };

  const handleBack = async (data: RegisterStep3FormValues) => {
    setSubmitError(null);

    const { photoPreviewUrl, photoMetadata } =
      data.photos.length > 0
        ? await buildPhotoPayload(data.photos)
        : {
            photoPreviewUrl: step3Draft?.photoPreviewUrl,
            photoMetadata: step3Draft?.photoMetadata,
          };

    const draft: RegistrationStep3 = {
      skillName: data.skillName.trim(),
      categorySkill: data.category,
      subcategorySkill: data.subcategory,
      description: data.description ?? '',
      photoPreviewUrl,
      photoMetadata,
    };

    dispatch(saveStep3(draft));
    navigate('/auth/register/step-2');
  };

  const heroText = (
    <div className={styles.heroContainer}>
      <h2 className={styles.heroTitle}>Укажите, чем вы готовы поделиться</h2>
      <p>Так другие люди смогут увидеть ваши предложения и предложить вам обмен!</p>
    </div>
  );

  if (!db) return null;

  return (
    <>
      <StepProgress currentStep={3} totalSteps={3} className={styles.stepProgress} />
      <ContentSection
        main={
          <>
            {submitError && <div className={styles.formError}>{submitError}</div>}

            <RegisterStep3Form
              values={initialValues}
              categoryOptions={categoryOptions}
              subcategoryOptionsByCategoryId={subcategoryOptionsByCategoryId}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </>
        }
        heroText={heroText}
        heroImage={<img src={RegistrBoardImage} alt="Картинка" />}
      />
    </>
  );
};
