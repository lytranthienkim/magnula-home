import { useEffect, useState } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory, restoreCategory } from '@/api/products';

/**
 * Custom hook for managing categories data and logic
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ categoryName: '', description: '', isActive: true });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort
  useEffect(() => {
    const filtered = (categories || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [categories, sortOrder]);

  // Handlers
  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateCategory(selectedCategory.id, editData);
      const updated = { ...selectedCategory, ...editData };
      setSelectedCategory(updated);
      setCategories((prev) => prev.map((c) => (c.id === selectedCategory.id ? updated : c)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.categoryName) {
      setError('Name is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createCategory(formData);
      setCategories((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ categoryName: '', description: '', isActive: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setLoading(true);
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setError('Category deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    displayData,
    loading,
    showDetails,
    selectedCategory,
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
    setCategories,
    handleViewDetails,
    handleCloseModal,
    handleSave,
    handleAdd,
    handleDelete,
  };
};
