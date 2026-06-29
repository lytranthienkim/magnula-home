'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function UsersAddForm({
  formData,
  roles,
  loading,
  error,
  onFormDataChange,
  onCreateUser,
  onClose,
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h3 className="text-xl font-bold text-black mb-6">Create New User</h3>

        <div className="space-y-4 mb-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onFormDataChange({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
              >
                {showPassword ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Assign Role</label>
            <select
              value={formData.roleId}
              onChange={(e) => onFormDataChange({ ...formData, roleId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            >
              <option value="">Select a role (optional)</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreateUser}
            disabled={loading}
            className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
