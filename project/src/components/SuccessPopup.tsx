import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, courseName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewCourses = () => {
    navigate('/my-courses');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enrollment Successful!</h3>
          <p className="text-sm text-gray-500 mb-4">
            You have successfully enrolled in {courseName}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleViewCourses}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View My Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup; 