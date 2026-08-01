'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllCategories, createCategory, updateCategory, deleteCategory, restoreCategory } from '@/api/category';
import { CategoriesHeader, CategoriesTable, CategoriesModal, CategoriesAddForm } from '@/components/layout/categories';
import { Pagination } from '@/components/common/Pagination';

const initialFormData = {
  categoryName: '',
  description: '',
  isActive: true,
};

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function CategoriesPage() {

  // useListManagement
  const { setItems: setCategories, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllCategories();
      const data = parseData(res);
      return { data: data.filter(c => !c.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedCategory,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    error: modalError,
    handleSave,
    handleViewDetails,
    handleCloseModal,
    handleRestore,
  } = useItemModal({
    updateFn: updateCategory,
    deleteFn: deleteCategory,
    restoreFn: restoreCategory,
    onSuccess: (_, updated) => {
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    },
    onDelete: (deleted) => {
      setCategories((prev) => prev.filter((c) => c.id !== deleted.id));
    },
  });

  // useItemForm
  const {
    showAddForm,
    setShowAddForm,
    formData,
    setFormData,
    formLoading,
    formError,
    setFormError,
    handleSubmit,
    resetForm,
  } = useItemForm({
    initialValues: initialFormData,
    createFn: createCategory,
    onSuccess: (res) => {
      const newCategory = Array.isArray(res) ? res[0] : res?.data || res;
      setCategories((prev) => [newCategory, ...prev]);
      setShowAddForm(false);
    },
  });

  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleDeleteCategory = useCallback(async (category) => {
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      setError('Category deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  }, [setCategories, setError]);

  const handleRestoreCategory = useCallback(async (category) => {
    try {
      const restored = await restoreCategory(category.id);
      setCategories((prev) => prev.map((c) => (c.id === category.id ? restored : c)));
      setError('Category restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore category');
    }
  }, [setCategories, setError]);

  const handleFormSubmit = useCallback(() => {
    if (!formData.categoryName?.trim()) {
      setFormError('Category name is required');
      return;
    }
    handleSubmit();
  }, [formData.categoryName, setFormError, handleSubmit]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <CategoriesHeader onAddClick={() => setShowAddForm(true)} />
      <CategoriesTable
        data={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteCategory}
        onRestore={handleRestoreCategory}
        canDelete={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <CategoriesModal
        selectedCategory={selectedCategory}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedCategory || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={() => handleRestore()}
      />

      <CategoriesAddForm
        showAddForm={showAddForm}
        formData={formData}
        formLoading={formLoading}
        formError={formError}
        onFormDataChange={setFormData}
        onClearError={() => setFormError('')}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          resetForm();
          setShowAddForm(false);
        }}
      />
    </div>
  );
}
