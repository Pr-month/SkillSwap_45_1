"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AllExceptionFilter = class AllExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof typeorm_1.EntityNotFoundError) {
            return response.status(404).json({
                statusCode: 404,
                message: 'Entity not found',
            });
        }
        if (exception instanceof common_1.PayloadTooLargeException) {
            return response.status(413).json({
                statusCode: 413,
                message: 'Payload too large',
            });
        }
        if (exception instanceof typeorm_1.QueryFailedError) {
            const error = exception;
            if (error.code === '23505') {
                return response.status(409).json({
                    statusCode: 409,
                    message: 'Dublicate entry',
                });
            }
        }
        response.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};
exports.AllExceptionFilter = AllExceptionFilter;
exports.AllExceptionFilter = AllExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionFilter);
//# sourceMappingURL=all-exception.filter.js.map