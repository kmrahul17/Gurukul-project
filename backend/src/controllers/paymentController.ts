import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Payment } from '../models/Payment';
import { Enrollment } from '../models/Enrollment';
import { logger } from '../utils/logger';
import Course from '../models/Course';
import User from '../models/User';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, courseId } = req.body;
    const userId = req.user?.id;

    // Remove or comment out logger.info('Creating order with data:', { amount, courseId, userId });

    if (!amount || !courseId || !userId) {
      // Remove or comment out logger.warn('Missing required fields:', { amount, courseId, userId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Remove or comment out logger.error('Razorpay credentials not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    // Ensure userId is a valid ObjectId
    let validUserId: mongoose.Types.ObjectId;
    try {
      validUserId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // In development mode, ensure the user exists or create one
    if (process.env.NODE_ENV === 'development') {
      const existingUser = await User.findById(validUserId);
      if (!existingUser) {
        // Create a development user
        const devUser = new User({
          _id: validUserId,
          email: 'admin@gurukul.com',
          name: 'Admin User',
          password: 'hashed_password_placeholder' // This won't be used for login in dev mode
        });
        await devUser.save();
      }
    }

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId,
        userId: validUserId.toString()
      }
    };

    // Remove or comment out logger.info('Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      status: 'created',
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: validUserId
    });

    await payment.save();

    // Remove or comment out logger.info('Payment record created:', { paymentId: payment._id, orderId: order.id });

    res.json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt
    });
  } catch (error) {
    // Remove or comment out logger.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    // Remove or comment out logger.info('Verifying payment:', { razorpay_order_id, razorpay_payment_id, courseId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      // Remove or comment out logger.warn('Missing payment verification details');
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update payment status
      const payment = await Payment.findOne({ orderId: razorpay_order_id });
      if (payment) {
        payment.status = 'completed';
        payment.paymentId = razorpay_payment_id;
        await payment.save();

        // Remove or comment out logger.info('Payment verified and updated:', { paymentId: payment._id });

        // Get course details
        const course = await Course.findById(courseId);
        if (!course) {
          // Remove or comment out logger.error('Course not found:', { courseId });
          return res.status(404).json({ error: 'Course not found' });
        }

        // Get user details
        const user = await User.findById(payment.userId);
        if (!user) {
          // Remove or comment out logger.error('User not found:', { userId: payment.userId });
          return res.status(404).json({ error: 'User not found' });
        }

        // Create enrollment with all required fields
        const enrollment = new Enrollment({
          userId: payment.userId,
          courseId: payment.courseId,
          email: user.email,
          courseName: course.title,
          price: course.price,
          status: 'active',
          enrolledAt: new Date()
        });

        await enrollment.save();

        // Remove or comment out logger.info('Enrollment created:', { enrollmentId: enrollment._id });

        res.json({ success: true, message: 'Payment verified successfully' });
      } else {
        // Remove or comment out logger.warn('Payment record not found:', { orderId: razorpay_order_id });
        res.status(404).json({ error: 'Payment record not found' });
      }
    } else {
      // Remove or comment out logger.warn('Invalid payment signature');
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    // Remove or comment out logger.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 