import React from 'react';
import { BookOpen, Users, GraduationCap, TrendingUp, Clock, Award } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Courses',
      value: '24',
      change: '+4 from last month',
      icon: BookOpen,
    },
    {
      title: 'Active Students',
      value: '3,457',
      change: '+20% from last month',
      icon: Users,
    },
    {
      title: 'Course Completion',
      value: '78%',
      change: '+5% from last month',
      icon: GraduationCap,
    },
    {
      title: 'Revenue',
      value: '₹18.5L',
      change: '+12% from last month',
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      type: 'New student registration',
      time: 'Just now',
    },
    {
      type: 'New course published',
      time: '1 hour ago',
    },
    {
      type: 'Payment received',
      time: '3 hours ago',
    },
    {
      type: 'Timetable updated',
      time: 'Yesterday at 10:30 AM',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto"> {/* Added padding and max-width */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your education platform's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Enrollment Overview</h2>
              <p className="text-sm text-gray-600">Monthly student enrollments for current year</p>
            </div>
            <select className="px-3 py-1 border rounded-md text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Placeholder for chart */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-600 w-full rounded-t-lg relative group"
                style={{ height: `${Math.random() * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                  {Math.floor(Math.random() * 100)} enrollments
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-gray-600 mb-4">Latest platform updates</p>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Popular Courses Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Popular Courses</h2>
            <p className="text-sm text-gray-600">Most enrolled courses this month</p>
          </div>
          <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-500">{30 + index} students</span>
              </div>
              <h3 className="font-medium mb-2">Advanced Web Development</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>8 weeks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;