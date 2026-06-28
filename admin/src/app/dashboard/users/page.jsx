'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllUsers, createUser, updateUserProfile, assignRoleToUser, removeRoleFromUser, getUserRoles, updateUserStatus } from '@/api/users';
import { getAllRoles } from '@/api/roles';
import { adminResetPassword } from '@/api/auth';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';

export default function UsersPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canCreate = true; // Replace with permission check
  const canRead = true;
  const canUpdate = true;
  const canDelete = true;

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: '',
  });
  const [saving, setSaving] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [resettingPassword, setResettingPassword] = useState(false);

  // Fetch users and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          getAllUsers(),
          getAllRoles(),
        ]);
        setUsers(usersRes.data || []);
        setRoles(rolesRes.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle view details
  const handleViewDetails = async (user) => {
    try {
      // Fetch complete user data including roles from backend
      const userRes = await getAllUsers(); // Get fresh data
      const fullUserData = userRes.data.find(u => u.id === user.id);

      if (fullUserData) {
        // Extract roleId from roles array
        const userRoleNames = fullUserData.roles || [];
        const roleId = userRoleNames.length > 0
          ? roles.find(r => r.roleName === userRoleNames[0])?.id
          : null;

        const userData = {
          ...fullUserData,
          roleId: roleId,
        };

        setSelectedUser(userData);
        setEditData(userData);
      } else {
        setSelectedUser(user);
        setEditData(user);
      }

      setShowDetails(true);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to load user details:', err);
      // Still open the modal even if fetch fails
      setSelectedUser(user);
      setEditData(user);
      setShowDetails(true);
      setEditMode(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatePayload = {
        fullName: editData.fullName,
        email: editData.email,
      };

      await updateUserProfile(selectedUser.id, updatePayload);

      // Update status if changed
      if (editData.isActive !== selectedUser.isActive) {
        await updateUserStatus(selectedUser.id, editData.isActive);
      }

      // Update role if changed
      const selectedUserRoleId = selectedUser.roleId ? String(selectedUser.roleId) : null;
      const editDataRoleId = editData.roleId ? String(editData.roleId) : null;


      if (editDataRoleId && editDataRoleId !== selectedUserRoleId) {
        // Remove old role first if exists
        if (selectedUserRoleId) {
          await removeRoleFromUser(selectedUser.id, selectedUserRoleId);
        }
        // Assign new role
        await assignRoleToUser(selectedUser.id, editDataRoleId);
      }

      setSelectedUser(editData);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? editData : u))
      );
      setEditMode(false);
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setResettingPassword(true);
    try {
      await adminResetPassword(selectedUser.id, resetPasswordData.newPassword);
      setShowResetPasswordModal(false);
      setResetPasswordData({ newPassword: '', confirmPassword: '' });
      setSuccess('Password reset successfully for user');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.roleId) {
      setError('Please fill all required fields');
      return;
    }

    setFormLoading(true);
    try {
      // Send roleId to backend during creation (it will assign role in transaction)
      const res = await createUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        roleId: formData.roleId, // Include roleId so backend assigns it during creation
      });

      if (res.success) {
        // Re-fetch all users to ensure complete data with proper structure
        const usersRes = await getAllUsers();
        setUsers(usersRes.data || []);

        setShowAddForm(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          roleId: '',
        });
        setSuccess('User created successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      // Backend returns 'error' field, not 'message'
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'email', label: 'EMAIL' },
    { key: 'fullName', label: 'FULL NAME' },
    {
      key: 'isActive',
      label: 'IS ACTIVE',
      render: (row) => (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = (user) => [
    {
      label: 'View',
      onClick: () => handleViewDetails(user),
      variant: 'success',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Users Management</h3>
          <p className="body-02 text-black">Manage system users and their roles</p>
        </div>
        {canCreate && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setError(''); // Clear any previous errors
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add User
          </button>
        )}
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

      {/* Table */}
      <Table columns={columns} data={users} onAction={actions} loading={loading} />

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">User ID</p>
                <h2 className="text-3xl font-bold text-black">{selectedUser.email}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Email */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Email</p>
                <div className="bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs text-black">{selectedUser.email}</p>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Full Name</p>
                <div className="bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.fullName || ''}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs font-medium text-black">{selectedUser.fullName}</p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Role</p>
                <div className="bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <select
                      value={editData.roleId || ''}
                      onChange={(e) => setEditData({ ...editData, roleId: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    >
                      <option value="">Select Role</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roleName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs font-medium text-black">
                      {selectedUser.roles && selectedUser.roles.length > 0
                        ? selectedUser.roles[0]
                        : 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Status</p>
                <div className="bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <select
                      value={editData.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData(selectedUser);
                    }}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowResetPasswordModal(true);
                        setError('');
                        setResetPasswordData({ newPassword: '', confirmPassword: '' });
                      }}
                      className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition"
                    >
                      Reset Password
                    </button>
                  </div>
                  {canUpdate && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-2">Reset Password</h3>
            <p className="text-sm text-gray-600 mb-6">Reset password for {selectedUser.email}</p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50  border-red-500 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">New Password *</label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  placeholder="••••••••"
                  disabled={resettingPassword}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  placeholder="••••••••"
                  disabled={resettingPassword}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setResetPasswordData({ newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                disabled={resettingPassword}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="px-6 py-2 bg-orange-500 text-white text-xs font-bold rounded hover:bg-orange-600 transition disabled:opacity-50"
              >
                {resettingPassword ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-6">Create New User</h3>

            {/* Error Message in Modal */}
            {error && (
              <div className="mb-6 p-4 bg-red-50  border-red-500 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Password * (Min 6 chars)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${
                      formData.password && formData.password.length < 6 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {formData.password && formData.password.length < 6 && (
                    <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Role *</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    roleId: '',
                  });
                  setError('');
                }}
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
