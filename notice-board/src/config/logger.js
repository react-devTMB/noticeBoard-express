import winston from 'winston';
import path from 'path';
import winstonDaily from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;
const logDir = 'logs';
const maxKeepDays = 7;
const options = {
  format: format.combine(
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, label, timestamp }) => {
      return `${level.toUpperCase().padEnd(5)} ${timestamp} [${label}] - ${message}`;
    })
  ),
  transports: [
    // info level
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: maxKeepDays,
      zippedArchive: true,
    }),
    // error level
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: maxKeepDays,
      zippedArchive: true,
    }),
  ],
};

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize()),
    })
  );
}

export default logger;
