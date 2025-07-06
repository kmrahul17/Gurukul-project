import React from 'react';

const Notifications = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Notification Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>New course enrollments</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Student messages</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Course reviews</span>
              </label>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">System Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Security alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Maintenance updates</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;