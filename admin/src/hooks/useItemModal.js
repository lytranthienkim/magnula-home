import { useState, useCallback } from 'react';

export const useItemModal = ({
  updateFn = null,
  deleteFn = null,
  restoreFn = null,
  onSuccess = null,
  onDelete = null,
} = {}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleViewDetails = useCallback((item) => {
    setSelected(item);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
    setError('');
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetails(false);
    setSelected(null);
    setEditMode(false);
    setEditData({});
    setError('');
  }, []);

  const handleStartEdit = useCallback(() => {
    setEditData(selected || {});
    setEditMode(true);
  }, [selected]);

  const handleSave = useCallback(async () => {
    if (!updateFn || !selected) return;

    setUpdating(true);
    setError('');
    try {
      const result = await updateFn(selected.id, editData);
      const updatedItem = { ...selected, ...editData };
      setSelected(updatedItem);
      setEditMode(false);
      setEditData({});
      if (onSuccess) onSuccess(result, updatedItem);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save');
    } finally {
      setUpdating(false);
    }
  }, [updateFn, selected, editData, onSuccess]);

  const handleDelete = useCallback(async () => {
    if (!deleteFn || !selected) return;

    setUpdating(true);
    setError('');
    try {
      await deleteFn(selected.id);
      if (onDelete) onDelete(selected);
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete');
    } finally {
      setUpdating(false);
    }
  }, [deleteFn, selected, onDelete, handleCloseModal]);

  const handleRestore = useCallback(async () => {
    if (!restoreFn || !selected) return;

    setUpdating(true);
    setError('');
    try {
      const result = await restoreFn(selected.id);
      const restoredItem = { ...selected, ...result };
      setSelected(restoredItem);
      if (onSuccess) onSuccess(result, restoredItem);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to restore');
    } finally {
      setUpdating(false);
    }
  }, [restoreFn, selected, onSuccess]);

  return {
    showDetails,
    setShowDetails,
    selected,
    setSelected,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating,
    setUpdating,
    error,
    setError,
    handleViewDetails,
    handleCloseModal,
    handleStartEdit,
    handleSave,
    handleDelete,
    handleRestore,
  };
};
