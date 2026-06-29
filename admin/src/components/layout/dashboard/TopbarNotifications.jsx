'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { GoBell } from 'react-icons/go';
import { IoMailOpenOutline } from 'react-icons/io5';

const TopbarNotifications = memo(({
  unreadOrders,
  unreadRequests,
  newOrders,
  newProductRequests,
  showNotification,
  showProductRequests,
  onNotificationToggle,
  onRequestsToggle,
}) => {
  const router = useRouter();

  const handleViewOrder = () => {
    router.push('/dashboard/orders');
    onNotificationToggle();
  };

  const handleViewRequest = () => {
    router.push('/dashboard/product-requests');
    onRequestsToggle();
  };

  return (
    <>
      {/* Order Notifications */}
      <button
        onClick={onNotificationToggle}
        className="relative text-gray-600 hover:text-gray-900 transition"
        title="New Orders"
      >
        <GoBell className="w-6 h-6" />
        {unreadOrders && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
      </button>

      {/* Product Requests */}
      <button
        onClick={onRequestsToggle}
        className="relative text-gray-600 hover:text-gray-900 transition"
        title="Product Requests"
      >
        <IoMailOpenOutline className="w-6 h-6" />
        {unreadRequests && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
      </button>

      {/* Order Notifications Dropdown - Only NEW orders */}
      {showNotification && (
        <div className="absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-lg  z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <p className="text-sm font-semibold text-black">Order Notifications ({newOrders.length})</p>
          </div>
          {newOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {newOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={handleViewOrder}
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
              onClick={handleViewOrder}
              className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
            >
              View All Orders
            </button>
          </div>
        </div>
      )}

      {/* Product Requests Dropdown - Only NEW requests */}
      {showProductRequests && (
        <div className="absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-lg  z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <p className="text-sm font-semibold text-black">Product Requests ({newProductRequests.length})</p>
          </div>
          {newProductRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {newProductRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={handleViewRequest}
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
              onClick={handleViewRequest}
              className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
            >
              View All Requests
            </button>
          </div>
        </div>
      )}
    </>
  );
});

TopbarNotifications.displayName = 'TopbarNotifications';

export default TopbarNotifications;
