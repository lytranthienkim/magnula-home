'use client';
import { Table } from '@/components/common/table/Table';

export function RolesTable({
  displayData,
  loading,
  onViewDetails,
  onDelete,
  onRestore,
}) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'roleName', label: 'ROLE NAME', render: (row) => row.roleName || 'N/A' },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => <span className={`px-2 py-1 rounded text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{row.isActive ? 'Active' : 'Inactive'}</span>
    },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
  ];

  const actions = (role) => {
    const actionList = [
      {
        label: 'View',
        onClick: () => onViewDetails(role),
        variant: 'success',
      },
    ];

    if (role.deletedAt) {
      actionList.push({
        label: 'Restore',
        onClick: () => onRestore(role),
        variant: 'warning',
      });
    } else {
      actionList.push({
        label: 'Delete',
        onClick: () => {
          if (window.confirm(`Delete "${role.roleName}"?`)) {
            onDelete(role);
          }
        },
        variant: 'danger',
      });
    }

    return actionList;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          Total: {displayData?.length || 0} roles
        </span>
      </div>
      <Table columns={columns} data={displayData} onAction={actions} loading={loading} />
    </>
  );
}
