import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import courseService, { type ICourse } from '../lib/services/courseService';

interface EnrolledCourse {
  _id: string;
  courseId: string | {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    duration_weeks: number;
    level: string;
    instructor: {
      name: string;
      title: string;
      image: string;
    };
  };
  status: 'active' | 'completed';
  enrolledAt: string;
  userId: string;
  email: string;
  courseName: string;
  price: number;
}

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Successfully Enrolled!</h3>
          <p className="text-gray-600 mb-6">
            Congratulations! You have successfully enrolled in this course. You can now access your course materials.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue to Course
          </button>
        </div>
      </div>
    </div>
  );
};

const MyCourses = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('payment') === 'success') {
      setShowSuccessModal(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  useEffect(() => {
    const fetchEnrollmentsAndCourses = async () => {
      try {
        if (!user?.id) {
          navigate('/signin');
          return;
        }

        // Fetch enrollments using the new authenticated route
        const enrollmentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/my-courses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!enrollmentsResponse.ok) {
          throw new Error('Failed to fetch enrollments');
        }

        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);

        // Fetch course details for each enrollment
        const coursePromises = enrollmentsData.map((enrollment: EnrolledCourse) => {
          if (!enrollment.courseId) return Promise.resolve(null);
          const courseId = typeof enrollment.courseId === 'string' ? enrollment.courseId : enrollment.courseId._id;
          if (!courseId) return Promise.resolve(null);
          return courseService.getCourseById(courseId);
        });
        
        const coursesData = await Promise.all(coursePromises);
        setCourses(coursesData.filter(Boolean));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsAndCourses();
  }, [user, navigate, token]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            You haven't enrolled in any courses yet
          </h2>
          <Link 
            to="/courses" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            if (!course || !course._id) return null;
            const enrollment = enrollments.find(e => {
              if (!e.courseId) return false;
              if (typeof e.courseId === 'string') return e.courseId === course._id;
              return e.courseId._id === course._id;
            });
            return (
              <div key={`${course._id}-${enrollment?._id || index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video w-full">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Course+Image";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      enrollment?.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {enrollment?.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center mb-4">
                    <img
                      src={course.instructor?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}`}
                      alt={course.instructor?.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{course.instructor?.name}</span>
                      <p className="text-xs text-gray-500">{course.instructor?.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{course.duration_weeks} weeks</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm">{course.level}</span>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal 
          isOpen={showSuccessModal} 
          onClose={() => setShowSuccessModal(false)} 
        />
      )}
    </div>
  );
};

export default MyCourses;