import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Clock, Star, ArrowRight } from 'lucide-react';
import courseService, { type ICourse } from '../lib/services/courseService';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const courses = await courseService.getAllCourses();
        setFeaturedCourses(courses.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <div className="bg-blue-50 inline-block px-4 py-1 rounded-full mb-4">
              <span className="text-blue-600">Transforming Education</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Unlock Your Learning Potential
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Gurukul provides an immersive learning experience with expert-led courses, 
              interactive content, and a supportive community to help you achieve your goals.
            </p>
            <div className="space-x-4">
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Explore Courses
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
              alt="Students learning"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">50+</h3>
              <p className="text-gray-600">Expert Instructors</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">100+</h3>
              <p className="text-gray-600">Courses Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-gray-600">Discover our most popular courses</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center">Loading courses...</div>
          ) : (
            featuredCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Course+Image";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                    <span className="text-blue-600 font-semibold">₹{course.price}</span>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-8">Subscribe to our newsletter for the latest courses and updates</p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-md focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-4 py-2 rounded-r-md hover:bg-gray-100"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students who are already learning with Gurukul
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Browse All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;