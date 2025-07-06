import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, FileText } from 'lucide-react';
import courseService, { type ICourse } from '../models/services/courseService';

const Courses = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(prevCourses => prevCourses.filter(course => course._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete course. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <Link 
          to="/courses/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {course.image && (
              <div className="aspect-video w-full">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${course.image}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x300?text=Course+Image";
                  }}
                  crossOrigin="anonymous"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">₹{course.price}</span>
                <span className="text-sm text-gray-500">{course.duration_weeks} weeks</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {course.level}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {course.language}
                </span>
              </div>

              {course.instructor && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Instructor:</h3>
                  <div className="flex items-center">
                    {course.instructor.image && (
                      <img
                        src={course.instructor.image}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full mr-2"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/40x40?text=Instructor";
                        }}
                      />
                    )}
                    <div>
                      <p className="font-medium">{course.instructor.name}</p>
                      <p className="text-sm text-gray-600">{course.instructor.title}</p>
                    </div>
                  </div>
                </div>
              )}

              {course.syllabus && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Syllabus:</h3>
                  <a
                    href={course.syllabus.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {course.syllabus.title}
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Link
                  to={`/courses/edit/${course._id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  disabled={deleteLoading === course._id}
                  className="text-red-600 hover:text-red-900 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {deleteLoading === course._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No courses found. Click "Add New Course" to create one.
        </div>
      )}
    </div>
  );
};

export default Courses;