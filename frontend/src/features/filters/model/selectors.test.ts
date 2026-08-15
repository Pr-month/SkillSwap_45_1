import { selectFilteredUsers } from './selectors';
import type { RootState } from '@app/store/store';
import type { Db } from '@shared/api/mock/normalize';


const db: Db = {
  users: [
    {
      id: 1,
      name: 'Anna',
      cityId: 1,
      gender: 'female',
      birthDate: '',
      createdAt: '',
      avatar: '',
      about: '',
      skillsOfferedIds: [10], // ← добавили навык для категории 1
      skillsWantedIds: []     // ← убрали, чтобы не попадала в offerType=learn
    },
    {
      id: 2,
      name: 'Ivan',
      cityId: 2,
      gender: 'male',
      birthDate: '',
      createdAt: '',
      avatar: '',
      about: '',
      skillsOfferedIds: [20],
      skillsWantedIds: [20]   // ← чтобы попадал в offerType=learn
    },
  ],

  skills: [],
  cities: [],
  categories: [],
  subcategories: [],

  usersById: {
    1: {
      id: 1,
      name: 'Anna',
      cityId: 1,
      gender: 'female',
      birthDate: '',
      createdAt: '',
      avatar: '',
      about: '',
      skillsOfferedIds: [10],
      skillsWantedIds: []
    },
    2: {
      id: 2,
      name: 'Ivan',
      cityId: 2,
      gender: 'male',
      birthDate: '',
      createdAt: '',
      avatar: '',
      about: '',
      skillsOfferedIds: [20],
      skillsWantedIds: [20]
    },
  },

 skillsById: {
  10: {
    id: 10,
    title: 'Skill 10',
    ownerUserId: 1,
    description: '',
    images: [],
    categoryId: 1,
    subcategoryId: 10,
  },
  20: {
    id: 20,
    title: 'Skill 20',
    ownerUserId: 2,
    description: '',
    images: [],
    categoryId: 2,
    subcategoryId: 20,
  },
},


  citiesById: {},
  categoriesById: {},
  subcategoriesById: {},

  subcategoriesByCategoryId: {},
  skillsByOwnerUserId: {},
  skillsBySubcategoryId: {},
};

const baseState: Partial<RootState> = {
  db: {
    db,
    status: 'succeeded',
    error: null,
  },
  filters: {
    offerType: 'all',
    categories: {},
    gender: 'all',
    cities: [],
  },
};

describe('selectFilteredUsers', () => {
  it('returns empty array if db is null', () => {
    const state = {
      db: {
        db: null,
        status: 'idle',
        error: null,
      },
      filters: baseState.filters,
    } as RootState;

    expect(selectFilteredUsers(state)).toEqual([]);
  });

  it('filters by gender', () => {
    const state = {
      ...baseState,
      filters: { ...baseState.filters, gender: 'female' },
    } as RootState;

    const result = selectFilteredUsers(state);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Anna');
  });

  it('filters by offerType learn', () => {
    const state = {
      ...baseState,
      filters: { ...baseState.filters, offerType: 'learn' },
    } as RootState;

    const result = selectFilteredUsers(state);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ivan');
  });

  it('filters by city', () => {
    const state = {
      ...baseState,
      filters: { ...baseState.filters, cities: ['1'] },
    } as RootState;

    const result = selectFilteredUsers(state);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Anna');
  });

  it('filters by category + subcategory', () => {
    const state = {
      ...baseState,
      filters: {
        ...baseState.filters,
        categories: { 1: ['10'] },
      },
    } as RootState;

    const result = selectFilteredUsers(state);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Anna');
  });
});