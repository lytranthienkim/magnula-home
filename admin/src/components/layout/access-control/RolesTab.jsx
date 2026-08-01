import { Table } from '@/components/common/table/Table';

export default function RolesTab({
  roles,
  loading,
  setShowCreateRoleModal,
  setCreateRoleData,
  roleColumns,
  roleActions,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => {
          setCreateRoleData({ roleName: '' });
          setShowCreateRoleModal(true);
        }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
          + Add
        </button>
      </div>
      <Table columns={roleColumns} data={roles} onAction={roleActions} loading={loading} />
    </div>
  );
}
