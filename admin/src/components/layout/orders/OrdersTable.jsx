'use client';

import { Table } from '@/components/common/table/Table';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];

export default function OrdersTable({ 
  orders, 
  loading, 
  statusFilter, 
  sortOrder, 
  onStatusFilterChange, 
  onSortOrderChange,
  onViewDetails 
}) {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Shipping': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-black';
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (row) => row.customerName || 'N/A',
    },
    {
      key: 'email',
      label: 'EMAIL',
      render: (row) => row.customerEmail || 'N/A',
    },
    {
      key: 'total',
      label: 'TOTAL',
      render: (row) => `$${parseFloat(row.totalPrice || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  const actions = (order) => [
    {
      label: 'View',
      onClick: () => onViewDetails(order),
      variant: 'success',
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {orders.length} of {orders.length}
        </span>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="All">All</option>
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
              className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <Table columns={columns} data={orders} onAction={actions} loading={loading} />
    </>
  );
}
