'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '@/redux/authSlice';
import { loginAdmin } from '@/api/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
      const response = await loginAdmin(email, password, rememberMe); // remeber me flag true or false

      if (response.success) {
        dispatch(
          loginSuccess({
            user: response.data,
            permissions: response.data.permissions || [],
          })
        );

        router.push('/dashboard');
      } else {
        const errorMsg = response.error || response.message || 'Login failed';
        setError(errorMsg);
        dispatch(loginFailure(errorMsg));
      }
    } catch (err) {
      // Handle different error response formats
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      console.error('Login error details:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md  px-8 py-10 rounded-sm ">
        <div className="flex flex-col text-center justify-center mb-5">
          <h3 className="font-bold text-black uppercase">Welcome back</h3>
          <p className='text-sm text-gray-600'>Have a nice work day</p>
        </div>


        {error && (
          <p className="mb-4 text-xs text-red-600">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold text-black uppercase">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="text-sm border border-gray-300 px-4 py-2.5 bg-white text-black placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-semibold text-black uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm border border-gray-300 px-4 py-2.5 pr-10 bg-white text-black placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </button>
            </div>
          </div>

  
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} // tick remember me
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-black transition">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
