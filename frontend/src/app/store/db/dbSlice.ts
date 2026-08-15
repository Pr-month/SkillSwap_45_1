import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Db } from '@shared/api/mock/normalize';
import { loadDb } from '@shared/api/mock/loadDb';

export type DbState = {
  db: Db | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: DbState = {
  db: null,
  status: 'idle',
  error: null,
};

// thunk: грузим мок-данные, нормализуем, кладем в store
export const initDb = createAsyncThunk<Db>('db/initDb', async () => {
  const db = await loadDb();
  return db;
});

const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    // иногда удобно руками сбросить
    resetDb(state) {
      state.db = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDb.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initDb.fulfilled, (state, action: PayloadAction<Db>) => {
        state.status = 'succeeded';
        state.db = action.payload;
      })
      .addCase(initDb.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load db';
      });
  },
});

export const { resetDb } = dbSlice.actions;
export const dbReducer = dbSlice.reducer;
