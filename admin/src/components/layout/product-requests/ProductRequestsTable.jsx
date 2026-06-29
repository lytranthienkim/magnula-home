'use client';

import { memo } from 'react';
import { Table } from '@/components/common/table';
import { Pagination } from '@/components/common/table';

const ProductRequestsTable = memo(({
  displayData,
  loading,
  sortOrder,
  statusFilter,
  currentPage,
  itemsPerPage,
  onSortChange,
  onStatusFilterChange,
  onViewDetails,
  onDeleteFromTable,
  canDelete,
  onPageChange,
}) => {
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayData.slice(startIdx, startIdx + itemsPerPage);

  const columns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'customerName', label: 'Customer Name', width: 'flex' },
    { key: 'productName', label: 'Product Name', width: 'flex' },
    { key: 'status', label: 'Status', width: '100px' },
    { key: 'createdAt', label: 'Date', width: '140px' },
  ];

  const renderRow = (item) => (
    <>
      <td className="px-4 py-2 text-sm text-gray-600">#{item.id}</td>
      <td className="px-4 py-2 text-sm text-gray-900 font-medium">{item.customerName || 'Anonymous'}</td>
      <td className="px-4 py-2 text-sm text-gray-600">{item.productName || 'N/A'}</td>
      <td className="px-4 py-2 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          item.status === 'Completed' ? 'bg-green-100 text-green-800' :
          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.status || 'Pending'}
        </span>
      </td>
      <td className="px-4 py-2 text-sm text-gray-600">
        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
      </td>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Sort</label>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData}
        loading={loading}
        renderRow={renderRow}
        onRowClick={onViewDetails}
        actions={canDelete ? [
          {
            label: 'Delete',
            onClick: onDeleteFromTable,
            className: 'text-red-600 hover:text-red-800',
          }
        ] : []}
        emptyMessage="No product requests found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

ProductRequestsTable.displayName = 'ProductRequestsTable';

export default ProductRequestsTable;
