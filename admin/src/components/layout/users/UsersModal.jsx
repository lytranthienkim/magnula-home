'use client';

export default function UsersModal({
  selectedUser,
  editMode,
  editData,
  roles,
  saving,
  resettingPassword,
  showResetPasswordModal,
  resetPasswordData,
  onClose,
  onEditModeChange,
  onEditDataChange,
  onSave,
  onShowResetPassword,
  onResetPasswordDataChange,
  onResetPassword,
}) {
  if (!selectedUser) return null;

  const displayUser = editMode ? editData : selectedUser;
  const displayRoles = editData.roles || [];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">User ID</p>
              <h2 className="text-3xl font-bold text-black">{selectedUser.id}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Personal Information */}
            <div>
              <p className="text-sm text-black font-semibold uppercase mb-4">Personal Information</p>
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center">
                  <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                  <div className="flex-1 bg-gray-50 px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.fullName || ''}
                        onChange={(e) => onEditDataChange({ ...editData, fullName: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs font-medium text-black">{selectedUser.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <p className="text-xs text-black font-semibold uppercase w-24">Email:</p>
                  <div className="flex-1 bg-gray-50 px-4 py-2">
                    <p className="text-xs text-black">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <p className="text-xs text-black font-semibold uppercase w-24">Status:</p>
                  <div className="flex-1 bg-gray-50 px-4 py-2">
                    {editMode ? (
                      <select
                        value={editData.isActive ? 'active' : 'inactive'}
                        onChange={(e) => onEditDataChange({ ...editData, isActive: e.target.value === 'active' })}
                        className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div>
              <p className="text-sm text-black font-semibold uppercase mb-4">Assigned Roles</p>
              <div className="flex flex-wrap gap-2">
                {displayRoles && displayRoles.length > 0 ? (
                  displayRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {role}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-600">No roles assigned</p>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Created</p>
                <p className="text-xs text-black">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Updated</p>
                <p className="text-xs text-black">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    onEditModeChange(false);
                    onEditDataChange(selectedUser);
                  }}
                  className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={onShowResetPassword}
                    className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
                  >
                    Reset Password
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => onEditModeChange(true)}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-lg font-bold text-black mb-6">Reset Password</h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">New Password *</label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => onResetPasswordDataChange({ ...resetPasswordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => onResetPasswordDataChange({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  onShowResetPassword();
                  onResetPasswordDataChange({ newPassword: '', confirmPassword: '' });
                }}
                disabled={resettingPassword}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onResetPassword}
                disabled={resettingPassword}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {resettingPassword ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
