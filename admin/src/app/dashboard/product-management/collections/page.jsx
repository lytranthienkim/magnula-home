'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllCollections, createCollection, updateCollection, deleteCollection, restoreCollection } from '@/api/collection';
import { CollectionsHeader, CollectionsTable, CollectionsModal, CollectionsAddForm } from '@/components/layout/collections';
import { Pagination } from '@/components/common/Pagination';

const initialFormData = {
  collectionName: '',
  colorHex: '#000000',
  description: '',
  images: [],
};

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function CollectionsPage() {
  // useListManagement
  const { setItems: setCollections, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllCollections();
      const data = parseData(res);
      return { data: data.filter(c => !c.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedCollection,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    error: modalError,
    handleSave,
    handleViewDetails,
    handleCloseModal,
    handleDelete,
    handleRestore,
  } = useItemModal({
    updateFn: updateCollection,
    deleteFn: deleteCollection,
    restoreFn: restoreCollection,
    onSuccess: (_, updated) => {
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    },
    onDelete: (deleted) => {
      setCollections((prev) => prev.filter((c) => c.id !== deleted.id));
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
    createFn: createCollection,
    onSuccess: (res) => {
      const newCollection = Array.isArray(res) ? res[0] : res?.data || res;
      setCollections((prev) => [newCollection, ...prev]);
      setShowAddForm(false);
    },
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleFormSubmit = useCallback(() => {
    if (!formData.collectionName?.trim()) {
      setFormError('Collection name is required');
      return;
    }
    if (!formData.colorHex?.trim()) {
      setFormError('Color is required');
      return;
    }
    handleSubmit();
  }, [formData.collectionName, formData.colorHex, setFormError, handleSubmit]);

  const handleDeleteCollection = useCallback(async (collection) => {
    try {
      await deleteCollection(collection.id);
      setCollections((prev) => prev.filter((c) => c.id !== collection.id));
      setError('Collection deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete collection');
    }
  }, [setCollections, setError]);

  const handleRestoreCollection = useCallback(async (collection) => {
    try {
      const restored = await restoreCollection(collection.id);
      setCollections((prev) => prev.map((c) => (c.id === collection.id ? restored : c)));
      setError('Collection restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore collection');
    }
  }, [setCollections, setError]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <CollectionsHeader onAddClick={() => setShowAddForm(true)} />
      <CollectionsTable
        data={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteCollection}
        onRestore={handleRestoreCollection}
        canDelete={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <CollectionsModal
        selected={selectedCollection}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedCollection || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={() => handleRestore()}
      />

      <CollectionsAddForm
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
