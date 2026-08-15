const SKILL_COLOR_VARS = [
  '--color-tag-english',
  '--color-tag-business',
  '--color-tag-creativity',
  '--color-tag-education',
  '--color-tag-home',
  '--color-tag-health',
  '--color-tag-plus',
] as const;

export const getSkillColorVar = (categoryId?: number) => {
  if (!categoryId) return undefined;
  const idx = (categoryId - 1) % SKILL_COLOR_VARS.length;
  return SKILL_COLOR_VARS[idx];
};
