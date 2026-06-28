// Setup Admin Permissions - Add missing permissions to admin role
// This is a one-time setup endpoint for development

import db from '../../../config/db.js';
import { getAllPermissionKeys } from '../../../constants/permissions.js';

export const setupAdminPermissions = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;

    // Get or create admin role
    let adminRole = await Role.findOne({ where: { roleName: 'admin' } });
    if (!adminRole) {
      return res.status(400).json({
        success: false,
        error: 'Admin role not found',
      });
    }

    // All required permissions (standardized format)
    const requiredPermissions = getAllPermissionKeys();

    let createdCount = 0;
    let assignedCount = 0;

    // Create permissions if not exist and assign to admin role
    for (const permKey of requiredPermissions) {
      let perm = await Permission.findOne({ where: { permissionKey: permKey } });

      if (!perm) {
        perm = await Permission.create({
          permissionKey: permKey,
          description: `Permission to ${permKey.replace(/_/g, ' ')}`,
        });
        createdCount++;
      }

      // Assign to admin role if not already assigned
      const existing = await RolePermission.findOne({
        where: { roleId: adminRole.id, permissionId: perm.id },
      });

      if (!existing) {
        await RolePermission.create({
          roleId: adminRole.id,
          permissionId: perm.id,
        });
        assignedCount++;
      }
    }

    res.json({
      success: true,
      message: 'Admin permissions setup complete',
      data: {
        permissionsCreated: createdCount,
        permissionsAssigned: assignedCount,
        totalPermissions: requiredPermissions.length,
      },
    });
  } catch (error) {
    console.error('Setup admin permissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to setup permissions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
