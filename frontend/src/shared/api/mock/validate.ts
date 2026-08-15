import type { Db } from './normalize';

export const validateDb = (db: Db) => {
  const warn = (msg: string) => console.warn(`[mock-db] ${msg}`);

  for (const u of db.users) {
    if (!db.citiesById[u.cityId]) warn(`user ${u.id}: cityId ${u.cityId} not found`);

    for (const sid of u.skillsOfferedIds) {
      if (!db.skillsById[sid]) warn(`user ${u.id}: offered skillId ${sid} not found`);
    }
    for (const sid of u.skillsWantedIds) {
      if (!db.skillsById[sid]) warn(`user ${u.id}: wanted skillId ${sid} not found`);
    }
  }

  for (const s of db.skills) {
    if (!db.usersById[s.ownerUserId]) warn(`skill ${s.id}: ownerUserId ${s.ownerUserId} not found`);
    if (!db.categoriesById[s.categoryId])
      warn(`skill ${s.id}: categoryId ${s.categoryId} not found`);
    if (!db.subcategoriesById[s.subcategoryId])
      warn(`skill ${s.id}: subcategoryId ${s.subcategoryId} not found`);

    // Проверка поля images - всегда должно быть массивом (даже пустым)
    if (!Array.isArray(s.images)) {
      warn(`skill ${s.id}: images is not an array`);
    }
  }

  for (const sub of db.subcategories) {
    if (!db.categoriesById[sub.categoryId])
      warn(`subcategory ${sub.id}: categoryId ${sub.categoryId} not found`);
  }
};
