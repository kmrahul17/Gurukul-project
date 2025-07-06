export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration_weeks: number;
  level: string;
  language: string;
  image: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
  };
  syllabus?: string[] | {
    title: string;
    fileUrl: string;
  };
  timetable?: {
    [key: string]: string;
  };
  created_at?: Date;
}

const API_URL = import.meta.env.VITE_API_URL;

const courseService = {
  getAllCourses: async (): Promise<ICourse[]> => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCourseById: async (id: string): Promise<ICourse> => {
    try {
      if (!id) {
        throw new Error('Course ID is required');
      }

      // Handle case where courseId might be an object
      const courseId = typeof id === 'object' ? (id as any)?._id : id;
      
      if (!courseId || typeof courseId !== 'string') {
        throw new Error('Invalid course ID format');
      }

      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(errorData.message || 'Course not found');
        }
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid course ID');
        }
        throw new Error(errorData.message || 'Failed to fetch course');
      }
      
      const data = await response.json();
      if (!data) throw new Error('No data returned from API');
      
      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch course');
    }
  }
};
export default courseService;