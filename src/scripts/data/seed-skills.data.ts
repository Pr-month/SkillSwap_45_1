import { UsersData } from 'src/scripts/data/seed-users.data';

export interface SeedCreateSkill {
  title: string;
  description?: string;
  category?: string;
  images?: string[];
  owner: string;
}

export const SkillsData: SeedCreateSkill[] = [
  {
    title: 'React',
    description: 'React is a JavaScript library for building user interfaces.',
    category: 'Frontend',
    images: ['https://example.com/image1.jpg'],
    owner: UsersData[0].email,
  },
  {
    title: 'Node.js',
    description: 'Node.js is a JavaScript runtime environment.',
    category: 'Backend',
    images: ['https://example.com/image2.jpg'],
    owner: UsersData[1].email,
  },
];
