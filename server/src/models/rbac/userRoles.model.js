import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const UserRole = db.define(
  'UserRole',
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

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
  },
  {
    tableName: 'user_roles',
    timestamps: false,  // Pivot table - no need to track created/updated
    underscored: true,
  }
);

export default UserRole;
