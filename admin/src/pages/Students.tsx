import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Course {
  title: string;
  image: string;
  description: string;
  duration_weeks: number;
  level: string;
  price: number;
}

interface Enrollment {
  _id: string;
  userId: string;
  email: string;
  courseId: string;
  course?: Course;
  courseName: string;
  price: number;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

const Students = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [latestEnrollment, setLatestEnrollment] = useState<Enrollment | null>(null);
  const [previousCount, setPreviousCount] = useState(0);

  // Function to fetch enrollments
  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/enrollments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }

      const data = await response.json();
      
      // Check for new enrollment by comparing counts
      if (data.length > previousCount && previousCount !== 0) {
        const newEnrollment = data[0]; // Assuming data is sorted by latest first
        if (newEnrollment && newEnrollment.email) {
          setLatestEnrollment(newEnrollment);
          setShowNotification(true);
          const courseName = newEnrollment.course?.title || newEnrollment.courseName || 'the course';
          toast.success(`${newEnrollment.email} has enrolled in ${courseName}`);
        }
      }
      
      setPreviousCount(data.length);
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new enrollments every 30 seconds
  useEffect(() => {
    fetchEnrollments();
    const interval = setInterval(fetchEnrollments, 30000);
    return () => clearInterval(interval);
  }, []);

  // Notification component
  const EnrollmentNotification = () => {
    if (!showNotification || !latestEnrollment) return null;

    const courseName = latestEnrollment.course?.title || latestEnrollment.courseName || 'the course';

    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-up">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="font-medium">New Enrollment!</p>
            <p className="text-sm text-gray-500">
              {latestEnrollment.email} has enrolled in {courseName}
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Student Enrollments</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <tr key={enrollment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{enrollment.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.course?.title || enrollment.courseName || 'Unknown Course'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Duration: {enrollment.course?.duration_weeks || 'N/A'} weeks • Level: {enrollment.course?.level || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{enrollment.course?.price || enrollment.price || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : enrollment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EnrollmentNotification />
    </div>
  );
};

export default Students;