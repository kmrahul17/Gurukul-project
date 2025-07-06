import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService, { type ICourse } from '../models/services/courseService';
import PDFUpload from '../components/PDFUpload';
import ImageUpload from '../components/ImageUpload';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration_weeks: '',
    level: 'Beginner',
    language: '',
    image: '',
    instructor: {
      name: '',
      title: '',
      bio: '',
      image: ''
    },
    syllabus: {
      title: '',
      fileUrl: ''
    },
    timetable: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: ''
    } as { [key: string]: string }
  });
  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      if (!id) return;
      const course = await courseService.getCourseById(id);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        duration_weeks: course.duration_weeks.toString(),
        level: course.level,
        language: course.language,
        image: course.image || '',
        instructor: course.instructor || {
          name: '',
          title: '',
          bio: '',
          image: ''
        },
        syllabus: course.syllabus || {
          title: '',
          fileUrl: ''
        },
        timetable: course.timetable || {
          sunday: '',
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: ''
        }
      });
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Log form data for debugging
      console.log('Form data being submitted:', formData);
  
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.duration_weeks) {
        throw new Error('Please fill in all required fields');
      }
  
      // Validate instructor fields with trimmed values
      const { instructor } = formData;
      if (!instructor?.name?.trim() || 
          !instructor?.title?.trim() || 
          !instructor?.bio?.trim() || 
          !instructor?.image?.trim()) {
        console.log('Invalid instructor data:', instructor);
        throw new Error('All instructor fields are required');
      }
  
      // Validate syllabus
      if (!formData.syllabus.fileUrl) {
        throw new Error('Please upload a syllabus PDF');
      }
  
      const courseDataToSend: Partial<ICourse> = {
        ...formData,
        price: Number(formData.price),
        duration_weeks: Number(formData.duration_weeks),
        instructor: {
          name: instructor.name.trim(),
          title: instructor.title.trim(),
          bio: instructor.bio.trim(),
          image: instructor.image.trim()
        },
        syllabus: {
          title: formData.syllabus.title || 'Course Syllabus',
          fileUrl: formData.syllabus.fileUrl
        },
        timetable: formData.timetable
      };
  
      if (id) {
        await courseService.updateCourse(id, courseDataToSend as ICourse);
      } else {
        await courseService.createCourse(courseDataToSend as ICourse);
      }
      
      navigate('/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('instructor.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            instructor: {
                ...prev.instructor,
                [field]: value
            }
        }));
        // Log instructor data after update
        console.log('Updated instructor data:', formData.instructor);
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
};
  

  

  
  const handleTimetableChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [day]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{id ? 'Edit Course' : 'Add New Course'}</h1>
      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
          <input
            type="number"
            name="duration_weeks"
            id="duration_weeks"
            required
            min="1"
            value={formData.duration_weeks}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
          <select
            name="level"
            id="level"
            required
            value={formData.level}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
          <input
            type="text"
            name="language"
            id="language"
            required
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>
        <div className="border-t pt-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">Course Image</h2>
  <ImageUpload
    currentImage={formData.image}
    onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
    label="Course Cover Image"
  />
</div>
        {/* Instructor Section */}

        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructor Details</h2>
          
          <div className="space-y-4">
            <ImageUpload
              currentImage={formData.instructor.image}
              onImageChange={(url) => 
                setFormData(prev => ({
                  ...prev,
                  instructor: { ...prev.instructor, image: url }
                }))
              }
              label="Instructor Photo"
            />

            <div>
              <label htmlFor="instructor.name" className="block text-sm font-medium text-gray-700">
                Instructor Name
              </label>
              <input
                type="text"
                name="instructor.name"
                id="instructor.name"
                value={formData.instructor.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
              />
            </div>

    <div>
      <label htmlFor="instructor.title" className="block text-sm font-medium text-gray-700">
        Title/Position
      </label>
      <input
        type="text"
        name="instructor.title"
        id="instructor.title"
        value={formData.instructor.title}
        onChange={handleChange}
        required
        className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
      />
    </div>

    <div>
      <label htmlFor="instructor.bio" className="block text-sm font-medium text-gray-700">
        Bio
      </label>
      <textarea
        name="instructor.bio"
        id="instructor.bio"
        value={formData.instructor.bio}
        onChange={handleChange}
        required
        rows={4}
        className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
      />
    </div>

    
  </div>
</div>


        {/* Syllabus Section */}
        <div className="border-t pt-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Course Syllabus</h2>
        <PDFUpload
          currentFile={formData.syllabus.fileUrl}
          onFileChange={(url) => 
            setFormData(prev => ({
              ...prev,
              syllabus: {
                title: 'Course Syllabus',
                fileUrl: url
              }
            }))
          }
          label="Upload Syllabus PDF"
        />
      </div>

        {/* Timetable Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Timetable</label>
          {Object.keys(formData.timetable).map((day) => (
            <div key={day} className="flex gap-4 items-center">
              <label className="w-24 text-sm text-gray-600 capitalize">{day}</label>
              <input
                type="text"
                value={formData.timetable[day as keyof typeof formData.timetable]}
                onChange={(e) => handleTimetableChange(day, e.target.value)}
                placeholder="e.g., 9:00 AM - 11:00 AM"
                className="flex-1 rounded border-gray-300 shadow-sm p-2"
              />
            </div>
          ))}
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
            {loading ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Course' : 'Add Course')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;