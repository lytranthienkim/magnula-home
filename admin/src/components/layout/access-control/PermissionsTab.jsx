import { Table } from '@/components/common/table/Table';

export const PermissionsTab = ({
  permissions,
  loading,
  permissionColumns,
  permissionActions,
}) => {
  return (
    <Table columns={permissionColumns} data={permissions} onAction={permissionActions} loading={loading} />
  );
};
