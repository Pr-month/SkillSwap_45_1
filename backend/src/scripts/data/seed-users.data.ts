import { UserRole, Gender } from 'src/users/enums/users.enums';

export const UsersData = [
  {
    name: 'User 1',
    email: 'user1@example.com',
    password: '123456',
    about: 'About user 1',
    birthdate: new Date('2000-01-01'),
    city: 'City 1',
    gender: Gender.MALE,
    avatar: 'https://example.com/avatar1.jpg',
    role: UserRole.USER,
  },
  {
    name: 'User 2',
    email: 'user2@example.com',
    password: '123456',
    about: 'About user 2',
    birthdate: new Date('2000-01-01'),
    city: 'City 2',
    gender: Gender.FEMALE,
    avatar: 'https://example.com/avatar2.jpg',
    role: UserRole.USER,
  },
];
