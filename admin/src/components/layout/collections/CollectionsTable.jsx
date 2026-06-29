'use client';
import { Table } from '@/components/common/table/Table';
export default function CollectionsTable({ data, loading, onViewDetails, sortOrder, onSortOrderChange, statusFilter, onStatusFilterChange, onDelete, canDelete }) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'collectionName', label: 'NAME', render: (row) => row.collectionName || 'N/A' },
    { key: 'colorHex', label: 'COLOR', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: row.colorHex || '#000' }}></div>
        <span className="text-xs text-black">{row.colorHex || 'N/A'}</span>
      </div>
    ) },
    { key: 'description', label: 'DESCRIPTION', render: (row) => (
      <span className="text-xs text-gray-600 line-clamp-1">{row.description || 'N/A'}</span>
    ) },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
    { key: 'updatedAt', label: 'UPDATED', render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN') },
  ];
  const actions = (row) => {
    const actionList = [{ label: 'View', onClick: () => onViewDetails(row), variant: 'success' }];
    if (canDelete) {
      actionList.push({
        label: 'Delete',
        onClick: () => {
          if (window.confirm(`Delete "${row.collectionName}"?`)) {
            onDelete(row);
          }
        },
        variant: 'danger',
      });
    }
    return actionList;
  };
  return <>
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs text-gray-500">{data.length} items</span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 font-medium">Status:</label>
          <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none">
            <option value="All">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 font-medium">Sort:</label>
          <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)} className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
    <Table columns={columns} data={data} onAction={actions} loading={loading} />
  </>;
}
