'use client';

import { REQUEST_STATUSES } from '@/constants/statuses';

export default function ProductRequestsModal({
  selectedRequest,
  editMode,
  editData,
  statusUpdating,
  onStatusChange,
  onSave,
  onEditModeChange,
  onEditDataChange,
  onClose,
}) {
  if (!selectedRequest) return null;

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase">Request ID</p>
            <h2 className="text-3xl font-bold text-black">#{selectedRequest.id}</h2>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Request Status</p>
            <div className={`px-4 py-2 rounded text-sm font-medium w-full ${getStatusColor(editMode ? editData.status : selectedRequest.status)}`}>
              <select
                value={editMode ? (editData.status || selectedRequest.status) : (selectedRequest.status || '')}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={statusUpdating || !editMode}
                className="w-full bg-transparent text-black text-sm font-medium focus:outline-none cursor-pointer appearance-none disabled:opacity-50"
              >
                {REQUEST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Customer Information</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Name:</p>
                <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedRequest.customerName || 'N/A'}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Phone:</p>
                <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedRequest.customerPhone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Request Information</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Product:</p>
                <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">
                  {selectedRequest.Product?.productName || 'N/A'}
                  {selectedRequest.ProductVariant?.overallSize && ` (${selectedRequest.ProductVariant.overallSize})`}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Quantity:</p>
                <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedRequest.requestedQuantity || '-'}</p>
              </div>
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-32 mt-1">Description:</p>
                <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedRequest.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  onEditModeChange(false);
                  onEditDataChange({});
                }}
                disabled={statusUpdating}
                className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={statusUpdating}
                className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {statusUpdating ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onEditModeChange(true);
                    onEditDataChange({ status: selectedRequest.status });
                  }}
                  className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  disabled
                  className="px-6 py-2 bg-black text-white text-xs font-bold opacity-50 cursor-not-allowed"
                >
                  Saved
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
