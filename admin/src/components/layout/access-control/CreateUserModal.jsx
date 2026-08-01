import { createUser } from '@/api/users';

export const CreateUserModal = ({
  showCreateModal,
  setShowCreateModal,
  createData,
  setCreateData,
  roles,
  fetchAllData,
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <p className="text-md font-semibold uppercase">Create New User</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">User Information</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Full Name *</label>
                <input
                  type="text"
                  value={createData.fullName}
                  onChange={(e) => setCreateData({ ...createData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Email *</label>
                <input
                  type="email"
                  value={createData.email}
                  onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Password *</label>
                <input
                  type="password"
                  value={createData.password}
                  onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Role *</label>
                <select
                  value={createData.roleId}
                  onChange={(e) => setCreateData({ ...createData, roleId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={() => {
            setShowCreateModal(false);
            setCreateData({ fullName: '', email: '', password: '', roleId: '' });
          }} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={async () => {
            try {
              if (!createData.fullName || !createData.email || !createData.password || !createData.roleId) {
                alert('All fields are required');
                return;
              }
              await createUser({
                fullName: createData.fullName,
                email: createData.email,
                password: createData.password,
                roleId: createData.roleId,
              });
              alert('User created successfully');
              setShowCreateModal(false);
              setCreateData({ fullName: '', email: '', password: '', roleId: '' });
              await fetchAllData();
            } catch (err) {
              alert('Failed to create user: ' + (err.response?.data?.message || err.message));
            }
          }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">
            Create User
          </button>
        </div>
      </div>
    </div>
  );
};
