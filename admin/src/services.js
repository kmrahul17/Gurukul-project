const API_URL = import.meta.env.VITE_API_URL;

const courseService = {
  getAllCourses: async () => {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getCourseById: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  createCourse: async (courseData) => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create course');
      }

      return data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  deleteCourse: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message
    };
  }
};

export { courseService as default }; 