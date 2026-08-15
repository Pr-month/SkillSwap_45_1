import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store/store';
import type { TFilterValues } from './types';
import type { User } from '@shared/api/mock/types';
import type { Db } from '@shared/api/mock/normalize';
import { selectDb } from '../../../app/store/db/selectors';

export const selectFilters = (state: RootState): TFilterValues => state.filters;

export const selectFilteredUsers = createSelector(
  [selectFilters, selectDb],
  (filters: TFilterValues, db: Db | null): User[] => {
    if (!db) return [];

    const users = db.users;

    return users.filter((user) => {
      // фильтрация по типу предложения
      if (filters.offerType !== 'all') {
        const hasMatchingSkills =
          filters.offerType === 'learn'
            ? user.skillsWantedIds.length > 0
            : user.skillsOfferedIds.length > 0;
        if (!hasMatchingSkills) return false;
      }

      // фильтрация по полу
      if (filters.gender !== 'all' && user.gender !== filters.gender) {
        return false;
      }

      // фильтрация по городам
      if (filters.cities.length > 0 && !filters.cities.includes(String(user.cityId))) {
        return false;
      }

      // фильтрация по категориям и подкатегориям
      if (Object.keys(filters.categories).length > 0) {
        let hasMatchingCategory = false;

        for (const [categoryIdStr, selectedSubcategories] of Object.entries(filters.categories)) {
          const categoryId = Number(categoryIdStr);

          // есть ли у пользователя навыки в этой категории
          const userHasSkillsInCategory =
            user.skillsOfferedIds.some((skillId) => {
              const skill = db.skillsById[skillId];
              return skill?.categoryId === categoryId;
            }) ||
            user.skillsWantedIds.some((skillId) => {
              const skill = db.skillsById[skillId];
              return skill?.categoryId === categoryId;
            });

          if (userHasSkillsInCategory) {
            if (selectedSubcategories.length === 0) {
              hasMatchingCategory = true;
              break;
            }

            // если выбраны подкатегории, проверяем их
            const hasMatchingSubcategory = selectedSubcategories.some((subcatIdStr) => {
              const subcatId = Number(subcatIdStr);
              return (
                user.skillsOfferedIds.some((skillId) => {
                  const skill = db.skillsById[skillId];
                  return skill?.subcategoryId === subcatId;
                }) ||
                user.skillsWantedIds.some((skillId) => {
                  const skill = db.skillsById[skillId];
                  return skill?.subcategoryId === subcatId;
                })
              );
            });

            if (hasMatchingSubcategory) {
              hasMatchingCategory = true;
              break;
            }
          }
        }

        if (!hasMatchingCategory) return false;
      }

      return true;
    });
  },
);
