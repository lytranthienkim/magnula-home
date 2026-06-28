import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, createOrder, getAllPaymentMethods } from '@/api/orders';
import { getAllProducts } from '@/api/products';
import { getAllCountries, getAllStateByCountry } from '@/api/country';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];

const FALLBACK_COUNTRIES = [
  { iso2: 'US', name: 'United States' },
  { iso2: 'VN', name: 'Vietnam' },
  { iso2: 'GB', name: 'United Kingdom' },
  { iso2: 'CA', name: 'Canada' },
  { iso2: 'AU', name: 'Australia' },
  { iso2: 'JP', name: 'Japan' },
  { iso2: 'CN', name: 'China' },
  { iso2: 'IN', name: 'India' },
  { iso2: 'SG', name: 'Singapore' },
  { iso2: 'TH', name: 'Thailand' },
];

/**
 * Custom hook for managing orders data and logic
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    countryRegion: '',
    stateProvince: '',
    shippingAddress: '',
    paymentMethodId: '',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [displayData, setDisplayData] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, countriesRes, paymentRes] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getAllCountries(),
          getAllPaymentMethods(),
        ]);

        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
        setCountries(countriesRes.data?.length > 0 ? countriesRes.data : FALLBACK_COUNTRIES);
        setPaymentMethods(paymentRes.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setCountries(FALLBACK_COUNTRIES);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = orders || [];
    if (statusFilter !== 'All') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setDisplayData(filtered);
  }, [orders, statusFilter, sortOrder]);

  // Handlers
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setEditMode(false);
    setEditData({});
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, { status: newStatus });
      const updated = { ...selectedOrder, status: newStatus };
      setSelectedOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? updated : o))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  return {
    orders,
    displayData,
    products,
    loading,
    showDetails,
    selectedOrder,
    editMode,
    editData,
    showAddForm,
    formData,
    selectedProducts,
    countries,
    states,
    paymentMethods,
    formLoading,
    statusUpdating,
    error,
    statusFilter,
    sortOrder,
    ORDER_STATUSES,
    setEditMode,
    setEditData,
    setShowDetails,
    setFormData,
    setSelectedProducts,
    setStatusFilter,
    setSortOrder,
    setShowAddForm,
    handleViewDetails,
    handleCloseModal,
    handleStatusChange,
    setOrders,
    setError,
  };
};
