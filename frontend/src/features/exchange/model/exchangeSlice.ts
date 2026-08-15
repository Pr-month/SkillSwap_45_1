import type { RootState } from '@app/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ExchangeState {
  offeredExchanges: Record<number, boolean>; // { userId: boolean }
}

const initialState: ExchangeState = {
  offeredExchanges: {},
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setExchangeOffered: (state, action: PayloadAction<{ userId: number }>) => {
      const { userId } = action.payload;
      state.offeredExchanges[userId] = true;
    },
    removeExchangeOffer: (state, action: PayloadAction<{ userId: number }>) => {
      const { userId } = action.payload;
      delete state.offeredExchanges[userId];
    },
  },
});

export const { setExchangeOffered, removeExchangeOffer } = exchangeSlice.actions;

// Селекторы
export const selectExchangeOffered = (state: RootState, userId: number) =>
  state.exchange.offeredExchanges[userId] || false;

export default exchangeSlice.reducer;
