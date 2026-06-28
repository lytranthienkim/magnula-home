import { useEffect, useState } from 'react';
import { getAllUsers, updateUserStatus, updateProfile } from '@/api/users';
import { getAllRoles } from '@/api/roles';

/**
 * Custom hook for managing users data and logic
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  // Fetch data
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
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort
  useEffect(() => {
    const filtered = (users || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [users, sortOrder]);

  // Handlers
  const handleViewDetails = async (user) => {
    try {
      setSelectedUser(user);
      setEditMode(false);
      setEditData({});
      setShowDetails(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user details');
    }
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      if (editData.isActive !== undefined) {
        await updateUserStatus(selectedUser.id, { isActive: editData.isActive });
      }
      const updated = { ...selectedUser, ...editData };
      setSelectedUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  return {
    users,
    displayData,
    roles,
    loading,
    showDetails,
    selectedUser,
    editMode,
    editData,
    statusUpdating,
    error,
    sortOrder,
    setEditMode,
    setEditData,
    setShowDetails,
    setSortOrder,
    setError,
    setUsers,
    handleViewDetails,
    handleCloseModal,
    handleSave,
  };
};
