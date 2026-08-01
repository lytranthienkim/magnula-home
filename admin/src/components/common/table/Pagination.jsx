'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Pagination({ currentPage, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pageNumbers.push(1);
    if (startPage > 2) {
      pageNumbers.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
      {currentPage === 1 ? (
        <button
          disabled
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 opacity-50 cursor-not-allowed text-gray-700"
        >
          Previous
        </button>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
        >
          Previous
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 text-sm">
                ...
              </span>
            );
          }
          const isCurrent = currentPage === page;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCurrent
                  ? 'bg-black text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage === totalPages ? (
        <button
          disabled
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 opacity-50 cursor-not-allowed text-gray-700"
        >
          Next
        </button>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
        >
          Next
        </Link>
      )}

      <span className="ml-4 text-xs text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
