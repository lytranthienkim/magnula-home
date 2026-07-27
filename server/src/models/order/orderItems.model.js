import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const OrderItem = db.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE',
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_variant_id',
      references: {
        model: 'product_variants',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },

    priceAtPurchase: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'price_at_purchase',
      validate: {
        min: 0,  
      },
    },
  },
  {
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
  }
);

export default OrderItem;
