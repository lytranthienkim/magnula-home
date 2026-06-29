'use client';

import { HiOutlinePlus } from 'react-icons/hi2';

/**
 * ProductsHeader Component
 * Displays the page header and add button for products management
 */
export function ProductsHeader({ canCreate, onAddClick }) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-black uppercase">Products Management</h3>
        <p className="body-02">Manage all products in your store</p>
      </div>
      {canCreate && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add
        </button>
      )}
    </div>
  );
}
