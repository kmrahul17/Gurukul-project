import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Award, Globe, ShoppingCart } from 'lucide-react';
import courseService, { ICourse } from '../lib/services/courseService';
import EnrollmentModal from '../components/EnrollmentModal';
import PaymentModal from '../components/PaymentModal';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

interface ReviewType {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
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
            Congratulations! You have successfully enrolled in this course.
          </p>
          <div className="space-y-3">
            <Link
              to="/my-courses"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Access Your Course
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [userReview, setUserReview] = useState<ReviewType | null>(null);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowPaymentModal(true);
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/course/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);
      
      // Find the user's review if it exists
      if (user) {
        const userReview = data.find((review: ReviewType) => review.userId === user.id);
        setUserReview(userReview || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setToast({
        message: 'Failed to load reviews',
        type: 'error'
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      if (!user?.id) {
        throw new Error('Please login to submit a review');
      }

      const url = userReview 
        ? `${import.meta.env.VITE_API_URL}/reviews/${userReview._id}`
        : `${import.meta.env.VITE_API_URL}/reviews`;

      const method = userReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: id,
          rating,
          comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setToast({
        message: userReview ? 'Review updated successfully!' : 'Review submitted successfully!',
        type: 'success'
      });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to submit review',
        type: 'error'
      });
      throw error;
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) {
          setError('Course ID is missing');
          return;
        }
        
        const data = await courseService.getCourseById(id);
        setCourse(data);
        fetchReviews();
      } catch (err) {
        console.error('Error fetching course:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load course details');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const mockReviews: ReviewType[] = [
    {
      _id: '1',
      userId: 'user1',
      rating: 5,
      comment: 'Excellent course! The instructor was very knowledgeable and the content was well-structured.',
      createdAt: '2024-03-15T10:00:00Z',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      _id: '2',
      userId: 'user2',
      rating: 4,
      comment: 'Great content, but some sections could use more examples.',
      createdAt: '2024-03-14T15:30:00Z',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }
  ];

  const renderSyllabusPreview = (syllabus: ICourse['syllabus']) => {
    if (!syllabus || !course) return null;
    
    if (Array.isArray(syllabus)) {
      return (
        <div className="space-y-4">
          {syllabus.slice(0, 4).map((item: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
          {syllabus.length > 4 && (
            <div className="text-blue-600 font-medium mt-4">
              +{syllabus.length - 4} more topics
            </div>
          )}
        </div>
      );
    } else if (typeof syllabus === 'object' && 'fileUrl' in syllabus) {
      return (
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700">{syllabus.title}</p>
          </div>
          <a
            href={syllabus.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Syllabus PDF
          </a>
        </div>
      );
    }
    
    return null;
  };

  const renderFullSyllabus = (syllabus: ICourse['syllabus']) => {
    if (!syllabus || !course) return null;
    
    if (typeof syllabus === 'object' && 'fileUrl' in syllabus) {
      return (
        <div className="space-y-8">
          {/* Course Overview */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Course Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700">Duration: {course.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700">Level: {course.level}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700">Language: {course.language}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700">Certificate of Completion</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-gray-700">Self-paced Learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{syllabus.title}</p>
              </div>
            </div>
          </div>

          {/* Syllabus Download */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Detailed Syllabus</h3>
            <a
              href={syllabus.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Syllabus PDF
            </a>
          </div>

          {/* Course Requirements */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Course Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Basic understanding of the subject matter</li>
              <li>Access to a computer with internet connection</li>
              <li>Dedication to complete the course</li>
              <li>Willingness to participate in discussions</li>
            </ul>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!course) return <div className="text-gray-600 p-4">Course not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2">
          <div className="bg-blue-50 inline-block px-3 py-1 rounded-full mb-4">
            <span className="text-blue-600">{course.level}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">4.8</span>
            </div>
            <span className="mx-2">•</span>
            <span>2345 students</span>
            <span className="mx-2">•</span>
            <span>Last updated {new Date(course.created_at || '').toLocaleDateString()}</span>
          </div>

              <div className="border-b">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-6">
              {activeTab === 'overview' && (
                  <div>
    <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
    <p className="text-gray-600 mb-6">{course.description}</p>
                    
                    {/* Course Highlights */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Course Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Hands-on Projects</h4>
                              <p className="text-gray-600">Real-world projects to apply your learning</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Expert Support</h4>
                              <p className="text-gray-600">Get help from industry experts</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Career Guidance</h4>
                              <p className="text-gray-600">Career support and job placement assistance</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Lifetime Access</h4>
                              <p className="text-gray-600">Access course materials anytime, anywhere</p>
                            </div>
                          </div>
                        </div>
                      </div>
        </div>
      </div>
    )}

{activeTab === 'syllabus' && (
                  <div className="space-y-8">
                    {/* Detailed Syllabus */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Detailed Syllabus</h3>
                        
                        {typeof course.syllabus === 'object' && 'fileUrl' in course.syllabus ? (
                          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Syllabus PDF Available</h4>
                            <p className="text-gray-600 mb-4">Download the complete course syllabus</p>
                            <a
                              href={course.syllabus.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
                              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Syllabus
            </a>
          </div>
                        ) : (
                          <div className="space-y-6">
                            {Array.isArray(course.syllabus) && course.syllabus.map((item: string, index: number) => (
                              <div 
                                key={index} 
                                className="group flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                  <span className="text-blue-600 font-medium">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {item}
                                  </h4>
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Estimated time: 2-3 hours
                                  </div>
                                </div>
                                <button className="ml-4 p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            ))}
        </div>
                        )}
                      </div>
                    </div>

                    {/* Course Requirements */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Course Requirements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Basic Understanding</h4>
                              <p className="text-gray-600">Basic knowledge of the subject matter</p>
                            </div>
                          </div>
                          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Technical Requirements</h4>
                              <p className="text-gray-600">Computer with internet connection</p>
                            </div>
                          </div>
                          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Time Commitment</h4>
                              <p className="text-gray-600">Dedication to complete the course</p>
                            </div>
                          </div>
                          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Active Participation</h4>
                              <p className="text-gray-600">Willingness to participate in discussions</p>
                            </div>
                          </div>
                        </div>
                      </div>
    </div>
  </div>
)}

{activeTab === 'instructor' && (
  <div>
    <div className="flex items-center mb-6">
      <img
        src={course.instructor.image}
        alt={course.instructor.name}
        className="w-24 h-24 rounded-full object-cover"
        onError={(e) => {
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(course.instructor.name) + "&background=random";
        }}
      />
      <div className="ml-6">
        <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
        <p className="text-gray-600">{course.instructor.title}</p>
      </div>
    </div>
    <p className="text-gray-600 mb-4">
      {course.instructor.bio}
    </p>
  </div>
)}

                {activeTab === 'timetable' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(course.timetable || {}).map(([day, time]) => 
                        time ? (
                          <div key={day} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2 capitalize">{day}</h4>
                            <p className="text-gray-600">{time}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="mt-8">
                    {user ? (
                      userReview ? (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-4">Your Review</h3>
                          <ReviewForm
                            courseId={id || ''}
                            onSubmit={handleReviewSubmit}
                            initialRating={userReview.rating}
                            initialComment={userReview.comment}
                            isEditing
                          />
                      </div>
                      ) : (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                          <ReviewForm
                            courseId={id || ''}
                            onSubmit={handleReviewSubmit}
                          />
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Please login to write a review</p>
                        <Link
                          to="/signin"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Sign in
                        </Link>
                    </div>
                    )}
                    
                    <h3 className="text-lg font-semibold mb-4">All Reviews</h3>
                    {isLoadingReviews ? (
                      <div className="text-center py-8">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-600">No reviews yet</div>
                    ) : (
                      <ReviewList
                        reviews={reviews}
                        courseId={id || ''}
                        onReviewUpdate={fetchReviews}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Course Image and Enrollment */}
            <div className="lg:col-span-1">
  <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
    {course.image && (
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x300?text=" + encodeURIComponent(course.title);
          }}
        />
      </div>
    )}
    <div className="text-3xl font-bold mb-4">₹{course.price}</div>
    <button
                  onClick={handleEnrollClick}
    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6 flex items-center justify-center"
  >
    <ShoppingCart className="w-5 h-5 mr-2" />
    Enroll Now
  </button>

    <div className="space-y-4">
      <div className="flex items-center">
        <Clock className="w-5 h-5 text-gray-600" />
        <span className="ml-2">{course.duration_weeks} weeks duration</span>
      </div>
      <div className="flex items-center">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <span className="ml-2">{course.level} level</span>
      </div>
      <div className="flex items-center">
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="ml-2">{course.language}</span>
      </div>
      <div className="flex items-center">
        <Award className="w-5 h-5 text-gray-600" />
        <span className="ml-2">Certificate of completion</span>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>

        {showPaymentModal && course && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          course={course}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
);
};

export default CourseDetails;