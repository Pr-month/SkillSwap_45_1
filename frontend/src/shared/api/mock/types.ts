export type Id = number;

export type Gender = 'male' | 'female';

export type Category = { id: Id; name: string; color: string };
export type City = { id: Id; name: string };
export type Subcategory = { id: Id; name: string; categoryId: Id };
export type SkillImage = { src: string };

export type Skill = {
  id: Id;
  title: string;
  categoryId: Id;
  subcategoryId: Id;
  ownerUserId: Id;
  description: string;
  images: SkillImage[]; // Добавлено поле images
};

export type User = {
  id: Id;
  name: string;
  cityId: Id;
  gender: Gender;
  birthDate: string; // ISO YYYY-MM-DD
  createdAt: string; // ISO YYYY-MM-DD
  avatar: string;
  about: string;
  skillsOfferedIds: Id[];
  skillsWantedIds: Id[];
};

export type Credential = {
  userId: Id;
  email: string;
  passwordHash: string; // "sha256:<hex>"
};

export type UsersPayload = { users: User[] };
export type SkillsPayload = { skills: Skill[] };
export type CitiesPayload = { cities: City[] };
export type CategoriesPayload = { categories: Category[] };
export type SubcategoriesPayload = { subcategories: Subcategory[] };
export type CredentialsPayload = { credentials: Credential[] };

export type MockData = {
  users: User[];
  skills: Skill[];
  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];
};
