import type {
  MockData,
  User,
  Skill,
  City,
  Category,
  Subcategory,
} from './types';

/**
 * Db - нормализованное представление мок-данных
 * Идея: вместо .find() / .filter() один раз строим мапы
 */
export type Db = {
  // исходные массивы
  users: User[];
  skills: Skill[];
  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];

  // быстрый доступ по id
  usersById: Record<string, User>;
  skillsById: Record<string, Skill>;
  citiesById: Record<string, City>;
  categoriesById: Record<string, Category>;
  subcategoriesById: Record<string, Subcategory>;

  // группировка подкатегорий по категории
  // categoryId -> список подкатегорий
  subcategoriesByCategoryId: Record<string, Subcategory[]>;

  // ownerUserId -> список навыков пользователя
  skillsByOwnerUserId: Record<string, Skill[]>;

  // subcategoryId -> список навыков
  skillsBySubcategoryId: Record<string, Skill[]>;
};

/**
 * Превращает массив сущностей в map by id.
 *
 * Пример:
 * [{ id: '1', ... }, { id: '2', ... }]
 *
 * превращается в:
 * {
 *   '1': {...},
 *   '2': {...}
 * }
 */
const toById = <T extends { id: string }>(
  items: T[],
): Record<string, T> =>
  items.reduce<Record<string, T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

/**
 * Универсальная группировка массива в Record по ключу.
 *
 * Например:
 * groupBy(skills, (skill) => skill.ownerUserId)
 *
 * даст:
 * {
 *   'user-id-1': [skill1, skill2],
 *   'user-id-2': [skill3],
 * }
 */
const groupBy = <T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

/**
 * normalizeData — основной шаг подготовки данных.
 *
 * Здесь мы:
 * - нормализуем необязательные поля пользователей;
 * - строим map byId для быстрого доступа;
 * - строим группировки;
 *
 * ВАЖНО:
 * skillsOfferedIds и skillsWantedIds могут отсутствовать
 * у пользователя, пришедшего с backend.
 *
 * После normalizeData они всегда будут массивами:
 * [] вместо undefined.
 */
export const normalizeData = (raw: MockData): Db => {
  /**
   * Нормализуем пользователей.
   *
   * Backend может вернуть:
   *
   * {
   *   id: 'uuid',
   *   name: 'Test User',
   *   email: 'test@example.com'
   * }
   *
   * без skillsOfferedIds / skillsWantedIds.
   *
   * Для frontend превращаем их в пустые массивы.
   */
  const users: User[] = raw.users.map((user) => ({
    ...user,
    skillsOfferedIds: user.skillsOfferedIds ?? [],
    skillsWantedIds: user.skillsWantedIds ?? [],
  }));

  // Быстрый доступ к пользователям по UUID
  const usersById = toById(users);

  // Быстрый доступ к навыкам по id
  const skillsById = toById(raw.skills);

  // Быстрый доступ к городам
  const citiesById = toById(raw.cities);

  // Быстрый доступ к категориям
  const categoriesById = toById(raw.categories);

  // Быстрый доступ к подкатегориям
  const subcategoriesById = toById(raw.subcategories);

  /**
   * Подкатегории группируем по categoryId.
   */
  const subcategoriesByCategoryId = groupBy(
    raw.subcategories,
    (subcategory) => subcategory.categoryId,
  );

  /**
   * Навыки группируем по владельцу.
   *
   * ВАЖНО:
   * здесь пока оставляем существующие данные skills.json
   * как есть.
   *
   * Проблему ownerUserId = 36, 37, 38...
   * разберём отдельно, потому что это старые mock ID.
   */
  const skillsByOwnerUserId = groupBy(
    raw.skills,
    (skill) => skill.ownerUserId,
  );

  /**
   * Навыки группируем по подкатегории.
   */
  const skillsBySubcategoryId = groupBy(
    raw.skills,
    (skill) => skill.subcategoryId,
  );

  /**
   * Возвращаем нормализованную БД.
   */
  return {
    ...raw,

    // ВАЖНО:
    // здесь должны быть именно нормализованные users,
    // а не raw.users
    users,

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