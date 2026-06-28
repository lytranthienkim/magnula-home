'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '@/components/common/table/Table';
import { VscChromeRestore } from "react-icons/vsc";
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
  getDeletedOrders,
  restoreItem,
} from '@/api/restore';

export default function RestorePage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('products');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [restoring, setRestoring] = useState(false);

  // Entity types that support soft delete
  // Note: Users use isActive flag (not paranoid), Orders are immutable
  const entityTypes = [
    { value: 'products', label: 'Products' },
    { value: 'categories', label: 'Categories' },
    { value: 'collections', label: 'Collections' },
    { value: 'images', label: 'Images' },
    { value: 'materials', label: 'Materials' },
    { value: 'fabric-types', label: 'Fabric Types' },
    { value: 'room-suitabilities', label: 'Room Suitabilities' },
    { value: 'users', label: 'Users' },
    { value: 'roles', label: 'Roles' },
    { value: 'permissions', label: 'Permissions' },
  ];

  // Fetch deleted items when type changes
  useEffect(() => {
    fetchDeletedItems();
  }, [selectedType]);

  const fetchDeletedItems = async () => {
    setLoading(true);
    try {
      let res;

      // Call appropriate API function based on selected type
      switch (selectedType) {
        case 'products':
          res = await getDeletedProducts();
          break;
        case 'categories':
          res = await getDeletedCategories();
          break;
        case 'collections':
          res = await getDeletedCollections();
          break;
        case 'materials':
          res = await getDeletedMaterials();
          break;
        case 'fabric-types':
          res = await getDeletedFabricTypes();
          break;
        case 'room-suitabilities':
          res = await getDeletedRoomSuitabilities();
          break;
        case 'images':
          res = await getDeletedImages();
          break;
        case 'users':
          res = await getDeletedUsers();
          break;
        case 'roles':
          res = await getDeletedRoles();
          break;
        case 'permissions':
          res = await getDeletedPermissions();
          break;
        default:
          throw new Error('Unknown entity type');
      }

      setDeletedItems(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load deleted items');
      setDeletedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item) => {
    if (!window.confirm(`Restore this item?`)) return;

    setRestoring(true);
    try {
      await restoreItem(selectedType, item.id);

      // Remove from deleted list
      setDeletedItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess('Item restored successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to restore item');
    } finally {
      setRestoring(false);
    }
  };

  // Dynamic columns based on entity type
  const getColumns = () => {
    const baseColumns = [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'deletedAt', label: 'DELETED', render: (row) => new Date(row.deletedAt).toLocaleString('vi-VN') || null },
    ];

    switch (selectedType) {
      case 'products':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'productName', label: 'PRODUCT NAME' },
          { key: 'price', label: 'PRICE' },
          ...baseColumns.slice(1),
        ];
      case 'categories':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'categoryName', label: 'CATEGORY NAME' },
          ...baseColumns.slice(1),
        ];
      case 'collections':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'collectionName', label: 'COLLECTION NAME' },
          ...baseColumns.slice(1),
        ];
      case 'materials':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'name', label: 'MATERIAL NAME' },
          ...baseColumns.slice(1),
        ];
      case 'fabric-types':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'name', label: 'FABRIC TYPE NAME' },
          ...baseColumns.slice(1),
        ];
      case 'room-suitabilities':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'name', label: 'ROOM SUITABILITY NAME' },
          ...baseColumns.slice(1),
        ];
      case 'images':
        return [
          ...baseColumns.slice(0, 1),
          {
            key: 'imageUrlPreview',
            label: 'IMAGE',
            render: (row) => (
              <img
                src={row.imageUrl}
                alt="Product"
                className="h-12 w-12 object-cover rounded"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E';
                }}
              />
            ),
          },
          { key: 'imageUrlText', label: 'URL', render: (row) => <span className="text-xs truncate max-w-xs">{row.imageUrl}</span> },
          ...baseColumns.slice(1),
        ];
      case 'users':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'email', label: 'EMAIL' },
          { key: 'fullName', label: 'FULL NAME' },
        ];
      case 'roles':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'roleName', label: 'ROLE NAME' },
          ...baseColumns.slice(1),
        ];
      case 'permissions':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'permissionKey', label: 'PERMISSION KEY' },
          ...baseColumns.slice(1),
        ];
      case 'orders':
        return [
          ...baseColumns.slice(0, 1),
          { key: 'orderCode', label: 'ORDER CODE' },
          { key: 'totalAmount', label: 'TOTAL AMOUNT' },
          ...baseColumns.slice(1),
        ];
      default:
        return baseColumns;
    }
  };

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

      {/* Type Selector */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {entityTypes.map((type) => (
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
