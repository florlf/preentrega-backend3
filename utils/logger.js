const { createLogger, format, transports } = require('winston');
const path = require('path');

const levels = {
  error: 0,
  http: 1,
  info: 2,
  debug: 3
};

const logger = createLogger({
  levels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    }),
    
    new transports.File({
      filename: path.join(__dirname, '../../logs/http.log'),
      level: 'http',
      maxsize: 5242880,
      maxFiles: 5
    }),
    
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
        )
      )
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
    level: 'debug'
  }));
}

module.exports = logger;