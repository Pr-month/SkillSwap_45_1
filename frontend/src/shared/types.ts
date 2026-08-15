export type Nullable<T> = T | null;
export type IsoDate = string;
export type IsoDateTime = string;
export type HEXColor = string;
export type Url = string;

export type CityId = number;
export type CategoryId = number;
export type SubCategoryId = number;

export interface City {
  id: CityId;
  name: string;
}

export interface CityResponse {
  cities: City[];
}

export interface Category {
  id: CategoryId;
  name: string;
  color: HEXColor;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface SubCategory {
  id: SubCategoryId;
  name: string;
  categoryId: CategoryId;
}

export interface SubCategoryResponse {
  subcategories: SubCategory[];
}

export type Option = {
  value: string;
  label: string;
};
