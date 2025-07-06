const MERCHANT_KEY = 'YFg5PU';
const MERCHANT_SALT = 'kAZSfSmdsHfWC3olIUZnxBgjIsaWzRvT';
const PAYU_BASE_URL = 'https://test.payu.in'; // Change to 'https://secure.payu.in' for production

interface PaymentOptions {
  amount: number;
  courseId: string;
  courseName: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
}

interface TransactionStatus {
  status: string;
  txnid: string;
  mihpayid: string;
  error: string;
}

interface RefundOptions {
  txnid: string;
  amount: number;
  reason: string;
}

interface SettlementDetails {
  settlementId: string;
  amount: number;
  date: string;
  status: string;
}

interface EMIEligibility {
  eligible: boolean;
  minAmount: number;
  maxAmount: number;
  banks: Array<{
    bankCode: string;
    bankName: string;
    interestRate: number;
  }>;
}

interface InvoiceOptions {
  amount: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  dueDate?: string;
}

export const createPaymentForm = async (options: PaymentOptions) => {
  try {
    // Create a transaction ID
    const txnid = `TXN${Date.now()}`;
    
    // Create the payment data
    const paymentData = {
      key: MERCHANT_KEY,
      txnid,
      amount: options.amount,
      productinfo: options.courseName,
      firstname: options.userName,
      email: options.userEmail,
      phone: options.userPhone || '9999999999',
      surl: `${import.meta.env.VITE_API_URL}/payments/success`,
      furl: `${import.meta.env.VITE_API_URL}/payments/failure`,
      hash: '',
      service_provider: 'payu_paisa',
      udf1: options.courseId,
      udf2: options.userId
    };

    // Generate hash
    const hashString = `${MERCHANT_KEY}|${txnid}|${options.amount}|${options.courseName}|${options.userName}|${options.userEmail}|${options.courseId}|${options.userId}|||||||||${MERCHANT_SALT}`;
    const hash = await generateHash(hashString);
    paymentData.hash = hash;

    // Create the form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${PAYU_BASE_URL}/_payment`;

    // Add form fields
    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    // Submit the form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return { txnid };
  } catch (error) {
    console.error('Error creating payment form:', error);
    throw error;
  }
};

export const checkTransactionStatus = async (txnid: string): Promise<TransactionStatus> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/status/${txnid}`);
    if (!response.ok) {
      throw new Error('Failed to check transaction status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

export const initiateRefund = async (options: RefundOptions): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate refund');
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating refund:', error);
    throw error;
  }
};

export const checkRefundStatus = async (refundId: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/refund/${refundId}`);
    if (!response.ok) {
      throw new Error('Failed to check refund status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking refund status:', error);
    throw error;
  }
};

export const getSettlementDetails = async (): Promise<SettlementDetails[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/settlements`);
    if (!response.ok) {
      throw new Error('Failed to fetch settlement details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching settlement details:', error);
    throw error;
  }
};

export const checkEMIEligibility = async (amount: number): Promise<EMIEligibility> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/emi-eligibility?amount=${amount}`);
    if (!response.ok) {
      throw new Error('Failed to check EMI eligibility');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking EMI eligibility:', error);
    throw error;
  }
};

export const createInvoice = async (options: InvoiceOptions): Promise<{ invoiceId: string; invoiceUrl: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const expireInvoice = async (invoiceId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/invoice/${invoiceId}/expire`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to expire invoice');
    }

    return await response.json();
  } catch (error) {
    console.error('Error expiring invoice:', error);
    throw error;
  }
};

const generateHash = async (string: string): Promise<string> => {
  // In a real implementation, you would use a proper SHA-512 hash function
  // For now, we'll use a simple hash function
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}; 