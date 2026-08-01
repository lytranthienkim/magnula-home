'use client';

import { useState, useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllCollectionImages, deleteCollectionImage } from '@/api/collectionImage';
import { CollectionImageModal } from '@/components/layout/collection-images';
import { Table } from '@/components/common/table/Table';
import { Pagination } from '@/components/common/Pagination';

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function CollectionImagesPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // useListManagement
  const { setItems: setImages, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllCollectionImages(10000, 0);
      return { data: parseData(res) };
    },
    sortField: 'createdAt',
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleViewImage = useCallback((image) => {
    setSelectedImage(image);
    setShowModal(true);
  }, []);

  const handleDeleteImage = useCallback(async (image) => {
    try {
      await deleteCollectionImage(image.id);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      setError('Collection image deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete collection image');
    }
  }, [setImages, setError]);

  // Table columns and actions
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'imageUrl', label: 'IMAGE', render: (row) => <img src={row.imageUrl} alt="Collection" className="h-12 w-12 object-cover rounded" /> },
    { key: 'collectionId', label: 'COLLECTION', render: (row) => row.collectionId || 'N/A' },
    { key: 'createdAt', label: 'UPLOADED', render: (row) => new Date(row.createdAt || 0).toLocaleString('vi-VN') },
    { key: 'updatedAt', label: 'UPDATED', render: (row) => new Date(row.updatedAt || 0).toLocaleString('vi-VN') },
  ];

  const actions = (item) => [
    { label: 'View', onClick: () => handleViewImage(item), variant: 'success' },
    { label: 'Delete', onClick: () => {
      if (window.confirm('Delete this collection image?')) {
        handleDeleteImage(item);
      }
    }, variant: 'danger' },
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
          {paginatedData.length} of {displayData.length}
        </span>
      </div>

      <Table columns={columns} data={paginatedData} onAction={actions} loading={loading} />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <CollectionImageModal
        isOpen={showModal}
        image={selectedImage}
        loading={loading}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteImage}
      />
    </div>
  );
}
