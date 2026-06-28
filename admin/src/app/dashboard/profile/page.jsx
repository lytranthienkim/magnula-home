'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '@/api/config';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function ProfilePage() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile data - từ User model
  const [profileData, setProfileData] = useState({
    id: currentUser?.id || '',
    email: currentUser?.email || '',
    fullName: currentUser?.fullName || '',
    isActive: currentUser?.isActive !== false,
    createdAt: null,
    updatedAt: null,
    roles: currentUser?.roles || [],
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data?.data) {
          const userData = res.data.data;
          setProfileData({
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName || '',
            isActive: userData.isActive !== false,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            roles: userData.roles || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setChangingPassword(true);
    try {
      await apiClient.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div>
          <h3 className="font-bold text-black uppercase">User Profile</h3>
          <p className="body-02 text-black">Manage your account and security</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50  border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50  border-green-600 rounded">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Account Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h4 className="text-lg font-bold text-black mb-8 uppercase">Account Information</h4>

              <div className="grid grid-cols-3 gap-8">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Email</label>
                  <p className="text-sm text-black">{profileData.email}</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Full Name</label>
                  <p className="text-sm text-black">{profileData.fullName || '-'}</p>
                </div>

                {/* Roles */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.roles && profileData.roles.length > 0 ? (
                      profileData.roles.map((role) => (
                        <span key={role} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-600">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="pt-6 border-t border-gray-200">
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-3">Account Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                  profileData.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {profileData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h4 className="text-lg font-bold text-black mb-8 uppercase">Security</h4>

              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Change your password to keep your account secure. You must enter your current password to set a new one.
                </p>

                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
                >
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Change Password Form */}
            {showPasswordForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h4 className="text-lg font-bold text-black mb-6">Change Password</h4>
              <p className="text-sm text-gray-600 mb-6">
                For your security, you must enter your current password to set a new one.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                      placeholder="Enter your current password"
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      disabled={changingPassword}
                    >
                      {showOldPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">
                    New Password * (Min 6 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${
                        passwordData.newPassword && passwordData.newPassword.length < 6
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="Enter new password"
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      disabled={changingPassword}
                    >
                      {showNewPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                  </div>
                  {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                    <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${
                        passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="Confirm new password"
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      disabled={changingPassword}
                    >
                      {showConfirmPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setError('');
                    }}
                    disabled={changingPassword}
                    className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
