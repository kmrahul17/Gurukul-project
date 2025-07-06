interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    prefill?: {
      name?: string;
      email?: string;
    };
    theme?: {
      color: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
  }
  
  interface Razorpay {
    new (options: RazorpayOptions): {
      open: () => void;
    };
  }
  
  declare global {
    interface Window {
      Razorpay: Razorpay;
    }
  }
  
  export {};