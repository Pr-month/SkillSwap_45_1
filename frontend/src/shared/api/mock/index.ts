import { getJson } from './client';
import type { CredentialsPayload, Credential } from './types';
import { DB } from './endpoints';
import type {
  UsersPayload,
  SkillsPayload,
  CitiesPayload,
  CategoriesPayload,
  SubcategoriesPayload,
  MockData,
  User,
  Skill,
  City,
  Category,
  Subcategory,
} from './types';

export const mockApi = {
  async getUsers(): Promise<User[]> {
    const data = await getJson<UsersPayload>(DB.users);
    return data.users;
  },
  async getSkills(): Promise<Skill[]> {
    const data = await getJson<SkillsPayload>(DB.skills);
    return data.skills;
  },
  async getCities(): Promise<City[]> {
    const data = await getJson<CitiesPayload>(DB.cities);
    return data.cities;
  },
  async getCategories(): Promise<Category[]> {
    const data = await getJson<CategoriesPayload>(DB.categories);
    return data.categories;
  },
  async getSubcategories(): Promise<Subcategory[]> {
    const data = await getJson<SubcategoriesPayload>(DB.subcategories);
    return data.subcategories;
  },

  async getCredentials(): Promise<Credential[]> {
    const data = await getJson<CredentialsPayload>(DB.credentials);
    return data.credentials;
  },

  async getAll(): Promise<MockData> {
    const [users, skills, cities, categories, subcategories] = await Promise.all([
      this.getUsers(),
      this.getSkills(),
      this.getCities(),
      this.getCategories(),
      this.getSubcategories(),
    ]);

    return { users, skills, cities, categories, subcategories };
  },
} as const;
