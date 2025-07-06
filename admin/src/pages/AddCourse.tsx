import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../models/services/courseService';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData(e.currentTarget);
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration_weeks: Number(formData.get('duration_weeks')),
      level: formData.get('level') as string,
      language: formData.get('language') as string,
      instructor: {
        name: formData.get('instructor.name') as string,
        title: formData.get('instructor.title') as string,
        bio: formData.get('instructor.bio') as string,
        image: formData.get('instructor.image') as string
      },
      syllabus: [],
      timetable: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: ''
      }
    };
  
    try {
      await courseService.createCourse(courseData);
      navigate('/courses');
    } catch (err) {
      setError('Failed to create course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Course</h1>
      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700">
            Duration (weeks)
          </label>
          <input
            type="number"
            name="duration_weeks"
            id="duration_weeks"
            required
            min="1"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            name="level"
            id="level"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <input
            type="text"
            name="language"
            id="language"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;