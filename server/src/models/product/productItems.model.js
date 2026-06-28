import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Product = db.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'collection_id',
      references: {
        model: 'collections',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    productName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'product_name',
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'material_id',
      references: {
        model: 'materials',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    fabricTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'fabric_type_id',
      references: {
        model: 'fabric_types',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    roomSuitabilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'room_suitability_id',
      references: {
        model: 'room_suitabilities',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    status: {
      type: DataTypes.ENUM('in stock', 'out of stock', 'discontinued'),
      allowNull: false,
      defaultValue: 'in stock',
      field: 'status',
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete - Product.destroy() will set deletedAt
  }
);

export default Product;
