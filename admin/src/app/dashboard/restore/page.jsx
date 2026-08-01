'use client';

import { useCallback, useEffect, useState } from 'react';
import { Table } from '@/components/common/table/Table';
import { VscChromeRestore } from "react-icons/vsc";
import { ENTITY_TYPES } from '@/constants/entities';
import {
  getDeletedProducts,
  getDeletedCategories,
  getDeletedCollections,
  getDeletedMaterials,
  getDeletedFabricTypes,
  getDeletedRoomSuitabilities,
  getDeletedImages,
  getDeletedUsers,
  getDeletedRoles,
  getDeletedPermissions,
  restoreItem,
} from '@/api/restore';

const FETCHERS = {
  products: getDeletedProducts,
  categories: getDeletedCategories,
  collections: getDeletedCollections,
  materials: getDeletedMaterials,
  'fabric-types': getDeletedFabricTypes,
  'room-suitabilities': getDeletedRoomSuitabilities,
  images: getDeletedImages,
  users: getDeletedUsers,
  roles: getDeletedRoles,
  permissions: getDeletedPermissions,
};

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function RestorePage() {
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('products');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchDeletedItems();
  }, [selectedType]);

  const fetchDeletedItems = useCallback(async () => {
    setLoading(true);
    try {
      const fetcher = FETCHERS[selectedType];
      if (!fetcher) throw new Error('Unknown entity type');

      const res = await fetcher();
      setDeletedItems(parseData(res));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load deleted items');
      setDeletedItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const handleRestore = useCallback(async (item) => {
    if (!window.confirm(`Restore this item?`)) return;

    setRestoring(true);
    try {
      await restoreItem(selectedType, item.id);
      setDeletedItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess('Restored successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to restore item');
    } finally {
      setRestoring(false);
    }
  }, [selectedType]);

  const COLUMN_CONFIG = {
    products: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'productName', label: 'PRODUCT NAME' },
      { key: 'price', label: 'PRICE' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    categories: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'categoryName', label: 'CATEGORY NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    collections: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'collectionName', label: 'COLLECTION NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    materials: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'MATERIAL NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    'fabric-types': [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'FABRIC TYPE NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    'room-suitabilities': [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'ROOM SUITABILITY NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    images: [
      { key: 'id', label: 'ID', width: '50px' },
      {
        key: 'imageUrl',
        label: 'IMAGE',
        render: (row) => (
          <img
            src={row.imageUrl}
            alt="Product"
            className="h-12 w-12 object-cover rounded"
            onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E'; }}
          />
        ),
      },
      { key: 'imageUrlText', label: 'URL', render: (row) => <span className="text-xs truncate max-w-xs">{row.imageUrl}</span> },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    users: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'email', label: 'EMAIL' },
      { key: 'fullName', label: 'FULL NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    roles: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'roleName', label: 'ROLE NAME' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
    permissions: [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'permissionKey', label: 'PERMISSION KEY' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') },
    ],
  };

  const getColumns = useCallback(() => {
    return COLUMN_CONFIG[selectedType] || [];
  }, [selectedType]);

  const actions = (item) => [
    {
      label: 'Restore',
      onClick: () => handleRestore(item),
      variant: 'success',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div>
          <h3 className="font-bold text-black uppercase">Deleted Items Recovery</h3>
          <p className="body-02 text-black">Restore permanently deleted data</p>
        </div>
      </div>
      <div className="mb-6 flex gap-2 flex-wrap">
        {ENTITY_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`px-4 py-2 rounded text-xs font-semibold transition ${
              selectedType === type.value
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )} 
      {success && (
        <div className="mb-6 p-4 bg-green-50  border-green-600 rounded">
          <p className="body-02 text-green-700">{success}</p>
        </div>
      )}

      {/* Table */}
      {deletedItems.length > 0 ? (
        <Table
          columns={getColumns()}
          data={deletedItems}
          onAction={actions}
          loading={loading}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <VscChromeRestore size={20}/>
          <p className="text-sm">
            {loading ? 'Loading...' : `No deleted ${selectedType} found`}
          </p>
        </div>
      )}
    </div>
  );
}
