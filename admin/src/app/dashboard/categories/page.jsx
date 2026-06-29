'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllCategories, createCategory, updateCategory, deleteCategory, restoreCategory } from '@/api/products';
import {
  CategoriesHeader,
  CategoriesTable,
  CategoriesModal,
} from '@/components/layout/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateCategory(selectedCategory.id, editData);
      const updatedCategory = { ...selectedCategory, ...editData };
      setSelectedCategory(updatedCategory);
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategory.id ? updatedCategory : c))
      );
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddCategory = async () => {
    if (!formData.categoryName) {
      setError('Category name is required');
      return;
    }

    setFormLoading(true);
    try {
      const res = await createCategory({
        categoryName: formData.categoryName,
        description: formData.description,
        isActive: formData.isActive,
      });
      setCategories((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({
        categoryName: '',
        description: '',
        isActive: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (category) => {
    setStatusUpdating(true);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      setShowDetails(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreCategory(selectedCategory.id);
      const updatedCategory = { ...selectedCategory, deletedAt: null };
      setSelectedCategory(updatedCategory);
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategory.id ? updatedCategory : c))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore category');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <CategoriesHeader onAddClick={() => setShowAddForm(true)} />
      <CategoriesTable
        data={displayData}
        loading={loading}
        onViewDetails={handleViewDetails}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onDelete={handleDelete}
        canDelete={true}
      />

      <CategoriesModal
        selectedCategory={selectedCategory}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={() => { setShowDetails(false); setSelectedCategory(null); setEditMode(false); setEditData({}); }}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={handleRestore}
      />

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Create New Category</h3>

            <div className="space-y-4 mb-8">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    categoryName: '',
                    description: '',
                    isActive: true,
                  });
                  setError('');
                }}
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
