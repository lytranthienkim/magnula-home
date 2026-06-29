'use client';

import { memo } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

const ProductRequestsModal = memo(({
  isOpen,
  request,
  editMode,
  editData,
  statusUpdating,
  canUpdate,
  onClose,
  onEditClick,
  onEditModeChange,
  onEditDataChange,
  onSave,
  onDelete,
  error,
  onErrorClear,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Product Request #{request.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600">{error}</p>
              <button onClick={onErrorClear} className="text-xs text-red-600 hover:text-red-800 mt-1">Dismiss</button>
            </div>
          )}

          {editMode ? (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Status</label>
                <select
                  value={editData.status || request.status || 'Pending'}
                  onChange={(e) => onEditDataChange({ ...editData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Notes</label>
                <textarea
                  value={editData.notes || request.notes || ''}
                  onChange={(e) => onEditDataChange({ ...editData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none min-h-24"
                  placeholder="Add notes..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={onSave}
                  disabled={statusUpdating}
                  className="flex-1 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {statusUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => onEditModeChange(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 text-xs font-bold rounded hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Customer Name</p>
                <p className="text-sm text-gray-900">{request.customerName || 'Anonymous'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Email</p>
                <p className="text-sm text-gray-900 break-all">{request.email || 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Product Name</p>
                <p className="text-sm text-gray-900">{request.productName || 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{request.description || 'No description'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                  request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status || 'Pending'}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Date</p>
                <p className="text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {canUpdate && (
                  <button
                    onClick={() => onEditClick()}
                    className="flex-1 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 text-xs font-bold rounded hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ProductRequestsModal.displayName = 'ProductRequestsModal';

export default ProductRequestsModal;
