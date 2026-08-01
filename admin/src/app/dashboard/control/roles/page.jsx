'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllRoles, createRole, updateRole, deleteRole, restoreRole } from '@/api/roles';
import {
  RolesHeader,
  RolesTable,
  RolesModal,
} from '@/components/layout/roles';

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

const initialFormData = { roleName: '', isActive: true };

export default function RolesPage() {
  const { setItems, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllRoles();
      return { data: parseData(res).filter(r => !r.deletedAt) };
    },
    sortField: 'createdAt',
  });

  const {
    selected,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    handleSave,
    handleViewDetails,
    handleCloseModal,
    handleRestore,
  } = useItemModal({
    updateFn: updateRole,
    deleteFn: deleteRole,
    restoreFn: restoreRole,
    onSuccess: (_, updated) => {
      setItems((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    },
    onDelete: (deleted) => {
      setItems((prev) => prev.filter((r) => r.id !== deleted.id));
    },
  });

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
    createFn: createRole,
    onSuccess: (res) => {
      const newRole = Array.isArray(res) ? res[0] : res?.data || res;
      setItems((prev) => [newRole, ...prev]);
      setShowAddForm(false);
    },
  });

  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  const handleFormSubmit = useCallback(() => {
    if (!formData.roleName?.trim()) {
      setFormError('Role name is required');
      return;
    }
    handleSubmit();
  }, [formData.roleName, setFormError, handleSubmit]);

  const handleDeleteRole = useCallback(async (role) => {
    try {
      await deleteRole(role.id);
      setItems((prev) => prev.filter((r) => r.id !== role.id));
      setError('Role deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete role');
    }
  }, [setItems, setError]);

  const handleRestoreRole = useCallback(async (role) => {
    try {
      const restored = await restoreRole(role.id);
      setItems((prev) => prev.map((r) => (r.id === role.id ? restored : r)));
      setError('Role restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore role');
    }
  }, [setItems, setError]);

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <RolesHeader onAddClick={() => setShowAddForm(true)} />
      <RolesTable
        displayData={paginatedData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteRole}
        onRestore={handleRestoreRole}
      />

      {displayData.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              {paginatedData.length} of {displayData.length}
            </span>
          </div>
        </div>
      )}

      <RolesModal
        isOpen={selected !== null}
        role={selected}
        editMode={editMode}
        editData={editData}
        updating={statusUpdating}
        canUpdate
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selected || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onDelete={() => handleDeleteRole(selected)}
        onRestore={handleRestore}
      />

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Add New Role</h3>
            <div className="space-y-4 mb-8">
              {formError && <div className="p-3 bg-red-50 border border-red-200 rounded"><p className="text-xs text-red-600">{formError}</p></div>}
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Role Name *</label>
                <input type="text" value={formData.roleName} onChange={(e) => setFormData({ ...formData, roleName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { resetForm(); setShowAddForm(false); }} disabled={formLoading} className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
              <button onClick={handleFormSubmit} disabled={formLoading} className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50">{formLoading ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
