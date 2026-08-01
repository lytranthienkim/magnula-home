import { updateUserProfile, assignRoleToUser, updateUserStatus } from '@/api/users';
import { updateRole, removePermissionFromRole, assignPermissionToRole } from '@/api/roles';

export const AccessControlModal = ({
  showModal,
  setShowModal,
  selectedItem,
  editMode,
  setEditMode,
  editData,
  setEditData,
  activeTab,
  roles,
  rolePermissions,
  setRolePermissions,
  setShowPasswordModal,
  canChangePassword,
  fetchAllData,
}) => {
  if (!showModal || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {!editMode ? (
            <>
              {activeTab === 'users' && (
                <>
                  {/* User info */}
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

                  {/* Status */}
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
                  {/* Role information */}
                  <div>
                    <p className="text-sm text-black font-semibold uppercase mb-4">Role Information</p>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                        <p className="flex-1 bg-gray-50 px-4 py-2 text-xs text-black">{selectedItem.roleName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
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
                  {/* Permission */}
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
                  {/* Edit user */}
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

                  {/* Status  */}
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

                  {/* Password */}
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

                  {/* Permissions */}
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

                    const hasNameChanged = editData.fullName && editData.fullName !== selectedItem.fullName;
                    const hasEmailChanged = editData.email && editData.email !== selectedItem.email;

                    if (hasNameChanged || hasEmailChanged) {
                      const userData = {};
                      if (hasNameChanged) userData.fullName = editData.fullName;
                      if (hasEmailChanged) userData.email = editData.email;
                      await updateUserProfile(selectedItem.id, userData);
                    }

                    const newRoleId = editData.roleId ? parseInt(editData.roleId) : null;
                    if (newRoleId && newRoleId !== selectedItem.roleId) {
                      await assignRoleToUser(selectedItem.id, newRoleId);
                    }

                    const newStatus = editData.status !== undefined ? editData.status : selectedItem.status;
                    const oldStatus = selectedItem.status;

                    if (newStatus !== oldStatus) {
                      const isActive = newStatus === 'active';
                      await updateUserStatus(selectedItem.id, isActive);
                    }
                  } else if (activeTab === 'roles') {
                    const hasRoleNameChanged = editData.roleName && editData.roleName !== selectedItem.roleName;

                    if (hasRoleNameChanged) {
                      await updateRole(selectedItem.id, editData.roleName);
                    }

                    if (editData.permissions) {
                      const oldPermissions = rolePermissions.filter((p) => p.assigned);
                      const newPermissions = editData.permissions;

                      const removedPerms = oldPermissions.filter(
                        (oldPerm) => !newPermissions.some((newPerm) => newPerm.id === oldPerm.id)
                      );

                      // Find added permissions
                      const addedPerms = newPermissions.filter(
                        (newPerm) => !oldPermissions.some((oldPerm) => oldPerm.id === newPerm.id)
                      );

                      for (const perm of removedPerms) {
                        await removePermissionFromRole(selectedItem.id, perm.id);
                      }

                      for (const perm of addedPerms) {
                        await assignPermissionToRole(selectedItem.id, perm.id);
                      }
                    }
                  } else if (activeTab === 'permissions') {
                    const hasDescriptionChanged = editData.description !== undefined && editData.description !== selectedItem.description;

                    if (hasDescriptionChanged) {
                      await updatePermission(selectedItem.id, selectedItem.permissionKey, editData.description);
                    }

                    const newStatus = editData.isActive !== undefined ? editData.isActive : selectedItem.isActive;
                    const oldStatus = selectedItem.isActive;

                    // TODO: Implement permission status update if needed
                    // if (newStatus !== oldStatus) {
                    //   if (newStatus) {
                    //     await restorePermission(selectedItem.id);
                    //   } else {
                    //     await deletePermission(selectedItem.id);
                    //   }
                    // }
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
  );
};
