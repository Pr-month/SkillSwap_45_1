import type { Db } from '@shared/api/mock/normalize';
import type { TFilterValues } from './types';
import { SKILL_TYPE } from './defaults';

export type TBadgeKind = 'offerType' | 'subcategory';

export type TBadgePayload =
  | { kind: 'offerType'; value: string }
  | { kind: 'subcategory'; categoryId: number; subcategoryId: string };

export type TBadge = {
  id: string;
  label: string;
  kind: TBadgeKind;
  payload: TBadgePayload;
};

export const buildAppliedBadges = (filters: TFilterValues, db: Db | null): TBadge[] => {
  const badges: TBadge[] = [];

  if (filters.offerType !== 'all') {
    const offerTypeOption = SKILL_TYPE.find((opt) => opt.value === filters.offerType);
    if (offerTypeOption) {
      badges.push({
        id: 'offerType',
        label: offerTypeOption.label,
        kind: 'offerType',
        payload: { kind: 'offerType', value: filters.offerType },
      });
    }
  }

  if (db) {
    const subcategoriesById = db.subcategoriesById;

    for (const [categoryIdStr, selectedSubcategories] of Object.entries(filters.categories)) {
      const categoryId = Number(categoryIdStr);

      for (const subcategoryId of selectedSubcategories) {
        const subcategory = subcategoriesById[Number(subcategoryId)];

        if (subcategory) {
          badges.push({
            id: `subcategory-${subcategoryId}`,
            label: subcategory.name,
            kind: 'subcategory',
            payload: {
              kind: 'subcategory',
              categoryId,
              subcategoryId,
            },
          });
        }
      }
    }
  }

  return badges;
};

export const removeBadge = (
  filters: TFilterValues,
  defaults: TFilterValues,
  badge: TBadge,
): TFilterValues => {
  const newFilters = { ...filters, categories: { ...filters.categories } };

  if (badge.kind === 'offerType') {
    newFilters.offerType = defaults.offerType;
  } else if (badge.kind === 'subcategory') {
    const payload = badge.payload as {
      kind: 'subcategory';
      categoryId: number;
      subcategoryId: string;
    };
    const { categoryId, subcategoryId } = payload;
    const currentSelected = newFilters.categories[categoryId] || [];

    newFilters.categories = {
      ...newFilters.categories,
      [categoryId]: currentSelected.filter((id) => id !== subcategoryId),
    };
  }

  return newFilters;
};
