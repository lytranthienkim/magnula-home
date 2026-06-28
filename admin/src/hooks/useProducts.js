import { useEffect, useState } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct, restoreProduct } from '@/api/products';

/**
 * Custom hook for managing products data and logic
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ productName: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('All');
  const [displayData, setDisplayData] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = products || [];
    if (statusFilter !== 'All') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [products, statusFilter, sortOrder]);

  // Handlers
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  const handleSave = async () => {
    setStatusUpdating(true);
    try {
      await updateProduct(selectedProduct.id, editData);
      const updated = { ...selectedProduct, ...editData };
      setSelectedProduct(updated);
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? updated : p)));
      setEditMode(false);
      setEditData({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setError('Product deleted successfully!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    displayData,
    loading,
    showDetails,
    selectedProduct,
    editMode,
    editData,
    showAddForm,
    formData,
    formLoading,
    statusUpdating,
    error,
    sortOrder,
    statusFilter,
    setEditMode,
    setEditData,
    setShowDetails,
    setFormData,
    setSortOrder,
    setStatusFilter,
    setShowAddForm,
    setError,
    setProducts,
    handleViewDetails,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
