import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUserId: number | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  currentUserId: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuthDone(state) {
      state.isInitialized = true;
    },
    loginStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ userId: number }>) {
      state.isAuthenticated = true;
      state.currentUserId = action.payload.userId;
      state.status = 'success';
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUserId = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { initAuthDone, loginStart, loginSuccess, loginFailure, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
