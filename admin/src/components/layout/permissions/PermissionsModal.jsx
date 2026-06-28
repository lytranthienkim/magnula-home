'use client';

/**
 * PermissionsModal Component
 * Displays permission details in a modal
 */
export function PermissionsModal({ isOpen, permission, onClose }) {
  if (!isOpen || !permission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Permission Key</p>
            <h2 className="text-3xl font-bold text-black">{permission.permissionKey}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Permission Key */}
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Permission Key</p>
            <div className="bg-gray-50 px-4 py-2">
              <p className="text-xs font-medium text-black">{permission.permissionKey}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Description</p>
            <div className="bg-gray-50 px-4 py-2">
              <p className="text-xs text-black">{permission.description || 'N/A'}</p>
            </div>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Created</p>
            <div className="bg-gray-50 px-4 py-2">
              <p className="text-xs text-black">{new Date(permission.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
