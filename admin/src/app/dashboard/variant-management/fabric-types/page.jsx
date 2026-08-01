'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllFabricTypes, createFabricType, updateFabricType, deleteFabricType, restoreFabricType } from '@/api/fabricType';
import { FabricTypesHeader, FabricTypesTable, FabricTypesModal, FabricTypesAddForm } from '@/components/layout/fabric-types';
import { Pagination } from '@/components/common/Pagination';

const initialFormData = {
  name: '',
  description: '',
  isActive: true,
};

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function FabricTypesPage() {

  // useListManagement
  const { setItems: setFabricTypes, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllFabricTypes();
      const data = parseData(res);
      return { data: data.filter(f => !f.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedFabricType,
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
    updateFn: updateFabricType,
    deleteFn: deleteFabricType,
    restoreFn: restoreFabricType,
    onSuccess: (_, updated) => {
      setFabricTypes((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    },
    onDelete: (deleted) => {
      setFabricTypes((prev) => prev.filter((f) => f.id !== deleted.id));
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
    createFn: createFabricType,
    onSuccess: (res) => {
      const newFabricType = Array.isArray(res) ? res[0] : res?.data || res;
      setFabricTypes((prev) => [newFabricType, ...prev]);
      setShowAddForm(false);
    },
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleFormSubmit = useCallback(() => {
    if (!formData.name?.trim()) {
      setFormError('Fabric type name is required');
      return;
    }
    handleSubmit();
  }, [formData.name, setFormError, handleSubmit]);

  const handleDeleteFabricType = useCallback(async (fabricType) => {
    try {
      await deleteFabricType(fabricType.id);
      setFabricTypes((prev) => prev.filter((f) => f.id !== fabricType.id));
      setError('Fabric type deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete fabric type');
    }
  }, [setFabricTypes, setError]);

  const handleRestoreFabricType = useCallback(async (fabricType) => {
    try {
      const restored = await restoreFabricType(fabricType.id);
      setFabricTypes((prev) => prev.map((f) => (f.id === fabricType.id ? restored : f)));
      setError('Fabric type restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore fabric type');
    }
  }, [setFabricTypes, setError]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <FabricTypesHeader onAddClick={() => setShowAddForm(true)} />
      <FabricTypesTable
        data={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteFabricType}
        onRestore={handleRestoreFabricType}
        canDelete={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <FabricTypesModal
        selected={selectedFabricType}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedFabricType || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={() => handleRestore()}
      />

      <FabricTypesAddForm
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
