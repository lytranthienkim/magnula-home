import { Table } from '@/components/common/table/Table';

export const UsersTab = ({
  users,
  loading,
  setShowCreateModal,
  setCreateData,
  userColumns,
  userActions,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => {
          setCreateData({ fullName: '', email: '', password: '', roleId: '' });
          setShowCreateModal(true);
        }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
          + Add
        </button>
      </div>
      <Table columns={userColumns} data={users} onAction={userActions} loading={loading} />
    </div>
  );
};
