'use client';

import { useState } from 'react';
import { useListManagement } from '@/hooks/useListManagement';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { getAllPermissions } from '@/api/permissions';
import { PermissionsHeader, PermissionsTable } from '@/components/layout/permissions';
import { Pagination } from '@/components/common/Pagination';

const parseData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export default function PermissionsPage() {
  const [selectedPermission, setSelectedPermission] = useState(null);

  const { loading, error, displayData } = useListManagement({
    fetchFn: async () => {
      const res = await getAllPermissions(10000, 0);
      return { data: parseData(res) };
    },
    sortField: 'createdAt',
  });

  const { currentPage, setCurrentPage, displayData: paginatedData, totalPages } = useUrlPagination(displayData, 20);

  const handleViewDetails = (permission) => {
    setSelectedPermission(permission);
  };

  return (
    <div>
      <PermissionsHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {displayData.length === 0 ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <p className="text-sm text-gray-600">No permissions available</p>
        </div>
      ) : (
        <>
          <PermissionsTable
            permissions={paginatedData}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </div>
  );
}
