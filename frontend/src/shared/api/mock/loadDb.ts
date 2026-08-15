import { mockApi } from './index';
import { normalizeData, type Db } from './normalize';
import { validateDb } from './validate';

let cached: Promise<Db> | null = null;

export const loadDb = (): Promise<Db> => {
  if (!cached) {
    cached = mockApi.getAll().then((raw) => {
      const db = normalizeData(raw);
      validateDb(db);
      return db;
    });
  }
  return cached;
};
