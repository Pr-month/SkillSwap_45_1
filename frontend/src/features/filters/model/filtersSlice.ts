import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TCategoriesSelected, TFilterValues } from './types';

const initialState: TFilterValues = {
  offerType: 'all',
  categories: {},
  gender: 'all',
  cities: [],
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (_state, action: PayloadAction<TFilterValues>) => {
      return action.payload;
    },
    setOfferType: (state, action: PayloadAction<string>) => {
      state.offerType = action.payload;
    },
    setCategories: (state, action: PayloadAction<TCategoriesSelected>) => {
      state.categories = action.payload;
    },
    setGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    setCities: (state, action: PayloadAction<string[]>) => {
      state.cities = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setFilters, resetFilters, setOfferType, setCategories, setGender, setCities } =
  filtersSlice.actions;
export default filtersSlice.reducer;
