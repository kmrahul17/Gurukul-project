import React from 'react';

const General = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">General Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              defaultValue="Gurukul Admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              defaultValue="admin@gurukul.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className="w-full p-2 border rounded-md">
              <option>UTC</option>
              <option>IST</option>
              <option>EST</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;