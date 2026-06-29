'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  restoreProduct,
  createProduct,
  updateProductVariant,
  deleteProductImage,
  addProductImage,
  getAllCategories,
  getAllCollections
} from '@/api/products';
import {
  getAllMaterials,
  getAllFabricTypes,
  getAllRoomSuitabilities
} from '@/api/productAttributes';
import {
  ProductsHeader,
  ProductsTable,
  ProductsModal,
  ProductsAddForm,
} from '@/components/layout/products';

export default function ProductsPage() {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayData, setDisplayData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    materialId: '',
    fabricTypeId: '',
    roomSuitabilityId: '',
    collectionId: '',
    variants: [{ overallSize: '', seatSize: '', color: '', price: '', stockQuantity: '' }],
    images: [{ imageUrl: '' }],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [fabricTypes, setFabricTypes] = useState([]);
  const [roomSuitabilities, setRoomSuitabilities] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data || []);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = products || [];
    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [products, sortOrder, statusFilter]);

  // Fetch reference data when modal opens
  useEffect(() => {
    if (showDetails || showAddForm) {
      const fetchReferenceData = async () => {
        try {
          const [catRes, colRes, matRes, fabRes, roomRes] = await Promise.all([
            getAllCategories(),
            getAllCollections(),
            getAllMaterials(),
            getAllFabricTypes(),
            getAllRoomSuitabilities(),
          ]);

          const extractData = (res) => {
            if (Array.isArray(res)) return res;
            if (res?.data && Array.isArray(res.data)) return res.data;
            if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
            return [];
          };

          setCategories(extractData(catRes));
          setCollections(extractData(colRes));
          setMaterials(extractData(matRes));
          setFabricTypes(extractData(fabRes));
          setRoomSuitabilities(extractData(roomRes));
        } catch (err) {
          console.error('Failed to load reference data:', err);
          setError('Failed to load reference data: ' + err.message);
        }
      };
      fetchReferenceData();
    }
  }, [showDetails, showAddForm]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      const updatePayload = { ...editData };
      const variantsToUpdate = editData.variants;
      let imagesToUpdate = editData.images;

      if (selectedProduct.categoryId) updatePayload.categoryId = selectedProduct.categoryId;
      if (selectedProduct.materialId) updatePayload.materialId = selectedProduct.materialId;
      if (selectedProduct.fabricTypeId) updatePayload.fabricTypeId = selectedProduct.fabricTypeId;
      if (selectedProduct.roomSuitabilityId) updatePayload.roomSuitabilityId = selectedProduct.roomSuitabilityId;
      if (selectedProduct.collectionId) updatePayload.collectionId = selectedProduct.collectionId;

      delete updatePayload.variants;
      delete updatePayload.images;
      delete updatePayload.newImageUrl;

      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === '' || updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });

      if (Object.keys(updatePayload).length > 0) {
        await updateProduct(selectedProduct.id, updatePayload);
      }

      if (variantsToUpdate) {
        for (let idx = 0; idx < variantsToUpdate.length; idx++) {
          const variant = variantsToUpdate[idx];
          const originalVariant = selectedProduct.variants[idx];
          const hasChanges =
            variant.overallSize !== originalVariant.overallSize ||
            variant.seatSize !== originalVariant.seatSize ||
            parseFloat(variant.price) !== parseFloat(originalVariant.price) ||
            parseInt(variant.stockQuantity) !== parseInt(originalVariant.stockQuantity);

          if (hasChanges && variant.id) {
            try {
              await updateProductVariant(variant.id, {
                overallSize: variant.overallSize,
                seatSize: variant.seatSize?.trim() || null,
                price: parseFloat(variant.price) || 0,
                stockQuantity: parseInt(variant.stockQuantity) || 0,
              });
            } catch (err) {
              console.error(`Failed to update variant ${variant.id}:`, err);
              throw err;
            }
          }
        }
      }

      if (imagesToUpdate) {
        const originalImageIds = selectedProduct.images.map(img => img.id);
        const updatedImageIds = imagesToUpdate.map(img => img.id);
        const deletedImages = selectedProduct.images.filter(img => !updatedImageIds.includes(img.id));

        if (deletedImages.length > 0) {
          for (const deletedImg of deletedImages) {
            if (deletedImg.id) {
              try {
                await deleteProductImage(deletedImg.id);
              } catch (err) {
                console.error(`Failed to delete image ${deletedImg.id}:`, err);
                throw err;
              }
            }
          }
        }

        const newImages = imagesToUpdate.filter(img => !originalImageIds.includes(img.id));

        if (newImages.length > 0) {
          const createdImages = [];
          for (const newImg of newImages) {
            if (newImg.imageUrl) {
              try {
                const createResult = await addProductImage(selectedProduct.id, {
                  imageUrl: newImg.imageUrl,
                  isMain: newImg.isMain || false,
                });
                createdImages.push(createResult.data);
              } catch (err) {
                console.error(`Failed to create image:`, err);
                throw err;
              }
            }
          }

          if (createdImages.length > 0) {
            const existingImages = imagesToUpdate.filter(img => originalImageIds.includes(img.id));
            imagesToUpdate = [...existingImages, ...createdImages];
          }
        }
      }

      const updatedProduct = {
        ...selectedProduct,
        ...updatePayload,
        variants: variantsToUpdate !== undefined ? variantsToUpdate : selectedProduct.variants,
        images: imagesToUpdate !== undefined ? imagesToUpdate : selectedProduct.images
      };

      setSelectedProduct(updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
      setEditMode(false);
      setEditData({});
      setError('Product updated successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to save product';
      setError(errorMsg);
    } finally {
      setStatusUpdating(false);
    }
  };

  const validateAddForm = () => {
    const errors = {};
    if (!formData.productName?.trim()) errors.productName = 'Product name is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!formData.materialId) errors.materialId = 'Material is required';
    if (!formData.fabricTypeId) errors.fabricTypeId = 'Fabric type is required';
    if (!formData.roomSuitabilityId) errors.roomSuitabilityId = 'Room suitability is required';

    const validVariants = formData.variants.filter(v => v.overallSize && v.price && v.stockQuantity);
    if (validVariants.length === 0) errors.variants = 'At least one variant with size, price, and stock is required';

    const validImages = formData.images.filter(img => img.imageUrl?.trim());
    if (validImages.length === 0) errors.images = 'At least one image URL is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateAddForm()) return;

    setFormLoading(true);
    try {
      const productData = {
        productName: formData.productName.trim(),
        categoryId: parseInt(formData.categoryId),
        materialId: parseInt(formData.materialId),
        fabricTypeId: parseInt(formData.fabricTypeId),
        roomSuitabilityId: parseInt(formData.roomSuitabilityId),
        collectionId: formData.collectionId ? parseInt(formData.collectionId) : null,
        variants: formData.variants
          .filter(v => v.overallSize && v.price && v.stockQuantity)
          .map(v => ({
            overallSize: v.overallSize.trim(),
            seatSize: v.seatSize?.trim() || null,
            color: v.color?.trim() || null,
            price: parseFloat(v.price),
            stockQuantity: parseInt(v.stockQuantity),
          })),
        images: formData.images
          .filter(img => img.imageUrl?.trim())
          .map(img => ({
            imageUrl: img.imageUrl.trim(),
          })),
      };

      const res = await createProduct(productData);
      setProducts((prev) => [res.data.product, ...prev]);
      setShowAddForm(false);
      setFormData({
        productName: '',
        categoryId: '',
        materialId: '',
        fabricTypeId: '',
        roomSuitabilityId: '',
        collectionId: '',
        variants: [{ overallSize: '', seatSize: '', color: '', price: '', stockQuantity: '' }],
        images: [{ imageUrl: '' }],
      });
      setFormErrors({});
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${selectedProduct.productName}"?`)) return;

    setStatusUpdating(true);
    try {
      await deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setShowDetails(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRestore = async () => {
    setStatusUpdating(true);
    try {
      await restoreProduct(selectedProduct.id);
      const updatedProduct = { ...selectedProduct, deletedAt: null };
      setSelectedProduct(updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore product');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteFromTable = async (product) => {
    setLoading(true);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setError('Product deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductsHeader canCreate={true} onAddClick={() => setShowAddForm(true)} />

      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      <ProductsTable
        displayData={displayData}
        products={products}
        loading={loading}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
        canDelete={true}
        onSortChange={setSortOrder}
        onStatusFilterChange={setStatusFilter}
        onViewDetails={handleViewDetails}
        onDeleteFromTable={handleDeleteFromTable}
      />

      <ProductsModal
        isOpen={showDetails}
        product={selectedProduct}
        editMode={editMode}
        editData={editData}
        categories={categories}
        collections={collections}
        materials={materials}
        fabricTypes={fabricTypes}
        roomSuitabilities={roomSuitabilities}
        statusUpdating={statusUpdating}
        canUpdate={true}
        onClose={() => { setShowDetails(false); setSelectedProduct(null); setEditMode(false); setEditData({}); }}
        onEditClick={() => {
          setEditData({
            productName: selectedProduct.productName,
            status: selectedProduct.status,
            categoryId: selectedProduct.categoryId,
            collectionId: selectedProduct.collectionId,
            materialId: selectedProduct.materialId,
            fabricTypeId: selectedProduct.fabricTypeId,
            roomSuitabilityId: selectedProduct.roomSuitabilityId,
          });
          setEditMode(true);
        }}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onSave={handleSave}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onCategoryChange={async (value) => {
          const selectedCat = categories.find((cat) => cat.id === parseInt(value));
          if (selectedCat) {
            await updateProduct(selectedProduct.id, { categoryId: selectedCat.id });
            setSelectedProduct({ ...selectedProduct, categoryId: selectedCat.id, Category: selectedCat });
          }
        }}
        onCollectionChange={async (value) => {
          const selectedCol = collections.find((col) => col.id === parseInt(value));
          if (selectedCol) {
            await updateProduct(selectedProduct.id, { collectionId: selectedCol.id });
            setSelectedProduct({ ...selectedProduct, collectionId: selectedCol.id, Collection: selectedCol });
          }
        }}
        onMaterialChange={async (value) => {
          const selectedMat = materials.find((mat) => mat.id === parseInt(value));
          if (selectedMat) {
            await updateProduct(selectedProduct.id, { materialId: selectedMat.id });
            setSelectedProduct({ ...selectedProduct, materialId: selectedMat.id, Material: selectedMat });
          }
        }}
        onFabricTypeChange={async (value) => {
          const selectedFab = fabricTypes.find((fab) => fab.id === parseInt(value));
          if (selectedFab) {
            await updateProduct(selectedProduct.id, { fabricTypeId: selectedFab.id });
            setSelectedProduct({ ...selectedProduct, fabricTypeId: selectedFab.id, FabricType: selectedFab });
          }
        }}
        onRoomSuitabilityChange={async (value) => {
          const selectedRoom = roomSuitabilities.find((room) => room.id === parseInt(value));
          if (selectedRoom) {
            await updateProduct(selectedProduct.id, { roomSuitabilityId: selectedRoom.id });
            setSelectedProduct({ ...selectedProduct, roomSuitabilityId: selectedRoom.id, RoomSuitability: selectedRoom });
          }
        }}
        onVariantChange={(idx, field, value) => {
          const updatedVariants = editData.variants || selectedProduct.variants.map(v => ({ ...v }));
          updatedVariants[idx] = { ...updatedVariants[idx], [field]: value };
          setEditData({ ...editData, variants: updatedVariants });
        }}
        onAddImage={(imageUrl) => {
          if (imageUrl) {
            const currentImages = editData.images || selectedProduct.images || [];
            const isFirstImage = currentImages.length === 0;
            const newImages = [...currentImages];
            newImages.push({
              id: Date.now(),
              imageUrl: imageUrl,
              isMain: isFirstImage
            });
            setEditData({ ...editData, images: newImages, newImageUrl: '' });
          }
        }}
        onRemoveImage={(idx) => {
          const currentImages = editData.images || selectedProduct.images;
          if (currentImages.length === 1) {
            setError('Cannot remove the last image. A product must have at least one image.');
            setTimeout(() => setError(''), 3000);
            return;
          }
          const updatedImages = currentImages.filter((_, i) => i !== idx);
          setEditData({ ...editData, images: updatedImages });
        }}
        error={error}
        onErrorClear={() => setError('')}
      />

      <ProductsAddForm
        isOpen={showAddForm}
        formData={formData}
        formErrors={formErrors}
        formLoading={formLoading}
        categories={categories}
        materials={materials}
        fabricTypes={fabricTypes}
        roomSuitabilities={roomSuitabilities}
        collections={collections}
        error={error}
        onFormDataChange={setFormData}
        onAddVariant={() => setFormData({
          ...formData,
          variants: [...formData.variants, { overallSize: '', seatSize: '', color: '', price: '', stockQuantity: '' }]
        })}
        onRemoveVariant={(idx) => setFormData({
          ...formData,
          variants: formData.variants.filter((_, i) => i !== idx)
        })}
        onAddImage={() => setFormData({
          ...formData,
          images: [...formData.images, { imageUrl: '' }]
        })}
        onRemoveImage={(idx) => setFormData({
          ...formData,
          images: formData.images.filter((_, i) => i !== idx)
        })}
        onSubmit={handleAddProduct}
        onCancel={() => {
          setShowAddForm(false);
          setFormData({
            productName: '',
            categoryId: '',
            materialId: '',
            fabricTypeId: '',
            roomSuitabilityId: '',
            collectionId: '',
            variants: [{ overallSize: '', seatSize: '', color: '', price: '', stockQuantity: '' }],
            images: [{ imageUrl: '' }],
          });
          setFormErrors({});
          setError('');
        }}
      />
    </div>
  );
}
