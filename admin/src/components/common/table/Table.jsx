'use client';

import { useState, useMemo } from 'react';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;

export function Table({ columns, data, onAction, loading }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return data.slice(startIdx, endIdx);
  }, [data, currentPage]);

  // Reset to page 1 when data changes
  if (data && data.length > 0 && currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <p className="text-gray-500 mb-2">No data available</p>
        <p className="text-xs text-gray-400">Create one to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppcase"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {onAction && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ACTIONS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, rowIdx) => (
            <tr key={row.id || rowIdx} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {onAction && (
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    {onAction(row).map((action) => (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          action.variant === 'danger'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : action.variant === 'success'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
