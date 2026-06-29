'use client';
import { Table } from '@/components/common/table/Table';
export default function FabrictypesTable({ data, loading, onViewDetails, sortOrder, onSortOrderChange, statusFilter, onStatusFilterChange }) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'name', label: 'NAME', render: (row) => row.name || 'N/A' },
    { key: 'description', label: 'DESCRIPTION', render: (row) => row.description || 'N/A' },
    { key: 'status', label: 'STATUS', render: (row) => <span className={`px-2 py-1 rounded text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{row.isActive ? 'Active' : 'Inactive'}</span> },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString() },
  ];
  const actions = (row) => [{ label: 'View', onClick: () => onViewDetails(row), variant: 'success' }];
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
