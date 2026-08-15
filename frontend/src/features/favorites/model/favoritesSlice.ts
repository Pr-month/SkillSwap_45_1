import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Id } from '@shared/api/mock/types';
import type { RootState } from '@app/store/store';

export type FavoritesState = {
  favoriteUserIds: Id[];
};

const initialState: FavoritesState = {
  favoriteUserIds: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Id>) {
      const targetUserId = action.payload; // извлекаем ID
      // проверяем, есть ли уже такой пользователь в массиве
      const exists = state.favoriteUserIds.includes(targetUserId);
      state.favoriteUserIds = exists
        ? state.favoriteUserIds.filter((id) => id !== targetUserId) // удалили
        : [...state.favoriteUserIds, targetUserId]; // добавили
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

export const selectFavoriteUserIds = (state: RootState): Id[] => state.favorites.favoriteUserIds; // возвращает массив избранных id

export const selectIsFavorite = (state: RootState, targetUserId: Id): boolean =>
  state.favorites.favoriteUserIds.includes(targetUserId); // проверяет, есть ли конкретный пользователь в избранном

export const selectFavoritesCount = (state: RootState): number =>
  state.favorites.favoriteUserIds.length; // сколько элементов в массиве избранного
