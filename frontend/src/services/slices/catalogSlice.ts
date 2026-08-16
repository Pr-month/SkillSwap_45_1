import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/entities/user/model/types';
import { getUsersApi, BackendUser } from '@/api/skillSwapApi';

interface CatalogState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: CatalogState = {
  users: [],
  loading: false,
  error: null,
  searchQuery: '',
};

/**
 * Временное преобразование backend User → frontend User.
 *
 * Сейчас backend отдаёт только базовые данные пользователя.
 * Навыки подключим следующим этапом.
 */
const mapBackendUser = (user: BackendUser): User => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  image: user.avatar ?? '',
  city: user.city ?? '',
  gender:
    user.gender === 'male' || user.gender === 'female'
      ? user.gender
      : 'any',
  birthdayDate: user.birthdate ?? '',
  description: user.about ?? '',
  likes: [],
  createdAt: new Date().toISOString(),

  // Временно оставляем пустым.
  // Навыки подключим отдельно.
  canTeach: {
    category: 'Иностранные языки',
    subcategory: 'Английский',
    subcategoryId: '',
    name: '',
    description: '',
    image: [],
    customSkillId: '',
  },

  wantsToLearn: [],
});

export const fetchCatalog = createAsyncThunk(
  'catalog/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const backendUsers = await getUsersApi();

      console.log('Пользователи с backend:', backendUsers);

      return backendUsers.map(mapBackendUser);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);

      return rejectWithValue('Ошибка загрузки профилей');
    }
  },
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,

  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload.toLowerCase();
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchCatalog.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })

      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery } = catalogSlice.actions;

export const catalogReducer = catalogSlice.reducer;