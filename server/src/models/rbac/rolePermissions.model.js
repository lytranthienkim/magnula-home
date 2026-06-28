import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const RolePermission = db.define(
  'RolePermission',
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'permission_id',
      references: {
        model: 'permissions',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'role_permissions',
    timestamps: false,  // Pivot table - no need to track created/updated
    underscored: true,
  }
);

export default RolePermission;
