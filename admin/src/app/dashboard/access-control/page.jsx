'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { getAllUsers, resetUserPassword, updateUserProfile, createUser, updateUserStatus, assignRoleToUser } from '@/api/users';
import { getAllRoles, updateRole, deleteRole, restoreRole, createRole, getRolePermissions, assignPermissionToRole, removePermissionFromRole } from '@/api/roles';
import { getAllPermissions, updatePermission, deletePermission, restorePermission } from '@/api/roles';
import { Table } from '@/components/common/table/Table';
import { AccessControlHeader } from '@/components/layout/access-control';

export default function AccessControlPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({ fullName: '', email: '', password: '', roleId: '' });
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [createRoleData, setCreateRoleData] = useState({ roleName: '' });
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
        getAllPermissions(),
      ]);
      setUsers(usersRes.data || usersRes || []);
      setRoles(rolesRes.data || rolesRes || []);
      setPermissions(permissionsRes.data || permissionsRes || []);
    } catch (err) {
      setError('Failed to load access control data');
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'name', label: 'NAME', render: (row) => row.fullName || 'N/A' },
    { key: 'email', label: 'EMAIL', render: (row) => row.email || 'N/A' },
    { key: 'status', label: 'STATUS', render: (row) => <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{row.status || 'active'}</span> },
  ];

  const roleColumns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'name', label: 'NAME', render: (row) => row.roleName || 'N/A' },
    { key: 'permissions', label: 'PERMISSIONS', render: (row) => (
      <button
        onClick={() => handleViewRole(row)}
        className="text-md underline  cursor-pointer"
      >
        View in details
      </button>
    ) },
  ];

  const permissionColumns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'key', label: 'KEY', render: (row) => row.permissionKey || 'N/A' },
    { key: 'description', label: 'DESCRIPTION', render: (row) => row.description || '-' },
  ];

  const userActions = (row) => [{ label: 'View', onClick: () => { setSelectedItem(row); setEditData({}); setEditMode(false); setShowModal(true); }, variant: 'success' }];
  const roleActions = (row) => [
    { label: 'View', onClick: () => handleViewRole(row), variant: 'success' },
    { label: 'Delete', onClick: () => handleDeleteRole(row.id), variant: 'danger' }
  ];
  const permissionActions = (row) => [{ label: 'View', onClick: () => { setSelectedItem(row); setEditData({}); setEditMode(false); setShowModal(true); }, variant: 'success' }];

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
  ];

  // Check if current user can change password for selected user
  const canChangePassword = () => {
    if (!currentUser || !selectedItem) return false;
    const currentUserRole = Array.isArray(currentUser.roles) ? currentUser.roles[0] : currentUser.role;
    const isCurrentUserAdmin = currentUserRole?.toLowerCase() === 'administrator';

    if (!isCurrentUserAdmin) return false; // Only admins can change passwords

    // Get selected user's role (they may have assigned roles)
    const selectedUserRole = selectedItem.role || selectedItem.roles?.[0];
    const isSelectedUserAdmin = selectedUserRole?.toLowerCase() === 'administrator';

    // Admins cannot change password of other admins
    return !isSelectedUserAdmin;
  };

  const handleViewRole = async (role) => {
    try {
      const perms = await getRolePermissions(role.id);
      setRolePermissions(perms.data || perms || []);
      setSelectedItem(role);
      setEditData({});
      setEditMode(false);
      setShowModal(true);
    } catch (err) {
      alert('Failed to load role permissions: ' + err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await deleteRole(roleId);
      await fetchAllData();
      alert('Role deleted successfully');
    } catch (err) {
      alert('Failed to delete role: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <AccessControlHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-black'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-lg  p-8">
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => {
                  setCreateData({ fullName: '', email: '', password: '', roleId: '' });
                  setShowCreateModal(true);
                }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
                  + Add 
                </button>
              </div>
              <Table columns={userColumns} data={users} onAction={userActions} loading={loading} />
            </div>
          )}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => {
                  setCreateRoleData({ roleName: '' });
                  setShowCreateRoleModal(true);
                }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
                  + Add
                </button>
              </div>
              <Table columns={roleColumns} data={roles} onAction={roleActions} loading={loading} />
            </div>
          )}
          {activeTab === 'permissions' && (
            <Table columns={permissionColumns} data={permissions} onAction={permissionActions} loading={loading} />
          )}
        </>
      )}

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              {!editMode ? (
                <>
                  {activeTab === 'users' && (
                    <>
                      {/* User Information Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Information</p>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                            <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">{selectedItem.fullName || 'N/A'}</p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-xs text-black font-semibold uppercase w-24">Email:</p>
                            <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">{selectedItem.email || 'N/A'}</p>
                          </div>
                          <div className="flex items-start">
                            <p className="text-xs text-black font-semibold uppercase w-24 mt-1">Role:</p>
                            <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">
                              {Array.isArray(selectedItem.roles)
                                ? selectedItem.roles.map(r => r.roleName || r.role || r).join(', ')
                                : selectedItem.role || selectedItem.roleName || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-3">User Status</p>
                        <div className={`px-4 py-2 rounded text-sm font-medium ${selectedItem.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {selectedItem.status || 'active'}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'roles' && (
                    <>
                      {/* Role Information Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Role Information</p>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                            <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">{selectedItem.roleName || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Permissions Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Permissions</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {rolePermissions.length > 0 ? (
                            rolePermissions.map((perm, idx) => (
                              <label key={perm.id || idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={perm.assigned || false}
                                  onChange={(e) => {
                                    if (!editMode) return; // Only editable in edit mode
                                    setRolePermissions(
                                      rolePermissions.map((p) =>
                                        p.id === perm.id ? { ...p, assigned: e.target.checked } : p
                                      )
                                    );
                                  }}
                                  disabled={!editMode}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-xs text-black">{perm.permissionKey}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No permissions available</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'permissions' && (
                    <>
                      {/* Permission Information Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Permission Information</p>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <p className="text-xs text-black font-semibold uppercase w-24 mt-1">Description:</p>
                            <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">{selectedItem.description || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {activeTab === 'users' && (
                    <>
                      {/* Edit User Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Edit User Information</p>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Name</label>
                            <input
                              type="text"
                              value={editData.fullName || selectedItem.fullName || ''}
                              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Email</label>
                            <input
                              type="email"
                              value={editData.email || selectedItem.email || ''}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Role</label>
                            <select
                              value={editData.roleId !== undefined ? String(editData.roleId) : String(selectedItem?.roleId || '')}
                              onChange={(e) => setEditData({ ...editData, roleId: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                            >
                              <option value="">Select a role</option>
                              {roles.map((role) => (
                                <option key={role.id} value={String(role.id)}>
                                  {role.roleName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Status Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-3">User Status</p>
                        <select
                          value={editData.status !== undefined ? editData.status : (selectedItem?.status || 'active')}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Password Section */}
                      {canChangePassword() && (
                        <div>
                          <button onClick={() => setShowPasswordModal(true)} className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-black text-sm font-bold rounded hover:bg-gray-100 transition">
                            Change Password
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'roles' && (
                    <div className="space-y-8">
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Edit Role Information</p>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Name</label>
                            <input
                              type="text"
                              value={editData.roleName || selectedItem.roleName}
                              onChange={(e) => setEditData({ ...editData, roleName: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Permissions Section */}
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Assign Permissions</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-300 rounded p-3 bg-gray-50">
                          {rolePermissions.length > 0 ? (
                            rolePermissions.map((perm) => (
                              <label key={perm.id} className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={
                                    editData.permissions
                                      ? editData.permissions.some((p) => p.id === perm.id)
                                      : perm.assigned || false
                                  }
                                  onChange={(e) => {
                                    const currentPerms = editData.permissions || rolePermissions.filter((p) => p.assigned);
                                    if (e.target.checked) {
                                      setEditData({
                                        ...editData,
                                        permissions: [...currentPerms, perm],
                                      });
                                    } else {
                                      setEditData({
                                        ...editData,
                                        permissions: currentPerms.filter((p) => p.id !== perm.id),
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-xs text-black">{perm.permissionKey}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No permissions available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'permissions' && (
                    <div className="space-y-8">
                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-4">Edit Permission Information</p>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Description</label>
                          <input
                            type="text"
                            value={editData.description || selectedItem.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-black font-semibold uppercase mb-3">Permission Status</p>
                        <select
                          value={editData.isActive !== undefined ? (editData.isActive ? 'active' : 'inactive') : (selectedItem.isActive ? 'active' : 'inactive')}
                          onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'active' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              {!editMode ? (
                <>
                  <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
                    Close
                  </button>
                  <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditMode(false); setEditData({}); }} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={async () => {
                    try {
                      if (activeTab === 'users') {

                        // Handle name/email change (update user profile)
                        const hasNameChanged = editData.fullName && editData.fullName !== selectedItem.fullName;
                        const hasEmailChanged = editData.email && editData.email !== selectedItem.email;

                        if (hasNameChanged || hasEmailChanged) {
                          const userData = {};
                          if (hasNameChanged) userData.fullName = editData.fullName;
                          if (hasEmailChanged) userData.email = editData.email;
                          await updateUserProfile(selectedItem.id, userData);
                        }

                        // Handle role change (assign role to user)
                        const newRoleId = editData.roleId ? parseInt(editData.roleId) : null;
                        if (newRoleId && newRoleId !== selectedItem.roleId) {
                          await assignRoleToUser(selectedItem.id, newRoleId);
                        }

                        // Handle status change (Active/Inactive)
                        const newStatus = editData.status !== undefined ? editData.status : selectedItem.status;
                        const oldStatus = selectedItem.status;

                        if (newStatus !== oldStatus) {
                          const isActive = newStatus === 'active';
                          await updateUserStatus(selectedItem.id, isActive);
                        }
                      } else if (activeTab === 'roles') {
                        // Handle role name change
                        const hasRoleNameChanged = editData.roleName && editData.roleName !== selectedItem.roleName;

                        if (hasRoleNameChanged) {
                          await updateRole(selectedItem.id, editData.roleName);
                        }

                        // Handle permission changes
                        if (editData.permissions) {
                          const oldPermissions = rolePermissions.filter((p) => p.assigned);
                          const newPermissions = editData.permissions;

                          // Find removed permissions
                          const removedPerms = oldPermissions.filter(
                            (oldPerm) => !newPermissions.some((newPerm) => newPerm.id === oldPerm.id)
                          );

                          // Find added permissions
                          const addedPerms = newPermissions.filter(
                            (newPerm) => !oldPermissions.some((oldPerm) => oldPerm.id === newPerm.id)
                          );

                          // Remove permissions
                          for (const perm of removedPerms) {
                            await removePermissionFromRole(selectedItem.id, perm.id);
                          }

                          // Add permissions
                          for (const perm of addedPerms) {
                            await assignPermissionToRole(selectedItem.id, perm.id);
                          }
                        }
                      } else if (activeTab === 'permissions') {
                        // Handle permission description change
                        const hasDescriptionChanged = editData.description !== undefined && editData.description !== selectedItem.description;

                        if (hasDescriptionChanged) {
                          await updatePermission(selectedItem.id, selectedItem.permissionKey, editData.description);
                        }

                        // Handle status change (Active/Inactive)
                        const newStatus = editData.isActive !== undefined ? editData.isActive : selectedItem.isActive;
                        const oldStatus = selectedItem.isActive;

                        if (newStatus !== oldStatus) {
                          if (newStatus) {
                            // Restore if changing to Active
                            await restorePermission(selectedItem.id);
                          } else {
                            // Delete (soft delete) if changing to Inactive
                            await deletePermission(selectedItem.id);
                          }
                        }
                      }
                      setEditMode(false);
                      setEditData({});
                      await fetchAllData();
                      alert('Updated successfully');
                    } catch (err) {
                      alert('Failed to save: ' + (err.response?.data?.message || err.message));
                    }
                  }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
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
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-md font-semibold uppercase">Create New User</p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-4">User Information</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={createData.fullName}
                      onChange={(e) => setCreateData({ ...createData, fullName: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Email *</label>
                    <input
                      type="email"
                      value={createData.email}
                      onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Password *</label>
                    <input
                      type="password"
                      value={createData.password}
                      onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Role *</label>
                    <select
                      value={createData.roleId}
                      onChange={(e) => setCreateData({ ...createData, roleId: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => {
                setShowCreateModal(false);
                setCreateData({ fullName: '', email: '', password: '', roleId: '' });
              }} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={async () => {
                try {
                  if (!createData.fullName || !createData.email || !createData.password || !createData.roleId) {
                    alert('All fields are required');
                    return;
                  }
                  await createUser({
                    fullName: createData.fullName,
                    email: createData.email,
                    password: createData.password,
                    roleId: createData.roleId,
                  });
                  alert('User created successfully');
                  setShowCreateModal(false);
                  setCreateData({ fullName: '', email: '', password: '', roleId: '' });
                  await fetchAllData();
                } catch (err) {
                  alert('Failed to create user: ' + (err.response?.data?.message || err.message));
                }
              }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-md font-semibold uppercase">Create New Role</p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Role Name *</label>
                    <input
                      type="text"
                      value={createRoleData.roleName}
                      onChange={(e) => setCreateRoleData({ ...createRoleData, roleName: e.target.value })}
                      placeholder="Enter role name"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => {
                setShowCreateRoleModal(false);
                setCreateRoleData({ roleName: '' });
              }} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={async () => {
                try {
                  if (!createRoleData.roleName) {
                    alert('Role name is required');
                    return;
                  }
                  await createRole(createRoleData.roleName);
                  alert('Role created successfully');
                  setShowCreateRoleModal(false);
                  setCreateRoleData({ roleName: '' });
                  await fetchAllData();
                } catch (err) {
                  alert('Failed to create role: ' + (err.response?.data?.message || err.message));
                }
              }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
