import { buildAppliedBadges, removeBadge } from './badges';
import type { TFilterValues } from './types';
import { SKILL_TYPE } from './defaults';
import type { Db } from '@shared/api/mock/normalize';

const mockDb: Db = {
  users: [],
  skills: [],
  cities: [],
  categories: [],
  subcategories: [
    { id: 10, name: 'React', categoryId: 1 },
  ],

  usersById: {},
  skillsById: {},
  citiesById: {},
  categoriesById: {},
  subcategoriesById: {
    10: { id: 10, name: 'React', categoryId: 1 },
  },

  subcategoriesByCategoryId: {
    1: [{ id: 10, name: 'React', categoryId: 1 }],
  },

  skillsByOwnerUserId: {},
  skillsBySubcategoryId: {},
};

describe('buildAppliedBadges', () => {
  it('returns empty array if filters are default', () => {
    const filters: TFilterValues = {
      offerType: 'all',
      categories: {},
      gender: 'all',
      cities: [],
    };

    expect(buildAppliedBadges(filters, null)).toEqual([]);
  });

  it('creates offerType badge', () => {
    const filters: TFilterValues = {
      offerType: 'learn',
      categories: {},
      gender: 'all',
      cities: [],
    };

    const badges = buildAppliedBadges(filters, null);

    expect(badges).toHaveLength(1);
    expect(badges[0].kind).toBe('offerType');
    expect(badges[0].label).toBe(
      SKILL_TYPE.find((s) => s.value === 'learn')?.label
    );
  });

  it('creates subcategory badge', () => {
    const filters: TFilterValues = {
      offerType: 'all',
      categories: { 1: ['10'] },
      gender: 'all',
      cities: [],
    };

    const badges = buildAppliedBadges(filters, mockDb);

    expect(badges).toHaveLength(1);
    expect(badges[0].kind).toBe('subcategory');
    expect(badges[0].label).toBe('React');
  });

  it('ignores missing subcategory in db', () => {
    const filters: TFilterValues = {
      offerType: 'all',
      categories: { 1: ['999'] },
      gender: 'all',
      cities: [],
    };

    expect(buildAppliedBadges(filters, mockDb)).toEqual([]);
  });
});

describe('removeBadge', () => {
  const defaults: TFilterValues = {
    offerType: 'all',
    categories: { 1: [] },
    gender: 'all',
    cities: [],
  };

  it('removes offerType badge', () => {
    const filters = { ...defaults, offerType: 'learn' };

    const result = removeBadge(filters, defaults, {
      id: 'offerType',
      label: '',
      kind: 'offerType',
      payload: { kind: 'offerType', value: 'learn' },
    });

    expect(result.offerType).toBe('all');
  });

  it('removes subcategory badge', () => {
    const filters = {
      ...defaults,
      categories: { 1: ['10'] },
    };

    const result = removeBadge(filters, defaults, {
      id: 'subcategory-10',
      label: '',
      kind: 'subcategory',
      payload: {
        kind: 'subcategory',
        categoryId: 1,
        subcategoryId: '10',
      },
    });

    expect(result.categories[1]).toEqual([]);
  });
});