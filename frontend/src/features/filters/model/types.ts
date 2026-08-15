import type { Option } from '@shared/types';

export type TCategoriesSelected = {
  [key: number]: string[];
};

export type TFilterValues = {
  offerType: string;
  categories: TCategoriesSelected;
  gender: string;
  cities: string[];
};

export type TSubCategoriesOption = {
  [key: number]: Option[];
};
