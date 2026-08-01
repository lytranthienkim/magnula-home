'use client';

import { useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { getAllPaymentMethods, createPaymentMethod, updatePaymentMethod, restorePaymentMethod } from '@/api/paymentMethod';
import {
  PaymentMethodsHeader,
  PaymentMethodsTable,
  PaymentMethodsModal,
  PaymentMethodsForm,
} from '@/components/layout/payment-methods';

const initialFormData = {
  code: '',
  name: '',
  isActive: true,
};

export default function PaymentMethodsPage() {
  // useListManagement
  const { setItems, loading, error, setError, statusFilter, setStatusFilter, sortOrder, setSortOrder, displayData } = useListManagement({
    fetchFn: getAllPaymentMethods,
    sortField: 'createdAt',
    filterFn: (item, status) => item.isActive === (status === 'active'),
  });

  // useItemModal
  const {
    selected,
    setSelected,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    setUpdating: setStatusUpdating,
    handleSave,
    handleViewDetails,
    handleCloseModal,
  } = useItemModal({
    updateFn: updatePaymentMethod,
    onSuccess: (_, updated) => {
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
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
    createFn: createPaymentMethod,
    onSuccess: (res) => {
      setItems((prev) => [res.data, ...prev]);
      setShowAddForm(false);
    },
  });

  // Handlers
  const handleRestore = useCallback(async () => {
    if (!selected) return;
    setStatusUpdating(true);
    try {
      await restorePaymentMethod(selected.id);
      const updated = { ...selected, deletedAt: null };
      setSelected(updated);
      setItems((prev) => prev.map((i) => (i.id === selected.id ? updated : i)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore');
    } finally {
      setStatusUpdating(false);
    }
  }, [selected, setStatusUpdating, setSelected, setItems, setError]);

  const handleFormSubmit = useCallback(() => {
    if (!formData.code?.trim()) {
      setFormError('Code is required');
      return;
    }
    if (!formData.name?.trim()) {
      setFormError('Name is required');
      return;
    }
    handleSubmit();
  }, [formData.code, formData.name, setFormError, handleSubmit]);

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <PaymentMethodsHeader onAddClick={() => setShowAddForm(true)} />
      <PaymentMethodsTable
        data={displayData}
        loading={loading}
        onViewDetails={handleViewDetails}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <PaymentMethodsModal
        selected={selected}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selected || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={handleRestore}
      />

      <PaymentMethodsForm
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
