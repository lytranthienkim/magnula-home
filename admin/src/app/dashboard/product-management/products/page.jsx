'use client';

import { useEffect, useState, useCallback } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useItemModal } from '@/hooks/useItemModal';
import { useItemForm } from '@/hooks/useItemForm';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllProducts, createProduct, updateProduct, deleteProduct, restoreProduct } from '@/api/products';
import { getAllCategories } from '@/api/category';
import { getAllCollections } from '@/api/collection';
import { getAllMaterials } from '@/api/materials';
import { getAllFabricTypes } from '@/api/fabricType';
import { getAllRoomSuitabilities } from '@/api/roomSuitabilities';
import { ProductsHeader, ProductsTable, ProductsModal, ProductsAddForm } from '@/components/layout/products';
import { Pagination } from '@/components/common/Pagination';

const initialFormData = {
  productName: '',
  description: '',
  categoryId: '',
  collectionId: '',
  materialId: '',
  fabricTypeId: '',
  roomSuitabilityId: '',
  images: [{ imageUrl: '' }],
  variants: [{
    overallSize: '',
    seatSize: '',
    color: '',
    price: 0,
    stockQuantity: 0,
  }],
  isActive: true,
};

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [fabricTypes, setFabricTypes] = useState([]);
  const [roomSuitabilities, setRoomSuitabilities] = useState([]);

  // useListManagement
  const { setItems: setProducts, loading, error, setError, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllProducts();
      const data = parseData(res);
      return { data: data.filter(p => !p.deletedAt) };
    },
    sortField: 'createdAt',
  });

  // useItemModal
  const {
    selected: selectedProduct,
    editMode,
    setEditMode,
    editData,
    setEditData,
    updating: statusUpdating,
    error: modalError,
    handleSave,
    handleViewDetails,
    handleCloseModal,
    handleRestore,
  } = useItemModal({
    updateFn: updateProduct,
    deleteFn: deleteProduct,
    restoreFn: restoreProduct,
    onSuccess: (_, updated) => {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    },
    onDelete: (deleted) => {
      setProducts((prev) => prev.filter((p) => p.id !== deleted.id));
    },
  });

  // useItemForm
  const {
    showAddForm,
    setShowAddForm,
    formData,
    setFormData,
    formLoading,
    formError,
    setFormError,
    handleSubmit,
    resetForm,
  } = useItemForm({
    initialValues: initialFormData,
    createFn: createProduct,
    onSuccess: (res) => {
      const newProduct = Array.isArray(res) ? res[0] : res?.data || res;
      setProducts((prev) => [newProduct, ...prev]);
      setShowAddForm(false);
    },
  });

  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  // Fetch product data
  useEffect(() => {
    if (selectedProduct || showAddForm) {
      const fetchReferenceData = async () => {
        try {
          const [catRes, colRes, matRes, fabRes, roomRes] = await Promise.all([
            getAllCategories(),
            getAllCollections(),
            getAllMaterials(),
            getAllFabricTypes(),
            getAllRoomSuitabilities(),
          ]);

          setCategories(parseData(catRes));
          setCollections(parseData(colRes));
          setMaterials(parseData(matRes));
          setFabricTypes(parseData(fabRes));
          setRoomSuitabilities(parseData(roomRes));
        } catch (err) {
          console.error('Failed to load reference data:', err);
          setError('Failed to load reference data');
        }
      };
      fetchReferenceData();
    }
  }, [selectedProduct, showAddForm, setError]);

  // Handlers
  const handleFormSubmit = useCallback(() => {
    if (!formData.productName?.trim()) {
      setFormError('Product name is required');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Category is required');
      return;
    }
    if (!formData.materialId) {
      setFormError('Material is required');
      return;
    }
    if (!formData.fabricTypeId) {
      setFormError('Fabric type is required');
      return;
    }
    const convertedData = {
      ...formData,
      categoryId: Number(formData.categoryId),
      materialId: Number(formData.materialId),
      fabricTypeId: Number(formData.fabricTypeId),
      roomSuitabilityId: Number(formData.roomSuitabilityId),
      collectionId: formData.collectionId ? Number(formData.collectionId) : null,
    };
    setFormData(convertedData);
    handleSubmit();
  }, [formData.productName, formData.categoryId, formData.materialId, formData.fabricTypeId, setFormError, handleSubmit, setFormData]);

  // Delete produtc
  const handleDeleteProduct = useCallback(async (product) => {
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setError('Product deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  }, [setProducts, setError]);

  // Restore product
  const handleRestoreProduct = useCallback(async (product) => {
    try {
      const restored = await restoreProduct(product.id);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? restored : p)));
      setError('Product restored successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore product');
    }
  }, [setProducts, setError]);

  // Variant and image handlers
  const handleAddVariant = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), {
        overallSize: '',
        seatSize: '',
        color: '',
        price: 0,
        stockQuantity: 0,
      }],
    }));
  }, [setFormData]);

  // Remove variant
  const handleRemoveVariant = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }, [setFormData]);

  // Add image
  const handleAddImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { imageUrl: '' }],
    }));
  }, [setFormData]);

  const handleRemoveImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, [setFormData]);

  return (
    <div>
      {(error || modalError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error || modalError}</p>
        </div>
      )}

      <ProductsHeader canCreate onAddClick={() => setShowAddForm(true)} />
      <ProductsTable
        displayData={paginatedData}
        loading={loading}
        canDelete={true}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteProduct}
        onRestore={handleRestoreProduct}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <ProductsModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        editMode={editMode}
        editData={editData}
        statusUpdating={statusUpdating}
        categories={categories}
        collections={collections}
        materials={materials}
        fabricTypes={fabricTypes}
        roomSuitabilities={roomSuitabilities}
        canUpdate
        onClose={handleCloseModal}
        onEditModeChange={(mode) => {
          setEditMode(mode);
          if (mode) setEditData(selectedProduct || {});
        }}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onDelete={() => handleDeleteProduct(selectedProduct)}
        onRestore={handleRestore}
      />

      <ProductsAddForm
        isOpen={showAddForm}
        formData={formData}
        formErrors={{}}
        formError={formError}
        formLoading={formLoading}
        categories={categories || []}
        collections={collections || []}
        materials={materials || []}
        fabricTypes={fabricTypes || []}
        roomSuitabilities={roomSuitabilities || []}
        onFormDataChange={setFormData}
        onAddVariant={handleAddVariant}
        onRemoveVariant={handleRemoveVariant}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onCancel={() => {
          resetForm();
          setShowAddForm(false);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
