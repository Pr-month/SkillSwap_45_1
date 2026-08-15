import reducer, {
  setFilters,
  resetFilters,
  setOfferType,
  setCategories,
  setGender,
  setCities,
} from './filtersSlice';
import type { TFilterValues } from './types';

describe('filtersSlice reducer', () => {
  const initialState: TFilterValues = {
    offerType: 'all',
    categories: {},
    gender: 'all',
    cities: [],
  };

  it('should return initial state by default', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFilters', () => {
    const newState: TFilterValues = {
      offerType: 'learn',
      categories: { 1: ['10'] },
      gender: 'female',
      cities: ['1'],
    };

    expect(reducer(initialState, setFilters(newState))).toEqual(newState);
  });

  it('should handle setOfferType', () => {
    const state = reducer(initialState, setOfferType('teach'));
    expect(state.offerType).toBe('teach');
  });

  it('should handle setCategories', () => {
    const state = reducer(initialState, setCategories({ 2: ['5'] }));
    expect(state.categories).toEqual({ 2: ['5'] });
  });

  it('should handle setGender', () => {
    const state = reducer(initialState, setGender('male'));
    expect(state.gender).toBe('male');
  });

  it('should handle setCities', () => {
    const state = reducer(initialState, setCities(['3']));
    expect(state.cities).toEqual(['3']);
  });

  it('should handle resetFilters', () => {
    const modifiedState: TFilterValues = {
      offerType: 'learn',
      categories: { 1: ['10'] },
      gender: 'female',
      cities: ['1'],
    };

    const state = reducer(modifiedState, resetFilters());
    expect(state).toEqual(initialState);
  });
});
