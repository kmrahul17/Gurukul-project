import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to courses page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/courses');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but your payment could not be processed. Please try again or contact support.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to courses page in 5 seconds...
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/courses')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 