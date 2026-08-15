import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi } from '../../../shared/api/mock';
import { sha256Hex } from '../../../shared/lib/crypto/sha256';
import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';
import { initAuthDone } from './authSlice';

const LS_USER_ID_KEY = 'auth.userId';

export const loginThunk = createAsyncThunk<void, { email: string; password: string }>(
  'auth/login',
  async ({ email, password }, { dispatch }) => {
    try {
      dispatch(loginStart());

      const credentials = await mockApi.getCredentials();
      const cred = credentials.find((c) => c.email.toLowerCase() === email.toLowerCase());

      if (!cred) {
        dispatch(loginFailure('Неверный email или пароль'));
        return;
      }

      const inputHash = await sha256Hex(password);
      const fullHash = `sha256:${inputHash}`;

      if (fullHash !== cred.passwordHash) {
        dispatch(loginFailure('Неверный email или пароль'));
        return;
      }

      localStorage.setItem(LS_USER_ID_KEY, String(cred.userId));
      dispatch(loginSuccess({ userId: cred.userId }));
    } catch {
      dispatch(loginFailure('Ошибка авторизации. Попробуйте еще раз.'));
    }
  },
);

export const initAuthThunk = createAsyncThunk<void, void>('auth/init', async (_, { dispatch }) => {
  const raw = localStorage.getItem(LS_USER_ID_KEY);

  if (raw) {
    const userId = Number(raw);
    if (Number.isFinite(userId)) {
      dispatch(loginSuccess({ userId }));
    }
  }

  dispatch(initAuthDone());
});

export const logoutThunk = createAsyncThunk<void, void>('auth/logout', async (_, { dispatch }) => {
  localStorage.removeItem(LS_USER_ID_KEY);
  dispatch(logout());
});
