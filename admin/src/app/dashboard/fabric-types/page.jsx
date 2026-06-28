'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllFabricTypes, createFabricType, updateFabricType, deleteFabricType, restoreFabricType } from '@/api/productAttributes';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';
import { checkPermission, PERMISSIONS } from '@/helper/permissions';

export default function FabricTypesPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canRead = checkPermission(currentUser, PERMISSIONS.FABRIC_TYPES.READ);
  const canCreate = checkPermission(currentUser, PERMISSIONS.FABRIC_TYPES.CREATE);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.FABRIC_TYPES.UPDATE);
  const canDelete = checkPermission(currentUser, PERMISSIONS.FABRIC_TYPES.DELETE);
  const [fabricTypes, setFabricTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFabricType, setSelectedFabricType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchFabricTypes = async () => {
      try {
        const res = await getAllFabricTypes();
        setFabricTypes(res.data || []);
      } catch (err) {
        setError('Failed to load fabric types');
      } finally {
        setLoading(false);
      }
    };
    fetchFabricTypes();
  }, []);

  useEffect(() => {
    const filtered = (fabricTypes || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [fabricTypes, sortOrder]);

  const handleViewDetails = (fabricType) => {
    setSelectedFabricType(fabricType);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateFabricType(selectedFabricType.id, editData);
      const updated = { ...selectedFabricType, ...editData };
      setSelectedFabricType(updated);
      setFabricTypes((prev) => prev.map((f) => (f.id === selectedFabricType.id ? updated : f)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createFabricType(formData);
      setFabricTypes((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ name: '', description: '', isActive: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add');
    } finally {
      setFormLoading(false);
    }
  };


  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreFabricType(selectedFabricType.id);
      const updated = { ...selectedFabricType, deletedAt: null };
      setSelectedFabricType(updated);
      setFabricTypes((prev) => prev.map((f) => (f.id === selectedFabricType.id ? updated : f)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'name', label: 'NAME', render: (row) => row.name || 'N/A' },
    { key: 'description', label: 'DESCRIPTION', render: (row) => (row.description || 'N/A').substring(0, 50) + '...' },
    {
      key: 'isActive',
      label: 'STATUS',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

  const handleDeleteFromTable = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    setLoading(true);
    try {
      await deleteFabricType(item.id);
      setFabricTypes((prev) => prev.filter((f) => f.id !== item.id));
      setError('Item deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const actions = (item) => [
    { label: 'View', onClick: () => handleViewDetails(item), variant: 'success' },
    ...(canDelete
      ? [
          {
            label: 'Delete',
            onClick: () => handleDeleteFromTable(item),
            variant: 'danger',
          },
        ]
      : []),
  ];

  if (!canRead) {
    return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-500">Access denied. You don't have permission to view fabric types.</p></div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Fabric Types Management</h3>
          <p className="body-02">Manage fabric types</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
            <HiOutlinePlus className="w-5 h-5" /> Add Fabric Type
          </button>
        )}
      </div>

      {error && <div className="mb-6 p-4 bg-red-50  border-error rounded"><p className="body-02 text-error">{error}</p></div>}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {fabricTypes.length}
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

      {showDetails && selectedFabricType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Fabric Type ID</p>
              <h2 className="text-3xl font-bold text-black">{selectedFabricType.name}</h2>
            </div>
            <div className="px-8 py-6 space-y-8">
              <div><p className="text-sm text-black font-semibold uppercase mb-4">Details</p><div className="space-y-4">
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32">Name:</p>{editMode ? <input type="text" value={editData.name !== undefined ? editData.name : selectedFabricType.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedFabricType.name || 'N/A'}</p>}</div>
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32 mt-1">Description:</p>{editMode ? <textarea value={editData.description !== undefined ? editData.description : selectedFabricType.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" rows="3" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedFabricType.description || 'N/A'}</p>}</div>
                <div className="flex items-center"><p className="text-xs text-black font-semibold uppercase w-32">Status:</p>{editMode ? <select value={editData.isActive !== undefined ? editData.isActive : selectedFabricType.isActive} onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"><option value="true">Active</option><option value="false">Inactive</option></select> : <span className={`flex-1 px-4 py-2 text-xs font-semibold rounded ${selectedFabricType.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{selectedFabricType.isActive ? 'Active' : 'Inactive'}</span>}</div>
              </div></div>
            </div>
            <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
              {editMode ? (
                <>
                  <button onClick={() => { setEditMode(false); setEditData({}); }} disabled={statusUpdating} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
                  <button onClick={handleSave} disabled={statusUpdating} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition">{statusUpdating ? 'Saving...' : 'Save'}</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowDetails(false)} className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Cancel</button>
                  <div className="flex gap-2">
                    {!selectedFabricType.deletedAt ? (
                      <>
                        {canUpdate && <button onClick={() => { setEditMode(true); setEditData({ name: selectedFabricType.name, description: selectedFabricType.description, isActive: selectedFabricType.isActive }); }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>}
                      </>
                    ) : (
                      canDelete && <button onClick={handleRestore} disabled={statusUpdating} className="px-6 py-2 bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition">{statusUpdating ? 'Restoring...' : 'Restore'}</button>
                    )}
                    <button disabled className="px-6 py-2 bg-black text-white text-xs font-bold opacity-50 cursor-not-allowed">Saved</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Add Fabric Type</h3>
            <div className="space-y-4 mb-8">
              <div><label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" /></div>
              <div><label className="text-xs font-semibold text-black uppercase block mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" rows="3" /></div>
              <div><label className="text-xs font-semibold text-black uppercase block mb-2">Status</label><select value={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"><option value="true">Active</option><option value="false">Inactive</option></select></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowAddForm(false); setFormData({ name: '', description: '', isActive: true }); setError(''); }} disabled={formLoading} className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
              <button onClick={handleAdd} disabled={formLoading} className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50">{formLoading ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
