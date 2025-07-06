import React from 'react';
import { Calendar } from 'lucide-react';

const Students = () => {
  const students = [
    {
      id: 1,
      name: 'Aditya Patel',
      email: 'aditya.patel@example.com',
      registeredOn: 'April 12, 2023',
      enrolledCourses: ['Data Science Fundamentals', 'AI & Machine Learning'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Neha Singh',
      email: 'neha.singh@example.com',
      registeredOn: 'May 5, 2023',
      enrolledCourses: ['Data Science Fundamentals'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      email: 'rahul.kumar@example.com',
      registeredOn: 'March 18, 2023',
      enrolledCourses: ['Full Stack Web Development', 'AI & Machine Learning'],
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">View and manage enrolled students</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 p-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-gray-600 text-sm">{student.email}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Registered on {student.registeredOn}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Enrolled Courses:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.enrolledCourses.map((course) => (
                      <span
                        key={course}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;