'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, restoreMaterial } from '@/api/materials';
import { MaterialsHeader, MaterialsTable, MaterialsModal, MaterialsAddForm } from '@/components/layout/materials';
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

export default function MaterialsPage() {
  // useListManagement
  const { setItems: setMaterials, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllMaterials();
      const data = parseData(res);
      return { data: data.filter(m => !m.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedMaterial,
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
    updateFn: updateMaterial,
    deleteFn: deleteMaterial,
    restoreFn: restoreMaterial,
    onSuccess: (_, updated) => {
      setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    },
    onDelete: (deleted) => {
      setMaterials((prev) => prev.filter((m) => m.id !== deleted.id));
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
    createFn: createMaterial,
    onSuccess: (res) => {
      const newMaterial = Array.isArray(res) ? res[0] : res?.data || res;
      setMaterials((prev) => [newMaterial, ...prev]);
      setShowAddForm(false);
    },
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleFormSubmit = useCallback(() => {
    if (!formData.name?.trim()) {
      setFormError('Material name is required');
      return;
    }
    handleSubmit();
  }, [formData.name, setFormError, handleSubmit]);

  const handleDeleteMaterial = useCallback(async (material) => {
    try {
      await deleteMaterial(material.id);
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
      setError('Material deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete material');
    }
  }, [setMaterials, setError]);

  const handleRestoreMaterial = useCallback(async (material) => {
    try {
      const restored = await restoreMaterial(material.id);
      setMaterials((prev) => prev.map((m) => (m.id === material.id ? restored : m)));
      setError('Material restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore material');
    }
  }, [setMaterials, setError]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <MaterialsHeader onAddClick={() => setShowAddForm(true)} />
      <MaterialsTable
        data={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteMaterial}
        onRestore={handleRestoreMaterial}
        canDelete={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <MaterialsModal
        selected={selectedMaterial}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedMaterial || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={() => handleRestore()}
      />

      <MaterialsAddForm
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
