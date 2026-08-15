import authReducer, {
  initAuthDone,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
  type AuthState,
} from './authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    isInitialized: false,
    isAuthenticated: false,
    currentUserId: null,
    status: 'idle',
    error: null,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('initAuthDone', () => {
    const state = authReducer(initialState, initAuthDone());
    expect(state.isInitialized).toBe(true);
  });

  it('loginStart', () => {
    const state = authReducer(initialState, loginStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('loginSuccess', () => {
    const state = authReducer(initialState, loginSuccess({ userId: 10 }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.currentUserId).toBe(10);
    expect(state.status).toBe('success');
    expect(state.error).toBeNull();
  });

  it('loginFailure', () => {
    const state = authReducer(initialState, loginFailure('err'));
    expect(state.status).toBe('error');
    expect(state.error).toBe('err');
  });

  it('logout', () => {
    const state = authReducer(
      {
        isInitialized: true,
        isAuthenticated: true,
        currentUserId: 5,
        status: 'success',
        error: null,
      },
      logout(),
    );

    expect(state.isAuthenticated).toBe(false);
    expect(state.currentUserId).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('clearAuthError', () => {
    const state = authReducer({ ...initialState, error: 'oops' }, clearAuthError());
    expect(state.error).toBeNull();
  });
});
