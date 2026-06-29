'use client';

import { Table } from '@/components/common/table/Table';

/**
 * ProductsTable Component
 * Displays the products table with filters and sorting
 */
export function ProductsTable({
  displayData,
  products,
  loading,
  sortOrder,
  statusFilter,
  onSortChange,
  onStatusFilterChange,
  onViewDetails,
  onDeleteFromTable,
  canDelete,
}) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    {
      key: 'productName',
      label: 'PRODUCT NAME',
      render: (row) => row.productName || 'N/A',
    },
    {
      key: 'Category',
      label: 'CATEGORY',
      render: (row) => row.Category?.categoryName || 'N/A',
    },
    {
      key: 'Collection',
      label: 'COLLECTION',
      render: (row) => row.Collection?.collectionName || 'N/A',
    },
    {
      key: 'variants',
      label: 'PRICE',
      render: (row) => {
        const variant = row.variants?.[0];
        return variant ? `$${parseFloat(variant.price).toFixed(2)}` : 'N/A';
      },
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => row.status || 'N/A',
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = (product) => {
    const actionList = [
      {
        label: 'View',
        onClick: () => onViewDetails(product),
        variant: 'success',
      },
    ];

    if (canDelete) {
      actionList.push({
        label: 'Delete',
        onClick: () => {
          if (window.confirm(`Delete "${product.productName}"?`)) {
            onDeleteFromTable(product);
          }
        },
        variant: 'danger',
      });
    }

    return actionList;
  };

  return (
    <>
      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {products.length}
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
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={displayData} onAction={actions} loading={loading} />
    </>
  );
}
