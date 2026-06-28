'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllPaymentMethods, updatePaymentMethodStatus, updatePaymentMethod, createPaymentMethod } from '@/api/orders';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';

export default function PaymentMethodsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const isAdmin = currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('Administrator');

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await getAllPaymentMethods();
        setPaymentMethods(res.data || []);
      } catch (err) {
        setError('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  useEffect(() => {
    const filtered = (paymentMethods || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [paymentMethods, sortOrder]);

  const handleStatusChange = (newIsActive) => {
    if (editMode) {
      setEditData({ ...editData, isActive: newIsActive });
    } else {
      handleQuickStatusUpdate(newIsActive);
    }
  };

  const handleQuickStatusUpdate = async (newIsActive) => {
    setStatusUpdating(true);
    try {
      await updatePaymentMethodStatus(selectedMethod.id, { isActive: newIsActive });
      setSelectedMethod((prev) => ({ ...prev, isActive: newIsActive }));
      setPaymentMethods((prev) =>
        prev.map((m) => (m.id === selectedMethod.id ? { ...m, isActive: newIsActive } : m))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update payment method status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      const updatedMethod = { ...selectedMethod, ...editData };

      // Only update status if isActive changed
      if (editData.isActive !== undefined && editData.isActive !== selectedMethod.isActive) {
        await updatePaymentMethodStatus(selectedMethod.id, { isActive: editData.isActive });
      }

      // Update name/description if changed
      if (editData.name !== undefined || editData.description !== undefined || editData.code !== undefined) {
        const updatePayload = {};
        if (editData.name !== undefined) updatePayload.name = editData.name;
        if (editData.description !== undefined) updatePayload.description = editData.description;
        if (editData.code !== undefined) updatePayload.code = editData.code;

        if (Object.keys(updatePayload).length > 0) {
          await updatePaymentMethod(selectedMethod.id, updatePayload);
        }
      }

      setSelectedMethod(updatedMethod);
      setPaymentMethods((prev) =>
        prev.map((m) => (m.id === selectedMethod.id ? updatedMethod : m))
      );
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save payment method');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!formData.code || !formData.name) {
      setError('Code and Name are required');
      return;
    }

    setFormLoading(true);
    try {
      const res = await createPaymentMethod(formData);
      setPaymentMethods((prev) => [...prev, res.data]);
      setShowAddForm(false);
      setFormData({ code: '', name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add payment method');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'code', label: 'CODE', render: (row) => row.code || 'N/A' },
    { key: 'name', label: 'METHOD NAME', render: (row) => row.name || 'N/A' },
    {
      key: 'isActive',
      label: 'STATUS',
      render: (row) => (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(row.isActive)}`}>
          {getStatusLabel(row.isActive)}
        </span>
      ),
    },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
  ];

  const actions = (method) => [
    {
      label: 'View',
      onClick: () => {
        setSelectedMethod(method);
        setEditMode(false);
        setEditData({});
        setShowDetails(true);
      },
      variant: 'success',
    },
  ];

  if (!isAdmin) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Payment Methods Management</h3>
          <p className="body-02">Manage payment methods and their status</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
        >
          <HiOutlinePlus className="w-3 h-3" />
          Add
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {paymentMethods.length}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 font-medium">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={displayData} onAction={actions} loading={loading} />

      {showDetails && selectedMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Payment Method ID</p>
              <h2 className="text-3xl font-bold text-black">{selectedMethod.name}</h2>
            </div>

            <div className="px-8 py-6 space-y-8">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Status</p>
                <div className={`px-4 py-2 rounded text-sm font-medium w-full ${getStatusColor(editMode ? editData.isActive : selectedMethod.isActive)}`}>
                  <select
                    value={editMode ? (editData.isActive ? 'true' : 'false') : (selectedMethod.isActive ? 'true' : 'false')}
                    onChange={(e) => handleStatusChange(e.target.value === 'true')}
                    disabled={statusUpdating || !editMode}
                    className="w-full bg-transparent text-black text-sm font-medium focus:outline-none cursor-pointer appearance-none disabled:opacity-50"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs flex-1 font-semibold uppercase mb-4">Payment Method Details</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <p className="text-xs text-black font-semibold uppercase w-32">Code:</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.code !== undefined ? editData.code : selectedMethod.code || ''}
                        onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs flex-1 bg-gray-50 px-4 py-2">{selectedMethod.code || 'N/A'}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <p className="text-xs text-black font-semibold uppercase w-32">Name:</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.name !== undefined ? editData.name : selectedMethod.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs flex-1 bg-gray-50 px-4 py-2">{selectedMethod.name || 'N/A'}</p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <p className="text-xs text-black font-semibold uppercase w-32">Description:</p>
                    {editMode ? (
                      <textarea
                        value={editData.description !== undefined ? editData.description : selectedMethod.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                        rows="2"
                      />
                    ) : (
                      <p className="text-xs flex-1 bg-gray-50 px-4 py-2">{selectedMethod.description || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditData({ isActive: selectedMethod.isActive });
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
      )}

      {/* Add Payment Method Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CREDIT_CARD"
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Credit Card"
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Payment method details"
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ code: '', name: '', description: '' });
                  setError('');
                }}
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
