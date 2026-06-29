'use client';

export default function CategoriesAddForm({
  formData,
  loading,
  error,
  onFormDataChange,
  onCreateCategory,
  onClose,
}) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h3 className="text-xl font-bold text-black mb-6">Create New Category</h3>

        <div className="space-y-4 mb-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Category Name *</label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => onFormDataChange({ ...formData, categoryName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              rows="3"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Status</label>
            <select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => onFormDataChange({ ...formData, isActive: e.target.value === 'active' })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreateCategory}
            disabled={loading}
            className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
