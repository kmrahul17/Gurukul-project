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
  syllabus: {
    title: string;
    fileUrl: string;
  };
  timetable: {
    [key: string]: string;
  };
  created_at?: Date;
}

const API_URL = import.meta.env.VITE_API_URL;

const courseService = {
  async getAllCourses(): Promise<ICourse[]> {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getCourseById(id: string): Promise<ICourse> {
    const response = await fetch(`${API_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  async createCourse(courseData: Omit<ICourse, '_id' | 'created_at'>): Promise<ICourse> {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create course');
    }

    return response.json();
  },

  async updateCourse(id: string, courseData: Partial<ICourse>): Promise<ICourse> {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update course');
    }

    return response.json();
  }
};

export default courseService;