'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const TopbarSearch = memo(({
  searchQuery,
  searchResults,
  showSearchResults,
  onSearchChange,
  onSearchFocus,
  onClose,
}) => {
  const router = useRouter();

  const handleProductClick = (product) => {
    router.push(`/dashboard/products?search=${product.productName}`);
    onSearchChange('');
    onClose();
  };

  const handleOrderClick = () => {
    router.push('/dashboard/orders');
    onSearchChange('');
    onClose();
  };

  return (
    <div className="hidden sm:flex flex-1 max-w-2xl relative">
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder=""
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => searchQuery && onSearchFocus()}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
        />
      </div>

      {/* Search Results Dropdown */}
      {showSearchResults && (searchResults.products.length > 0 || searchResults.orders.length > 0) && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg z-50 max-h-96 overflow-y-auto ">
          {/* Products */}
          {searchResults.products.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                <p className="text-xs font-semibold text-gray-600 uppercase">Products</p>
              </div>
              {searchResults.products.map(product => (
                <button
                  key={`product-${product.id}`}
                  onClick={() => handleProductClick(product)}
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
                  onClick={handleOrderClick}
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
  );
});

TopbarSearch.displayName = 'TopbarSearch';

export default TopbarSearch;
