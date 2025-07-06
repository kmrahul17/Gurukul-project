import winston from 'winston';
import express from 'express';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add console logging if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export const setupLogging = (app: express.Application) => {
  // Log all requests
  app.use((req, res, next) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    next();
  });

  // Log errors
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error({
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    next(err);
  });
};

export { logger };

// Only allow info logs for server start and MongoDB connection
export const logServerStart = (port: number) => {
  logger.info(`Server running on port ${port}`);
};

export const logMongoConnected = () => {
  logger.info('Connected to MongoDB');
};

export const logMongoSuccess = () => {
  logger.info('MongoDB connected successfully');
};