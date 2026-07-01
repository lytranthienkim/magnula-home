'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, updateOrder, updateOrderStatus, getOrderById, createOrder, getAllPaymentMethods, getActivePaymentMethods } from '@/api/orders';
import { getAllProducts, getProductVariants } from '@/api/products';
import { getAllCountries, getAllStateByCountry } from '@/api/country';
import {
  OrdersHeader,
  OrdersTable,
  OrdersModal,
  OrdersAddForm,
} from '@/components/layout/orders';

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

export default function OrdersPage() {
  // State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Form state
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
  const [productSelect, setProductSelect] = useState('');
  const [variantSelect, setVariantSelect] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [productVariants, setProductVariants] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filtered = orders;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredOrders = getFilteredAndSortedOrders();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, paymentRes] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getActivePaymentMethods(),
        ]);
        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
        setPaymentMethods(paymentRes.data || []);

        try {
          const countriesData = await getAllCountries();
          const countriesArray = Array.isArray(countriesData) ? countriesData : (countriesData?.data ? countriesData.data : []);
          if (countriesArray.length > 0) {
            setCountries(countriesArray);
          } else {
            setCountries(FALLBACK_COUNTRIES);
          }
        } catch (err) {
          console.error('Failed to fetch countries:', err);
          setCountries(FALLBACK_COUNTRIES);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setCountries(FALLBACK_COUNTRIES);
      } finally {
        setLoading(false);
        setLoadingCountries(false);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const res = await getOrderById(order.id);
      setSelectedOrder(res.data);
      setEditData(res.data);
      setShowDetails(true);
      setEditMode(false);
    } catch (err) {
      setError('Failed to load order details');
    }
  };

  const handleEditClick = () => {
    setEditData(selectedOrder);
    setEditMode(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare update payload - only include changed fields
      const updatePayload = {};
      if (editData.status !== selectedOrder.status) updatePayload.status = editData.status;
      if (editData.customerName !== selectedOrder.customerName) updatePayload.customerName = editData.customerName;
      if (editData.customerEmail !== selectedOrder.customerEmail) updatePayload.customerEmail = editData.customerEmail;
      if (editData.customerPhone !== selectedOrder.customerPhone) updatePayload.customerPhone = editData.customerPhone;
      if (editData.countryRegion !== selectedOrder.countryRegion) updatePayload.countryRegion = editData.countryRegion;
      if (editData.stateProvince !== selectedOrder.stateProvince) updatePayload.stateProvince = editData.stateProvince;
      if (editData.shippingAddress !== selectedOrder.shippingAddress) updatePayload.shippingAddress = editData.shippingAddress;

      if (Object.keys(updatePayload).length === 0) {
        setError('No changes to save');
        setSaving(false);
        return;
      }

      await updateOrder(selectedOrder.id, updatePayload);

      setSelectedOrder(editData);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? editData : o))
      );
      setEditMode(false);
      setError('Order updated successfully');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save order information');
    } finally {
      setSaving(false);
    }
  };

  const handleCountryChange = async (countryName) => {
    const country = countries.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      countryRegion: countryName,
      stateProvince: ''
    }));
    setStates([]);
    setLoadingStates(false);

    if (countryName && country && country.iso2) {
      setLoadingStates(true);
      try {
        const statesData = await getAllStateByCountry(country.iso2);
        const statesArray = Array.isArray(statesData) ? statesData : (statesData?.data ? statesData.data : []);
        setStates(statesArray || []);
      } catch (err) {
        console.error('Failed to fetch states:', err);
        setError(`Failed to load states for ${countryName}`);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    }
  };

  const handleProductChange = async (productId) => {
    setProductSelect(productId);
    setVariantSelect('');
    setProductVariants([]);

    if (!productId) return;

    try {
      const res = await getProductVariants(productId);
      setProductVariants(res.data || []);
    } catch (err) {
      setError('Failed to load product variants');
    }
  };

  const handleAddProduct = () => {
    if (!productSelect || !variantSelect || productQuantity < 1) {
      setError('Please select product, variant, and quantity');
      return;
    }

    const variant = productVariants.find(v => v.id === parseInt(variantSelect));
    if (!variant) {
      setError('Invalid variant selected');
      return;
    }

    const availableStock = variant.stockQuantity || 0;
    if (availableStock <= 0) {
      setError(`This variant is out of stock`);
      return;
    }

    if (productQuantity > availableStock) {
      setError(`Not enough stock. Available: ${availableStock}, Requested: ${productQuantity}`);
      return;
    }

    setSelectedProducts([...selectedProducts, {
      productId: parseInt(productSelect),
      productVariantId: parseInt(variantSelect),
      quantity: parseInt(productQuantity),
      price: variant.price,
    }]);
    setProductSelect('');
    setVariantSelect('');
    setProductQuantity(1);
    setProductVariants([]);
    setError('');
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleCreateOrder = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress || !formData.paymentMethodId) {
      setError('Please fill all required fields');
      return;
    }

    if (selectedProducts.length === 0) {
      setError('Please add at least one product');
      return;
    }

    setFormLoading(true);
    try {
      const res = await createOrder({
        fullName: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        countryRegion: formData.countryRegion,
        stateProvince: formData.stateProvince,
        shippingAddress: formData.shippingAddress,
        paymentMethodId: parseInt(formData.paymentMethodId),
        items: selectedProducts,
      });

      setOrders((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        countryRegion: '',
        stateProvince: '',
        shippingAddress: '',
        paymentMethodId: '',
      });
      setSelectedProducts([]);
      setProductSelect('');
      setProductQuantity(1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      <OrdersHeader onAddClick={() => setShowAddForm(true)} />
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        onStatusFilterChange={setStatusFilter}
        onSortOrderChange={setSortOrder}
        onViewDetails={handleViewDetails}
      />

      <OrdersModal
        selectedOrder={selectedOrder}
        editMode={editMode}
        editData={editData}
        saving={saving}
        onClose={() => { setShowDetails(false); setSelectedOrder(null); setEditMode(false); setEditData({}); }}
        onEditClick={handleEditClick}
        onEditModeChange={setEditMode}
        onEditDataChange={setEditData}
        onStatusChange={handleStatusChange}
        onSave={handleSave}
      />

      {showAddForm && (
        <OrdersAddForm
          formData={formData}
          selectedProducts={selectedProducts}
          productSelect={productSelect}
          variantSelect={variantSelect}
          productQuantity={productQuantity}
          productVariants={productVariants}
          products={products}
          countries={countries}
          states={states}
          paymentMethods={paymentMethods}
          loading={formLoading}
          loadingCountries={loadingCountries}
          loadingStates={loadingStates}
          error={error}
          onFormDataChange={setFormData}
          onCountryChange={handleCountryChange}
          onProductChange={handleProductChange}
          onProductQuantityChange={setProductQuantity}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
          onCreateOrder={handleCreateOrder}
          onClose={() => {
            setShowAddForm(false);
            setFormData({
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              countryRegion: '',
              stateProvince: '',
              shippingAddress: '',
              paymentMethodId: '',
            });
            setError('');
          }}
          onProductSelectChange={setProductSelect}
          onVariantSelectChange={setVariantSelect}
        />
      )}
    </div>
  );
}
