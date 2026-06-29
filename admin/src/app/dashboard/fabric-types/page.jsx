'use client';

import { useEffect, useState } from 'react';
import { getAllFabricTypes, createFabricType, updateFabricType, restoreFabricType } from '@/api/productAttributes';
import {
  FabricTypesHeader,
  FabricTypesTable,
  FabricTypesModal,
} from '@/components/layout/fabric-types';

export default function FabricTypesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getAllFabricTypes();
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
      await updateFabricType(selected.id, editData);
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
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createFabricType(formData);
      setItems((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({ name: '', description: '', isActive: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreFabricType(selected.id);
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

      <FabricTypesHeader onAddClick={() => setShowAddForm(true)} />
      <FabricTypesTable
        data={displayData}
        loading={loading}
        onViewDetails={handleViewDetails}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <FabricTypesModal
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
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Add New Item</h3>
            <div className="space-y-4 mb-8">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded"><p className="text-xs text-red-600">{error}</p></div>}
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Status</label>
                <select value={formData.isActive ? 'active' : 'inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
