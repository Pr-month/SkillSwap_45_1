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

    return db.users.filter((user) => {
      const skillsWantedIds = user.skillsWantedIds ?? [];
      const skillsOfferedIds = user.skillsOfferedIds ?? [];

      // фильтрация по типу предложения
      if (filters.offerType !== 'all') {
        const hasMatchingSkills =
          filters.offerType === 'learn'
            ? skillsWantedIds.length > 0
            : skillsOfferedIds.length > 0;

        if (!hasMatchingSkills) return false;
      }

      // фильтрация по полу
      if (filters.gender !== 'all' && user.gender !== filters.gender) {
        return false;
      }

      // фильтрация по городам
      if (
        filters.cities.length > 0 &&
        (!user.city || !filters.cities.includes(user.city))
      ) {
        return false;
      }

      // фильтрация по категориям
      if (Object.keys(filters.categories).length > 0) {
        let hasMatchingCategory = false;

        for (const [categoryIdStr, selectedSubcategories] of Object.entries(
          filters.categories,
        )) {
          const categoryId = Number(categoryIdStr);

          const userHasSkillsInCategory =
            skillsOfferedIds.some((skillId) => {
              const skill = db.skillsById[skillId];
              return skill?.categoryId === categoryId;
            }) ||
            skillsWantedIds.some((skillId) => {
              const skill = db.skillsById[skillId];
              return skill?.categoryId === categoryId;
            });

          if (userHasSkillsInCategory) {
            if (selectedSubcategories.length === 0) {
              hasMatchingCategory = true;
              break;
            }

            const hasMatchingSubcategory = selectedSubcategories.some(
              (subcatIdStr) => {
                const subcatId = Number(subcatIdStr);

                return (
                  skillsOfferedIds.some((skillId) => {
                    const skill = db.skillsById[skillId];
                    return skill?.subcategoryId === subcatId;
                  }) ||
                  skillsWantedIds.some((skillId) => {
                    const skill = db.skillsById[skillId];
                    return skill?.subcategoryId === subcatId;
                  })
                );
              },
            );

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
