import { createRole } from '@/api/roles';

export const CreateRoleModal = ({
  showCreateRoleModal,
  setShowCreateRoleModal,
  createRoleData,
  setCreateRoleData,
  fetchAllData,
}) => {
  if (!showCreateRoleModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <p className="text-md font-semibold uppercase">Create New Role</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          <div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Role Name *</label>
                <input
                  type="text"
                  value={createRoleData.roleName}
                  onChange={(e) => setCreateRoleData({ ...createRoleData, roleName: e.target.value })}
                  placeholder="Enter role name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={() => {
            setShowCreateRoleModal(false);
            setCreateRoleData({ roleName: '' });
          }} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={async () => {
            try {
              if (!createRoleData.roleName) {
                alert('Role name is required');
                return;
              }
              await createRole(createRoleData.roleName);
              alert('Role created successfully');
              setShowCreateRoleModal(false);
              setCreateRoleData({ roleName: '' });
              await fetchAllData();
            } catch (err) {
              alert('Failed to create role: ' + (err.response?.data?.message || err.message));
            }
          }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};
