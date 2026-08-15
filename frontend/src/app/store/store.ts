import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { dbReducer } from '@app/store/db/dbSlice';
import { sortReducer } from '@features/sort/model';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { favoritesReducer } from '@features/favorites/model';
import filtersReducer from '@features/filters/model/filtersSlice';
import authReducer from '@features/auth/model/authSlice';
import RegistrationReducer from '@features/auth/model/registrationSlice';
import profileReducer from '@features/profile/model/profileSlice';
import { searchReducer } from '@features/search/model';
import exchangeReducer from '@features/exchange/model/exchangeSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['db'], // дописать сюда те редьюсеры, что не нужно в LocalStorage сохранять)
};

const rootReducer = combineReducers({
  db: dbReducer,
  sort: sortReducer,
  favorites: favoritesReducer,
  filters: filtersReducer,
  auth: authReducer,
  registration: RegistrationReducer,
  profile: profileReducer,
  search: searchReducer,
  exchange: exchangeReducer,
  // сюда дописывать новые редьюсеры
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['profile.profile.birthDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const persistor = persistStore(store);
export default store;
