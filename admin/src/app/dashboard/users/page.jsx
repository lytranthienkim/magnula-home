'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllUsers, createUser, updateUserProfile, assignRoleToUser, removeRoleFromUser, getUserRoles, updateUserStatus } from '@/api/users';
import { getAllRoles } from '@/api/roles';
import { adminResetPassword } from '@/api/auth';
import {
  UsersHeader,
  UsersTable,
  UsersModal,
  UsersAddForm,
} from '@/components/layout/users';

export default function UsersPage() {
  const { user: currentUser } = useSelector((state) => state.auth);

  // State
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [resettingPassword, setResettingPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: '',
  });

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
      const userRes = await getAllUsers();
      const fullUserData = userRes.data.find(u => u.id === user.id);

      if (fullUserData) {
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
        isActive: editData.isActive,
      };

      await updateUserProfile(editData.id, updatePayload);

      setSelectedUser(editData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editData.id ? editData : u))
      );
      setEditMode(false);
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const createPayload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const res = await createUser(createPayload);

      if (formData.roleId) {
        await assignRoleToUser(res.data.id, parseInt(formData.roleId));
      }

      setUsers((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        roleId: '',
      });
      setError('');
      setSuccess('User created successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
      setError('Please enter password in both fields');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setResettingPassword(true);
    try {
      await adminResetPassword(selectedUser.id, {
        newPassword: resetPasswordData.newPassword,
      });

      setShowResetPasswordModal(false);
      setResetPasswordData({ newPassword: '', confirmPassword: '' });
      setSuccess('Password reset successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-xs text-green-600">{success}</p>
        </div>
      )}

      <UsersHeader onAddClick={() => setShowAddForm(true)} />
      <UsersTable users={users} loading={loading} onViewDetails={handleViewDetails} />

      <UsersModal
        selectedUser={selectedUser}
        editMode={editMode}
        editData={editData}
        roles={roles}
        saving={saving}
        resettingPassword={resettingPassword}
        showResetPasswordModal={showResetPasswordModal}
        resetPasswordData={resetPasswordData}
        onClose={() => { setShowDetails(false); setSelectedUser(null); setEditMode(false); setEditData({}); }}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onShowResetPassword={() => setShowResetPasswordModal(!showResetPasswordModal)}
        onResetPasswordDataChange={setResetPasswordData}
        onResetPassword={handleResetPassword}
      />

      {showAddForm && (
        <UsersAddForm
          formData={formData}
          roles={roles}
          loading={formLoading}
          error={error}
          onFormDataChange={setFormData}
          onCreateUser={handleCreateUser}
          onClose={() => {
            setShowAddForm(false);
            setFormData({
              fullName: '',
              email: '',
              password: '',
              roleId: '',
            });
            setError('');
          }}
        />
      )}
    </div>
  );
}
