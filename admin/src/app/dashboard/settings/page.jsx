'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { HiOutlineShieldExclamation, HiOutlineLockClosed, HiOutlineCog } from 'react-icons/hi2';

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  // Check if user is admin (handle both string and array formats)
  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
  const isAdmin = userRole?.toLowerCase() === 'administrator' ;

  if (!isAdmin) {
    return (
      <div className="max-w-2xl">
        <h1 className="h1-neu font-bold text-black mb-2">Settings</h1>
        <p className="body-02 text-gray-600 mb-8">Admin settings are only available to administrators</p>

        <div className="bg-white border border-light rounded-lg p-8 text-center">
          <HiOutlineShieldExclamation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="body-02 text-gray-600">You do not have permission to access these settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="h1-neu font-bold text-black mb-2">Settings</h1>
        <p className="body-02 text-gray-600">Manage your admin account and system settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Link href="/dashboard/change-password">
          <div className="bg-white border border-light rounded-lg p-6 hover:border-black transition-colors cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <HiOutlineLockClosed className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="h3-neu font-bold text-black mb-2">Change Password</h3>
                <p className="body-03 text-gray-600">Update your account password to keep it secure</p>
              </div>
            </div>
          </div>
        </Link>

        {/* System Settings */}
        <div className="bg-white border border-light rounded-lg p-6 cursor-not-allowed opacity-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <HiOutlineCog className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="h3-neu font-bold text-black mb-2">System Settings</h3>
              <p className="body-03 text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-12 bg-white border border-light rounded-lg p-6">
        <h2 className="h2-neu font-bold text-black mb-6">Account Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="body-03 text-gray-600 font-semibold mb-2">Full Name</p>
            <p className="body-02 text-black">{user?.fullName || 'N/A'}</p>
          </div>

          <div>
            <p className="body-03 text-gray-600 font-semibold mb-2">Email</p>
            <p className="body-02 text-black">{user?.email || 'N/A'}</p>
          </div>

          <div>
            <p className="body-03 text-gray-600 font-semibold mb-2">Role</p>
            <p className="body-02 text-black">{user?.role || user?.roles?.[0]?.roleName || 'N/A'}</p>
          </div>

          <div>
            <p className="body-03 text-gray-600 font-semibold mb-2">Status</p>
            <p className="body-02">
              <span className={`px-3 py-1 rounded text-xs font-semibold ${user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="h3-neu font-bold text-black mb-2">Need Help?</h3>
        <p className="body-02 text-gray-700">
          For additional assistance or to report issues, please contact the system administrator.
        </p>
      </div>
    </div>
  );
}
