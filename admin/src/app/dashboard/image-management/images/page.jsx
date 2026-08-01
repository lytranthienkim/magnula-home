'use client';

import { useState, useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import ProductImageModal from '@/components/layout/product-images';
import { Table } from '@/components/common/table/Table';
import { Pagination } from '@/components/common/Pagination';
import { getAllImages } from '@/api/image';
import { deleteProductImage } from '@/api/productImage';

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function ImagesPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // useListManagement
  const { setItems: setImages, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllImages();
      return { data: parseData(res) };
    },
    sortField: 'createdAt',
  });

  // useUrlPagination
  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Handlers
  const handleViewDetails = useCallback((image) => {
    setSelectedImage(image);
    setShowDetails(true);
  }, []);

  const handleDeleteImage = useCallback(async (image) => {
    try {
      await deleteProductImage(image.id);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      setError('Image deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete image');
    }
  }, [setImages, setError]);

  // Table columns and actions
  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'imageUrl', label: 'IMAGE', render: (row) => <img src={row.imageUrl} alt="Product" className="h-12 w-12 object-cover rounded" /> },
    { key: 'uploadedAt', label: 'UPLOADED', render: (row) => new Date(row.uploadedAt || row.createdAt).toLocaleString('vi-VN') },
    { key: 'updatedAt', label: 'UPDATED', render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN') },
  ];

  const actions = (item) => [
    { label: 'View', onClick: () => handleViewDetails(item), variant: 'success' },
    { label: 'Delete', onClick: () => {
      if (window.confirm('Delete this image?')) {
        handleDeleteImage(item);
      }
    }, variant: 'danger' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Images Management</h3>
        <p className="body-02">View and manage product images</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border-error rounded"><p className="body-02 text-error">{error}</p></div>}

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {paginatedData.length} of {displayData.length}
        </span>
      </div>

      <Table columns={columns} data={paginatedData} onAction={actions} loading={loading} />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <ProductImageModal
        isOpen={showDetails}
        image={selectedImage}
        loading={loading}
        onClose={() => setShowDetails(false)}
        onDelete={handleDeleteImage}
      />
    </div>
  );
}
