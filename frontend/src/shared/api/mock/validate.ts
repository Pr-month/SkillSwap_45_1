import type { Db } from './normalize';

export const validateDb = (db: Db) => {
  const warn = (msg: string) => console.warn(`[mock-db] ${msg}`);

  for (const u of db.users) {
    // Пользователи с backend используют city, а не cityId.
    // cityId оставляем только для старых mock-пользователей.
    if (u.cityId !== undefined && !db.citiesById[u.cityId]) {
      warn(`user ${u.id}: cityId ${u.cityId} not found`);
    }

    // Эти поля могут отсутствовать у пользователей с backend.
    const skillsOfferedIds = u.skillsOfferedIds ?? [];
    const skillsWantedIds = u.skillsWantedIds ?? [];

    for (const sid of skillsOfferedIds) {
      if (!db.skillsById[sid]) {
        warn(`user ${u.id}: offered skillId ${sid} not found`);
      }
    }

    for (const sid of skillsWantedIds) {
      if (!db.skillsById[sid]) {
        warn(`user ${u.id}: wanted skillId ${sid} not found`);
      }
    }
  }

  for (const s of db.skills) {
    if (!db.usersById[s.ownerUserId]) {
      warn(
        `skill ${s.id}: ownerUserId ${s.ownerUserId} not found`,
      );
    }

    if (!db.categoriesById[s.categoryId]) {
      warn(
        `skill ${s.id}: categoryId ${s.categoryId} not found`,
      );
    }

    if (!db.subcategoriesById[s.subcategoryId]) {
      warn(
        `skill ${s.id}: subcategoryId ${s.subcategoryId} not found`,
      );
    }

    if (!Array.isArray(s.images)) {
      warn(`skill ${s.id}: images is not an array`);
    }
  }

  for (const sub of db.subcategories) {
    if (!db.categoriesById[sub.categoryId]) {
      warn(
        `subcategory ${sub.id}: categoryId ${sub.categoryId} not found`,
      );
    }
  }
};