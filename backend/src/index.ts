import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { connectDB } from './config/db';
import courseRoutes from './routes/courseRoutes';
import uploadRoutes from './routes/uploadRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import authRoutes from './routes/authRoutes';
import reviewRoutes from './routes/reviewRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { Payment } from './models/Payment';

// Load environment variables first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://test.payu.in", "http://localhost:5173", "http://localhost:5174"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "http://localhost:5173", "http://localhost:5174"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:", "http://localhost:5173", "http://localhost:5174"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:", "http://localhost:5173", "http://localhost:5174"],
      connectSrc: ["'self'", "https://test.payu.in", "http://localhost:5173", "http://localhost:5174", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "http://localhost:5000"],
      frameSrc: ["'self'", "https://test.payu.in", "http://localhost:5173", "http://localhost:5174"],
      formAction: ["'self'", "https://test.payu.in", "http://localhost:5173", "http://localhost:5174"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://gurukul-project.vercel.app','https://gurukul-project-ansl.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(async () => {
    logger.info('Connected to MongoDB');
    
    // Drop the txnid index if it exists
    try {
      const indexes = await Payment.collection.indexes();
      const txnidIndex = indexes.find(index => index.name === 'txnid_1');
      if (txnidIndex) {
        await Payment.collection.dropIndex('txnid_1');
        logger.info('Dropped txnid index');
      }
    } catch (error) {
      logger.error('Error checking/dropping txnid index:', error);
    }
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
