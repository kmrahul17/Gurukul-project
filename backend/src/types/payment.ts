export interface PaymentOrder {
  amount: number;
  currency: string;
  courseId: string;
  userId: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: string | number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}