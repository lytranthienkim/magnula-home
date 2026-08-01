'use client';

import { memo, useCallback } from 'react';
import { Table } from '@/components/common/table/Table';
import { Pagination } from '@/components/common/Pagination';

const ProductRequestsTable = memo(({
  data,
  loading,
  currentPage,
  totalPages,
  onViewDetails,
  onPageChange,
}) => {
  const getStatusColor = useCallback((status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }, []);

  const columns = [
    { key: 'id', label: 'ID', width: '80px' },
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (row) => row.customerName || 'N/A',
    },
    {
      key: 'quantity',
      label: 'QUANTITY',
      render: (row) => row.requestedQuantity || '-',
    },
    {
      key: 'productName',
      label: 'PRODUCT',
      render: (row) => {
        const productName = row.Product?.productName || 'N/A';
        const variantInfo = row.ProductVariant?.overallSize ? ` (${row.ProductVariant.overallSize})` : '';
        return productName + variantInfo;
      },
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
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = useCallback((request) => {
    return [
      {
        label: 'View',
        onClick: () => onViewDetails(request),
        variant: 'success',
      },
    ];
  }, [onViewDetails]);

  return (
    <div className="space-y-4">
      <Table columns={columns} data={data} onAction={actions} loading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={onPageChange} />
    </div>
  );
});

ProductRequestsTable.displayName = 'ProductRequestsTable';

export default ProductRequestsTable;
