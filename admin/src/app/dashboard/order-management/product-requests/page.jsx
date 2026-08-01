'use client';

import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllProductRequests, updateProductRequest } from '@/api/productRequest';
import { ProductRequestsTable, ProductRequestsModal } from '@/components/layout/product-requests';

export default function ProductRequestsPage() {
  // useListManagement
  const { setItems: setRequests, loading, error, displayData } = useListManagement({
    fetchFn: () => getAllProductRequests(10000, 0),
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedRequest,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    error: modalError,
    handleSave: hookHandleSave,
    handleViewDetails,
    handleCloseModal,
  } = useItemModal({
    updateFn: updateProductRequest,
    onSuccess: (_, updatedRequest) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
      );
    },
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Product Requests Management</h3>
        <p className="body-02">Manage customer product quantity requests</p>
      </div>

      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border-error rounded">
          <p className="body-02 text-error">{error || modalError}</p>
        </div>
      )}

      <ProductRequestsTable
        data={paginatedData}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onViewDetails={handleViewDetails}
        onPageChange={setCurrentPage}
      />

      <ProductRequestsModal
        selectedRequest={selectedRequest}
        editMode={editMode}
        editData={editData}
        statusUpdating={statusUpdating}
        onStatusChange={(newStatus) => setEditData((prev) => ({ ...prev, status: newStatus }))}
        onSave={hookHandleSave}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onClose={handleCloseModal}
      />
    </div>
  );
}
