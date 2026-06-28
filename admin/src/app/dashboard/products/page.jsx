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
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { checkPermission, isAdmin as checkIsAdmin, PERMISSIONS } from '@/helper/permissions';

export default function ProductsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const isAdmin = checkIsAdmin(currentUser);
  const canRead = checkPermission(currentUser, PERMISSIONS.PRODUCTS.READ);
  const canCreate = checkPermission(currentUser, PERMISSIONS.PRODUCTS.CREATE);
  const canUpdate = checkPermission(currentUser, PERMISSIONS.PRODUCTS.UPDATE);
  const canDelete = checkPermission(currentUser, PERMISSIONS.PRODUCTS.DELETE);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    materialId: '',
    fabricTypeId: '',
    roomSuitabilityId: '',
    collectionId: '',
    variants: [
      {
        overallSize: '',
        seatSize: '',
        color: '',
        price: '',
        stockQuantity: '',
      }
    ],
    images: [{ imageUrl: '' }],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayData, setDisplayData] = useState([]);
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
  const [collectionImageIndex, setCollectionImageIndex] = useState(0);

  // Reference data for selectors
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [fabricTypes, setFabricTypes] = useState([]);
  const [roomSuitabilities, setRoomSuitabilities] = useState([]);

  // Selector modals
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [showFabricTypeSelector, setShowFabricTypeSelector] = useState(false);
  const [showRoomSuitabilitySelector, setShowRoomSuitabilitySelector] = useState(false);

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

  useEffect(() => {
    let filtered = products || [];

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Sort by date
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setDisplayData(filtered);
  }, [products, sortOrder, statusFilter]);

  // Fetch reference data when details modal or add form opens
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

          // Handle both {data: []} and direct array formats
          const extractData = (res) => {
            console.log('Response format:', res);
            if (Array.isArray(res)) {
              console.log('Direct array:', res.length);
              return res;
            }
            if (res?.data && Array.isArray(res.data)) {
              console.log('res.data is array:', res.data.length);
              return res.data;
            }
            if (res?.data?.data && Array.isArray(res.data.data)) {
              console.log('res.data.data is array:', res.data.data.length);
              return res.data.data;
            }
            console.log('No data found, returning empty');
            return [];
          };

          const categoriesData = extractData(catRes);
          const collectionsData = extractData(colRes);
          const materialsData = extractData(matRes);
          const fabricTypesData = extractData(fabRes);
          const roomSuitabilitiesData = extractData(roomRes);

          setCategories(categoriesData);
          setCollections(collectionsData);
          setMaterials(materialsData);
          setFabricTypes(fabricTypesData);
          setRoomSuitabilities(roomSuitabilitiesData);

          console.log('Reference data loaded:', {
            categories: categoriesData.length,
            collections: collectionsData.length,
            materials: materialsData.length,
            fabricTypes: fabricTypesData.length,
            roomSuitabilities: roomSuitabilitiesData.length,
          });
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
      // Prepare update payload - include all fields that can be changed
      const updatePayload = { ...editData };
      const variantsToUpdate = editData.variants;
      let imagesToUpdate = editData.images;

      // Add category, material, fabric type, room suitability, collection if changed
      if (selectedProduct.categoryId) {
        updatePayload.categoryId = selectedProduct.categoryId;
      }
      if (selectedProduct.materialId) {
        updatePayload.materialId = selectedProduct.materialId;
      }
      if (selectedProduct.fabricTypeId) {
        updatePayload.fabricTypeId = selectedProduct.fabricTypeId;
      }
      if (selectedProduct.roomSuitabilityId) {
        updatePayload.roomSuitabilityId = selectedProduct.roomSuitabilityId;
      }
      if (selectedProduct.collectionId) {
        updatePayload.collectionId = selectedProduct.collectionId;
      }

      // Remove variants and images from main update payload
      delete updatePayload.variants;
      delete updatePayload.images;
      delete updatePayload.newImageUrl;

      // Clean up empty values
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === '' || updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });

      // Update product only if there are changes
      if (Object.keys(updatePayload).length > 0) {
        console.log('Updating product ID:', selectedProduct.id);
        console.log('Payload keys:', Object.keys(updatePayload));
        console.log('Full payload:', JSON.stringify(updatePayload, null, 2));
        await updateProduct(selectedProduct.id, updatePayload);
      }

      // Update variants if they were changed
      if (variantsToUpdate) {
        for (let idx = 0; idx < variantsToUpdate.length; idx++) {
          const variant = variantsToUpdate[idx];
          const originalVariant = selectedProduct.variants[idx];

          // Check if variant has changes
          const hasChanges =
            variant.overallSize !== originalVariant.overallSize ||
            variant.seatSize !== originalVariant.seatSize ||
            parseFloat(variant.price) !== parseFloat(originalVariant.price) ||
            parseInt(variant.stockQuantity) !== parseInt(originalVariant.stockQuantity);

          if (hasChanges && variant.id) {
            console.log(`Updating variant ${variant.id}:`, {
              overallSize: variant.overallSize,
              seatSize: variant.seatSize,
              price: parseFloat(variant.price),
              stockQuantity: parseInt(variant.stockQuantity),
            });
            try {
              await updateProductVariant(variant.id, {
                overallSize: variant.overallSize,
                seatSize: variant.seatSize,
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

      // Handle image modifications - only if images were actually modified
      if (imagesToUpdate) {
        console.log('Original images:', selectedProduct.images);
        console.log('Updated images:', imagesToUpdate);

        const originalImageIds = selectedProduct.images.map(img => img.id);
        const updatedImageIds = imagesToUpdate.map(img => img.id);

        console.log('Original image IDs:', originalImageIds);
        console.log('Updated image IDs:', updatedImageIds);

        // Find deleted images (those in original but not in updated)
        const deletedImages = selectedProduct.images.filter(img => !updatedImageIds.includes(img.id));
        console.log('Deleted images:', deletedImages);

        // Delete images that were removed
        if (deletedImages.length > 0) {
          for (const deletedImg of deletedImages) {
            if (deletedImg.id) {
              console.log(`Deleting image ${deletedImg.id}`);
              try {
                const deleteResult = await deleteProductImage(deletedImg.id);
                console.log(`Image ${deletedImg.id} deleted successfully:`, deleteResult);
              } catch (err) {
                console.error(`Failed to delete image ${deletedImg.id}:`, err);
                throw err;
              }
            }
          }
        } else {
          console.log('No images to delete');
        }

        // Find new images (those in updated but not in original)
        const newImages = imagesToUpdate.filter(img => !originalImageIds.includes(img.id));
        console.log('New images to create:', newImages);

        // Create new images in database
        if (newImages.length > 0) {
          const createdImages = [];
          for (const newImg of newImages) {
            if (newImg.imageUrl) {
              console.log(`Creating new image: ${newImg.imageUrl}`);
              try {
                const createResult = await addProductImage(selectedProduct.id, {
                  imageUrl: newImg.imageUrl,
                  isMain: newImg.isMain || false,
                });
                console.log(`Image created successfully:`, createResult);
                createdImages.push(createResult.data);
              } catch (err) {
                console.error(`Failed to create image:`, err);
                throw err;
              }
            }
          }

          // Replace temp IDs with real IDs from database
          if (createdImages.length > 0) {
            const existingImages = imagesToUpdate.filter(img => originalImageIds.includes(img.id));
            imagesToUpdate = [...existingImages, ...createdImages];
            console.log('Updated images with created ones:', imagesToUpdate);
          }
        } else {
          console.log('No new images to create');
        }
      } else {
        console.log('imagesToUpdate is undefined or falsy, skipping image modifications');
      }

      // Update product with merged data
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
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to save product';
      console.error('Final error message:', errorMsg);
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

    // Validate at least one variant
    const validVariants = formData.variants.filter(v => v.overallSize && v.price && v.stockQuantity);
    if (validVariants.length === 0) errors.variants = 'At least one variant with size, price, and stock is required';

    // Validate at least one image
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

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    {
      key: 'productName',
      label: 'PRODUCT NAME',
      render: (row) => row.productName || 'N/A',
    },
    {
      key: 'Category',
      label: 'CATEGORY',
      render: (row) => row.Category?.categoryName || 'N/A',
    },
    {
      key: 'Collection',
      label: 'COLLECTION',
      render: (row) => row.Collection?.collectionName || 'N/A',
    },
    {
      key: 'variants',
      label: 'PRICE',
      render: (row) => {
        const variant = row.variants?.[0];
        return variant ? `$${parseFloat(variant.price).toFixed(2)}` : 'N/A';
      },
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => row.status || 'N/A',
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN'),
    },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString('vi-VN'),
    },
  ];

  const actions = (product) => {
    const actionList = [
      {
        label: 'View',
        onClick: () => handleViewDetails(product),
        variant: 'success',
      },
    ];

    if (canDelete) {
      actionList.push({
        label: 'Delete',
        onClick: () => {
          if (window.confirm(`Delete "${product.productName}"?`)) {
            handleDeleteFromTable(product);
          }
        },
        variant: 'danger',
      });
    }

    return actionList;
  };

  if (!canRead) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500">Access denied. You don't have permission to view products.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black uppercase">Products Management</h3>
          <p className="body-02">Manage all products in your store</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Product
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50  border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-500">
          {displayData.length} of {products.length}
        </span>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-gray-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="All">All</option>
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

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
      </div>

      {/* Table */}
      <Table columns={columns} data={displayData} onAction={actions} loading={loading} />

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="font-bold text-black">Item</h3>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              {/* Basic Information */}
              <div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <p className="text-xs text-black font-semibold uppercase w-40">Product Name:</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.productName !== undefined ? editData.productName : selectedProduct.productName || ''}
                        onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none rounded"
                      />
                    ) : (
                      <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedProduct.productName || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex items-start">
                    <p className="text-xs text-black font-semibold uppercase w-40">Status:</p>
                    {editMode ? (
                      <select
                        value={editData.status !== undefined ? editData.status : selectedProduct.status || ''}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                      >
                        <option value="">Select Status</option>
                        <option value="in stock">In Stock</option>
                        <option value="out of stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    ) : (
                      <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{selectedProduct.status || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Category:</p>
                <select
                  value={selectedProduct.Category?.id || ''}
                  onChange={async (e) => {
                    const selectedCat = categories.find((cat) => cat.id === parseInt(e.target.value));
                    if (selectedCat) {
                      await updateProduct(selectedProduct.id, { categoryId: selectedCat.id });
                      setSelectedProduct({ ...selectedProduct, categoryId: selectedCat.id, Category: selectedCat });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat?.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Collection */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Collection:</p>
                <select
                  value={selectedProduct.Collection?.id || ''}
                  onChange={async (e) => {
                    const selectedCol = collections.find((col) => col.id === parseInt(e.target.value));
                    if (selectedCol) {
                      await updateProduct(selectedProduct.id, { collectionId: selectedCol.id });
                      setSelectedProduct({ ...selectedProduct, collectionId: selectedCol.id, Collection: selectedCol });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Collection</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.collectionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Material:</p>
                <select
                  value={selectedProduct.Material?.id || ''}
                  onChange={async (e) => {
                    const selectedMat = materials.find((mat) => mat.id === parseInt(e.target.value));
                    if (selectedMat) {
                      await updateProduct(selectedProduct.id, { materialId: selectedMat.id });
                      setSelectedProduct({ ...selectedProduct, materialId: selectedMat.id, Material: selectedMat });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Material</option>
                  {materials.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fabric Type */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Fabric:</p>
                <select
                  value={selectedProduct.FabricType?.id || ''}
                  onChange={async (e) => {
                    const selectedFab = fabricTypes.find((fab) => fab.id === parseInt(e.target.value));
                    if (selectedFab) {
                      await updateProduct(selectedProduct.id, { fabricTypeId: selectedFab.id });
                      setSelectedProduct({ ...selectedProduct, fabricTypeId: selectedFab.id, FabricType: selectedFab });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Fabric Type</option>
                  {fabricTypes.map((fab) => (
                    <option key={fab.id} value={fab.id}>
                      {fab.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Suitability */}
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Room Size:</p>
                <select
                  value={selectedProduct.RoomSuitability?.id || ''}
                  onChange={async (e) => {
                    const selectedRoom = roomSuitabilities.find((room) => room.id === parseInt(e.target.value));
                    if (selectedRoom) {
                      await updateProduct(selectedProduct.id, { roomSuitabilityId: selectedRoom.id });
                      setSelectedProduct({ ...selectedProduct, roomSuitabilityId: selectedRoom.id, RoomSuitability: selectedRoom });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Room Size</option>
                  {roomSuitabilities.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <p className="text-sm text-black font-semibold uppercase mb-4">Variants & Pricing</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Overall Size</th>
                          <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Seat Size</th>
                          <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Price</th>
                          <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Stock Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProduct.variants.map((variant, idx) => (
                          <tr key={variant.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={editData.variants?.[idx]?.overallSize ?? variant.overallSize ?? ''}
                                  onChange={(e) => {
                                    const updatedVariants = editData.variants || selectedProduct.variants.map(v => ({ ...v }));
                                    updatedVariants[idx] = { ...updatedVariants[idx], overallSize: e.target.value };
                                    setEditData({ ...editData, variants: updatedVariants });
                                  }}
                                  className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                                />
                              ) : (
                                variant.overallSize || 'N/A'
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={editData.variants?.[idx]?.seatSize ?? variant.seatSize ?? ''}
                                  onChange={(e) => {
                                    const updatedVariants = editData.variants || selectedProduct.variants.map(v => ({ ...v }));
                                    updatedVariants[idx] = { ...updatedVariants[idx], seatSize: e.target.value };
                                    setEditData({ ...editData, variants: updatedVariants });
                                  }}
                                  className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                                />
                              ) : (
                                variant.seatSize || 'N/A'
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 font-semibold">
                              {editMode ? (
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-600 mr-1">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={editData.variants?.[idx]?.price !== undefined ? editData.variants[idx].price : (variant.price ?? '')}
                                    onChange={(e) => {
                                      const updatedVariants = editData.variants || selectedProduct.variants.map(v => ({ ...v }));
                                      const newValue = e.target.value === '' ? '' : parseFloat(e.target.value) || 0;
                                      updatedVariants[idx] = { ...updatedVariants[idx], price: newValue };
                                      setEditData({ ...editData, variants: updatedVariants });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                                  />
                                </div>
                              ) : (
                                variant.price ? `$${parseFloat(variant.price).toFixed(2)}` : '$0.00'
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              {editMode ? (
                                <input
                                  type="number"
                                  value={editData.variants?.[idx]?.stockQuantity ?? variant.stockQuantity ?? ''}
                                  onChange={(e) => {
                                    const updatedVariants = editData.variants || selectedProduct.variants.map(v => ({ ...v }));
                                    const newValue = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                                    updatedVariants[idx] = { ...updatedVariants[idx], stockQuantity: newValue };
                                    setEditData({ ...editData, variants: updatedVariants });
                                  }}
                                  className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                                />
                              ) : (
                                variant.stockQuantity
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Product Images */}
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-4">Product Images</p>
                {editMode && (
                  <div className="mb-4">
                    <label className="text-xs text-black font-semibold uppercase block mb-2">Add Image URL:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={editData.newImageUrl || ''}
                        onChange={(e) => setEditData({ ...editData, newImageUrl: e.target.value })}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (editData.newImageUrl) {
                            const currentImages = editData.images || selectedProduct.images || [];
                            // First image is automatically isMain
                            const isFirstImage = currentImages.length === 0;
                            const newImages = [...currentImages];
                            newImages.push({
                              id: Date.now(),
                              imageUrl: editData.newImageUrl,
                              isMain: isFirstImage
                            });
                            setEditData({ ...editData, images: newImages, newImageUrl: '' });
                          }
                        }}
                        className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                {(editData.images || selectedProduct.images) && (editData.images || selectedProduct.images).length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {(editData.images || selectedProduct.images).map((img, idx) => (
                      <div key={img.id} className="flex flex-col">
                        <div className="relative bg-gray-100 rounded overflow-hidden aspect-square mb-2">
                          <img src={img.imageUrl} alt="Product" className="w-full h-full object-cover" />
                          {img.isMain && (
                            <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">MAIN</div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 break-all line-clamp-2 mb-2">{img.imageUrl}</p>
                        {editMode && (
                          <button
                            onClick={() => {
                              const currentImages = editData.images || selectedProduct.images;
                              // Prevent removing the last image
                              if (currentImages.length === 1) {
                                setError('Cannot remove the last image. A product must have at least one image.');
                                setTimeout(() => setError(''), 3000);
                                return;
                              }
                              console.log(`Remove button clicked for image index ${idx}:`, img);
                              console.log('Current images before filter:', currentImages);
                              const updatedImages = currentImages.filter((_, i) => i !== idx);
                              console.log('Images after filter:', updatedImages);
                              setEditData({ ...editData, images: updatedImages });
                              console.log('editData updated with new images');
                            }}
                            disabled={((editData.images || selectedProduct.images) || []).length === 1}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
              >
                Close
              </button>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditData({});
                      }}
                      disabled={statusUpdating}
                      className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={statusUpdating}
                      className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      {statusUpdating ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <>
                    {canUpdate && (
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setEditData({
                            productName: selectedProduct.productName,
                            status: selectedProduct.status,
                          });
                        }}
                        className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selector Modal */}
      {showCategorySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Select Category</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={async () => {
                    await updateProduct(selectedProduct.id, { categoryId: cat.id });
                    setSelectedProduct({ ...selectedProduct, categoryId: cat.id, Category: cat });
                    setShowCategorySelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded border transition ${
                    selectedProduct.Category?.id === cat.id
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-black border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCategorySelector(false)} className="w-full mt-6 px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collection Selector Modal */}
      {showCollectionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Select Collection</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={async () => {
                    await updateProduct(selectedProduct.id, { collectionId: col.id });
                    setSelectedProduct({ ...selectedProduct, collectionId: col.id, Collection: col });
                    setShowCollectionSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded border transition flex items-center gap-2 ${
                    selectedProduct.Collection?.id === col.id
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-black border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: col.colorHex }}></div>
                  <span>{col.collectionName}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowCollectionSelector(false)} className="w-full mt-6 px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Material Selector Modal */}
      {showMaterialSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Select Material</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={async () => {
                    await updateProduct(selectedProduct.id, { materialId: mat.id });
                    setSelectedProduct({ ...selectedProduct, materialId: mat.id, Material: mat });
                    setShowMaterialSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded border transition text-xs ${
                    selectedProduct.Material?.id === mat.id
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-black border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {mat.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMaterialSelector(false)} className="w-full mt-6 px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fabric Type Selector Modal */}
      {showFabricTypeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Select Fabric Type</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {fabricTypes.map((fab) => (
                <button
                  key={fab.id}
                  onClick={async () => {
                    await updateProduct(selectedProduct.id, { fabricTypeId: fab.id });
                    setSelectedProduct({ ...selectedProduct, fabricTypeId: fab.id, FabricType: fab });
                    setShowFabricTypeSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded border transition ${
                    selectedProduct.FabricType?.id === fab.id
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-black border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {fab.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShowFabricTypeSelector(false)} className="w-full mt-6 px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Room Suitability Selector Modal */}
      {showRoomSuitabilitySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-black mb-6">Select Room Suitability</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {roomSuitabilities.map((room) => (
                <button
                  key={room.id}
                  onClick={async () => {
                    await updateProduct(selectedProduct.id, { roomSuitabilityId: room.id });
                    setSelectedProduct({ ...selectedProduct, roomSuitabilityId: room.id, RoomSuitability: room });
                    setShowRoomSuitabilitySelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded border transition text-xs ${
                    selectedProduct.RoomSuitability?.id === room.id
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-black border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShowRoomSuitabilitySelector(false)} className="w-full mt-6 px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-6">Add New Product</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {/* Product Name */}
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.productName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.productName && <span className="text-xs text-red-500">{formErrors.productName}</span>}
              </div>

              {/* Attributes Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                  {formErrors.categoryId && <span className="text-xs text-red-500">{formErrors.categoryId}</span>}
                </div>

                {/* Material */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Material *</label>
                  <select
                    value={formData.materialId}
                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.materialId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Material</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  {formErrors.materialId && <span className="text-xs text-red-500">{formErrors.materialId}</span>}
                </div>
              </div>

              {/* Attributes Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fabric Type */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Fabric Type *</label>
                  <select
                    value={formData.fabricTypeId}
                    onChange={(e) => setFormData({ ...formData, fabricTypeId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.fabricTypeId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Fabric Type</option>
                    {fabricTypes.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  {formErrors.fabricTypeId && <span className="text-xs text-red-500">{formErrors.fabricTypeId}</span>}
                </div>

                {/* Room Suitability */}
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Room Suitability *</label>
                  <select
                    value={formData.roomSuitabilityId}
                    onChange={(e) => setFormData({ ...formData, roomSuitabilityId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.roomSuitabilityId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Room Suitability</option>
                    {roomSuitabilities.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  {formErrors.roomSuitabilityId && <span className="text-xs text-red-500">{formErrors.roomSuitabilityId}</span>}
                </div>
              </div>

              {/* Collection (Optional) */}
              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Collection (Optional)</label>
                <select
                  value={formData.collectionId}
                  onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                >
                  <option value="">Select Collection</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>{c.collectionName}</option>
                  ))}
                </select>
              </div>

              {/* Variants Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-black uppercase block">Variants *</label>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      variants: [...formData.variants, { overallSize: '', seatSize: '', color: '', price: '', stockQuantity: '' }]
                    })}
                    className="text-xs text-black hover:text-gray-600 font-semibold"
                  >
                    + Add Variant
                  </button>
                </div>
                {formErrors.variants && <span className="text-xs text-red-500 block mb-2">{formErrors.variants}</span>}
                <div className="space-y-3 overflow-x-auto">
                  {formData.variants.map((variant, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Size *</label>
                          <input
                            type="text"
                            placeholder="e.g., W30 x D28 x H17"
                            value={variant.overallSize}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[idx].overallSize = e.target.value;
                              setFormData({ ...formData, variants: newVariants });
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Seat Size</label>
                          <input
                            type="text"
                            placeholder="e.g., 60cm"
                            value={variant.seatSize}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[idx].seatSize = e.target.value;
                              setFormData({ ...formData, variants: newVariants });
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Color</label>
                          <input
                            type="text"
                            placeholder="e.g., Gray"
                            value={variant.color}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[idx].color = e.target.value;
                              setFormData({ ...formData, variants: newVariants });
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Price *</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[idx].price = e.target.value;
                              setFormData({ ...formData, variants: newVariants });
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 block mb-1">Stock *</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={variant.stockQuantity}
                              onChange={(e) => {
                                const newVariants = [...formData.variants];
                                newVariants[idx].stockQuantity = e.target.value;
                                setFormData({ ...formData, variants: newVariants });
                              }}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              variants: formData.variants.filter((_, i) => i !== idx)
                            })}
                            className="text-red-500 hover:text-red-700 font-bold text-lg self-end pb-1"
                            title="Remove variant"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-black uppercase block">Images *</label>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      images: [...formData.images, { imageUrl: '' }]
                    })}
                    className="text-xs text-black hover:text-gray-600 font-semibold"
                  >
                    + Add Image
                  </button>
                </div>
                {formErrors.images && <span className="text-xs text-red-500 block mb-2">{formErrors.images}</span>}
                <div className="space-y-2">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={image.imageUrl}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[idx].imageUrl = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          images: formData.images.filter((_, i) => i !== idx)
                        })}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
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
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
