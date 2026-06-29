'use client';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];

export default function OrdersModal({
  selectedOrder,
  editMode,
  editData,
  saving,
  onClose,
  onEditClick,
  onEditModeChange,
  onEditDataChange,
  onStatusChange,
  onSave
}) {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Shipping': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-black';
  };

  if (!selectedOrder) return null;

  const displayOrder = editMode ? editData : selectedOrder;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Order Code</p>
            <h2 className="text-3xl font-bold text-black">{selectedOrder.orderCode}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {/* Status Section */}
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Order Status</p>
            <div className={`px-4 py-2 rounded text-sm font-medium w-full ${getStatusColor(displayOrder.status)}`}>
              <select
                value={displayOrder.status}
                onChange={(e) => {
                  if (editMode) {
                    onEditDataChange({ ...editData, status: e.target.value });
                  } else {
                    onStatusChange(e.target.value);
                  }
                }}
                className="w-full bg-transparent text-black text-sm font-medium focus:outline-none cursor-pointer appearance-none"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Information Section */}
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Customer Information</p>
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.customerName || ''}
                      onChange={(e) => onEditDataChange({ ...editData, customerName: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs font-medium text-black">{selectedOrder.customerName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-24">Email:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="email"
                      value={editData.customerEmail || ''}
                      onChange={(e) => onEditDataChange({ ...editData, customerEmail: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs text-black">{selectedOrder.customerEmail}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-24">Phone:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input
                      type="tel"
                      value={editData.customerPhone || ''}
                      onChange={(e) => onEditDataChange({ ...editData, customerPhone: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs font-medium text-black">{selectedOrder.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Shipping Address</p>
            <div className="space-y-4">
              {/* Country and State - Same Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Country */}
                <div className="flex items-center">
                  <p className="text-xs text-black font-semibold uppercase w-24">Country:</p>
                  <div className="flex-1 bg-gray-50 px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.countryRegion || ''}
                        onChange={(e) => onEditDataChange({ ...editData, countryRegion: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs font-medium text-black">{selectedOrder.countryRegion}</p>
                    )}
                  </div>
                </div>
                {/* State */}
                <div className="flex items-center">
                  <p className="text-xs text-black font-semibold uppercase w-24">State:</p>
                  <div className="flex-1 bg-gray-50 px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.stateProvince || ''}
                        onChange={(e) => onEditDataChange({ ...editData, stateProvince: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs font-medium text-black">{selectedOrder.stateProvince}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-24">Address:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <textarea
                      value={editData.shippingAddress || ''}
                      onChange={(e) => onEditDataChange({ ...editData, shippingAddress: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      rows="2"
                    />
                  ) : (
                    <p className="text-xs text-black">{selectedOrder.shippingAddress}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Order Items</p>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-black">Product</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-black">Quantity</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-black">Price</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-black">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2 text-xs text-black font-medium truncate">{item.Product?.productName || 'Unknown'}</td>
                      <td className="px-3 py-2 text-xs text-center text-black">{item.quantity}</td>
                      <td className="px-3 py-2 text-xs text-right text-black">${parseFloat(item.priceAtPurchase || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-xs text-right font-semibold text-black">${(parseFloat(item.priceAtPurchase || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="flex flex-row items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-black font-semibold uppercase">Order Total</p>
            <p className="text-2xl font-bold text-black">${parseFloat(selectedOrder.totalPrice || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  onEditModeChange(false);
                }}
                className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onEditClick}
                  className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  disabled
                  className="px-3 py-1.5 bg-black text-white text-xs font-bold opacity-50 cursor-not-allowed"
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
