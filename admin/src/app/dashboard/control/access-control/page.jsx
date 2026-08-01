'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllUsers} from '@/api/users';
import { getAllRoles,deleteRole, getRolePermissions } from '@/api/roles';
import { getAllPermissions } from '@/api/permissions';
import {
  AccessControlHeader,
  AccessControlTabs,
  UsersTab,
  RolesTab,
  PermissionsTab,
  AccessControlModal,
  PasswordChangeModal,
  CreateUserModal,
  CreateRoleModal,
} from '@/components/layout/access-control';

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

  // Fetch all users, roles, and permissions
  const parseData = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res)) return res;
    return [];
  };

  // Fetch all users, roles, and permissions
  const fetchAllData = async () => {
    try {
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
        getAllPermissions(),
      ]);
      setUsers(parseData(usersRes) || []);
      setRoles(parseData(rolesRes) || []);
      setPermissions(parseData(permissionsRes) || []);
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
  const permissionActions = () => [];

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
  ];

  const canChangePassword = () => {
    if (!currentUser || !selectedItem) return false;
    const currentUserRole = Array.isArray(currentUser.roles) ? currentUser.roles[0] : currentUser.role;
    const isCurrentUserAdmin = currentUserRole?.toLowerCase() === 'administrator';

    if (!isCurrentUserAdmin) return false;

    const selectedUserRole = selectedItem.role || selectedItem.roles?.[0];
    const isSelectedUserAdmin = selectedUserRole?.toLowerCase() === 'administrator';

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

      <AccessControlTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {loading ? (
        <div className="bg-white rounded-lg  p-8">
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'users' && (
            <UsersTab
              users={users}
              loading={loading}
              setShowCreateModal={setShowCreateModal}
              setCreateData={setCreateData}
              userColumns={userColumns}
              userActions={userActions}
            />
          )}
          {activeTab === 'roles' && (
            <RolesTab
              roles={roles}
              loading={loading}
              setShowCreateRoleModal={setShowCreateRoleModal}
              setCreateRoleData={setCreateRoleData}
              roleColumns={roleColumns}
              roleActions={roleActions}
            />
          )}
          {activeTab === 'permissions' && (
            <PermissionsTab
              permissions={permissions}
              loading={loading}
              permissionColumns={permissionColumns}
              permissionActions={permissionActions}
            />
          )}
        </>
      )}

      <AccessControlModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItem={selectedItem}
        editMode={editMode}
        setEditMode={setEditMode}
        editData={editData}
        setEditData={setEditData}
        activeTab={activeTab}
        roles={roles}
        rolePermissions={rolePermissions}
        setRolePermissions={setRolePermissions}
        setShowPasswordModal={setShowPasswordModal}
        canChangePassword={canChangePassword}
        fetchAllData={fetchAllData}
      />

      <PasswordChangeModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        selectedItem={selectedItem}
        fetchAllData={fetchAllData}
      />

      <CreateUserModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        createData={createData}
        setCreateData={setCreateData}
        roles={roles}
        fetchAllData={fetchAllData}
      />

      <CreateRoleModal
        showCreateRoleModal={showCreateRoleModal}
        setShowCreateRoleModal={setShowCreateRoleModal}
        createRoleData={createRoleData}
        setCreateRoleData={setCreateRoleData}
        fetchAllData={fetchAllData}
      />
    </div>
  );
}
