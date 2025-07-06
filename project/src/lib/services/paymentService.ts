import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

interface CreateOrderData {
  amount: number;
  courseId: string;
  userId: string;
}

interface OrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  key: string;
}

interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courseId: string;
  userId: string;
  amount: number;
}

interface VerifyPaymentResponse {
  verified: boolean;
  orderId: string;
  paymentId: string;
}

interface PaymentOptions {
  amount: number;
  courseId: string;
  courseName: string;
}

export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  try {
    // Debug logs
    console.log('Creating order with data:', {
      amount: data.amount,
      courseId: data.courseId,
      userId: data.userId,
      API_URL
    });

    const response = await axios.post<OrderResponse>(
      `${API_URL}/payments/create-order`,
      {
        amount: data.amount,
        courseId: data.courseId,
        userId: data.userId
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Order creation response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create order');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create order');
      }
    }
    throw error;
  }
};

export const verifyPayment = async (data: VerifyPaymentData): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axios.post<VerifyPaymentResponse>(
      `${API_URL}/payments/verify`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || typeof response.data.verified !== 'boolean') {
      throw new Error('Invalid verification response from server');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Payment verification failed';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const makePayment = async (options: PaymentOptions) => {
  const { token } = useAuth();
  
  try {
    // Create order
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: options.amount,
        courseId: options.courseId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const orderData = await response.json();

    // Initialize Razorpay
    const razorpay = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: 'INR',
      name: 'Gurukul',
      description: `Payment for ${options.courseName}`,
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          // Verify payment
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          return true;
        } catch (error) {
          console.error('Payment verification error:', error);
          throw error;
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    });

    // Open Razorpay payment window
    razorpay.open();
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};