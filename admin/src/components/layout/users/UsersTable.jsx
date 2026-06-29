'use client';

import { Table } from '@/components/common/table/Table';

export default function UsersTable({ users, loading, onViewDetails }) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    {
      key: 'name',
      label: 'NAME',
      render: (row) => row.fullName || 'N/A',
    },
    {
      key: 'email',
      label: 'EMAIL',
      render: (row) => row.email || 'N/A',
    },
    {
      key: 'roles',
      label: 'ROLES',
      render: (row) => (row.roles && Array.isArray(row.roles) ? row.roles.join(', ') : 'N/A'),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => {
        const isActive = row.status === 'active' || row.isActive === true;
        return (
          <span className={`px-3 py-1 rounded text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const actions = (user) => [
    {
      label: 'View',
      onClick: () => onViewDetails(user),
      variant: 'success',
    },
  ];

  return <Table columns={columns} data={users} onAction={actions} loading={loading} />;
}
