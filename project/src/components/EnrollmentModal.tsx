import React from 'react';
import { X } from 'lucide-react';

interface EnrollmentModalProps {
  course: {
    title: string;
    price: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EnrollmentModal = ({ course, isOpen, onClose, onConfirm }: EnrollmentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Confirm Enrollment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium">Course Details</h4>
            <p className="text-gray-600">{course.title}</p>
            <p className="text-xl font-bold mt-2">₹{course.price}</p>
          </div>
          
          <div className="py-4">
            <button
              onClick={onConfirm}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Proceed to Pay
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;