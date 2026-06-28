'use client';

import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading, danger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
            <HiOutlineExclamationTriangle
              className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-blue-600'}`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
