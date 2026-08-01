'use client';

import { useCallback, useState, useEffect } from 'react';
import { OrdersHeader, OrdersTable, OrdersModal, OrdersAddForm } from '@/components/layout/orders';
import { Pagination } from '@/components/common/Pagination';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllOrders, updateOrder } from '@/api/orders';
import { getAllProducts } from '@/api/products';
import { getAllCountries } from '@/api/country';
import { getActivePaymentMethods } from '@/api/paymentMethod';

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function OrdersPage() {
  // useListManagement
  const { setItems: setOrders, loading, error, setError, statusFilter, setStatusFilter, sortOrder, setSortOrder, displayData } = useListManagement({
    fetchFn: () => getAllOrders(10000, 0),
    sortField: 'createdAt',
    filterFn: (item, status) => item.status === status,
  });

  // useItemModal
  const {
    selected: selectedOrder,
    setSelected: setSelectedOrder,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    setUpdating: setStatusUpdating,
    handleViewDetails: hookHandleViewDetails,
    handleCloseModal,
  } = useItemModal();

  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Fetch metadata for products, countries and payment methods
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [productsRes, countriesRes, paymentRes] = await Promise.all([
          getAllProducts(),
          getAllCountries(),
          getActivePaymentMethods(),
        ]);
        setProducts(parseData(productsRes));
        setCountries(parseData(countriesRes));
        setPaymentMethods(parseData(paymentRes));
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  const [showAddForm, setShowAddForm] = useState(false);

  // Handlers
  const handleStatusChange = useCallback(async (newStatus) => {
    if (!selectedOrder) return;
    setStatusUpdating(true);
    try {
      await updateOrder(selectedOrder.id, { status: newStatus });
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    } finally {
      setStatusUpdating(false);
    }
  }, [selectedOrder, setStatusUpdating, setSelectedOrder]);

  const handleEditClick = useCallback(() => {
    setEditData(selectedOrder || {});
    setEditMode(true);
  }, [selectedOrder, setEditData, setEditMode]);

  const handleEditModeChange = useCallback((mode) => {
    setEditMode(mode);
    if (mode) setEditData(selectedOrder || {});
  }, [selectedOrder, setEditMode, setEditData]);

  const handleSaveOrder = useCallback(async () => {
    if (!selectedOrder) return;

    try {
      const updatePayload = {};
      if (editData.status !== selectedOrder.status) updatePayload.status = editData.status;
      if (editData.customerName !== selectedOrder.customerName) updatePayload.customerName = editData.customerName;
      if (editData.customerEmail !== selectedOrder.customerEmail) updatePayload.customerEmail = editData.customerEmail;
      if (editData.customerPhone !== selectedOrder.customerPhone) updatePayload.customerPhone = editData.customerPhone;
      if (editData.countryRegion !== selectedOrder.countryRegion) updatePayload.countryRegion = editData.countryRegion;
      if (editData.stateProvince !== selectedOrder.stateProvince) updatePayload.stateProvince = editData.stateProvince;
      if (editData.shippingAddress !== selectedOrder.shippingAddress) updatePayload.shippingAddress = editData.shippingAddress;

      if (Object.keys(updatePayload).length === 0) {
        setError('No changes to save');
        return;
      }

      setStatusUpdating(true);
      await updateOrder(selectedOrder.id, updatePayload);
      const updatedOrder = { ...selectedOrder, ...editData };
      setSelectedOrder(updatedOrder);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
      setEditMode(false);
      setEditData({});
      setError('Order updated successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save order');
    } finally {
      setStatusUpdating(false);
    }
  }, [selectedOrder, editData, setStatusUpdating, setSelectedOrder, setOrders, setEditMode, setEditData, setError]);

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      <OrdersHeader onAddClick={() => setShowAddForm(true)} />
      <OrdersTable
        orders={paginatedData}
        loading={loading}
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        onStatusFilterChange={setStatusFilter}
        onSortOrderChange={setSortOrder}
        onViewDetails={hookHandleViewDetails}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <OrdersModal
        selectedOrder={selectedOrder}
        editMode={editMode}
        editData={editData}
        onClose={handleCloseModal}
        onEditClick={handleEditClick}
        onEditModeChange={handleEditModeChange}
        onEditDataChange={setEditData}
        onStatusChange={handleStatusChange}
        onSave={handleSaveOrder}
      />

      <OrdersAddForm
        showAddForm={showAddForm}
        products={products}
        countries={countries}
        paymentMethods={paymentMethods}
        onClose={() => setShowAddForm(false)}
        setOrders={setOrders}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
