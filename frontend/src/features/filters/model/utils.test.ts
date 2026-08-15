import {
  createDefaultCategoriesSelected,
  createDefaultFilterValues,
  countAppliedFilters,
  groupSubcategoriesByCategoryId,
  convertCitiesToOptions,
} from './utils';

describe('utils', () => {
  it('createDefaultCategoriesSelected', () => {
    const categories = [
      { id: 1, name: 'IT', color: 'red' },
      { id: 2, name: 'Art', color: 'blue' },
    ];

    expect(createDefaultCategoriesSelected(categories)).toEqual({
      1: [],
      2: [],
    });
  });

  it('countAppliedFilters', () => {
    const defaults = {
      offerType: 'all',
      categories: { 1: [] },
      gender: 'all',
      cities: [],
    };

    const filters = {
      offerType: 'learn',
      categories: { 1: ['10'] },
      gender: 'female',
      cities: ['1', '2'],
    };

    expect(countAppliedFilters(filters, defaults)).toBe(1 + 1 + 1 + 2);
  });

  it('groupSubcategoriesByCategoryId', () => {
    const subcategories = [
      { id: 10, name: 'React', categoryId: 1 },
      { id: 20, name: 'Vue', categoryId: 1 },
    ];

    expect(groupSubcategoriesByCategoryId(subcategories)).toEqual({
      1: [
        { value: '10', label: 'React' },
        { value: '20', label: 'Vue' },
      ],
    });
  });

  it('convertCitiesToOptions', () => {
    const cities = [
      { id: 1, name: 'Moscow' },
      { id: 2, name: 'SPb' },
    ];

    expect(convertCitiesToOptions(cities)).toEqual([
      { value: '1', label: 'Moscow' },
      { value: '2', label: 'SPb' },
    ]);
  });

it('createDefaultFilterValues', () => {
  const categories = [
    { id: 1, name: 'IT', color: 'red' },
    { id: 2, name: 'Art', color: 'blue' },
  ];

  expect(createDefaultFilterValues(categories)).toEqual({
    offerType: 'all', 
    categories: {
      1: [],
      2: [],
    },
    gender: 'all',
    cities: [],
  });
});
});