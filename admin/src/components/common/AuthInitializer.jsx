'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { loginSuccess, logout } from '@/redux/authSlice';
import { checkAuth } from '@/api/auth';

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      // Skip auth check on login and register pages
      if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
        return;
      }

      try {
        // Check if user has valid authentication cookie
        const response = await checkAuth();

        if (response.success && response.data) {
          // Restore user session from cookie
          dispatch(
            loginSuccess({
              user: response.data,
              permissions: response.data.permissions || [],
            })
          );
        }
      } catch (error) {
        // Cookie expired or invalid - clear Redux state
        dispatch(logout());

        // Only redirect to login if we're on a protected page
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    initializeAuth();
  }, [dispatch, router, pathname]);

  return children;
}
