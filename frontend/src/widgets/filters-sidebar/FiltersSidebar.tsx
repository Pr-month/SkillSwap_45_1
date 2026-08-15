import { useState } from 'react';
import { RadioGroup } from '@shared/ui/radio-group/RadioGroup';
import { CheckboxGroup } from '@shared/ui/checkbox-group/CheckboxGroup';
import { Button } from '@shared/ui/Button/Button';
import { SKILL_TYPE, GENDER } from '@features/filters/model/defaults';
import iconArrowDown from '@shared/assets/icons/ui/icon_arrow_down.svg';
import styles from './FiltersSidebar.module.css';
import iconCross from '@shared/assets/icons/ui/icon_close.svg';
import { Checkbox } from '@shared/ui/checkbox';
import clsx from 'clsx';
import type { TCategoriesSelected } from '@features/filters/model/types';
import {
  convertCitiesToOptions,
  countAppliedFilters,
  createDefaultFilterValues,
  groupSubcategoriesByCategoryId,
} from '@features/filters/model/utils';
import { useDispatch, useSelector } from '@app/store/store';
import {
  resetFilters,
  setCategories,
  setCities,
  setGender,
  setOfferType,
} from '@features/filters/model/filtersSlice';
import { selectFilters } from '@features/filters/model/selectors';
import { selectDb } from '@app/store/db/selectors';

const VISIBLE_CATEGORIES = 6;
const VISIBLE_CITIES = 5;

export const FiltersSidebar = () => {
  const dispatch = useDispatch();
  const filterValues = useSelector(selectFilters);
  const db = useSelector(selectDb);
  const categories = db ? db.categories : [];
  const subcategories = groupSubcategoriesByCategoryId(db ? db.subcategories : []);
  const cities = convertCitiesToOptions(db ? db.cities : []);

  const defaultFilterValues = createDefaultFilterValues(db ? db.categories : []);
  const appliedFiltersCount = countAppliedFilters(filterValues, defaultFilterValues); // Счетчик примененных фильтров
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false); // Флаг раскрытия Все города
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false); // Флаг раскрытия Все категории
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]); // Индексы раскрытых категорий
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(VISIBLE_CATEGORIES); // Видимое количество категорий до раскрытия
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(VISIBLE_CITIES); // Видимое количество городов

  const handleOfferTypeChange = (value: string) => {
    dispatch(setOfferType(value));
  };

  const handleCategoriesChange = (value: TCategoriesSelected) => {
    dispatch(setCategories(value));
  };

  const handleGenderChange = (value: string) => {
    dispatch(setGender(value));
  };

  const handleCitiesChange = (value: string[]) => {
    dispatch(setCities(value));
  };
  const toggleCategoriesVisibility = () => {
    if (isCategoriesExpanded) {
      setIsCategoriesExpanded(false);
      setVisibleCategoryCount(6);
    } else {
      setIsCategoriesExpanded(true);
      setVisibleCategoryCount(db ? db.categories.length : 0);
    }
  };

  const toggleCitiesVisibility = () => {
    if (isCitiesExpanded) {
      setIsCitiesExpanded(false);
      setVisibleCitiesCount(5);
    } else {
      setIsCitiesExpanded(true);
      setVisibleCitiesCount(db ? db.cities.length : 0);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  return (
    <div className={styles.filtersSidebar}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterHeaderTitle}>
          Фильтры {appliedFiltersCount ? `(${appliedFiltersCount})` : ''}
        </h2>
        {appliedFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              dispatch(resetFilters());
              setExpandedCategories([]);
            }}
            className={styles.resetBtn}
          >
            Сбросить <img src={iconCross} className={styles.icon} alt="Сбросить" />
          </Button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.section}>
          <RadioGroup
            name="offerType"
            options={SKILL_TYPE}
            value={filterValues.offerType}
            onChange={handleOfferTypeChange}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Навыки</h3>
          <div className={styles.checkboxGroup}>
            {categories.slice(0, visibleCategoryCount).map((category) => (
              <div key={category.id} className={styles.categoryItem}>
                <div className={styles.categoryContainer}>
                  <Checkbox
                    label={category.name}
                    checked={
                      expandedCategories.includes(category.id) ||
                      (filterValues.categories[category.id]?.length ?? 0) > 0
                    }
                    onChange={() => handleCategoryToggle(category.id)}
                    checkedMark="dash"
                    className={styles.categoryCheckbox}
                  />
                  <img
                    src={iconArrowDown}
                    className={clsx(
                      styles.icon,
                      expandedCategories.includes(category.id)
                        ? [styles.iconRotated, styles.iconVisible]
                        : styles.hidden,
                    )}
                    alt="Развернуть/свернуть"
                  />
                </div>
                <div
                  className={clsx(
                    styles.subcategoriesContainer,
                    !expandedCategories.includes(category.id) && styles.hidden,
                  )}
                >
                  <CheckboxGroup
                    name="subCategories"
                    options={subcategories[category.id]}
                    value={filterValues.categories[category.id]}
                    onChange={(values) => {
                      const newCategories = {
                        ...filterValues.categories,
                        [category.id]: values,
                      };
                      handleCategoriesChange(newCategories);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className={styles.arrowBtn}
              aria-label={isCategoriesExpanded ? 'Свернуть категории' : 'Показать все категории'}
              onClick={toggleCategoriesVisibility}
            >
              {isCategoriesExpanded ? 'Свернуть' : 'Все категории'}
              <img
                src={iconArrowDown}
                className={clsx(styles.icon, isCategoriesExpanded && styles.iconRotated)}
                alt="Развернуть/свернуть"
              />
            </Button>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Пол автора</h3>
          <RadioGroup
            name="gender"
            options={GENDER}
            value={filterValues.gender}
            onChange={handleGenderChange}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Город</h3>
          <div className={styles.checkboxGroup}>
            <CheckboxGroup
              name="cities"
              options={cities.slice(0, visibleCitiesCount)}
              value={filterValues.cities}
              onChange={handleCitiesChange}
            />
            <Button
              variant="ghost"
              disabled={cities.length <= VISIBLE_CITIES}
              className={styles.arrowBtn}
              aria-label={isCitiesExpanded ? 'Свернуть города' : 'Показать все города'}
              onClick={toggleCitiesVisibility}
            >
              {isCitiesExpanded ? 'Свернуть' : 'Все города'}
              <img
                src={iconArrowDown}
                className={clsx(styles.icon, isCitiesExpanded && styles.iconRotated)}
                alt="Развернуть/свернуть"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
