import type { RootState } from '@app/store/store';

export const selectDb = (state: RootState) => state.db.db;
export const selectDbStatus = (state: RootState) => state.db.status;
export const selectDbError = (state: RootState) => state.db.error;
