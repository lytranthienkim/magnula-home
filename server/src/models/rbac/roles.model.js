import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Role = db.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    roleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'role_name',
      validate: {
        len: [3, 100],
      },
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    underscored: true,
    paranoid: true, 
  }
);

export default Role;
