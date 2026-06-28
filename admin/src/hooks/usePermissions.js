import { useEffect, useState } from 'react';
import { getAllPermissions } from '@/api/roles';

/**
 * Custom hook for managing permissions data and logic
 * Handles: fetching, state management, modal controls
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [error, setError] = useState('');

  // Fetch permissions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllPermissions();
        setPermissions(res.data || []);
      } catch (err) {
        console.error('Error loading permissions:', err);
        setError('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle view details
  const handleViewDetails = (permission) => {
    setSelectedPermission(permission);
    setShowDetails(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedPermission(null);
  };

  return {
    permissions,
    loading,
    showDetails,
    selectedPermission,
    error,
    handleViewDetails,
    handleCloseModal,
  };
};
