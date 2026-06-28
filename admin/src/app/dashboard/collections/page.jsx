'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllCollections, createCollection, updateCollection, deleteCollection, restoreCollection } from '@/api/products';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';
import { checkPermission, PERMISSIONS } from '@/helper/permissions';

export default function CollectionsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canRead = checkPermission(currentUser, PERMISSIONS.COLLECTIONS.READ);
  const canCreate = checkPermission(currentUser, PERMISSIONS.COLLECTIONS.CREATE);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.COLLECTIONS.UPDATE);
  const canDelete = checkPermission(currentUser, PERMISSIONS.COLLECTIONS.DELETE);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ collectionName: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getAllCollections();
        setCollections(res.data || []);
      } catch (err) {
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    const filtered = (collections || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [collections, sortOrder]);

  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateCollection(selectedCollection.id, editData);
      const updated = { ...selectedCollection, ...editData };
      setSelectedCollection(updated);
      setCollections((prev) => prev.map((c) => (c.id === selectedCollection.id ? updated : c)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.collectionName) {
      setError('Name is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createCollection(formData);
      setCollections((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ collectionName: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add');
    } finally {
      setFormLoading(false);
    }
  };


  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreCollection(selectedCollection.id);
      const updated = { ...selectedCollection, deletedAt: null };
      setSelectedCollection(updated);
      setCollections((prev) => prev.map((c) => (c.id === selectedCollection.id ? updated : c)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'collectionName', label: 'NAME', render: (row) => row.collectionName || 'N/A' },
    { key: 'description', label: 'DESCRIPTION', render: (row) => (row.description || 'N/A').substring(0, 50) + '...' },
    { key: 'createdAt', label: 'CREATED', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

  const handleDeleteFromTable = async (item) => {
    if (!window.confirm(`Delete "${item.collectionName}"?`)) return;

    setLoading(true);
    try {
      await deleteCollection(item.id);
      setCollections((prev) => prev.filter((c) => c.id !== item.id));
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
    return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-500">Access denied. You don't have permission to view collections.</p></div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase">Collections Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage collections</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition whitespace-nowrap">
            <HiOutlinePlus className="w-5 h-5" /> Add Collection
          </button>
        )}
      </div>

      {error && <div className="mb-6 p-4 bg-red-50  border-error rounded"><p className="body-02 text-error">{error}</p></div>}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {collections.length}
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

      {showDetails && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Collection ID</p>
              <h2 className="text-3xl font-bold text-black">{selectedCollection.collectionName}</h2>
            </div>
            <div className="px-8 py-6 space-y-8">
              <div><p className="text-sm text-black font-semibold uppercase mb-4">Details</p><div className="space-y-4">
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32">Name:</p>{editMode ? <input type="text" value={editData.collectionName !== undefined ? editData.collectionName : selectedCollection.collectionName || ''} onChange={(e) => setEditData({ ...editData, collectionName: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedCollection.collectionName || 'N/A'}</p>}</div>
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32 mt-1">Description:</p>{editMode ? <textarea value={editData.description !== undefined ? editData.description : selectedCollection.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" rows="3" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedCollection.description || 'N/A'}</p>}</div>
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
                    {!selectedCollection.deletedAt ? (
                      <>
                        {canUpdate && <button onClick={() => { setEditMode(true); setEditData({ collectionName: selectedCollection.collectionName, description: selectedCollection.description }); }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>}
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
            <h3 className="text-xl font-bold text-black mb-6">Add Collection</h3>
            <div className="space-y-4 mb-8">
              <div><label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label><input type="text" value={formData.collectionName} onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" /></div>
              <div><label className="text-xs font-semibold text-black uppercase block mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" rows="3" /></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowAddForm(false); setFormData({ collectionName: '', description: '' }); setError(''); }} disabled={formLoading} className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
              <button onClick={handleAdd} disabled={formLoading} className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50">{formLoading ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
