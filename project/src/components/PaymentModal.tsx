import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import SuccessPopup from './SuccessPopup';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    _id: string;
    name: string;
    price: number;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, course }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, token } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to make a payment');
      return;
    }

    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: course.price,
          courseId: course._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Gurukul',
        description: `Payment for ${course.name}`,
        order_id: data.id,
        prefill: {
          name: user.name || '',
          email: user.email || ''
        },
        handler: async function (response: any) {
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
                razorpay_signature: response.razorpay_signature,
                courseId: course._id
              })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            if (verifyData.success) {
              toast.success('Payment successful! You are now enrolled in the course.');
              setShowSuccess(true);
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
            
            <div className="mb-4">
              <p className="text-gray-600">Course: {course.name}</p>
              <p className="text-gray-600">Amount: ₹{course.price}</p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        courseName={course.name}
      />
    </>
  );
};

export default PaymentModal; 