'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllRoles, createRole, updateRole, deleteRole, getRolePermissions, assignPermissionToRole, removePermissionFromRole } from '@/api/roles';
import { getAllPermissions } from '@/api/roles';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';

export default function RolesPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canCreate = true; // Replace with permission check
  const canRead = true;
  const canUpdate = true;
  const canDelete = true;

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });
  const [rolePermissions, setRolePermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [tempPermissions, setTempPermissions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          getAllRoles(),
          getAllPermissions(),
        ]);
        setRoles(rolesRes.data || []);
        setPermissions(permsRes.data || []);
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
  const handleViewDetails = async (role) => {
    try {
      const res = await getRolePermissions(role.id);
      setSelectedRole(role);
      setEditData(role);
      setRolePermissions(res.data || []);
      setShowDetails(true);
      setEditMode(false);
    } catch (err) {
      setError('Failed to load role details');
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatePayload = {
        roleName: editData.roleName,
      };

      await updateRole(selectedRole.id, editData.roleName);

      setSelectedRole(editData);
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? editData : r))
      );
      setEditMode(false);
      setSuccess('Role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDeleteFromTable = async (role) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      await deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      setSuccess('Role deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
    }
  };

  // Handle manage permissions
  const handleManagePermissions = async (role) => {
    try {
      const res = await getRolePermissions(role.id);
      setSelectedRole(role);
      setRolePermissions(res.data || []);
      setTempPermissions(res.data || []);
      setShowPermissionsModal(true);
    } catch (err) {
      setError('Failed to load role permissions');
    }
  };

  // Handle toggle permission in modal (before saving)
  const handleTogglePermissionCheckbox = (permissionId) => {
    const hasPermission = tempPermissions.some((p) => p.permissionId === permissionId);

    if (hasPermission) {
      setTempPermissions((prev) => prev.filter((p) => p.permissionId !== permissionId));
    } else {
      // Create a temporary RolePermission object for unchecked permission
      setTempPermissions((prev) => [...prev, {
        roleId: selectedRole.id,
        permissionId,
        Permission: permissions.find((p) => p.id === permissionId)
      }]);
    }
  };

  // Handle save permissions
  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const assignedPermIds = tempPermissions.map((p) => p.permissionId);
      const currentPermIds = rolePermissions.map((p) => p.permissionId);

      // Find permissions to add (in temp but not in current)
      const toAdd = assignedPermIds.filter((id) => !currentPermIds.includes(id));
      // Find permissions to remove (in current but not in temp)
      const toRemove = currentPermIds.filter((id) => !assignedPermIds.includes(id));

      // Execute all operations
      await Promise.all([
        ...toAdd.map((permId) => assignPermissionToRole(selectedRole.id, permId)),
        ...toRemove.map((permId) => removePermissionFromRole(selectedRole.id, permId)),
      ]);

      // Update state with saved permissions
      setRolePermissions(tempPermissions);
      setShowPermissionsModal(false);
      setSuccess('Permissions saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  // Handle create role
  const handleCreateRole = async () => {
    if (!formData.roleName) {
      setError('Role name is required');
      return;
    }

    setFormLoading(true);
    try {
      const res = await createRole(formData.roleName);
      setRoles((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({
        roleName: '',
        description: '',
      });
      setSuccess('Role created successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'roleName', label: 'ROLE NAME' },
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

  const actions = (role) => [
    {
      label: 'View',
      onClick: () => handleViewDetails(role),
      variant: 'success',
    },
    canDelete && {
      label: 'Delete',
      onClick: () => handleDeleteFromTable(role),
      variant: 'danger',
    },
  ].filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Roles Management</h3>
          <p className="body-02 text-black">Manage user roles and their permissions</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Role
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
      <Table columns={columns} data={roles} onAction={actions} loading={loading} />

      {/* Role Details Modal */}
      {showDetails && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Role Name</p>
                <h2 className="text-3xl font-bold text-black">{selectedRole.roleName}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Role Name */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Role Name</p>
                <div className="bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.roleName || ''}
                      onChange={(e) => setEditData({ ...editData, roleName: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs font-medium text-black">{selectedRole.roleName}</p>
                  )}
                </div>
              </div>

              {/* Permissions List */}
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-3">Assigned Permissions</p>
                <div className="bg-gray-50 px-4 py-2 max-h-64 overflow-y-auto">
                  {rolePermissions.length > 0 ? (
                    <div className="space-y-2">
                      {rolePermissions.map((rolePermItem, idx) => {
                        // RolePermission object has structure: { roleId, permissionId, Permission }
                        const perm = rolePermItem.Permission || rolePermItem;
                        return (
                          <div key={perm.id || rolePermItem.permissionId || idx} className="text-xs text-black">
                            <p className="font-semibold">{perm.permissionKey}</p>
                            <p className="text-gray-600">{perm.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">No permissions assigned</p>
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
                      setEditData(selectedRole);
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
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setShowPermissionsModal(false);
                    }}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManagePermissions(selectedRole)}
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                    >
                      Manage Permissions
                    </button>
                    {canUpdate && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">
                Manage Permissions for "{selectedRole.roleName}"
              </h2>
            </div>

            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {permissions.map((permission) => {
                  const isAssigned = tempPermissions.some((p) => p.permissionId === permission.id);
                  return (
                    <label
                      key={permission.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleTogglePermissionCheckbox(permission.id)}
                        disabled={saving}
                        className="cursor-pointer mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-black">{permission.permissionKey}</p>
                        <p className="text-xs text-gray-600">{permission.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowPermissionsModal(false)}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-6">Create New Role</h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Role Name *</label>
                <input
                  type="text"
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  placeholder="e.g., Editor, Manager"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  placeholder="Role description (optional)"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    roleName: '',
                    description: '',
                  });
                  setError('');
                }}
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
