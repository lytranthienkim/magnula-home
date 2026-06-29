'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '@/api/config';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { ProfileHeader } from '@/components/layout/profile';

export default function ProfilePage() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    id: currentUser?.id || '',
    email: currentUser?.email || '',
    fullName: currentUser?.fullName || '',
    isActive: currentUser?.isActive !== false,
    createdAt: null,
    updatedAt: null,
    roles: currentUser?.roles || [],
  });

  // Edit profile
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);

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
      }
    };

    fetchUserProfile();
  }, []);

  // Update editData when profileData is loaded
  useEffect(() => {
    setEditData({ fullName: profileData.fullName, email: profileData.email });
  }, [profileData]);

  // Handle edit profile
  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    if (!editData.fullName || !editData.email) {
      setError('Name and email are required');
      return;
    }

    setSavingProfile(true);
    try {
      await apiClient.put('/users/profile', {
        fullName: editData.fullName,
        email: editData.email,
      });

      setProfileData((prev) => ({
        ...prev,
        fullName: editData.fullName,
        email: editData.email,
      }));

      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await apiClient.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <ProfileHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-xs text-green-600">{success}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg  p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-black">Profile Information</h2>
          {!editMode && (
            <button
              onClick={() => {
                setEditData({ fullName: profileData.fullName, email: profileData.email });
                setEditMode(true);
              }}
              className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          {editMode ? (
            <>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Email *</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Email</label>
                <p className="text-sm text-black bg-gray-50 px-4 py-3 rounded">{profileData.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Full Name</label>
                <p className="text-sm text-black bg-gray-50 px-4 py-3 rounded">{profileData.fullName || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Status</label>
              <p className={`text-sm px-4 py-3 rounded inline-block font-semibold ${profileData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {profileData.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Roles</label>
              <div className="flex flex-wrap gap-2">
                {profileData.roles && profileData.roles.length > 0 ? (
                  profileData.roles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">No roles assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Created At</label>
              <p className="text-sm text-black bg-gray-50 px-4 py-3 rounded">
                {profileData.createdAt ? new Date(profileData.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Last Updated</label>
              <p className="text-sm text-black bg-gray-50 px-4 py-3 rounded">
                {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-black">Password</h3>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showOldPassword ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">New Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showNewPassword ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showConfirmPassword ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setError('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
