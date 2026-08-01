'use client';

import { useEffect, useState, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { logoutAdmin } from '@/api/auth';

import { getAllProducts } from '@/api/products';
import { HiOutlineBars3 } from 'react-icons/hi2';
import TopbarSearch from './TopbarSearch';
import TopbarNotifications from './TopbarNotifications';
import TopbarUserMenu from './TopbarUserMenu';
import { getAllProductRequests } from '@/api/productRequest';
import { getAllOrders } from '@/api/orders';

function TopbarContent({ onMenuClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProductRequests, setShowProductRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], orders: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [newOrders, setNewOrders] = useState([]);
  const [newProductRequests, setNewProductRequests] = useState([]);
  const [unreadOrders, setUnreadOrders] = useState(false);
  const [unreadRequests, setUnreadRequests] = useState(false);

  const lastOrderTimestampRef = useRef(0);
  const lastRequestTimestampRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
  const isAdmin = userRole?.toLowerCase() === 'administrator';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Date.now();
        const isInitialLoad = isInitialLoadRef.current;
        const timeWindow = isInitialLoad ? 60000 : 5000;
        const timeThreshold = now - timeWindow;
        const ordersRes = await getAllOrders(10, 0);
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

        const requestsRes = await getAllProductRequests(10, 0);
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

      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!unreadOrders) return;
    const timer = setTimeout(() => {
      setUnreadOrders(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [unreadOrders]);

  useEffect(() => {
    if (!unreadRequests) return;
    const timer = setTimeout(() => {
      setUnreadRequests(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [unreadRequests]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    }
    dispatch(logout());
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
        getAllProducts(10, 0), 
        getAllOrders(10, 0), 
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
    <header className="fixed right-0 top-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-4 lg:px-8 z-40 transition-all duration-300">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex-shrink-0 p-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        <HiOutlineBars3 className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
      </button>

      {/* Search bar */}
      <TopbarSearch
        searchQuery={searchQuery}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        onSearchChange={handleSearch}
        onSearchFocus={() => searchQuery && setShowSearchResults(true)}
        onClose={() => setShowSearchResults(false)}
      />

      {/* Right section */}
      <div className="flex items-center gap-6 ml-auto">
        <TopbarNotifications
          unreadOrders={unreadOrders}
          unreadRequests={unreadRequests}
          newOrders={newOrders}
          newProductRequests={newProductRequests}
          showNotification={showNotification}
          showProductRequests={showProductRequests}
          onNotificationToggle={() => {
            setShowNotification(!showNotification);
            setShowProductRequests(false);
          }}
          onRequestsToggle={() => {
            setShowProductRequests(!showProductRequests);
            setShowNotification(false);
          }}
        />

        {/* User menu*/}
        <TopbarUserMenu
          user={user}
          isAdmin={isAdmin}
          showMenu={showMenu}
          onToggleMenu={() => setShowMenu(!showMenu)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}

export const Topbar = memo(TopbarContent);
