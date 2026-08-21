"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = exports.loggerOptions = void 0;
const winston = __importStar(require("winston"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const nest_winston_1 = require("nest-winston");
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    try {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    catch (error) {
        console.error('Failed to create logs directory:', error);
    }
}
const logLevel = process.env.LOG_LEVEL || 'info';
const timestampFormat = winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
});
const consoleFormat = winston.format.combine(timestampFormat, winston.format.printf(({ timestamp, level, message, context }) => {
    const ctx = typeof context === 'string' ? ` [${context}]` : '';
    return `${timestamp} ${level}${ctx}: ${message}`;
}));
const fileFormat = winston.format.combine(timestampFormat, winston.format.json());
exports.loggerOptions = {
    level: logLevel,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({
            filename: path.join(logsDir, 'application.log'),
            format: fileFormat,
            maxFiles: 30,
            maxsize: 10485760,
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'errors.log'),
            level: 'error',
            format: fileFormat,
            maxFiles: 30,
            maxsize: 10485760,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'rejections.log'),
        }),
    ],
};
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger(exports.loggerOptions);
//# sourceMappingURL=winston.logger.js.map