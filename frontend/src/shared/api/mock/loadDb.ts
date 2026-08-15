import { mockApi } from './index';
import { backendApi } from '../backend';
import { normalizeData, type Db } from './normalize';
import { validateDb } from './validate';

let cached: Promise<Db> | null = null;

export const loadDb = (): Promise<Db> => {
  if (!cached) {
    cached = Promise.all([
      backendApi.getUsers(),
      mockApi.getSkills(),
      mockApi.getCities(),
      mockApi.getCategories(),
      mockApi.getSubcategories(),
    ]).then(([users, skills, cities, categories, subcategories]) => {
      const raw = {
        users,
        skills,
        cities,
        categories,
        subcategories,
      };

      const db = normalizeData(raw);
      validateDb(db);

      return db;
    });
  }

  return cached;
};