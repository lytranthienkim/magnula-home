import { DataTypes } from 'sequelize';
import db from '../../config/db.js';
import { updateProductStock } from '../../hooks/product/updateProductStockHook.js';

const ProductVariant = db.define(
  'ProductVariant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE',
    },

    overallSize: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'overall_size',
      validate: {
        len: [5, 100],
      },
    },

    seatSize: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'seat_size',
    },

    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'color',
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0, 
      },
    },

    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_quantity',
      validate: {
        isInt: true,
        min: 0,
      },
    },


    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
    paranoid: true,  
    hooks: {
      afterCreate: updateProductStock,
      afterUpdate: updateProductStock,
      afterDestroy: updateProductStock,
    },
  }
);

export default ProductVariant;
