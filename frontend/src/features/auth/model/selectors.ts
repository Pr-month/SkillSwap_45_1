import type { RootState } from '@app/store/store';

export const selectAuthIsInitialized = (state: RootState) => state.auth.isInitialized;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectCurrentUserId = (state: RootState) => state.auth.currentUserId;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;
