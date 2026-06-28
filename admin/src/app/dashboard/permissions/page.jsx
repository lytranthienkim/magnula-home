'use client';

import { usePermissions } from '@/hooks/usePermissions';
import {
  PermissionsHeader,
  PermissionsTable,
  PermissionsModal,
} from '@/components/layout/permissions';

/**
 * Permissions Page
 * Clean page component - imports logic from hook, renders components
 */
export default function PermissionsPage() {
  const {
    permissions,
    loading,
    showDetails,
    selectedPermission,
    error,
    handleViewDetails,
    handleCloseModal,
  } = usePermissions();

  return (
    <div>
      <PermissionsHeader />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-error rounded">
          <p className="body-02 text-error">{error}</p>
        </div>
      )}

      {/* Table */}
      <PermissionsTable
        permissions={permissions}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {/* Modal */}
      <PermissionsModal
        isOpen={showDetails}
        permission={selectedPermission}
        onClose={handleCloseModal}
      />
    </div>
  );
}
