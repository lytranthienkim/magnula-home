import { useEffect, useState } from 'react';
import { getAllRoles, createRole, updateRole, deleteRole, restoreRole } from '@/api/roles';

/**
 * Custom hook for managing roles data and logic
 */
export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ roleName: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllRoles();
        setRoles(res.data || []);
      } catch (err) {
        console.error('Error loading roles:', err);
        setError('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort
  useEffect(() => {
    const filtered = (roles || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [roles, sortOrder]);

  // Handlers
  const handleViewDetails = (role) => {
    setSelectedRole(role);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedRole(null);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateRole(selectedRole.id, editData);
      const updated = { ...selectedRole, ...editData };
      setSelectedRole(updated);
      setRoles((prev) => prev.map((r) => (r.id === selectedRole.id ? updated : r)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.roleName) {
      setError('Role name is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createRole(formData);
      setRoles((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ roleName: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (roleId) => {
    setLoading(true);
    try {
      await deleteRole(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      setError('Role deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    displayData,
    loading,
    showDetails,
    selectedRole,
    editMode,
    editData,
    showAddForm,
    formData,
    formLoading,
    statusUpdating,
    error,
    sortOrder,
    setEditMode,
    setEditData,
    setShowDetails,
    setFormData,
    setShowAddForm,
    setSortOrder,
    setError,
    setRoles,
    handleViewDetails,
    handleCloseModal,
    handleSave,
    handleAdd,
    handleDelete,
  };
};
