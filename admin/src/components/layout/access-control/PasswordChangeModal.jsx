import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { resetUserPassword } from '@/api/users';

export default function PasswordChangeModal({
  showPasswordModal,
  setShowPasswordModal,
  passwordData,
  setPasswordData,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  selectedItem,
  fetchAllData,
}) {
  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h2 className="text-xl font-bold text-black mb-6">Change Password</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword || ''}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
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
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword || ''}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
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
        </div>

        <div className="flex gap-3">
          <button onClick={async () => {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
              alert('Passwords do not match');
              return;
            }
            if (!passwordData.newPassword) {
              alert('Please enter a password');
              return;
            }
            try {
              await resetUserPassword(selectedItem.id, passwordData.newPassword);
              alert('Password changed successfully');
              setShowPasswordModal(false);
              setPasswordData({ newPassword: '', confirmPassword: '' });
              await fetchAllData();
            } catch (err) {
              alert('Failed to change password: ' + (err.response?.data?.message || err.message));
            }
          }} className="flex-1 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
            Save
          </button>
          <button onClick={() => {
            setShowPasswordModal(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
          }} className="flex-1 px-4 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
