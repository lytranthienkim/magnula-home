'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getOrderById, createOrder, getAllPaymentMethods, getActivePaymentMethods } from '@/api/orders';
import { getAllProducts, getProductVariants } from '@/api/products';
import { getAllCountries, getAllStateByCountry } from '@/api/country';
import { Table } from '@/components/common/table/Table';
import { HiOutlinePlus } from 'react-icons/hi2';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];

export default function OrdersPage() {
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
  const [productSelect, setProductSelect] = useState('');
  const [variantSelect, setVariantSelect] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [productVariants, setProductVariants] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  // Fallback countries list
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
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredOrders = getFilteredAndSortedOrders();

  // Fetch orders, products, countries, and payment methods
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

        // Fetch countries separately with fallback
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

  // Handle status change from dropdown
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

  // Handle view details
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

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      // Update order with edited data
      const updatePayload = {
        customerName: editData.customerName,
        customerEmail: editData.customerEmail,
        customerPhone: editData.customerPhone,
        countryRegion: editData.countryRegion,
        stateProvince: editData.stateProvince,
        shippingAddress: editData.shippingAddress,
      };

      // Call update API (you'll need to create this endpoint)
      // For now, just update local state
      setSelectedOrder(editData);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? editData : o))
      );
      setEditMode(false);
    } catch (err) {
      setError('Failed to save order information');
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
    } else {
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

    // Check stock availability
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

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Shipping': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-black';
  };

  const columns = [
    { key: 'id', label: 'ID', width: '50px' },
    {
      key: 'customer',
      label: 'CUSTOMER',
      render: (row) => row.customerName || 'N/A',
    },
    {
      key: 'email',
      label: 'EMAIL',
      render: (row) => row.customerEmail || 'N/A',
    },
    {
      key: 'total',
      label: 'TOTAL',
      render: (row) => `$${parseFloat(row.totalPrice || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => (
        <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'updatedAt',
      label: 'UPDATED',
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  const actions = (order) => [
    {
      label: 'View',
      onClick: () => handleViewDetails(order),
      variant: 'success',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className=" font-bold text-black  uppercase">Orders Management</h3>
          <p className="body-02 text-black">Manage customer orders and track shipments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Order
        </button>
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
          {filteredOrders.length} of {orders.length}
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
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
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
      <Table columns={columns} data={filteredOrders} onAction={actions} loading={loading} />

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Order Code</p>
                <h2 className="text-3xl font-bold text-black">{selectedOrder.orderCode}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              {/* Status Section */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Order Status</p>
                <div className={`px-4 py-2 rounded text-sm font-medium w-full ${getStatusColor(editMode ? editData.status : selectedOrder.status)}`}>
                  <select
                    value={editMode ? editData.status : selectedOrder.status}
                    onChange={(e) => {
                      if (editMode) {
                        setEditData({ ...editData, status: e.target.value });
                      } else {
                        handleStatusChange(e.target.value);
                      }
                    }}
                    className="w-full bg-transparent text-black text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Information Section */}
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-4">Customer Information</p>
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex items-center ">
                    <p className="text-xs text-black font-semibold uppercase w-24">Name:</p>
                    <div className="flex-1 bg-gray-50 px-4 py-2">
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.customerName || ''}
                          onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                        />
                      ) : (
                        <p className="text-xs font-medium text-black">{selectedOrder.customerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center ">
                    <p className="text-xs text-black font-semibold uppercase w-24">Email:</p>
                    <div className="flex-1 bg-gray-50 px-4 py-2">
                      {editMode ? (
                        <input
                          type="email"
                          value={editData.customerEmail || ''}
                          onChange={(e) => setEditData({ ...editData, customerEmail: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                        />
                      ) : (
                        <p className="text-xs text-black">{selectedOrder.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center ">
                    <p className="text-xs text-black font-semibold uppercase w-24">Phone:</p>
                    <div className="flex-1 bg-gray-50 px-4 py-2">
                      {editMode ? (
                        <input
                          type="tel"
                          value={editData.customerPhone || ''}
                          onChange={(e) => setEditData({ ...editData, customerPhone: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                        />
                      ) : (
                        <p className="text-xs font-medium text-black">{selectedOrder.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-4">Shipping Address</p>
                <div className="space-y-4">
                  {/* Country and State - Same Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="flex items-center ">
                      <p className="text-xs text-black font-semibold uppercase w-24">Country:</p>
                      <div className="flex-1 bg-gray-50 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.countryRegion || ''}
                            onChange={(e) => setEditData({ ...editData, countryRegion: e.target.value })}
                            className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                          />
                        ) : (
                          <p className="text-xs font-medium text-black">{selectedOrder.countryRegion}</p>
                        )}
                      </div>
                    </div>
                    {/* State */}
                    <div className="flex items-center ">
                      <p className="text-xs text-black font-semibold uppercase w-24">State:</p>
                      <div className="flex-1 bg-gray-50 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.stateProvince || ''}
                            onChange={(e) => setEditData({ ...editData, stateProvince: e.target.value })}
                            className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                          />
                        ) : (
                          <p className="text-xs font-medium text-black">{selectedOrder.stateProvince}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start ">
                    <p className="text-xs text-black font-semibold uppercase w-24 ">Address:</p>
                    <div className="flex-1 bg-gray-50 px-4 py-2">
                      {editMode ? (
                        <textarea
                          value={editData.shippingAddress || ''}
                          onChange={(e) => setEditData({ ...editData, shippingAddress: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none"
                          rows="2"
                        />
                      ) : (
                        <p className="text-xs text-black">{selectedOrder.shippingAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Section */}
              <div>
                <p className="text-sm text-black font-semibold uppercase mb-4">Order Items</p>
                <div className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-black">Product</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-black">Quantity</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-black">Price</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-black">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-3 py-2 text-xs text-black font-medium truncate">{item.Product?.productName || 'Unknown'}</td>
                          <td className="px-3 py-2 text-xs text-center text-black">{item.quantity}</td>
                          <td className="px-3 py-2 text-xs text-right text-black">${parseFloat(item.priceAtPurchase || 0).toFixed(2)}</td>
                          <td className="px-3 py-2 text-xs text-right font-semibold text-black">${(parseFloat(item.priceAtPurchase || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Section */}
              <div className="flex flex-row items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-black font-semibold uppercase">Order Total</p>
                <p className="text-2xl font-bold text-black">${parseFloat(selectedOrder.totalPrice || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData(selectedOrder);
                    }}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      disabled
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold opacity-50 cursor-not-allowed"
                    >
                      Saved
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Order Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-6">Create New Order</h3>

            <div className="space-y-4 mb-8">
              {/* Customer Info Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Address Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Country</label>
                  <select
                    value={formData.countryRegion}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  >
                    <option value="">
                      {loadingCountries ? 'Loading countries...' : 'Select Country'}
                    </option>
                    {Array.isArray(countries) && countries.length > 0 ? (
                      countries.map((c) => (
                        <option key={c.iso2 || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No countries available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">State/Province</label>
                  <select
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    disabled={!formData.countryRegion || loadingStates}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">
                      {!formData.countryRegion
                        ? 'Select country first'
                        : loadingStates
                          ? 'Loading states...'
                          : states.length === 0
                            ? 'No states available'
                            : 'Select State/Province'}
                    </option>
                    {Array.isArray(states) && states.length > 0 && !loadingStates && (
                      states.map((s) => (
                        <option key={s.iso2 || s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Shipping Address *</label>
                  <input
                    type="text"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase block mb-2">Payment Method *</label>
                <select
                  value={formData.paymentMethodId}
                  onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h4 className="text-sm font-semibold text-black uppercase mb-4">Products *</h4>

                <div className="space-y-3 mb-4">
                  {/* Product Selection Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-black uppercase block mb-2">Product</label>
                      <select
                        value={productSelect}
                        onChange={(e) => handleProductChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-black uppercase block mb-2">Variant</label>
                      <select
                        value={variantSelect}
                        onChange={(e) => setVariantSelect(e.target.value)}
                        disabled={!productSelect || productVariants.length === 0}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none disabled:bg-gray-100"
                      >
                        <option value="">Select Variant</option>
                        {productVariants.map((v) => {
                          const isOutOfStock = (v.stockQuantity || 0) <= 0;
                          return (
                            <option
                              key={v.id}
                              value={v.id}
                              disabled={isOutOfStock}
                            >
                              {v.overallSize} - ${parseFloat(v.price || 0).toFixed(2)}
                              {isOutOfStock ? ' (Out of Stock)' : ` (Stock: ${v.stockQuantity || 0})`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-black uppercase block mb-2">
                        Quantity
                        {variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) && (
                          <span className="text-gray-500 text-xs font-normal">
                            {' '}(Max: {productVariants.find(v => v.id === parseInt(variantSelect))?.stockQuantity || 0})
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) ? (productVariants.find(v => v.id === parseInt(variantSelect))?.stockQuantity || 0) : undefined}
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Price Info Row */}
                  {variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-black uppercase block mb-2">Unit Price</label>
                        <div className="px-4 py-2 bg-gray-100 rounded text-sm text-black font-semibold">
                          ${parseFloat(productVariants.find(v => v.id === parseInt(variantSelect))?.price || 0).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-black uppercase block mb-2">Total Price</label>
                        <div className="px-4 py-2 bg-gray-100 rounded text-sm text-black font-semibold">
                          ${(parseFloat(productVariants.find(v => v.id === parseInt(variantSelect))?.price || 0) * productQuantity).toFixed(2)}
                        </div>
                      </div>
                      <div>&nbsp;</div>
                    </div>
                  )}

                  <button
                    onClick={handleAddProduct}
                    className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800"
                  >
                    Add Product to Order
                  </button>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs font-semibold text-black uppercase mb-2">Selected Products:</div>
                    <div className="space-y-2">
                      {selectedProducts.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        const totalPrice = (item.price || 0) * item.quantity;
                        return (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded text-xs">
                            <span className="text-black flex-1">
                              {product?.productName} × {item.quantity} @ ${parseFloat(item.price || 0).toFixed(2)} = ${totalPrice.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveProduct(idx)}
                              className="text-red-600 font-bold hover:text-red-800 ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-xs font-semibold text-black">
                        <span>Order Subtotal:</span>
                        <span>${selectedProducts.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
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
                disabled={formLoading}
                className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={formLoading}
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {formLoading ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
