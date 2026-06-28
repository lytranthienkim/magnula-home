'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllImages, updateImage, deleteProductImage, restoreImage } from '@/api/products';
import { Table } from '@/components/common/table/Table';
import { checkPermission, PERMISSIONS } from '@/helper/permissions';

export default function ImagesPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const canRead = checkPermission(currentUser, PERMISSIONS.PRODUCTS.READ);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.PRODUCTS.UPDATE);
  const canDelete = checkPermission(currentUser, PERMISSIONS.PRODUCTS.DELETE);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await getAllImages();
        setImages(res.data || []);
      } catch (err) {
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const filtered = (images || []).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [images, sortOrder]);

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateImage(selectedImage.id, editData);
      const updated = { ...selectedImage, ...editData };
      setSelectedImage(updated);
      setImages((prev) => prev.map((img) => (img.id === selectedImage.id ? updated : img)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteFromTable = async (item) => {
    if (!window.confirm(`Delete this image?`)) return;

    setLoading(true);
    try {
      await deleteProductImage(item.id);
      setImages((prev) => prev.filter((img) => img.id !== item.id));
      setError('Item deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreImage(selectedImage.id);
      const updated = { ...selectedImage, deletedAt: null };
      setSelectedImage(updated);
      setImages((prev) => prev.map((img) => (img.id === selectedImage.id ? updated : img)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'imageUrl', label: 'IMAGE', render: (row) => <img src={row.imageUrl} alt="Product" className="h-12 w-12 object-cover rounded" /> },
    { key: 'uploadedAt', label: 'UPLOADED', render: (row) => new Date(row.uploadedAt || row.createdAt).toLocaleString('vi-VN') },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

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
    return <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-500">Access denied. You don't have permission to view images.</p></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Images Management</h3>
        <p className="body-02">View and manage product images</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50  border-error rounded"><p className="body-02 text-error">{error}</p></div>}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {images.length}
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

      {showDetails && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Image ID</p>
              <h2 className="text-3xl font-bold text-black">#{selectedImage.id}</h2>
            </div>
            <div className="px-8 py-6 space-y-8">
              <div className="flex justify-center">
                <img src={selectedImage.imageUrl} alt={selectedImage.altText} className="max-w-96 max-h-96 rounded object-cover" />
              </div>
              <div><p className="text-sm text-black font-semibold uppercase mb-4">Image Details</p><div className="space-y-4">
                <div className="flex items-start"><p className="text-xs text-black font-semibold uppercase w-32">URL:</p>
                  {editMode ? (
                    <input type="text" value={editData.imageUrl !== undefined ? editData.imageUrl : selectedImage.imageUrl || ''} onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })} className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none" />
                  ) : (
                    <p className="flex-1 bg-gray-50 px-4 py-2 text-xs break-all">{selectedImage.imageUrl || 'N/A'}</p>
                  )}
                </div>
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
                    {!selectedImage.deletedAt ? (
                      canUpdate && <button onClick={() => { setEditMode(true); setEditData({ imageUrl: selectedImage.imageUrl }); }} className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>
                    ) : (
                      canUpdate && <button onClick={handleRestore} disabled={statusUpdating} className="px-6 py-2 bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition">{statusUpdating ? 'Restoring...' : 'Restore'}</button>
                    )}
                    <button disabled className="px-6 py-2 bg-black text-white text-xs font-bold opacity-50 cursor-not-allowed">Saved</button>
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
