"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsData = void 0;
const seed_users_data_1 = require("./seed-users.data");
exports.SkillsData = [
    {
        title: 'React',
        description: 'React is a JavaScript library for building user interfaces.',
        category: 'Frontend',
        images: ['https://example.com/image1.jpg'],
        owner: seed_users_data_1.UsersData[0].email,
    },
    {
        title: 'Node.js',
        description: 'Node.js is a JavaScript runtime environment.',
        category: 'Backend',
        images: ['https://example.com/image2.jpg'],
        owner: seed_users_data_1.UsersData[1].email,
    },
];
//# sourceMappingURL=seed-skills.data.js.map