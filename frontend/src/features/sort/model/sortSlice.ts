import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SortDirection = 'desc' | 'asc';

export type SortState = {
  direction: SortDirection;
};

const initialState: SortState = {
  direction: 'desc',
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setDirection(state, action: PayloadAction<SortDirection>) {
      state.direction = action.payload;
    },
    toggleDirection(state) {
      state.direction = state.direction === 'desc' ? 'asc' : 'desc';
    },
  },
});

export const { setDirection, toggleDirection } = sortSlice.actions;
export const sortReducer = sortSlice.reducer;

// Selectors
type SortSliceState = { sort: SortState };

export const selectSortDirection = (state: SortSliceState): SortDirection => state.sort.direction;
