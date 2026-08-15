import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@app/store/store';
import type { IsoDate } from '@shared/types';

import { saveStep3, resetRegistrationDraft, type RegistrationStep3 } from './registrationSlice';

import {
  selectRegistrationStep1,
  selectRegistrationStep2,
  selectRegistrationStep3,
} from './registrationSelectors';

import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { createProfile } from '../../profile/model/profileSlice';

type CreateProfilePayload = Parameters<typeof createProfile>[0];

type Step3FormLike = {
  skillName: string;
  category: string[];
  subcategory: string[];
  description: string;
  photos: File[];
};

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

// 1) Один thunk для RegisterStep3Page: сохраняет step3 (сериализуемо) и запускает финализацию
export const finishRegistrationFromStep3 = createAsyncThunk<
  { userId: number },
  Step3FormLike,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/finishRegistrationFromStep3', async (form, { dispatch, rejectWithValue }) => {
  try {
    if (!form.skillName.trim()) return rejectWithValue('Название навыка обязательно');
    if (form.category.length === 0) return rejectWithValue('Выберите хотя бы одну категорию');
    if (form.subcategory.length === 0) return rejectWithValue('Выберите хотя бы одну подкатегорию');

    const { photoPreviewUrl, photoMetadata } = await buildPhotoPayload(form.photos);

    const step3: RegistrationStep3 = {
      skillName: form.skillName.trim(),
      categorySkill: form.category,
      subcategorySkill: form.subcategory,
      description: form.description ?? '',
      photoPreviewUrl,
      photoMetadata,
    };

    dispatch(saveStep3(step3));

    const resAction = await dispatch(finishRegistration());
    if (finishRegistration.rejected.match(resAction)) {
      return rejectWithValue((resAction.payload as string) ?? 'Ошибка завершения регистрации');
    }

    return resAction.payload as { userId: number };
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Ошибка завершения регистрации');
  }
});

// 2) Финальный thunk: читает step1/2/3 из registrationSlice, создает профиль, логинит, чистит draft
export const finishRegistration = createAsyncThunk<
  { userId: number },
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/finishRegistration', async (_, { getState, dispatch, rejectWithValue }) => {
  dispatch(loginStart());

  try {
    const state = getState();
    const step1 = selectRegistrationStep1(state);
    const step2 = selectRegistrationStep2(state);
    const step3 = selectRegistrationStep3(state);

    if (!step1 || !step2 || !step3) {
      const missing: string[] = [];
      if (!step1) missing.push('шаг 1');
      if (!step2) missing.push('шаг 2');
      if (!step3) missing.push('шаг 3');
      const msg = `Заполнены не все шаги регистрации: ${missing.join(', ')}`;
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    // базовые проверки
    if (!step1.email?.trim() || !step1.password?.trim()) {
      const msg = 'Email и пароль обязательны';
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    if (!step2.name?.trim()) {
      const msg = 'Имя обязательно';
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    if (!step3.skillName?.trim()) {
      const msg = 'Название навыка обязательно';
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    if (step3.categorySkill.length === 0) {
      const msg = 'Выберите хотя бы одну категорию';
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    if (step3.subcategorySkill.length === 0) {
      const msg = 'Выберите хотя бы одну подкатегорию';
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }

    const payload: CreateProfilePayload = {
      profile: {
        email: step1.email,
        name: step2.name,
        birthDate: (step2.birthDate as IsoDate | null) ?? null,
        gender: step2.gender ?? '',
        city: step2.city ?? '',
        about: '',
        avatarSrc: step2.avatarPreviewUrl,
      },
      skill: {
        title: step3.skillName,
        description: step3.description ?? '',
        category: step3.categorySkill.join(', '),
        images: step3.photoPreviewUrl
          ? [{ src: step3.photoPreviewUrl, alt: `Фото навыка: ${step3.skillName}` }]
          : [],
        tags: step3.subcategorySkill ?? [],
        isPublic: true,
      },
    };

    const userId = Date.now();

    dispatch(createProfile(payload));
    dispatch(loginSuccess({ userId }));

    // очищаем черновик только после успеха
    dispatch(resetRegistrationDraft());

    return { userId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка при создании профиля';
    dispatch(loginFailure(msg));
    return rejectWithValue(msg);
  }
});
