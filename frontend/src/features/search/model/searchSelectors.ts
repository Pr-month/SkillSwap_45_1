import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store/store';
import { selectFilteredUsers } from '@features/filters/model/selectors';

export const selectSearchQuery = (state: RootState): string => state.search.query;

export const selectHasQuery = (state: RootState): boolean => state.search.query.trim().length > 0;

export const selectUsersByFiltersAndSearch = createSelector(
  [selectFilteredUsers, selectSearchQuery, (state: RootState) => state.db.db],
  (filteredUsers, query, db) => {
    if (!db) return filteredUsers;

    if (!query.trim()) return filteredUsers;

    const lowerQuery = query.toLowerCase();

    return filteredUsers.filter((user) => {
      const userSkills = db.skillsByOwnerUserId[user.id] ?? [];

      return userSkills.some((skill) => skill.title.toLowerCase().includes(lowerQuery));
    });
  },
);
