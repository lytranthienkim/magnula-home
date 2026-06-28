import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Order = db.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    orderCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'order_code',
    },

    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'customer_name',
    },

    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'customer_email',
      validate: {
        isEmail: true,
      },
    },

    customerPhone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'customer_phone',
    },

    countryRegion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'country_region',
    },

    stateProvince: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'state_province',
    },

    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'shipping_address',
    },

    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_price',
      validate: {
        min: 0,  
      },
    },

    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'payment_method_id',
      references: {
        model: 'payment_methods',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending',
      field: 'status',
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    paranoid: false,  // IMMUTABLE ENTITY - Orders can NEVER be deleted (soft or hard)
  }
);

export default Order;
