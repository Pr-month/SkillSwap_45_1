import { loginThunk, initAuthThunk, logoutThunk } from './authThunks';
import { loginStart, loginSuccess, loginFailure, logout, initAuthDone } from './authSlice';
import { mockApi } from '../../../shared/api/mock';
import { sha256Hex } from '../../../shared/lib/crypto/sha256';

jest.mock('../../../shared/api/mock');
jest.mock('../../../shared/lib/crypto/sha256');

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

beforeEach(() => {
  localStorageMock.clear();
});

describe('authThunks', () => {
  const dispatch = jest.fn();
  const getState = jest.fn();

  describe('loginThunk', () => {
    it('success login', async () => {
      (mockApi.getCredentials as jest.Mock).mockResolvedValue([
        { email: 'test@mail.com', passwordHash: 'sha256:abc', userId: 1 },
      ]);

      (sha256Hex as jest.Mock).mockResolvedValue('abc');

      await loginThunk({ email: 'test@mail.com', password: 'pass' })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(loginStart());
      expect(dispatch).toHaveBeenCalledWith(loginSuccess({ userId: 1 }));
      expect(localStorage.getItem('auth.userId')).toBe('1');
    });

    it('fail if user not found', async () => {
      (mockApi.getCredentials as jest.Mock).mockResolvedValue([]);

      await loginThunk({ email: 'x', password: 'y' })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(loginFailure('Неверный email или пароль'));
    });

    it('fail if password wrong', async () => {
      (mockApi.getCredentials as jest.Mock).mockResolvedValue([
        { email: 'a', passwordHash: 'sha256:zzz', userId: 1 },
      ]);

      (sha256Hex as jest.Mock).mockResolvedValue('xxx');

      await loginThunk({ email: 'a', password: 'y' })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(loginFailure('Неверный email или пароль'));
    });

    it('handle error', async () => {
      (mockApi.getCredentials as jest.Mock).mockRejectedValue(new Error('fail'));

      await loginThunk({ email: 'a', password: 'b' })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        loginFailure('Ошибка авторизации. Попробуйте еще раз.'),
      );
    });
  });

  describe('initAuthThunk', () => {
    it('login from localStorage', async () => {
      localStorage.setItem('auth.userId', '7');

      await initAuthThunk()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(loginSuccess({ userId: 7 }));
      expect(dispatch).toHaveBeenCalledWith(initAuthDone());
    });

    it('only init if no user', async () => {
      await initAuthThunk()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(initAuthDone());
    });
  });

  describe('logoutThunk', () => {
    it('remove storage and logout', async () => {
      localStorage.setItem('auth.userId', '7');

      await logoutThunk()(dispatch, getState, undefined);

      expect(localStorage.getItem('auth.userId')).toBeNull();
      expect(dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
