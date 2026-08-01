'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllRoomSuitabilities, createRoomSuitability, updateRoomSuitability, deleteRoomSuitability, restoreRoomSuitability } from '@/api/roomSuitabilities';
import { RoomSuitabilitiesHeader, RoomSuitabilitiesTable, RoomSuitabilitiesModal, RoomSuitabilitiesAddForm } from '@/components/layout/room-suitabilities';
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

export default function RoomSuitabilitiesPage() {
  // useListManagement
  const { setItems: setRoomSuitabilities, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllRoomSuitabilities();
      const data = parseData(res);
      return { data: data.filter(r => !r.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedRoomSuitability,
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
    updateFn: updateRoomSuitability,
    deleteFn: deleteRoomSuitability,
    restoreFn: restoreRoomSuitability,
    onSuccess: (_, updated) => {
      setRoomSuitabilities((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    },
    onDelete: (deleted) => {
      setRoomSuitabilities((prev) => prev.filter((r) => r.id !== deleted.id));
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
    createFn: createRoomSuitability,
    onSuccess: (res) => {
      const newRoomSuitability = Array.isArray(res) ? res[0] : res?.data || res;
      setRoomSuitabilities((prev) => [newRoomSuitability, ...prev]);
      setShowAddForm(false);
    },
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleFormSubmit = useCallback(() => {
    if (!formData.name?.trim()) {
      setFormError('Room suitability name is required');
      return;
    }
    handleSubmit();
  }, [formData.name, setFormError, handleSubmit]);

  const handleDeleteRoomSuitability = useCallback(async (roomSuitability) => {
    try {
      await deleteRoomSuitability(roomSuitability.id);
      setRoomSuitabilities((prev) => prev.filter((r) => r.id !== roomSuitability.id));
      setError('Room suitability deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete room suitability');
    }
  }, [setRoomSuitabilities, setError]);

  const handleRestoreRoomSuitability = useCallback(async (roomSuitability) => {
    try {
      const restored = await restoreRoomSuitability(roomSuitability.id);
      setRoomSuitabilities((prev) => prev.map((r) => (r.id === roomSuitability.id ? restored : r)));
      setError('Room suitability restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore room suitability');
    }
  }, [setRoomSuitabilities, setError]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <RoomSuitabilitiesHeader onAddClick={() => setShowAddForm(true)} />
      <RoomSuitabilitiesTable
        data={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteRoomSuitability}
        onRestore={handleRestoreRoomSuitability}
        canDelete={true}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <RoomSuitabilitiesModal
        selected={selectedRoomSuitability}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedRoomSuitability || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={() => handleRestore()}
      />

      <RoomSuitabilitiesAddForm
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
