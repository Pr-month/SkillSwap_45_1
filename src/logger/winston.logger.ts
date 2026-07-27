import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import { WinstonModule } from 'nest-winston';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create logs directory:', error);
  }
}

const logLevel = process.env.LOG_LEVEL || 'info';

const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

const consoleFormat = winston.format.combine(
  timestampFormat,
  winston.format.printf(({ timestamp, level, message, context }) => {
    const ctx = typeof context === 'string' ? ` [${context}]` : '';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${timestamp} ${level}${ctx}: ${message}`;
  }),
);

const fileFormat = winston.format.combine(
  timestampFormat,
  winston.format.json(),
);

export const loggerOptions: winston.LoggerOptions = {
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

export const winstonLogger = WinstonModule.createLogger(loggerOptions);
