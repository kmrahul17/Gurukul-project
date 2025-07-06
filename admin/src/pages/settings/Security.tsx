import React from 'react';

const Security = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Security Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;