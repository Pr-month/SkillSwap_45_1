import { type Category, type Subcategory } from '@shared/api/mock/types';
import type {
  TCategoriesSelected,
  TFilterValues,
  TSubCategoriesOption,
} from '@features/filters/model/types';
import { GENDER, SKILL_TYPE } from '../../../features/filters/model/defaults';
import type { City, Option } from '@shared/types';

export const createDefaultCategoriesSelected = (categories: Category[]) =>
  categories.reduce((acc, category) => ({ ...acc, [category.id]: [] }), {} as TCategoriesSelected);

export const createDefaultFilterValues = (categories: Category[]) =>
  ({
    offerType: SKILL_TYPE[0].value,
    categories: createDefaultCategoriesSelected(categories),
    gender: GENDER[0].value,
    cities: [],
  }) as TFilterValues;

export const countAppliedFilters = (
  filters: TFilterValues,
  defaultFilterValues: TFilterValues,
): number => {
  let count = 0;
  if (filters.offerType !== defaultFilterValues.offerType) {
    count++;
  }
  Object.values(filters.categories).forEach((subcategories) => {
    if (subcategories.length > 0) {
      count += subcategories.length;
    }
  });
  if (filters.gender !== defaultFilterValues.gender) {
    count++;
  }
  count += filters.cities.length;

  return count;
};

export const groupSubcategoriesByCategoryId = (
  subcategories: Subcategory[],
): TSubCategoriesOption => {
  return subcategories.reduce((acc: TSubCategoriesOption, subcategory: Subcategory) => {
    const { categoryId, id, name } = subcategory;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push({
      value: String(id),
      label: name,
    });

    return acc;
  }, {} as TSubCategoriesOption);
};

export const convertCitiesToOptions = (cities: City[]): Option[] => {
  return cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));
};
