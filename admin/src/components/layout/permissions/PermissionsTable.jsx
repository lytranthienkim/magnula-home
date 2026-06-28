'use client';

import { Table } from '@/components/common/table/Table';

/**
 * PermissionsTable Component
 * Displays permissions in a table format
 */
export function PermissionsTable({ permissions, loading, onViewDetails }) {
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'permissionKey', label: 'PERMISSION KEY' },
    {
      key: 'description',
      label: 'DESCRIPTION',
      render: (row) => {
        const desc = row.description || 'N/A';
        return (
          <span className="text-xs text-black" title={desc}>
            {desc.length > 50 ? desc.substring(0, 50) + '...' : desc}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = (permission) => [
    {
      label: 'View',
      onClick: () => onViewDetails(permission),
      variant: 'success',
    },
  ];

  return <Table columns={columns} data={permissions} onAction={actions} loading={loading} />;
}
