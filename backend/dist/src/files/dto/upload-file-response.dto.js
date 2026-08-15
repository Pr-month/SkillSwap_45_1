"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadFileResponseDto {
    message;
    url;
    originalName;
    size;
    mimeType;
}
exports.UploadFileResponseDto = UploadFileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Файл успешно загружен' }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '/uploads/file.jpg',
        description: 'Путь к файлу на сервере',
    }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'file.jpg', description: 'Оригинальное имя файла' }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 102400, description: 'Размер файла в байтах' }),
    __metadata("design:type", Number)
], UploadFileResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg', description: 'MIME-тип файла' }),
    __metadata("design:type", String)
], UploadFileResponseDto.prototype, "mimeType", void 0);
//# sourceMappingURL=upload-file-response.dto.js.map