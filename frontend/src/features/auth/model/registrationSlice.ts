import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Url } from '@shared/types';

export interface RegistrationStep1 {
  email: string;
  password: string;
}

export interface RegistrationStep2 {
  name: string;
  birthDate: string | null; // временно исправила с IsoDate | null
  gender: string;
  city: string | null;
  categorySkill: string[]; // изменено на строковый тип
  subcategorySkill: string[]; // изменено на строковый тип
  avatarPreviewUrl?: Url;
  avatarMetadata?: Record<string, unknown>;
}

export interface RegistrationStep3 {
  skillName: string;
  categorySkill: string[];
  subcategorySkill: string[];
  description: string;
  photoPreviewUrl?: Url; // ссылка на предпросмотр
  photoMetadata?: Record<string, unknown>; // метаданные, если нужны
}

interface RegistrationState {
  step1: RegistrationStep1 | null;
  step2: RegistrationStep2 | null;
  step3: RegistrationStep3 | null;
}

const initialState: RegistrationState = {
  step1: null,
  step2: null,
  step3: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    saveStep1: (state, action: PayloadAction<RegistrationStep1>) => {
      state.step1 = action.payload;
    },
    saveStep2: (state, action: PayloadAction<RegistrationStep2>) => {
      state.step2 = action.payload;
    },
    saveStep3: (state, action: PayloadAction<RegistrationStep3>) => {
      state.step3 = action.payload;
    },
    resetRegistrationDraft: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { saveStep1, saveStep2, saveStep3, resetRegistrationDraft } =
  registrationSlice.actions;

export default registrationSlice.reducer;
