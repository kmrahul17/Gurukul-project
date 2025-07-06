import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentOrder, PaymentVerification, RazorpayOrder } from '../types/payment';
import { logger } from '../utils/logger';
import { Payment } from '../models/Payment';
import { Enrollment } from '../models/Enrollment';

export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    // Remove or comment out logger.info('PaymentService initialized with Razorpay');
  }

  public async createOrder(orderData: PaymentOrder): Promise<RazorpayOrder> {
    try {
      // Validate input
      if (!orderData.amount || orderData.amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!orderData.courseId || !orderData.userId) {
        throw new Error('Missing required fields');
      }

      const options = {
        amount: Math.round(orderData.amount * 100), // Convert to paise
        currency: orderData.currency || 'INR',
        receipt: `order_${Date.now()}_${orderData.courseId}`,
        notes: {
          courseId: orderData.courseId,
          userId: orderData.userId
        }
      };

      // Remove or comment out logger.info('Creating Razorpay order:', options);
      const order = await this.razorpay.orders.create(options);

      // Store order details in database
      const payment = new Payment({
        orderId: order.id,
        amount: orderData.amount,
        courseId: orderData.courseId,
        userId: orderData.userId,
        status: 'created',
        currency: options.currency,
        receipt: options.receipt,
        createdAt: new Date()
      });

      await payment.save();

      // Remove or comment out logger.info('Order created successfully:', { orderId: order.id });
      return order as RazorpayOrder;
    } catch (error) {
      logger.error('Error creating Razorpay order:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create payment order');
    }
  }

  public async verifyPayment(paymentData: PaymentVerification): Promise<boolean> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Missing payment verification data');
      }

      // Generate signature for verification
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(text)
        .digest('hex');

      // Verify signature
      const isValid = signature === razorpay_signature;
      
      if (isValid) {
        // Update payment status in database
        await Payment.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            $set: {
              status: 'completed',
              paymentId: razorpay_payment_id,
              updatedAt: new Date()
            }
          }
        );

        // Remove or comment out logger.info('Payment verified successfully:', { orderId: razorpay_order_id });
        
        // Create enrollment after successful payment
        await this.createEnrollment(razorpay_order_id);
      } else {
        // Remove or comment out logger.warn('Payment signature verification failed:', { orderId: razorpay_order_id });
      }

      return isValid;
    } catch (error) {
      logger.error('Error verifying payment:', error);
      throw error;
    }
  }

  public async createEnrollment(orderId: string): Promise<void> {
    try {
      const payment = await Payment.findOne({ orderId }).populate('course user');

      if (!payment) {
        throw new Error(`Payment not found for order: ${orderId}`);
      }

      if (payment.status !== 'completed') {
        throw new Error(`Payment not completed for order: ${orderId}`);
      }

      // Check for existing enrollment
      const existingEnrollment = await Enrollment.findOne({
        userId: payment.userId,
        courseId: payment.courseId
      });

      if (existingEnrollment) {
        throw new Error('User already enrolled in this course');
      }

      // Create course enrollment
      const enrollment = new Enrollment({
        userId: payment.userId,
        courseId: payment.courseId,
        status: 'ACTIVE',
        enrollmentDate: new Date(),
        paymentId: payment.paymentId
      });

      await enrollment.save();

      // Remove or comment out logger.info('Enrollment created successfully:', {
      //   orderId,
      //   userId: payment.userId,
      //   courseId: payment.courseId
      // });
    } catch (error) {
      logger.error('Error creating enrollment:', error);
      throw error;
    }
  }
}