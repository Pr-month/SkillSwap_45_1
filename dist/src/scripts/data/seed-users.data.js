"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersData = void 0;
const users_enums_1 = require("../../users/enums/users.enums");
exports.UsersData = [
    {
        name: 'User 1',
        email: 'user1@example.com',
        password: '123456',
        about: 'About user 1',
        birthdate: new Date('2000-01-01'),
        city: 'City 1',
        gender: users_enums_1.Gender.MALE,
        avatar: 'https://example.com/avatar1.jpg',
        role: users_enums_1.UserRole.USER,
    },
    {
        name: 'User 2',
        email: 'user2@example.com',
        password: '123456',
        about: 'About user 2',
        birthdate: new Date('2000-01-01'),
        city: 'City 2',
        gender: users_enums_1.Gender.FEMALE,
        avatar: 'https://example.com/avatar2.jpg',
        role: users_enums_1.UserRole.USER,
    },
];
//# sourceMappingURL=seed-users.data.js.map