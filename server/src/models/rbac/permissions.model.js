import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Permission = db.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    permissionKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'permission_key',
      validate: {
        len: [3, 100],
      },
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
    paranoid: true, 
  }
);

export default Permission;
