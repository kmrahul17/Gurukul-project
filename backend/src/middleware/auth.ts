import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Bypass token verification in development mode
    if (process.env.NODE_ENV === 'development') {
      req.user = {
        id: '507f1f77bcf86cd799439011', // Fixed valid ObjectId for development
        email: 'admin@gurukul.com',
        role: 'admin'
      };
      return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded as Express.Request['user'];
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.error('Token expired:', { expiredAt: error.expiredAt });
        return res.status(401).json({ 
          message: 'Token expired', 
          error: 'TOKEN_EXPIRED',
          expiredAt: error.expiredAt 
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.error('Invalid token:', error.message);
        return res.status(401).json({ 
          message: 'Invalid token', 
          error: 'INVALID_TOKEN' 
        });
      } else {
        logger.error('Token verification failed:', error);
        return res.status(403).json({ 
          message: 'Token verification failed',
          error: 'VERIFICATION_FAILED'
        });
      }
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};