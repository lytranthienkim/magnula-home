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
        const response = await checkAuth();

        if (response.success && response.data) {
          dispatch(
            loginSuccess({
              user: response.data,
              permissions: response.data.permissions || [],
            })
          );
        }
      } catch (error) {
        dispatch(logout());

        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    initializeAuth();
  }, [dispatch, router, pathname]);

  return children;
}
