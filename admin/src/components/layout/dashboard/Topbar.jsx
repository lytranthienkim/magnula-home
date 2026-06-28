'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { logoutAdmin } from '@/api/auth';
import { getAllProductRequests, getAllOrders } from '@/api/orders';
import { getAllProducts } from '@/api/products';
import { HiOutlineArrowRightOnRectangle, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { GoBell } from 'react-icons/go';
import { IoMailOpenOutline } from 'react-icons/io5';

export function Topbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProductRequests, setShowProductRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], orders: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Track new/unread items only
  const [newOrders, setNewOrders] = useState([]);
  const [newProductRequests, setNewProductRequests] = useState([]);
  const [unreadOrders, setUnreadOrders] = useState(false);
  const [unreadRequests, setUnreadRequests] = useState(false);

  const lastOrderTimestampRef = useRef(0);
  const lastRequestTimestampRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  // Check if user is admin (handle both string and array formats)
  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
  const isAdmin = userRole?.toLowerCase() === 'administrator';

  // Fetch orders and product requests periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Date.now();
        const isInitialLoad = isInitialLoadRef.current;

        // On initial load, show items from last 1 minute
        // On subsequent fetches, show items from last 5 seconds
        const timeWindow = isInitialLoad ? 60000 : 5000;
        const timeThreshold = now - timeWindow;

        // Fetch orders - API returns data directly
        const ordersRes = await getAllOrders();
        const ordersList = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || []);

        const newOrdersList = ordersList.filter((order) => {
          const orderTime = new Date(order.createdAt).getTime();
          return orderTime > lastOrderTimestampRef.current && orderTime > timeThreshold;
        });

        if (newOrdersList.length > 0) {
          setNewOrders(newOrdersList);
          setUnreadOrders(true);
          lastOrderTimestampRef.current = Math.max(...newOrdersList.map(o => new Date(o.createdAt).getTime()));
        }

        // Fetch product requests - API returns data directly
        const requestsRes = await getAllProductRequests();
        const requestsList = Array.isArray(requestsRes) ? requestsRes : (requestsRes?.data || []);

        const newRequestsList = requestsList.filter((request) => {
          const requestTime = new Date(request.createdAt).getTime();
          return requestTime > lastRequestTimestampRef.current && requestTime > timeThreshold;
        });

        if (newRequestsList.length > 0) {
          setNewProductRequests(newRequestsList);
          setUnreadRequests(true);
          lastRequestTimestampRef.current = Math.max(...newRequestsList.map(r => new Date(r.createdAt).getTime()));
        }

        if (isInitialLoad) {
          isInitialLoadRef.current = false;
        }

        console.log('Notifications fetched - Orders:', newOrdersList.length, 'Requests:', newRequestsList.length);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (!unreadOrders) return;
    const timer = setTimeout(() => {
      setUnreadOrders(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [unreadOrders]);

  // Auto-hide request notification after 5 seconds
  useEffect(() => {
    if (!unreadRequests) return;
    const timer = setTimeout(() => {
      setUnreadRequests(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [unreadRequests]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear HttpOnly cookie on server
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    }

    // Clear local storage
    localStorage.removeItem('adminUser');

    // Update Redux state (token is in HttpOnly cookie, managed by browser)
    dispatch(logout());

    // Redirect to login
    router.push('/login');
  };

  const handleProfile = () => {
    setShowMenu(false);
    router.push('/dashboard/profile');
  };

  const handleAccessControl = () => {
    setShowMenu(false);
    router.push('/dashboard/access-control');
  };

  const handleViewRequest = (request) => {
    router.push(`/dashboard/product-requests`);
    setShowProductRequests(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults({ products: [], orders: [] });
      setShowSearchResults(false);
      return;
    }

    try {
      const [productsRes, ordersRes] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
      ]);

      const products = (productsRes?.data || productsRes || []).filter(p =>
        p.productName?.toLowerCase().includes(query.toLowerCase()) ||
        p.id?.toString().includes(query)
      ).slice(0, 5);

      const orders = (ordersRes?.data || ordersRes || []).filter(o =>
        o.orderCode?.toLowerCase().includes(query.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(query.toLowerCase()) ||
        o.id?.toString().includes(query)
      ).slice(0, 5);

      setSearchResults({ products, orders });
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <header className="fixed right-0 top-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (searchResults.products.length > 0 || searchResults.orders.length > 0) && (
          <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg z-50 max-h-96 overflow-y-auto shadow-lg">
            {/* Products */}
            {searchResults.products.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Products</p>
                </div>
                {searchResults.products.map(product => (
                  <button
                    key={`product-${product.id}`}
                    onClick={() => {
                      router.push(`/dashboard/products?search=${product.productName}`);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 transition"
                  >
                    <p className="text-sm text-black font-medium">{product.productName}</p>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </button>
                ))}
              </>
            )}

            {/* Orders */}
            {searchResults.orders.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-10">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Orders</p>
                </div>
                {searchResults.orders.map(order => (
                  <button
                    key={`order-${order.id}`}
                    onClick={() => {
                      router.push(`/dashboard/orders`);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 transition"
                  >
                    <p className="text-sm text-black font-medium">{order.orderCode}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Order Notifications */}
        <button
          onClick={() => {
            setShowNotification(!showNotification);
            setShowProductRequests(false);
          }}
          className="relative text-gray-600 hover:text-gray-900 transition"
          title="New Orders"
        >
          <GoBell className="w-6 h-6" />
          {unreadOrders && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>

        {/* Product Requests */}
        <button
          onClick={() => {
            setShowProductRequests(!showProductRequests);
            setShowNotification(false);
          }}
          className="relative text-gray-600 hover:text-gray-900 transition"
          title="Product Requests"
        >
          <IoMailOpenOutline className="w-6 h-6" />
          {unreadRequests && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>

        {/* Order Notifications Dropdown - Only NEW orders */}
        {showNotification && (
          <div className="absolute top-16 right-8 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
              <p className="text-sm font-semibold text-black">Order Notifications ({newOrders.length})</p>
            </div>
            {newOrders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {newOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      router.push('/dashboard/orders');
                      setShowNotification(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <p className="text-sm text-black font-semibold">Order #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-600">No new orders</div>
            )}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  router.push('/dashboard/orders');
                  setShowNotification(false);
                }}
                className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
              >
                View All Orders
              </button>
            </div>
          </div>
        )}

        {/* Product Requests Dropdown - Only NEW requests */}
        {showProductRequests && (
          <div className="absolute top-16 right-16 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
              <p className="text-sm font-semibold text-black">Product Requests ({newProductRequests.length})</p>
            </div>
            {newProductRequests.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {newProductRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleViewRequest(request)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <p className="text-sm text-black font-semibold">#{request.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{request.customerName || 'Anonymous'}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-600">No new requests</div>
            )}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  router.push('/dashboard/product-requests');
                  setShowProductRequests(false);
                }}
                className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
              >
                View All Requests
              </button>
            </div>
          </div>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition px-3 py-1 border-[1px] border-[#272727]/30 rounded-full"
          >
            {user?.fullName || 'Admin'}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200 transition"
              >
                Profile
              </button>

              {/* Access Control - Admin Only */}
              {isAdmin && (
                <button
                  onClick={handleAccessControl}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200 transition"
                >
                  Access Control
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
              >
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
