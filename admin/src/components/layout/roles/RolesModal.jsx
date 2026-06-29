'use client';
export default function RolesModal({ selected, editMode, editData, saving, onClose, onEditModeChange, onEditDataChange, onSave, onRestore }) {
  if (!selected) return null;
  const display = editMode ? editData : selected;
  const isDeleted = selected.deletedAt !== null;
  const getFieldDisplay = (obj) => obj.roleName || obj.name || 'N/A';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">{getFieldDisplay(selected)}</h2>
        </div>
        <div className="px-8 py-6 space-y-6">
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Details</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Name:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input type="text" value={editData.roleName || ''} onChange={(e) => onEditDataChange({ ...editData, roleName: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-400 text-xs text-black focus:outline-none" />
                  ) : (
                    <p className="text-xs font-medium text-black">{getFieldDisplay(selected)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Status:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <select value={editData.isActive ? 'active' : 'inactive'} onChange={(e) => onEditDataChange({ ...editData, isActive: e.target.value === 'active' })} className="w-full px-4 py-2 bg-white border border-gray-400 text-xs text-black focus:outline-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${selected.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{selected.isActive ? 'Active' : 'Inactive'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-600 font-semibold uppercase mb-2">Created</p><p className="text-xs text-black">{new Date(selected.createdAt).toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-600 font-semibold uppercase mb-2">Updated</p><p className="text-xs text-black">{new Date(selected.updatedAt).toLocaleString()}</p></div>
          </div>
        </div>
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          {editMode ? (
            <>
              <button onClick={() => { onEditModeChange(false); onEditDataChange(selected); }} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Cancel</button>
              <button onClick={onSave} disabled={saving} className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition">{saving ? 'Saving...' : 'Save'}</button>
            </>
          ) : (
            <>
              {isDeleted ? (
                <>
                  <button onClick={onClose} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Close</button>
                  <button onClick={onRestore} disabled={saving} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition disabled:opacity-50">{saving ? 'Restoring...' : 'Restore'}</button>
                </>
              ) : (
                <>
                  <button onClick={onClose} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Close</button>
                  <button onClick={() => onEditModeChange(true)} className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
