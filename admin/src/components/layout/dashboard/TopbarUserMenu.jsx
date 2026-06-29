'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

const TopbarUserMenu = memo(({
  user,
  isAdmin,
  showMenu,
  onToggleMenu,
  onLogout,
}) => {
  const router = useRouter();

  const handleProfile = () => {
    onToggleMenu();
    router.push('/dashboard/profile');
  };

  const handleAccessControl = () => {
    onToggleMenu();
    router.push('/dashboard/access-control');
  };

  return (
    <div className="relative">
      <button
        onClick={onToggleMenu}
        className="text-sm font-medium text-gray-900 hover:text-gray-600 transition px-3 py-1 border-[1px] border-[#272727]/30 rounded-full"
      >
        {user?.fullName || 'Admin'}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg  z-50">
          <button
            onClick={handleProfile}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200 transition"
          >
            Profile
          </button>

          {/* Access Control - Admin Only */}
          {isAdmin && (
            <button
              onClick={handleAccessControl}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200 transition"
            >
              Access Control
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
          >
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
});

TopbarUserMenu.displayName = 'TopbarUserMenu';

export default TopbarUserMenu;
