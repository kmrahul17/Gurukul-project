import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrder, verifyPayment } from '../controllers/paymentController';

const router = express.Router();

// Create a new order
router.post('/create-order', authenticateToken, createOrder);

// Verify payment
router.post('/verify', authenticateToken, verifyPayment);

export default router; 