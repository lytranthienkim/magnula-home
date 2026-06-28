'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, restoreMaterial } from '@/api/productAttributes';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';
import { checkPermission, PERMISSIONS } from '@/helper/permissions';

export default function MaterialsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canRead = checkPermission(currentUser, PERMISSIONS.MATERIALS.READ);
  const canCreate = checkPermission(currentUser, PERMISSIONS.MATERIALS.CREATE);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.MATERIALS.UPDATE);
  const canDelete = checkPermission(currentUser, PERMISSIONS.MATERIALS.DELETE);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
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
    const fetchMaterials = async () => {
      try {
        const res = await getAllMaterials();
        setMaterials(res.data || []);
      } catch (err) {
        setError('Failed to load materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = (materials || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [materials, sortOrder]);

  const handleViewDetails = (material) => {
    setSelectedMaterial(material);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateMaterial(selectedMaterial.id, editData);
      const updated = { ...selectedMaterial, ...editData };
      setSelectedMaterial(updated);
      setMaterials((prev) => prev.map((m) => (m.id === selectedMaterial.id ? updated : m)));
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
      const res = await createMaterial(formData);
      setMaterials((prev) => [res.data, ...prev]);
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
      await restoreMaterial(selectedMaterial.id);
      const updated = { ...selectedMaterial, deletedAt: null };
      setSelectedMaterial(updated);
      setMaterials((prev) => prev.map((m) => (m.id === selectedMaterial.id ? updated : m)));
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
      await deleteMaterial(item.id);
      setMaterials((prev) => prev.filter((m) => m.id !== item.id));
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
    return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-500">Access denied. You don't have permission to view materials.</p></div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Materials Management</h3>
          <p className="body-02">Manage materials</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition">
            <HiOutlinePlus className="w-5 h-5" /> Add Material
          </button>
        )}
      </div>

      {error && <div className="mb-6 p-4 bg-red-50  border-error rounded"><p className="body-02 text-error">{error}</p></div>}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {materials.length}
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

      {showDetails && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Material ID</p>
              <h2 className="text-3xl font-bold text-black">{selectedMaterial.name}</h2>
            </div>
            <div className="px-8 py-6 space-y-8">
              <div><p className="text-sm text-black font-semibold uppercase mb-4">Details</p><div className="space-y-4">
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32">Name:</p>{editMode ? <input type="text" value={editData.name !== undefined ? editData.name : selectedMaterial.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedMaterial.name || 'N/A'}</p>}</div>
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32 mt-1">Description:</p>{editMode ? <textarea value={editData.description !== undefined ? editData.description : selectedMaterial.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" rows="3" /> : <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedMaterial.description || 'N/A'}</p>}</div>
                <div className="flex items-center"><p className="text-xs text-black font-semibold uppercase w-32">Status:</p>{editMode ? <select value={editData.isActive !== undefined ? editData.isActive : selectedMaterial.isActive} onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"><option value="true">Active</option><option value="false">Inactive</option></select> : <span className={`flex-1 px-4 py-2 text-xs font-semibold rounded ${selectedMaterial.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{selectedMaterial.isActive ? 'Active' : 'Inactive'}</span>}</div>
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
                    {!selectedMaterial.deletedAt ? (
                      <>
                        {canUpdate && <button onClick={() => { setEditMode(true); setEditData({ name: selectedMaterial.name, description: selectedMaterial.description, isActive: selectedMaterial.isActive }); }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>}
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
            <h3 className="text-xl font-bold text-black mb-6">Add Material</h3>
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
