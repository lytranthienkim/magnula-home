'use client';

/**
 * PermissionsHeader Component
 * Displays the page header for permissions management
 */
export function PermissionsHeader() {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-black uppercase">Permissions Management</h3>
        <p className="body-02 text-black">View system permissions (read-only)</p>
      </div>
    </div>
  );
}
