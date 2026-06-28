'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllProductRequests, updateProductRequest } from '@/api/orders';
import { Table } from '@/components/common/table/Table';
import { checkPermission, PERMISSIONS } from '@/helper/permissions';

const REQUEST_STATUSES = ['pending', 'approved', 'rejected'];

export default function ProductRequestsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canRead = checkPermission(currentUser, PERMISSIONS.ORDERS.READ);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.ORDERS.UPDATE);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAllProductRequests();
        setRequests(res.data || []);
      } catch (err) {
        setError('Failed to load product requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = (newStatus) => {
    if (editMode) {
      setEditData({ ...editData, status: newStatus });
    } else {
      handleQuickStatusUpdate(newStatus);
    }
  };

  const handleQuickStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateProductRequest(selectedRequest.id, { status: newStatus });
      setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateProductRequest(selectedRequest.id, { status: editData.status });
      const updatedRequest = { ...selectedRequest, ...editData };
      setSelectedRequest(updatedRequest);
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r))
      );
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save request');
    } finally {
      setStatusUpdating(false);
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    { key: 'id', label: 'ID', width: '80px' },
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (row) => row.customerName || 'N/A',
    },
    {
      key: 'quantity',
      label: 'QUANTITY',
      render: (row) => row.requestedQuantity || '-',
    },
    {
      key: 'productName',
      label: 'PRODUCT',
      render: (row) => {
        const productName = row.Product?.productName || 'N/A';
        const variantInfo = row.ProductVariant?.overallSize ? ` (${row.ProductVariant.overallSize})` : '';
        return productName + variantInfo;
      },
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = (request) => {
    return [
      {
        label: 'View',
        onClick: () => {
          setSelectedRequest(request);
          setShowDetails(true);
        },
        variant: 'success',
      },
    ];
  };

  if (!canRead) {
    return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-500">Access denied. You don't have permission to view product requests.</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Product Requests Management</h3>
        <p className="body-02">Manage customer product quantity requests</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      {/* Table */}
      <Table columns={columns} data={requests} onAction={actions} loading={loading} />

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Request ID</p>
                <h2 className="text-3xl font-bold text-black">#{selectedRequest.id}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              {/* Status Section */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Request Status</p>
                <div className={`px-4 py-2 rounded text-sm font-medium w-full ${getStatusColor(editMode ? editData.status : selectedRequest.status)}`}>
                  <select
                    value={editMode ? (editData.status || selectedRequest.status) : (selectedRequest.status || '')}
                    onChange={(e) => handleStatusChange(e.target.value)}
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

              {/* Customer Information */}
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

              {/* Request Information */}
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

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData({});
                    }}
                    disabled={statusUpdating}
                    className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={statusUpdating}
                    className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {statusUpdating ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setEditData({ status: selectedRequest.status });
                        }}
                        className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                      >
                        Edit
                      </button>
                    )}
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
      )}

    </div>
  );
}
