"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.multerOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './public/uploads',
        filename: (_req, file, callback) => {
            const fileExtName = (0, path_1.extname)(file.originalname);
            const safeName = file.originalname
                .replace(fileExtName, '')
                .replace(/[^a-zA-Z0-9-_]/g, '-');
            const fileName = `${safeName}-${Date.now()}${fileExtName}`;
            callback(null, fileName);
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
};
//# sourceMappingURL=multer.config.js.map