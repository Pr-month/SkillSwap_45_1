import type { RootState } from '@app/store/store';

export const selectProfileForEditForm = (state: RootState) => ({
  email: state.profile.profile.email,
  name: state.profile.profile.name,
  birthDate: state.profile.profile.birthDate,
  gender: state.profile.profile.gender,
  city: state.profile.profile.city,
  about: state.profile.profile.about,
  avatarSrc: state.profile.profile.avatarSrc,
});

export const selectProfileSkill = (state: RootState) => state.profile.skill;

export const selectProfileEmail = (state: RootState) => state.profile.profile.email;
export const selectProfileName = (state: RootState) => state.profile.profile.name;
export const selectProfileBirthDate = (state: RootState) => state.profile.profile.birthDate;
export const selectProfileGender = (state: RootState) => state.profile.profile.gender;
export const selectProfileCity = (state: RootState) => state.profile.profile.city;
export const selectProfileAbout = (state: RootState) => state.profile.profile.about;
export const selectProfileAvatarSrc = (state: RootState) => state.profile.profile.avatarSrc;

export const selectSkillTitle = (state: RootState) => state.profile.skill.title;
export const selectSkillDescription = (state: RootState) => state.profile.skill.description;
export const selectSkillCategory = (state: RootState) => state.profile.skill.category;
export const selectSkillImages = (state: RootState) => state.profile.skill.images;
export const selectSkillTags = (state: RootState) => state.profile.skill.tags;
export const selectSkillIsPublic = (state: RootState) => state.profile.skill.isPublic;
