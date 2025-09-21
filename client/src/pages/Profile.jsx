import React from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <span className="badge badge-success">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input"
                defaultValue={user?.name}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                defaultValue={user?.email}
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="form-label">Preferred Currency</label>
              <select className="input" defaultValue={user?.currency}>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
            <div>
              <label className="form-label">Member Since</label>
              <input
                type="text"
                className="input"
                value={new Date(user?.createdAt).toLocaleDateString()}
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button className="btn-outline">
              Cancel
            </button>
            <button className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="btn-primary">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;