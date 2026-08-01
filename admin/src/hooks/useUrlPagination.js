import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export const useUrlPagination = (data, itemsPerPage = 20) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = Math.max(1, pageParam);

  const { displayData, totalPages } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const validPage = Math.min(currentPage, total || 1);
    const startIdx = (validPage - 1) * itemsPerPage;
    const display = data.slice(startIdx, startIdx + itemsPerPage);
    return { displayData: display, totalPages: total };
  }, [data, currentPage, itemsPerPage]);

  const setCurrentPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', validPage.toString());
    router.push(`?${params.toString()}`);
  };

  return {
    currentPage,
    setCurrentPage,
    displayData,
    totalPages,
  };
};
