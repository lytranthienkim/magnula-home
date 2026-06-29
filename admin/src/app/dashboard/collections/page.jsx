'use client';

import { useEffect, useState } from 'react';
import { getAllCollections, createCollection, updateCollection, restoreCollection, deleteCollection } from '@/api/products';
import {
  CollectionsHeader,
  CollectionsTable,
  CollectionsModal,
} from '@/components/layout/collections';

export default function CollectionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ collectionName: '', colorHex: '#000000', description: '', images: [] });
  const [imageUrl, setImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getAllCollections();
        setItems(res.data || []);
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items || [];
    if (statusFilter !== 'All') {
      filtered = filtered.filter(i => i.isActive === (statusFilter === 'active'));
    }
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [items, sortOrder, statusFilter]);

  const handleViewDetails = (item) => {
    setSelected(item);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateCollection(selected.id, editData);
      const updated = { ...selected, ...editData };
      setSelected(updated);
      setItems((prev) => prev.map((i) => (i.id === selected.id ? updated : i)));
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
    if (!formData.colorHex) {
      setError('Color is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createCollection(formData);
      setItems((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ collectionName: '', colorHex: '#000000', description: '', images: [] });
      setImageUrl('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    setFormData({
      ...formData,
      images: [...formData.images, imageUrl],
    });
    setImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleDelete = async (item) => {
    setStatusUpdating(true);
    try {
      await deleteCollection(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setShowDetails(false);
      setSelected(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete collection');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreCollection(selected.id);
      const updated = { ...selected, deletedAt: null };
      setSelected(updated);
      setItems((prev) => prev.map((i) => (i.id === selected.id ? updated : i)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <CollectionsHeader onAddClick={() => setShowAddForm(true)} />
      <CollectionsTable
        data={displayData}
        loading={loading}
        onViewDetails={handleViewDetails}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onDelete={handleDelete}
        canDelete={true}
      />

      <CollectionsModal
        selected={selected}
        editMode={editMode}
        editData={editData}
        saving={statusUpdating}
        onClose={() => { setShowDetails(false); setSelected(null); setEditMode(false); setEditData({}); }}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onRestore={handleRestore}
      />

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold text-black mb-6">Add New Collection</h3>
            <div className="space-y-4 mb-8">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded"><p className="text-xs text-red-600">{error}</p></div>}

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
                <input type="text" value={formData.collectionName} onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Color *</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.colorHex} onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })} className="w-16 h-10 border border-gray-300 rounded cursor-pointer" />
                  <input type="text" value={formData.colorHex} onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })} placeholder="#000000" className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" rows="2" />
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Collection Images</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" />
                  <button onClick={handleAddImage} className="px-3 py-2 bg-gray-600 text-white text-xs font-bold rounded hover:bg-gray-700">Add</button>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                        <span className="truncate text-gray-700">{img}</span>
                        <button onClick={() => handleRemoveImage(idx)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowAddForm(false); setFormData({ collectionName: '', colorHex: '#000000', description: '', images: [] }); setImageUrl(''); setError(''); }} disabled={formLoading} className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
              <button onClick={handleAdd} disabled={formLoading} className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50">{formLoading ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
