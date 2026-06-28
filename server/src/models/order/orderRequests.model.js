import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const ProductRequest = db.define(
  'ProductRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'customer_name',
    },

    customerPhone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'customer_phone',
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'SET NULL',  
      onUpdate: 'CASCADE',
    },

    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'product_variant_id',
      references: {
        model: 'product_variants',
        key: 'id',
      },
      onDelete: 'SET NULL',  // Changed from CASCADE to SET NULL
      onUpdate: 'CASCADE',
    },

    requestedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'requested_quantity',
      validate: {
        isInt: true,
        min: 1,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },

    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'status',
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'product_requests',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete - preserves lead data in archive
  }
);

export default ProductRequest;
