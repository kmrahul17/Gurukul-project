import React from 'react';

const Profile = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <img
              src="https://placehold.co/100"
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Change Photo
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue="Admin User"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              defaultValue="admin@example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;