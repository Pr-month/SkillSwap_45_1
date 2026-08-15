import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IsoDate } from '@shared/types';

export interface ProfileImage {
  src: string;
  alt?: string;
}

export interface ProfileState {
  profile: {
    email: string;
    name: string;
    birthDate: IsoDate | null;
    gender: string;
    city: string;
    about: string;
    avatarSrc?: string;
  };
  skill: {
    title: string;
    description: string;
    category: string;
    images: ProfileImage[];
    tags: string[];
    isPublic: boolean;
  };
}

const initialState: ProfileState = {
  profile: {
    email: '',
    name: '',
    birthDate: null,
    gender: '',
    city: '',
    about: '',
    avatarSrc: undefined,
  },
  skill: {
    title: '',
    description: '',
    category: '',
    images: [],
    tags: [],
    isPublic: true,
  },
};

interface CreateProfilePayload {
  profile: ProfileState['profile'];
  skill: ProfileState['skill'];
}

interface UpdateProfilePayload {
  email?: string;
  name?: string;
  birthDate?: IsoDate | null; // Исправлено: Date → IsoDate
  gender?: string;
  city?: string;
  about?: string;
  avatarSrc?: string;
}

interface UpdateProfileSkillPayload {
  title?: string;
  description?: string;
  category?: string;
  images?: ProfileImage[];
  tags?: string[];
  isPublic?: boolean;
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    createProfile: (state, action: PayloadAction<CreateProfilePayload>) => {
      state.profile = action.payload.profile;
      state.skill = action.payload.skill;
    },
    updateProfile: (state, action: PayloadAction<UpdateProfilePayload>) => {
      const { payload } = action;

      // тогда здесь переделала, учитывая что birthDate?: IsoDate | null;
      if (payload.email !== undefined) state.profile.email = payload.email;
      if (payload.name !== undefined) state.profile.name = payload.name;
      if (payload.birthDate !== undefined) state.profile.birthDate = payload.birthDate;
      if (payload.gender !== undefined) state.profile.gender = payload.gender;
      if (payload.city !== undefined) state.profile.city = payload.city;
      if (payload.about !== undefined) state.profile.about = payload.about;
      if (payload.avatarSrc !== undefined) state.profile.avatarSrc = payload.avatarSrc;
    },
    updateProfileSkill: (state, action: PayloadAction<UpdateProfileSkillPayload>) => {
      const { payload } = action;

      if (payload.title !== undefined) state.skill.title = payload.title;
      if (payload.description !== undefined) state.skill.description = payload.description;
      if (payload.category !== undefined) state.skill.category = payload.category;
      if (payload.images !== undefined) state.skill.images = payload.images;
      if (payload.tags !== undefined) state.skill.tags = payload.tags;
      if (payload.isPublic !== undefined) state.skill.isPublic = payload.isPublic;
    },

    resetProfile: (state) => {
      state.profile = initialState.profile;
      state.skill = initialState.skill;
    },
    resetProfileOnly: (state) => {
      state.profile = initialState.profile;
    },
    resetSkillOnly: (state) => {
      state.skill = initialState.skill;
    },
    addSkillImage: (state, action: PayloadAction<ProfileImage>) => {
      state.skill.images.push(action.payload);
    },
    removeSkillImage: (state, action: PayloadAction<number>) => {
      state.skill.images.splice(action.payload, 1);
    },
    addSkillTag: (state, action: PayloadAction<string>) => {
      if (!state.skill.tags.includes(action.payload)) {
        state.skill.tags.push(action.payload);
      }
    },
    removeSkillTag: (state, action: PayloadAction<string>) => {
      state.skill.tags = state.skill.tags.filter((tag) => tag !== action.payload);
    },
  },
});

export const {
  createProfile,
  updateProfile,
  updateProfileSkill,
  resetProfile,
  resetProfileOnly,
  resetSkillOnly,
  addSkillImage,
  removeSkillImage,
  addSkillTag,
  removeSkillTag,
} = profileSlice.actions;

export default profileSlice.reducer;
