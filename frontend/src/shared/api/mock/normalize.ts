import type { MockData, User, Skill, City, Category, Subcategory } from './types';

/**
 * Db - нормализованное представление мок-данных
 * Идея: вместо .find() / .filter() один раз строим мапы
 */

export type Db = {
  // исходные массивы для map/reneder без Object.values
  users: User[];
  skills: Skill[];
  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];

  // быстрый доступ по id (db.usersById[userId])
  usersById: Record<number, User>;
  skillsById: Record<number, Skill>;
  citiesById: Record<number, City>;
  categoriesById: Record<number, Category>;
  subcategoriesById: Record<number, Subcategory>;

  // группировка подкатегорий по категории:
  // categoryId -> список подкатегорий
  subcategoriesByCategoryId: Record<number, Subcategory[]>;

  // индексы для ускорения фильтрации/рендера
  // ownerUserId -> список навыков, принадлежащих пользователю
  skillsByOwnerUserId: Record<number, Skill[]>;

  // subcategoryId - список навыков этой подкатегории
  skillsBySubcategoryId: Record<number, Skill[]>;
};

/**
 * Превращает массив сущностей в "map by id"
 * Пример: [{id: 2, ...}, {id: 5, ...}] - { 2: {...}, 5: {...} }
 */
const toById = <T extends { id: number }>(items: T[]): Record<number, T> =>
  items.reduce<Record<number, T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

/**
 * Универсальная группировка массива в Record по ключу
 * Пример: groupBy(skills, s => s.ownerUserId) -> { [userId]: Skill[] }

 * Важно: если у ключа нет элементов, его просто не будет в объекте.
 * Поэтому при доступе обычно пишем: db.skillsByOwnerUserId[id] ?? []
 */
const groupBy = <T>(items: T[], keyFn: (item: T) => number): Record<number, T[]> =>
  items.reduce<Record<number, T[]>>((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

/**
 * normalizeData — основной шаг подготовки данных:
 * - строим мапы byId для O(1) доступа
 * - строим группировки (подкатегории по категориям, навыки по юзеру/подкатегории)
 *
 * Вызывается один раз после загрузки моков (mockApi.getAll()).
 */
export const normalizeData = (raw: MockData): Db => {
  // 1) byId мапы: быстрый доступ без .find()
  const usersById = toById(raw.users);
  const skillsById = toById(raw.skills);
  const citiesById = toById(raw.cities);
  const categoriesById = toById(raw.categories);
  const subcategoriesById = toById(raw.subcategories);
  // 2) группировки: быстрые выборки без filter()
  const subcategoriesByCategoryId = groupBy(raw.subcategories, (s) => s.categoryId);
  const skillsByOwnerUserId = groupBy(raw.skills, (s) => s.ownerUserId);
  const skillsBySubcategoryId = groupBy(raw.skills, (s) => s.subcategoryId);
  // 3) сборка финального Db:
  // сохраняем исходные массивы и добавляем индексы
  return {
    ...raw,
    usersById,
    skillsById,
    citiesById,
    categoriesById,
    subcategoriesById,
    subcategoriesByCategoryId,
    skillsByOwnerUserId,
    skillsBySubcategoryId,
  };
};
