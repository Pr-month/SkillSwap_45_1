import { getJson } from './mock/client';
import type { User } from './mock/types';

type BackendUser = {
  id: string;
  name: string;
  email: string;
  about: string | null;
  birthdate: string | null;
  city: string | null;
  gender: 'male' | 'female' | null;
  avatar: string | null;
};

const API_URL = 'http://localhost:3000/api';

export const backendApi = {
  async getUsers(): Promise<User[]> {
    const users = await getJson<BackendUser[]>(`${API_URL}/users`);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      about: user.about ?? undefined,
      birthDate: user.birthdate ?? undefined,
      city: user.city ?? undefined,
      gender: user.gender ?? undefined,
      avatar: user.avatar ?? undefined,
    }));
  },
} as const;