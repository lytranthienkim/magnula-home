import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const PaymentMethod = db.define(
  'PaymentMethod',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'code',
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'name',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'is_active',
    },
  },
  {
    tableName: 'payment_methods',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete
  }
);

export default PaymentMethod;
