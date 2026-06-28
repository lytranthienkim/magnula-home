'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowBack } from "react-icons/io";
import apiClient from '@/api/config';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Email is required');
        setLoading(false);
        return;
      }

      // Call check-user-role endpoint
      const res = await apiClient.post('/auth/check-user-role', { email });

      if (res.data?.success) {
        const userRoleData = res.data.data.role || '';

        // Only admin can reset password via forgot-password
        if (userRoleData.toLowerCase() === 'staff' || userRoleData.toLowerCase() === 'user') {
          setError('Your role does not have permission to change password. Contact your system administrator.');
          setLoading(false);
          return;
        }

        // Admin can continue
        setStep(2);
        setSuccess('');
      } else {
        setError(res.data?.error || 'User not found');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setError('Both password fields are required');
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Call forgot-password endpoint
      const res = await apiClient.post('/auth/forgot-password', {
        email,
        newPassword,
      });

      if (res.data?.success) {
        setSuccess('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(res.data?.error || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            {step === 1 ? 'Enter your email address to reset your password' : 'Enter your new password'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-black uppercase">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="text-sm border border-gray-300 px-4 py-2.5 bg-white text-black placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-xs font-semibold text-black uppercase">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="text-sm border border-gray-300 px-4 py-2.5 bg-white text-black placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-black uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="text-sm border border-gray-300 px-4 py-2.5 bg-white text-black placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setEmail('');
                setError('');
              }}
              className="w-full py-2.5 bg-white text-black border border-gray-300 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-4 text-left">
          <div className='flex flex-row gap-1'>
            <IoIosArrowBack size={18}/>
            <Link href="/login" className="text-sm">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
