'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/api/auth';
import { FormField } from '@/components/common/form/FormField';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword.trim()) newErrors.oldPassword = 'Current password is required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword(formData.oldPassword, formData.newPassword);
      setSuccess('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="h1-neu font-bold text-black mb-2">Change Password</h1>
        <p className="body-02 text-gray-600">Update your account password</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50  border-green-600 rounded">
          <p className="body-02 text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-light rounded-lg p-6">
        <div className="space-y-6 mb-6">
          <FormField
            label="Current Password"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            error={errors.oldPassword}
            placeholder="••••••••"
            required
            disabled={loading}
          />

          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="••••••••"
            required
            disabled={loading}
          />

          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-black text-white body-02 font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-light text-black body-02 font-semibold hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
