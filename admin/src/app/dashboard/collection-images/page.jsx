'use client';

import { useEffect, useState } from 'react';
import { getAllCollectionImages, deleteCollectionImage } from '@/api/products';
import { Table } from '@/components/common/table/Table';

export default function CollectionImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await getAllCollectionImages();
        setImages(res.data || res || []);
      } catch (err) {
        setError('Failed to load collection images');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const sorted = (images || []).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(sorted);
  }, [images, sortOrder]);

  const handleView = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleDelete = async (image) => {
    if (!window.confirm('Delete this collection image?')) return;
    setLoading(true);
    try {
      await deleteCollectionImage(image.id);
      setImages((prev) => prev.filter((i) => i.id !== image.id));
      setError('Collection image deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete collection image');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'imageUrl', label: 'IMAGE', render: (row) => <img src={row.imageUrl} alt="Collection" className="h-12 w-12 object-cover rounded" /> },
    { key: 'collectionId', label: 'COLLECTION', render: (row) => row.collectionId || 'N/A' },
    { key: 'createdAt', label: 'UPLOADED', render: (row) => new Date(row.createdAt || 0).toLocaleString('vi-VN') },
    { key: 'updatedAt', label: 'UPDATED', render: (row) => new Date(row.updatedAt || 0).toLocaleString('vi-VN') },
  ];

  const actions = (item) => [
    { label: 'View', onClick: () => handleView(item), variant: 'success' },
    { label: 'Delete', onClick: () => handleDelete(item), variant: 'danger' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Collection Images</h3>
        <p className="body-02">Manage collection images</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
          <button onClick={() => setError('')} className="text-xs text-red-600 hover:text-red-800 mt-1">Dismiss</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {images.length}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 font-medium">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={displayData} onAction={actions} loading={loading} />

      {showModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <img src={selectedImage.imageUrl} alt="Collection" className="max-w-full max-h-64 rounded object-cover" />
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <p className="text-xs font-semibold text-gray-600 w-24">ID:</p>
                <p className="text-xs text-black">{selectedImage.id}</p>
              </div>
              <div className="flex items-start gap-2">
                <p className="text-xs font-semibold text-gray-600 w-24">Collection:</p>
                <p className="text-xs text-black">{selectedImage.collectionId || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-2">
                <p className="text-xs font-semibold text-gray-600 w-24">URL:</p>
                <p className="text-xs text-black break-all">{selectedImage.imageUrl || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-2">
                <p className="text-xs font-semibold text-gray-600 w-24">Uploaded:</p>
                <p className="text-xs text-black">{new Date(selectedImage.createdAt || 0).toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-white border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50">Close</button>
              <button onClick={() => { handleDelete(selectedImage); setShowModal(false); }} className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
