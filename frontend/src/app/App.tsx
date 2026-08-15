import { useEffect } from 'react';
import AppRouter from '@app/router/router';

import { initDb } from '@app/store/db/dbSlice';
import { selectDbStatus, selectDbError } from '@app/store/db/selectors';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { initAuthThunk } from '@features/auth/model/authThunks';
import { selectAuthIsInitialized } from '@features/auth/model/selectors';

export default function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectDbStatus);
  const error = useAppSelector(selectDbError);

  const authInitialized = useAppSelector(selectAuthIsInitialized);

  useEffect(() => {
    // В dev под StrictMode useEffect может вызываться дважды.
    // Проверка status === 'idle' гарантирует, что initDb не дернется повторно.
    if (status === 'idle') {
      dispatch(initDb());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!authInitialized) {
      dispatch(initAuthThunk());
    }
  }, [dispatch, authInitialized]);

  if (status === 'loading') return <div>Загрузка данных…</div>;
  if (status === 'failed') return <div>Ошибка загрузки данных: {error}</div>;

  return <AppRouter />;
}
